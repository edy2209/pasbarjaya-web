import { refreshClanCache } from '@/lib/coc-api';

// Cron endpoint - dipanggil otomatis oleh GitHub Actions secara berkala
export async function GET() {
  const result = await refreshClanCache();
  console.log('[CRON] Clan cache refresh:', result);

  return Response.json(
    { ...result, timestamp: new Date().toISOString() },
    { status: result.success ? 200 : 500 }
  );
}
