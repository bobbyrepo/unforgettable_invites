import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID || 'fb6912bbc3e68db65cd483aee21885ae'}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '204da7da0e0389e76d16b5faa12448a7',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '6bff2711855825cd27bb81f21f130e2bd1e7ee5b550eb5ad42b6085ca266ff0c',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'unforgettable-invites-assets';
const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_URL || 'https://pub-9df949e18be24d52a5ae719c1edfe88c.r2.dev').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customFolder = (formData.get('folder') as string) || 'uploads';
    const customFilename = formData.get('filename') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = customFilename || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const s3Key = `${customFolder}/${safeName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type || 'application/octet-stream',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const publicUrl = `${R2_PUBLIC_URL}/${s3Key}`;

    return NextResponse.json({
      success: true,
      key: s3Key,
      url: publicUrl,
      size: buffer.length,
      mime: file.type,
    });
  } catch (error: any) {
    console.error('Upload to R2 failed:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
