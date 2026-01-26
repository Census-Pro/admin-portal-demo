import { auth } from '@/auth';

export async function instance(multipart?: boolean) {
  try {
    const session = await auth();

    if (!session?.user) {
      console.error('[instance] No session or user found');
      throw new Error('No authentication token found');
    }

    const accessToken = session.accessToken;

    if (!accessToken) {
      console.error('[instance] No access token in session');
      throw new Error('Session expired. Please login again.');
    }

    // Build headers with optional session ID for activity tracking
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      ...(multipart ? {} : { 'Content-Type': 'application/json' })
    };

    // Add session ID header if available (for Redis session activity tracking)
    if (session.sessionId) {
      headers['x-session-id'] = session.sessionId;
    }

    console.log('✅ [instance] Headers prepared with bearer token');
    return headers;
  } catch (error) {
    console.error('[instance] Error preparing headers:', error);
    throw error;
  }
}
