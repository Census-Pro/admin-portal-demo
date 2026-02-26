'use server';

import { instance } from '../instance';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const COMMON_SERVICE_URL =
  process.env.COMMON_SERVICE_URL || 'http://localhost:5003';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Announcement {
  id: string;
  headline: string;
  message?: string;
  image_url?: string;
  image_name?: string;
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsPage {
  id: string;
  cms_navigation_id?: string;
  slug: string;
  title: string;
  body?: string;
  status: 'draft' | 'published';
  updated_by_id?: string;
  updated_by_name?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  navigation?: {
    id: string;
    label: string;
  };
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  category: 'forms' | 'banners' | 'media';
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url?: string;
  icon?: string;
  order?: number;
  message?: string;
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
  contentPages?: CmsPage[];
}

// ============================================================================
// ANNOUNCEMENTS ACTIONS
// ============================================================================

export async function getAnnouncements() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-and-news/all`;

    console.log('[getAnnouncements] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getAnnouncements] Response status:', response.status);

    if (!response.ok) {
      console.error('[getAnnouncements] API Error:', response.statusText);
      return {
        success: false,
        error: 'Failed to fetch announcements',
        data: []
      };
    }

    const data = await response.json();
    console.log('[getAnnouncements] Data received:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[getAnnouncements] Error:', error);
    return { success: false, error: 'Failed to fetch announcements', data: [] };
  }
}

export async function createAnnouncement(
  data: Omit<Announcement, 'id' | 'created_by_id' | 'created_by_name'>,
  file?: File
) {
  try {
    const headers = await instance();
    const session = await auth();
    const url = `${COMMON_SERVICE_URL}/announcement-and-news`;

    const currentUser = session?.user;

    if (!currentUser) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const formData = new FormData();

    // Add text fields
    formData.append('headline', data.headline);
    if (data.message) formData.append('message', data.message);
    formData.append('status', data.status);
    formData.append('created_by_id', currentUser.id);
    formData.append(
      'created_by_name',
      currentUser.fullName || currentUser.cidNo || 'Unknown User'
    );

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    console.log('[createAnnouncement] FormData prepared with file:', !!file);

    // Remove Content-Type header to let browser set it with boundary
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 'Content-Type': _, ...headersWithoutContentType } = headers;

    const response = await fetch(url, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create announcement'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/announcements');
    return {
      success: true,
      message: 'Announcement created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createAnnouncement] Error:', error);
    return { success: false, error: 'Failed to create announcement' };
  }
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Announcement>,
  file?: File
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-and-news/${id}`;

    const formData = new FormData();

    // Add text fields if provided
    if (data.headline) formData.append('headline', data.headline);
    if (data.message) formData.append('message', data.message);
    if (data.status) formData.append('status', data.status);

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

    console.log('[updateAnnouncement] FormData prepared with file:', !!file);

    // Remove Content-Type header to let browser set it with boundary
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 'Content-Type': _, ...headersWithoutContentType } = headers;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: headersWithoutContentType,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update announcement'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/announcements');
    return {
      success: true,
      message: 'Announcement updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateAnnouncement] Error:', error);
    return { success: false, error: 'Failed to update announcement' };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-and-news/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete announcement' };
    }

    revalidatePath('/dashboard/content/announcements');
    return { success: true, message: 'Announcement deleted successfully' };
  } catch (error) {
    console.error('[deleteAnnouncement] Error:', error);
    return { success: false, error: 'Failed to delete announcement' };
  }
}

// ============================================================================
// CONTENT PAGES ACTIONS
// ============================================================================

export async function getCmsPages() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-content/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('[getCmsPages] API Error:', response.statusText);
      return {
        success: false,
        error: 'Failed to fetch content pages',
        data: []
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getCmsPages] Error:', error);
    return { success: false, error: 'Failed to fetch content pages', data: [] };
  }
}

export async function createCmsPage(data: Omit<CmsPage, 'id'>) {
  try {
    const headers = await instance();
    const session = await auth();
    const url = `${COMMON_SERVICE_URL}/cm-content`;

    // Add updated_by_id and updated_by_name from session
    const payload = {
      ...data,
      updated_by_id: session?.user?.id || session?.user?.sessionId,
      updated_by_name:
        session?.user?.fullName || session?.user?.name || 'Admin User'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create page'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/pages');
    return {
      success: true,
      message: 'Page created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createCmsPage] Error:', error);
    return { success: false, error: 'Failed to create page' };
  }
}

export async function updateCmsPage(id: string, data: Partial<CmsPage>) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-content/${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update page'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/pages');
    return {
      success: true,
      message: 'Page updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateCmsPage] Error:', error);
    return { success: false, error: 'Failed to update page' };
  }
}

