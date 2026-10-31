import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ClanEvent } from '@/lib/models';

// GET /api/events
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status && ['upcoming', 'active', 'ended'].includes(status)) filter.status = status;

    const events = await ClanEvent.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const event = await ClanEvent.create(body);
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
  }
}
