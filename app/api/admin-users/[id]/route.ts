import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/lib/models';

// PUT /api/admin-users/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    // Never allow updating passwordHash directly here
    const { passwordHash: _ph, ...safeBody } = body;
    void _ph;
    const admin = await AdminUser.findByIdAndUpdate(id, safeBody, { new: true, select: '-passwordHash' }).lean();
    if (!admin) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, admin });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/admin-users/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    await AdminUser.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
