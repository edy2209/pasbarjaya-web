import { NextRequest } from 'next/server';
import { refreshClanCache } from '@/lib/coc-api';

// Vercel Cron Job endpoint - auto refresh setiap hari
// Dipanggil otomatis oleh Vercel sesuai jadwal di vercel.json
export async function GET(req: NextRequest) {
  // Vercel cron mengirim header Authorization otomatis
  const authHeader = req.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await refreshClanCache();
  console.log('[CRON] Clan cache refresh:', result);
  return Response.json({ ...result, timestamp: new Date().toISOString() });
}
