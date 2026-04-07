import { NextResponse } from 'next/server';

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ bookings: [] });
}
