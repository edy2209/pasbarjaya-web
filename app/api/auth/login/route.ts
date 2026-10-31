import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'pasbarjaya_secret_super_key_2026';

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json({ success: false, error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const escapedUsername = cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find admin by username or email (case-insensitive)
    const admin = await AdminUser.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapedUsername}$`, 'i') } },
        { email: cleanUsername.toLowerCase() },
      ],
      isActive: true,
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(cleanPassword, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Username atau password salah' }, { status: 401 });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: { id: admin._id, username: admin.username, role: admin.role },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
