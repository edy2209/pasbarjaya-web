import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Highlight } from '@/lib/models';

// GET /api/highlights - Fetch all highlights from DB
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'classic' | 'cwl'
    const featured = searchParams.get('featured');

    const filter: Record<string, unknown> = {};
    if (type && ['classic', 'cwl'].includes(type)) filter.type = type;
    if (featured === 'true') filter.featured = true;

    const highlights = await Highlight.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, highlights });
  } catch (error) {
    console.error('GET /api/highlights error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch highlights' }, { status: 500 });
  }
}

// POST /api/highlights - Create new highlight (admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const highlight = await Highlight.create(body);
    return NextResponse.json({ success: true, highlight }, { status: 201 });
  } catch (error) {
    console.error('POST /api/highlights error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create highlight' }, { status: 500 });
  }
}
