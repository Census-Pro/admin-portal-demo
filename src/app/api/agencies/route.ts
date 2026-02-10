import { NextResponse } from 'next/server';
import { getAgencies } from '@/actions/common/user-actions';

export async function GET() {
  try {
    const result = await getAgencies();

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
    console.error('GET /api/agencies error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
}
