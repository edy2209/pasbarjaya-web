/**
 * Cloudflare Worker - CoC API Proxy
 * Deploy ini di Cloudflare Workers dashboard
 * Tambahkan secret: COC_API_TOKEN (via Workers > Settings > Variables)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://pasbarjaya.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route: /check-ip → cek outbound IP Worker ini
    if (url.pathname === '/check-ip') {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      return Response.json(ipData, { headers: corsHeaders });
    }

    // Route: /coc/clan → proxy ke CoC API
    if (url.pathname === '/coc/clan') {
      const token = env.COC_API_TOKEN;
      if (!token) {
        return Response.json({ error: 'COC_API_TOKEN not configured in Worker' }, { status: 500 });
      }

      const clanTag = url.searchParams.get('tag') || '#2JVVR0LLL';
      const encodedTag = encodeURIComponent(clanTag.startsWith('#') ? clanTag : `#${clanTag}`);

      const cocRes = await fetch(`https://api.clashofclans.com/v1/clans/${encodedTag}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await cocRes.json();
      return Response.json(data, {
        status: cocRes.status,
        headers: corsHeaders,
      });
    }

    return Response.json({ error: 'Unknown route' }, { status: 404 });
  },
};
