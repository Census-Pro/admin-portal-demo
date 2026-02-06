'use server';

import { revalidatePath } from 'next/cache';
import { instance } from './instance';

const API_URL = process.env.AUTH_SERVICE;

export async function changePassword(formData: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const session = await instance();

    // Get current user ID from session - this might need adjustment based on how session stores user ID
    // For now, we'll assume it's available in the session context

    // Since this is a server action called from a client component,
    // we need to get the user ID from the auth context
    const { auth } = await import('@/auth');
    const sessionData = await auth();

    if (!sessionData?.user?.id) {
      return { error: true, message: 'User not authenticated' };
    }

    const response = await fetch(
      `${API_URL}/admin/${sessionData.user.id}/change-password`,
      {
        method: 'POST',
        headers: session,
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMessage =
        (data?.error as any)?.message ||
        data?.message ||
        'Failed to update password';
      return { error: true, message: errorMessage };
    }

    revalidatePath('/dashboard/profile');
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error changing password:', error);
    return { error: true, message: 'Failed to update password' };
  }
}
