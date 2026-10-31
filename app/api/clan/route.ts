import { NextRequest, NextResponse } from 'next/server';
import { fetchClanData } from '@/lib/coc-api';

// GET /api/clan - Fetch live clan data from Supercell API
export async function GET(_req: NextRequest) {
  try {
    const clan = await fetchClanData();
    return NextResponse.json({ success: true, clan });
  } catch (error) {
    console.error('API /clan error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clan data' }, { status: 500 });
  }
}
