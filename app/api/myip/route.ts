export async function GET() {
  // Fetch outbound IP from an external service
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return Response.json({ serverOutboundIp: data.ip });
}
