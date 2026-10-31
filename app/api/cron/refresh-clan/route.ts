import { refreshClanCache } from '@/lib/coc-api';

// Cron endpoint - bisa dipanggil dari GitHub Actions, Vercel Cron, dll
export async function GET() {
  const result = await refreshClanCache();
  console.log('[CRON] Clan cache refresh:', result);
  return Response.json({ ...result, timestamp: new Date().toISOString() });
}
