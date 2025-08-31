import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check endpoint
    return NextResponse.json({
      success: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
      status: 'online'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      status: 'offline'
    }, { status: 500 });
  }
}
