import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'pasbarjaya-media';
const publicDomain = (process.env.R2_PUBLIC_DOMAIN || 'https://pub-r2.pasbarjaya.com').replace(/\/$/, '');

const s3 = (accountId && accessKeyId && secretAccessKey)
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

// POST /api/upload/presign - Generate direct upload URL to Cloudflare R2
export async function POST(req: NextRequest) {
  try {
    if (!s3) {
      return NextResponse.json(
        { success: false, error: 'Cloudflare R2 credentials belum lengkap di environment variable' },
        { status: 500 }
      );
    }

    const { fileName, fileType, folder = 'highlights' } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ success: false, error: 'fileName dan fileType diperlukan' }, { status: 400 });
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${Date.now()}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    // Generate presigned upload URL valid for 15 minutes
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    const publicUrl = `${publicDomain}/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Presign URL error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Gagal generate presigned URL' }, { status: 500 });
  }
}

