import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToR2 } from '@/lib/r2';

// POST /api/upload - Upload video/image file to Cloudflare R2
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'highlights';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Tidak ada file yang diupload' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak didukung. Gunakan MP4, WebM, atau gambar JPG/PNG.' },
        { status: 400 }
      );
    }

    // 500MB file size limit for videos
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File terlalu besar. Maksimum 500MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validFolders = ['highlights', 'videos', 'banners'] as const;
    const safeFolder = validFolders.includes(folder as typeof validFolders[number])
      ? (folder as typeof validFolders[number])
      : 'highlights';

    const result = await uploadFileToR2(buffer, file.name, file.type, safeFolder);

    return NextResponse.json({
      success: true,
      url: result.publicUrl,
      key: result.key,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload gagal. Pastikan Cloudflare R2 credentials sudah dikonfigurasi di .env.local' },
      { status: 500 }
    );
  }
}
