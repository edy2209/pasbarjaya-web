import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/lib/models';

// POST /api/auth/seed - Create initial superadmin (run once!)
// IMPORTANT: Remove or protect this route after first setup!
export async function POST(req: NextRequest) {
  try {
    // Simple protection: only allow seeding if no admin exists
    await dbConnect();

    const existingAdmin = await AdminUser.findOne({});
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin already exists. Seeding not allowed.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'Username, email, dan password wajib diisi' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({
      username,
      email,
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Superadmin berhasil dibuat!',
      user: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat admin' }, { status: 500 });
  }
}
