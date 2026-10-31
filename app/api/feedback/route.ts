import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Feedback } from '@/lib/models';

// GET /api/feedback - Admin: list all feedback
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status && ['pending', 'reviewed', 'implemented', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

// POST /api/feedback - Public: submit new feedback
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { senderName, playerTag, category, message } = body;
    if (!senderName || !message) {
      return NextResponse.json({ success: false, error: 'Nama dan pesan wajib diisi' }, { status: 400 });
    }

    const catMap: Record<string, string> = {
      war: 'war_strategy',
      war_strategy: 'war_strategy',
      'strategi war': 'war_strategy',
      donasi: 'donation',
      donation: 'donation',
      umum: 'general',
      general: 'general',
      event: 'general',
      rules: 'rules',
      peraturan: 'rules',
      other: 'other',
      lainnya: 'other',
    };
    const normalizedCategory = catMap[(category || '').toLowerCase()] || category || 'general';

    const feedback = await Feedback.create({
      senderName,
      playerTag: playerTag || '',
      category: normalizedCategory,
      message,
    });
    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Gagal menyimpan saran' }, { status: 500 });
  }
}
