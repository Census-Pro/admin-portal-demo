import { NextResponse } from 'next/server';
import { getOfficeLocations } from '@/actions/common/user-actions';

export async function GET() {
  try {
    const result = await getOfficeLocations();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('GET /api/office-locations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch office locations' },
      { status: 500 }
    );
  }
}
