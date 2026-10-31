import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/lib/models';

// GET /api/admin-users
export async function GET() {
  try {
    await dbConnect();
    const admins = await AdminUser.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST /api/admin-users
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'Username, email, password wajib diisi' }, { status: 400 });
    }

    const exists = await AdminUser.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return NextResponse.json({ success: false, error: 'Username atau email sudah terdaftar' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({ username, email, passwordHash, role: role || 'admin' });

    return NextResponse.json({
      success: true,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create admin' }, { status: 500 });
  }
}
