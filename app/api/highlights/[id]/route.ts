import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Highlight } from '@/lib/models';

// GET /api/highlights/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const highlight = await Highlight.findById(id).lean();
    if (!highlight) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // Increment view count
    await Highlight.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({ success: true, highlight });
  } catch (error) {
    console.error('GET /api/highlights/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch highlight' }, { status: 500 });
  }
}

// PUT /api/highlights/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const highlight = await Highlight.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!highlight) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, highlight });
  } catch (error) {
    console.error('PUT /api/highlights/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update highlight' }, { status: 500 });
  }
}

// DELETE /api/highlights/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await Highlight.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Highlight deleted' });
  } catch (error) {
    console.error('DELETE /api/highlights/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete highlight' }, { status: 500 });
  }
}
