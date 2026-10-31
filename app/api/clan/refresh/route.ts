import { NextRequest, NextResponse } from 'next/server';
import { refreshClanCache } from '@/lib/coc-api';

// POST /api/clan/refresh - Paksa refresh cache dari CoC API
// Panggil dari local: fetch('http://localhost:3000/api/clan/refresh', { method: 'POST' })
// Atau dari production pakai secret key
export async function POST(req: NextRequest) {
  // Simple secret key check (opsional, biar aman di production)
  const secret = req.headers.get('x-refresh-secret');
  const validSecret = process.env.JWT_SECRET || 'pasbarjaya_secret_super_key_2026';
  
  if (secret !== validSecret) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await refreshClanCache();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
