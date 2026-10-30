import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeId, title, xpReward = 150 } = body;

    return NextResponse.json({
      success: true,
      challengeId,
      title,
      xpAwarded: xpReward,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record completion' }, { status: 500 });
  }
}

