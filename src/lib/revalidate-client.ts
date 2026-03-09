/**
 * Client Portal Revalidation Utility
 * Triggers on-demand revalidation in the Client Portal when CMS content changes
 */

const CLIENT_PORTAL_URL =
  process.env.CLIENT_PORTAL_URL || 'http://localhost:3000';
const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET || 'census-revalidate-secret-2026';

type RevalidationType =
  | 'announcements'
  | 'navigation'
  | 'content-pages'
  | 'quick-links'
  | 'media-library'
  | 'all';

interface RevalidateOptions {
  type: RevalidationType;
  path?: string;
}

/**
 * Trigger revalidation in the Client Portal
 */
export async function revalidateClientPortal(
  options: RevalidateOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${CLIENT_PORTAL_URL}/api/revalidate`;

    console.log('[revalidateClientPortal] Triggering revalidation:', options);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATE_SECRET
      },
      body: JSON.stringify(options)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[revalidateClientPortal] Error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Revalidation request failed'
      };
    }

    const result = await response.json();
    console.log('[revalidateClientPortal] Success:', result);

    return { success: true };
  } catch (error) {
    console.error('[revalidateClientPortal] Exception:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to revalidate client portal'
    };
  }
}

/**
 * Revalidate announcements in Client Portal
 */
export async function revalidateAnnouncements() {
  return revalidateClientPortal({ type: 'announcements' });
}

/**
 * Revalidate navigation in Client Portal
 */
export async function revalidateNavigation() {
  return revalidateClientPortal({ type: 'navigation' });
}

/**
 * Revalidate content pages in Client Portal
 */
export async function revalidateContentPages(slug?: string) {
  return revalidateClientPortal({
    type: 'content-pages',
    path: slug ? `/${slug}` : undefined
  });
}

/**
 * Revalidate quick links in Client Portal
 */
export async function revalidateQuickLinks() {
  return revalidateClientPortal({ type: 'quick-links' });
}

/**
 * Revalidate media library in Client Portal
 */
export async function revalidateMediaLibrary() {
  return revalidateClientPortal({ type: 'media-library' });
}

/**
 * Revalidate all CMS content in Client Portal
 */
export async function revalidateAll() {
  return revalidateClientPortal({ type: 'all' });
}
