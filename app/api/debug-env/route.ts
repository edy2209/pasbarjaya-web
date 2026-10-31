export async function GET() {
  const token = process.env.COC_API_TOKEN || '';
  const clanTag = process.env.COC_CLAN_TAG || '#2JVVR0LLL';
  const mongoUri = process.env.MONGODB_URI || '';
  const r2Domain = process.env.R2_PUBLIC_DOMAIN || '';

  // Test actual CoC API call
  let cocApiResult: any = 'NOT TESTED';
  if (token) {
    try {
      const encodedTag = encodeURIComponent(clanTag.startsWith('#') ? clanTag : `#${clanTag}`);
      const res = await fetch(`https://api.clashofclans.com/v1/clans/${encodedTag}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      const body = await res.json();
      if (res.ok) {
        cocApiResult = `SUCCESS ✅ — Clan: ${body.name}, Members: ${body.members}`;
      } else {
        cocApiResult = `ERROR ❌ (${res.status}) — ${JSON.stringify(body)}`;
      }
    } catch (e: any) {
      cocApiResult = `EXCEPTION ❌ — ${e.message}`;
    }
  } else {
    cocApiResult = 'SKIPPED — token not set';
  }

  // Get server outbound IP
  let outboundIp = 'unknown';
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    const ipData = await ipRes.json();
    outboundIp = ipData.ip;
  } catch {}

  return Response.json({
    server_outbound_ip: outboundIp,
    COC_API_TOKEN: token
      ? `SET ✅ (${token.length} chars) — starts: ${token.slice(0, 20)}...`
      : 'NOT SET ❌',
    COC_CLAN_TAG: clanTag || 'NOT SET ❌',
    MONGODB_URI: mongoUri ? `SET ✅ — starts: ${mongoUri.slice(0, 30)}...` : 'NOT SET ❌',
    R2_PUBLIC_DOMAIN: r2Domain || 'NOT SET ❌',
    coc_api_test: cocApiResult,
  });
}