export async function deleteCmsPage(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-content/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete page' };
    }

    revalidatePath('/dashboard/content/pages');
    return { success: true, message: 'Page deleted successfully' };
  } catch (error) {
    console.error('[deleteCmsPage] Error:', error);
    return { success: false, error: 'Failed to delete page' };
  }
}

// ============================================================================
// MEDIA LIBRARY ACTIONS
// ============================================================================

export async function getMediaItems() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('[getMediaItems] API Error:', response.statusText);
      return { success: false, error: 'Failed to fetch media items', data: [] };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getMediaItems] Error:', error);
    return { success: false, error: 'Failed to fetch media items', data: [] };
  }
}

export async function createMediaItem(
  data: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create media item'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/media');
    return {
      success: true,
      message: 'Media uploaded successfully',
      data: result
    };
  } catch (error) {
    console.error('[createMediaItem] Error:', error);
    return { success: false, error: 'Failed to create media item' };
  }
}

export async function uploadMediaFile(formData: FormData) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library`;

    // Remove Content-Type header to let browser set it with boundary
    const headersWithoutContentType = { ...headers };
    delete headersWithoutContentType['Content-Type'];

    const response = await fetch(url, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to upload file'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/media');
    return {
      success: true,
      message: 'File uploaded successfully',
      data: result
    };
  } catch (error) {
    console.error('[uploadMediaFile] Error:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function updateMediaItem(id: string, data: Partial<MediaItem>) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library/${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update media item'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/media');
    return {
      success: true,
      message: 'Media updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateMediaItem] Error:', error);
    return { success: false, error: 'Failed to update media item' };
  }
}

export async function updateMediaFileWithUpload(
  id: string,
  formData: FormData
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library/${id}`;

    // Remove Content-Type header to let browser set it with boundary
    const headersWithoutContentType = { ...headers };
    delete headersWithoutContentType['Content-Type'];

    const response = await fetch(url, {
      method: 'PATCH',
      headers: headersWithoutContentType,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update file'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/media');
    return {
      success: true,
      message: 'File updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateMediaFileWithUpload] Error:', error);
    return { success: false, error: 'Failed to update file' };
  }
}

export async function deleteMediaItem(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-media-library/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete media item' };
    }

    revalidatePath('/dashboard/content/media');
    return { success: true, message: 'Media deleted successfully' };
  } catch (error) {
    console.error('[deleteMediaItem] Error:', error);
    return { success: false, error: 'Failed to delete media item' };
  }
}

// ============================================================================
// NAVIGATION ACTIONS
// ============================================================================

export async function getNavigationItems() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-navigation/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('[getNavigationItems] API Error:', response.statusText);
      return {
        success: false,
        error: 'Failed to fetch navigation items',
        data: []
      };
    }

    const data = await response.json();
    // Sort by order if available
    const sorted = data.sort(
      (a: NavigationItem, b: NavigationItem) => (a.order || 0) - (b.order || 0)
    );
    return { success: true, data: sorted };
  } catch (error) {
    console.error('[getNavigationItems] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch navigation items',
      data: []
    };
  }
}

export async function createNavigationItem(data: Omit<NavigationItem, 'id'>) {
  try {
    const headers = await instance();
    const session = await auth();
    const url = `${COMMON_SERVICE_URL}/cm-navigation`;

    // Add created_by_id and created_by_name from session
    const payload = {
      ...data,
      created_by_id: session?.user?.id || session?.user?.sessionId,
      created_by_name:
        session?.user?.fullName || session?.user?.name || 'Admin User'
    };

    console.log('[createNavigationItem] URL:', url);
    console.log('[createNavigationItem] Payload:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[createNavigationItem] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[createNavigationItem] Error response:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to create navigation item'
      };
    }

    const result = await response.json();
    console.log('[createNavigationItem] Success:', result);
    revalidatePath('/dashboard/content/navigation');
    return {
      success: true,
      message: 'Navigation item created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createNavigationItem] Error:', error);
    return { success: false, error: 'Failed to create navigation item' };
  }
}

export async function updateNavigationItem(
  id: string,
  data: Partial<NavigationItem>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-navigation/${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update navigation item'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/navigation');
    return {
      success: true,
      message: 'Navigation item updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateNavigationItem] Error:', error);
    return { success: false, error: 'Failed to update navigation item' };
  }
}

export async function deleteNavigationItem(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-navigation/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete navigation item' };
    }

    revalidatePath('/dashboard/content/navigation');
    return { success: true, message: 'Navigation item deleted successfully' };
  } catch (error) {
    console.error('[deleteNavigationItem] Error:', error);
    return { success: false, error: 'Failed to delete navigation item' };
  }
}
