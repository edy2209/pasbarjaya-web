export async function GET() {
  const token = process.env.COC_API_TOKEN || '';
  const clanTag = process.env.COC_CLAN_TAG || '';
  const mongoUri = process.env.MONGODB_URI || '';
  const r2Domain = process.env.R2_PUBLIC_DOMAIN || '';

  return Response.json({
    COC_API_TOKEN: token
      ? `SET ✅ (${token.length} chars) — starts: ${token.slice(0, 20)}...`
      : 'NOT SET ❌',
    COC_CLAN_TAG: clanTag
      ? `SET ✅ — value: ${clanTag}`
      : 'NOT SET ❌',
    MONGODB_URI: mongoUri
      ? `SET ✅ — starts: ${mongoUri.slice(0, 30)}...`
      : 'NOT SET ❌',
    R2_PUBLIC_DOMAIN: r2Domain
      ? `SET ✅ — value: ${r2Domain}`
      : 'NOT SET ❌',
  });
}
