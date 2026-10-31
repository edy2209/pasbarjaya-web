import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 Credentials (S3-compatible)
const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const bucketName = process.env.R2_BUCKET_NAME || 'pasbarjaya-media';

// Public domain for Cloudflare R2 (e.g., https://media.pasbarjaya.com or https://pub-<hash>.r2.dev)
export const publicDomain = (process.env.R2_PUBLIC_DOMAIN || 'https://pub-r2.pasbarjaya.com').replace(/\/$/, '');

const hasRealCredentials = Boolean(accountId && accessKeyId && secretAccessKey);

export const r2Client = hasRealCredentials
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

/**
 * Uploads a file buffer directly to Cloudflare R2.
 * Returns the permanent, publicly accessible URL.
 */
export async function uploadFileToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: 'videos' | 'banners' | 'highlights' = 'videos'
): Promise<{ success: boolean; publicUrl: string; key: string }> {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}-${sanitizedName}`;

  if (r2Client) {
    // Real upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);
  }

  // Generates the public CDN URL
  const publicUrl = `${publicDomain}/${key}`;

  return {
    success: true,
    publicUrl,
    key,
  };
}
