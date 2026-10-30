import { NextRequest, NextResponse } from 'next/server';
import { getAllInvites, saveInvite, deleteInvite } from '@/lib/storage';

export async function GET() {
  const invites = getAllInvites();
  return NextResponse.json(invites, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const result = saveInvite(rawData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, invite: result.invite });
  } catch (err: any) {
    console.error('Error in POST /api/invites:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('id') || searchParams.get('slug');

    if (!identifier) {
      return NextResponse.json({ error: 'Provide either id or slug to delete.' }, { status: 400 });
    }

    const result = deleteInvite(identifier);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true, remaining: result.remaining });
  } catch (err: any) {
    console.error('Error in DELETE /api/invites:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
