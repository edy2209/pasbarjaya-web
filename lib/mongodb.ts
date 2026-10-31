import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function getSafeMongoUri(rawUri: string): string {
  try {
    const uri = rawUri.trim().replace(/^['"]+|['"]+$/g, '');
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, protocol, user, pass, rest] = match;
      const safePass = encodeURIComponent(decodeURIComponent(pass));
      const safeUser = encodeURIComponent(decodeURIComponent(user));
      return `${protocol}${safeUser}:${safePass}@${rest}`;
    }
    return uri;
  } catch {
    return rawUri;
  }
}

function getFreshUri(): string {
  // 1. Prioritize process.env (Vercel production environment)
  const envUri = process.env.MONGODB_URI;
  if (envUri && envUri.trim()) {
    return getSafeMongoUri(envUri);
  }

  // 2. Fallback to local .env.local file
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        return getSafeMongoUri(match[1]);
      }
    }
  } catch {}

  return '';
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

async function dbConnect(): Promise<typeof mongoose> {
  const currentUri = getFreshUri();
  if (!currentUri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }

  // If already connected and ready
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Clear any stale rejected promise from previous attempts
  cached.promise = null;
  cached.conn = null;

  try {
    const conn = await mongoose.connect(currentUri, {
      bufferCommands: false,
    });
    cached.conn = conn;
    return conn;
  } catch (err: any) {
    cached.conn = null;
    cached.promise = null;
    console.error('dbConnect error:', err.message);
    throw err;
  }
}

export default dbConnect;
