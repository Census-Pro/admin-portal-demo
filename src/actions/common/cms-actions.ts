'use server';

import { instance } from '../instance';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  revalidateAnnouncements,
  revalidateNavigation,
  revalidateContentPages,
  revalidateQuickLinks,
  revalidateMediaLibrary
} from '@/lib/revalidate-client';

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
  category_id?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementCategory {
  id: string;
  name: string;
  name_dzo?: string;
  description?: string;
  slug: string;
  is_active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsPage {
  id: string;
  cms_navigation_id?: string; // Legacy - for backward compatibility
  cm_sub_link_id?: string; // New - for 3-tier structure
  slug: string;
  title: string;
  body?: string;
  featured_image_id?: string;
  status: 'draft' | 'published';
  updated_by_id?: string;
  updated_by_name?: string;
  published_by_id?: string;
  published_by_name?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  navigation?: {
    id: string;
    label: string;
  };
  subLink?: {
    id: string;
    label: string;
  };
  featuredImage?: MediaItem;
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
  subLinks?: SubLink[]; // New - for 3-tier structure
  contentPages?: CmsPage[]; // Legacy - for backward compatibility
}

export interface SubLink {
  id: string;
  cms_navigation_id: string;
  label: string;
  description?: string;
  icon?: string;
  order?: number;
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
  contentPages?: CmsPage[];
}

export interface QuickLinkCategory {
  id: string;
  name: string;
  name_dzo?: string;
  description?: string;
  slug: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  description?: string;
  url?: string;
  content_page_id?: string;
  contentPage?: CmsPage;
  category_id?: string;
  category?: QuickLinkCategory;
  type: string;
  order: number;
  is_active: boolean;
  opens_in_new_tab: boolean;
  icon?: string;
  created_at: string;
  created_by_name?: string;
}

// ============================================================================
// ANNOUNCEMENTS ACTIONS
// ============================================================================

export async function getAnnouncements() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-and-news/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('[getAnnouncements] API Error:', response.statusText);
      return {
        success: false,
        error: 'Failed to fetch announcements',
        data: []
      };
    }

    const data = await response.json();
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
    if (data.category_id) formData.append('category_id', data.category_id);
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

    // Trigger Client Portal revalidation
    await revalidateAnnouncements();

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
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.status) formData.append('status', data.status);

    // Add file if provided
    if (file) {
      formData.append('file', file);
    }

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

    // Trigger Client Portal revalidation
    await revalidateAnnouncements();

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

    // Trigger Client Portal revalidation
    await revalidateAnnouncements();

    return { success: true, message: 'Announcement deleted successfully' };
  } catch (error) {
    console.error('[deleteAnnouncement] Error:', error);
    return { success: false, error: 'Failed to delete announcement' };
  }
}

// ============================================================================
// ANNOUNCEMENT CATEGORIES ACTIONS
// ============================================================================

export async function getAnnouncementCategories() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-categories/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(
        '[getAnnouncementCategories] API Error:',
        response.statusText
      );
      return {
        success: false,
        error: 'Failed to fetch announcement categories',
        data: []
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result || []
    };
  } catch (error) {
    console.error('[getAnnouncementCategories] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch announcement categories',
      data: []
    };
  }
}

export async function getActiveAnnouncementCategories() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-categories/active`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(
        '[getActiveAnnouncementCategories] API Error:',
        response.statusText
      );
      return {
        success: false,
        error: 'Failed to fetch active announcement categories',
        data: []
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result || []
    };
  } catch (error) {
    console.error('[getActiveAnnouncementCategories] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch active announcement categories',
      data: []
    };
  }
}

export async function createAnnouncementCategory(
  data: Omit<AnnouncementCategory, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-categories`;

    // Clean up the data - remove empty strings and convert to undefined
    const cleanedData = {
      name: data.name,
      name_dzo: data.name_dzo || undefined,
      description: data.description || undefined,
      slug: data.slug || undefined,
      is_active: data.is_active,
      order: data.order || 0
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      console.error('[createAnnouncementCategory] Error response:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to create announcement category'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/categories');
    return {
      success: true,
      message: 'Announcement category created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createAnnouncementCategory] Exception:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create announcement category'
    };
  }
}

export async function updateAnnouncementCategory(
  id: string,
  data: Partial<AnnouncementCategory>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-categories/${id}`;

    // Clean up the data - remove empty strings and convert to undefined
    const cleanedData: Partial<AnnouncementCategory> = {};
    if (data.name !== undefined) cleanedData.name = data.name;
    if (data.name_dzo !== undefined)
      cleanedData.name_dzo = data.name_dzo || undefined;
    if (data.description !== undefined)
      cleanedData.description = data.description || undefined;
    if (data.slug !== undefined) cleanedData.slug = data.slug;
    if (data.is_active !== undefined) cleanedData.is_active = data.is_active;
    if (data.order !== undefined) cleanedData.order = data.order;

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      console.error('[updateAnnouncementCategory] Error response:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to update announcement category'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/categories');
    return {
      success: true,
      message: 'Announcement category updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateAnnouncementCategory] Error:', error);
    return { success: false, error: 'Failed to update announcement category' };
  }
}

export async function deleteAnnouncementCategory(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/announcement-categories/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to delete announcement category'
      };
    }

    revalidatePath('/dashboard/content/categories');
    return {
      success: true,
      message: 'Announcement category deleted successfully'
    };
  } catch (error) {
    console.error('[deleteAnnouncementCategory] Error:', error);
    return { success: false, error: 'Failed to delete announcement category' };
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
    const url = `${COMMON_SERVICE_URL}/cm-content`;

    // Clean up optional fields - convert empty strings or 'none' to null
    // Note: updated_by_id and updated_by_name are NOT included for CREATE
    // The backend will auto-populate these from the session/context
    const cleanedData: any = {
      title: data.title,
      slug: data.slug,
      body: data.body || '',
      status: data.status || 'draft',
      order: data.order || 1,
      cms_navigation_id:
        data.cms_navigation_id && data.cms_navigation_id !== 'none'
          ? data.cms_navigation_id
          : null,
      cm_sub_link_id:
        data.cm_sub_link_id && data.cm_sub_link_id !== 'none'
          ? data.cm_sub_link_id
          : null,
      featured_image_id:
        data.featured_image_id && data.featured_image_id !== 'none'
          ? data.featured_image_id
          : null
    };

    // If status is published on creation, record who published it
    if (data.status === 'published') {
      const session = await auth();
      cleanedData.published_by_id =
        session?.user?.id || session?.user?.sessionId || undefined;
      cleanedData.published_by_name =
        session?.user?.fullName || session?.user?.name || 'Admin User';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[createCmsPage] Error response:', errorData);

      // Handle specific foreign key constraint errors
      let errorMessage = errorData.message || 'Failed to create page';

      if (
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key')
      ) {
        if (errorMessage.includes('cms_navigation_id')) {
          errorMessage =
            'The selected navigation item does not exist. Please refresh and try again.';
        } else if (errorMessage.includes('featured_image_id')) {
          errorMessage =
            'The selected featured image does not exist. Please refresh and try again.';
        } else {
          errorMessage =
            'Invalid reference data. Please check your selections and try again.';
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/pages');

    // Trigger Client Portal revalidation
    await revalidateContentPages(result.slug);
    await revalidateNavigation();

    return {
      success: true,
      message: 'Page created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createCmsPage] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create page'
    };
  }
}

export async function updateCmsPage(id: string, data: Partial<CmsPage>) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-content/${id}`;

    // Get current session to populate updated_by fields
    const session = await auth();

    // Clean up optional fields - convert empty strings or 'none' to null
    const cleanedData: any = {};

    if (data.title !== undefined) cleanedData.title = data.title;
    if (data.slug !== undefined) cleanedData.slug = data.slug;
    if (data.body !== undefined) cleanedData.body = data.body;
    if (data.status !== undefined) cleanedData.status = data.status;
    if (data.order !== undefined) cleanedData.order = data.order;

    // Always attach updated_by fields from session on update
    cleanedData.updated_by_id =
      session?.user?.id || session?.user?.sessionId || undefined;
    cleanedData.updated_by_name =
      session?.user?.fullName || session?.user?.name || 'Admin User';

    // If status is becoming published, record who published it
    if (data.status === 'published') {
      cleanedData.published_by_id =
        session?.user?.id || session?.user?.sessionId || undefined;
      cleanedData.published_by_name =
        session?.user?.fullName || session?.user?.name || 'Admin User';
    }

    // Handle optional foreign keys properly
    if (data.cms_navigation_id !== undefined) {
      cleanedData.cms_navigation_id =
        data.cms_navigation_id && data.cms_navigation_id !== 'none'
          ? data.cms_navigation_id
          : null;
    }

    if (data.cm_sub_link_id !== undefined) {
      cleanedData.cm_sub_link_id =
        data.cm_sub_link_id && data.cm_sub_link_id !== 'none'
          ? data.cm_sub_link_id
          : null;
    }

    if (data.featured_image_id !== undefined) {
      cleanedData.featured_image_id =
        data.featured_image_id && data.featured_image_id !== 'none'
          ? data.featured_image_id
          : null;
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[updateCmsPage] Error response:', errorData);

      // Handle specific foreign key constraint errors
      let errorMessage = errorData.message || 'Failed to update page';

      if (
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('violates foreign key')
      ) {
        if (errorMessage.includes('cms_navigation_id')) {
          errorMessage =
            'The selected navigation item does not exist. Please refresh and try again.';
        } else if (errorMessage.includes('featured_image_id')) {
          errorMessage =
            'The selected featured image does not exist. Please refresh and try again.';
        } else {
          errorMessage =
            'Invalid reference data. Please check your selections and try again.';
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/pages');
    revalidatePath('/dashboard/content/navigation', 'layout');

    // Trigger Client Portal revalidation
    await revalidateContentPages(result.slug);
    await revalidateNavigation();

    return {
      success: true,
      message: 'Page updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateCmsPage] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update page'
    };
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

    // Trigger Client Portal revalidation (revalidate all content pages)
    await revalidateContentPages();

    return { success: true, message: 'Page deleted successfully' };
  } catch (error) {
    console.error('[deleteCmsPage] Error:', error);
    return { success: false, error: 'Failed to delete page' };
  }
}

export async function toggleCmsPageStatus(
  id: string,
  currentStatus: 'draft' | 'published'
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-content/${id}`;
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    const statusData: any = { status: newStatus };

    // If status is becoming published, record who published it
    if (newStatus === 'published') {
      const session = await auth();
      statusData.published_by_id =
        session?.user?.id || session?.user?.sessionId || undefined;
      statusData.published_by_name =
        session?.user?.fullName || session?.user?.name || 'Admin User';
    }

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to update status'
      };
    }

    const result = await response.json().catch(() => ({}));
    revalidatePath('/dashboard/content/pages');

    // Trigger Client Portal revalidation
    await revalidateContentPages(result.slug);
    await revalidateNavigation();

    return {
      success: true,
      message: `Page ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`
    };
  } catch (error) {
    console.error('[toggleCmsPageStatus] Error:', error);
    return { success: false, error: 'Failed to update status' };
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

    // Trigger Client Portal revalidation
    await revalidateMediaLibrary();

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

    // Remove Content-Type header to let fetch set it with the correct multipart boundary
    const headersWithoutContentType = { ...headers } as Record<string, string>;
    delete headersWithoutContentType['Content-Type'];

    // Reconstruct FormData server-side (Next.js deserializes it across the action boundary)
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const fileName = formData.get('file_name') as string | null;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const serverFormData = new FormData();
    serverFormData.append('file', file);
    serverFormData.append('category', category || 'media');
    if (fileName) {
      serverFormData.append('file_name', fileName);
    }

    console.log(
      '[uploadMediaFile] Uploading:',
      fileName || file.name,
      'size:',
      file.size,
      'category:',
      category
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: serverFormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[uploadMediaFile] API error:', response.status, errorData);
      return {
        success: false,
        error:
          errorData.message || `Upload failed with status ${response.status}`
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/media');

    // Trigger Client Portal revalidation
    await revalidateMediaLibrary();

    return {
      success: true,
      message: 'File uploaded successfully',
      data: result
    };
  } catch (error) {
    console.error('[uploadMediaFile] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
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

    const fileName = formData.get('file_name') as string | null;
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;

    const serverFormData = new FormData();
    if (file) serverFormData.append('file', file);
    if (category) serverFormData.append('category', category);
    if (fileName) serverFormData.append('file_name', fileName);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: headersWithoutContentType,
      body: serverFormData
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

    // Trigger Client Portal revalidation
    await revalidateMediaLibrary();

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

    // Trigger Client Portal revalidation
    await revalidateMediaLibrary();

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
      console.error('[createNavigationItem] Error response:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to create navigation item'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/navigation');

    // Trigger Client Portal revalidation
    await revalidateNavigation();

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

    // Remove fields that should not be updated
    const {
      created_by_id: _created_by_id,
      created_by_name: _created_by_name,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      contentPages: _contentPages,
      subLinks: _subLinks,
      ...updateData
    } = data;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
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

    // Trigger Client Portal revalidation
    await revalidateNavigation();

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

    // Trigger Client Portal revalidation
    await revalidateNavigation();

    return { success: true, message: 'Navigation item deleted successfully' };
  } catch (error) {
    console.error('[deleteNavigationItem] Error:', error);
    return { success: false, error: 'Failed to delete navigation item' };
  }
}

// ============================================================================
// SUB-LINKS ACTIONS (3-Tier Structure)
// ============================================================================

export async function getSubLinks() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-sub-links/all`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('[getSubLinks] API Error:', response.statusText);
      return {
        success: false,
        error: 'Failed to fetch sub-links',
        data: []
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getSubLinks] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch sub-links',
      data: []
    };
  }
}

export async function getSubLinksByNavigation(navigationId: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-sub-links/navigation/${navigationId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(
        '[getSubLinksByNavigation] API Error:',
        response.statusText
      );
      return {
        success: false,
        error: 'Failed to fetch sub-links for navigation',
        data: []
      };
    }

    const data = await response.json();
    // Sort by order
    const sorted = data.sort(
      (a: SubLink, b: SubLink) => (a.order || 0) - (b.order || 0)
    );
    return { success: true, data: sorted };
  } catch (error) {
    console.error('[getSubLinksByNavigation] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch sub-links for navigation',
      data: []
    };
  }
}

export async function createSubLink(data: Omit<SubLink, 'id'>) {
  try {
    const headers = await instance();
    const session = await auth();
    const url = `${COMMON_SERVICE_URL}/cm-sub-links`;

    const payload = {
      ...data,
      created_by_id: session?.user?.id || session?.user?.sessionId,
      created_by_name:
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
      console.error('[createSubLink] Error response:', errorData);
      return {
        success: false,
        error: errorData.message || 'Failed to create sub-link'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/navigation');

    // Trigger Client Portal revalidation
    await revalidateNavigation();

    return {
      success: true,
      message: 'Sub-link created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createSubLink] Error:', error);
    return { success: false, error: 'Failed to create sub-link' };
  }
}

export async function updateSubLink(id: string, data: Partial<SubLink>) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-sub-links/${id}`;

    // Remove fields that should not be updated
    const {
      created_by_id: _created_by_id,
      created_by_name: _created_by_name,
      cms_navigation_id: _cms_navigation_id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      contentPages: _contentPages,
      ...updateData
    } = data;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to update sub-link'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/navigation');

    // Trigger Client Portal revalidation
    await revalidateNavigation();

    return {
      success: true,
      message: 'Sub-link updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateSubLink] Error:', error);
    return { success: false, error: 'Failed to update sub-link' };
  }
}

export async function deleteSubLink(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/cm-sub-links/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete sub-link' };
    }

    revalidatePath('/dashboard/content/navigation');

    // Trigger Client Portal revalidation
    await revalidateNavigation();

    return { success: true, message: 'Sub-link deleted successfully' };
  } catch (error) {
    console.error('[deleteSubLink] Error:', error);
    return { success: false, error: 'Failed to delete sub-link' };
  }
}

// ============================================================================
// QUICK LINKS ACTIONS
// ============================================================================

export async function getQuickLinks() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-links`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch quick links', data: [] };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getQuickLinks] Error:', error);
    return { success: false, error: 'Failed to fetch quick links', data: [] };
  }
}

export async function createQuickLink(
  data: Omit<QuickLink, 'id' | 'created_at'>
) {
  try {
    const headers = await instance();
    const session = await auth();
    const url = `${COMMON_SERVICE_URL}/quick-links`;

    const currentUser = session?.user;

    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    const payload = {
      ...data,
      created_by_id: currentUser.id || currentUser.sessionId,
      created_by_name: currentUser.fullName || currentUser.name || 'Admin User'
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
        error: errorData.message || 'Failed to create quick link'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/quick-links');

    // Trigger Client Portal revalidation
    await revalidateQuickLinks();

    return {
      success: true,
      message: 'Quick link created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createQuickLink] Error:', error);
    return { success: false, error: 'Failed to create quick link' };
  }
}

export async function updateQuickLink(id: string, data: Partial<QuickLink>) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-links/${id}`;

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
        error: errorData.message || 'Failed to update quick link'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/quick-links');

    // Trigger Client Portal revalidation
    await revalidateQuickLinks();

    return {
      success: true,
      message: 'Quick link updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateQuickLink] Error:', error);
    return { success: false, error: 'Failed to update quick link' };
  }
}

export async function toggleQuickLinkStatus(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-links/${id}/toggle-active`;

    const response = await fetch(url, {
      method: 'PUT',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update status' };
    }

    revalidatePath('/dashboard/content/quick-links');

    // Trigger Client Portal revalidation
    await revalidateQuickLinks();

    return { success: true, message: 'Status updated successfully' };
  } catch (error) {
    console.error('[toggleQuickLinkStatus] Error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteQuickLink(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-links/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to delete quick link' };
    }

    revalidatePath('/dashboard/content/quick-links');

    // Trigger Client Portal revalidation
    await revalidateQuickLinks();

    return { success: true, message: 'Quick link deleted successfully' };
  } catch (error) {
    console.error('[deleteQuickLink] Error:', error);
    return { success: false, error: 'Failed to delete quick link' };
  }
}

// ============================================================================
// QUICK LINK CATEGORIES ACTIONS
// ============================================================================

export async function getQuickLinkCategories() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch categories', data: [] };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getQuickLinkCategories] Error:', error);
    return { success: false, error: 'Failed to fetch categories', data: [] };
  }
}

export async function getActiveQuickLinkCategories() {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories/active`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch categories', data: [] };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[getActiveQuickLinkCategories] Error:', error);
    return { success: false, error: 'Failed to fetch categories', data: [] };
  }
}

export async function createQuickLinkCategory(
  data: Omit<QuickLinkCategory, 'id' | 'created_at' | 'updated_at'>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories`;

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
        error: errorData.message || 'Failed to create category'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/quick-link-categories');
    return {
      success: true,
      message: 'Category created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createQuickLinkCategory] Error:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateQuickLinkCategory(
  id: string,
  data: Partial<QuickLinkCategory>
) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories/${id}`;

    const response = await fetch(url, {
      method: 'PUT',
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
        error: errorData.message || 'Failed to update category'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/quick-link-categories');
    return {
      success: true,
      message: 'Category updated successfully',
      data: result
    };
  } catch (error) {
    console.error('[updateQuickLinkCategory] Error:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function toggleQuickLinkCategoryStatus(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories/${id}/toggle-active`;

    const response = await fetch(url, {
      method: 'PUT',
      headers
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update status' };
    }

    revalidatePath('/dashboard/content/quick-link-categories');
    return { success: true, message: 'Status updated successfully' };
  } catch (error) {
    console.error('[toggleQuickLinkCategoryStatus] Error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteQuickLinkCategory(id: string) {
  try {
    const headers = await instance();
    const url = `${COMMON_SERVICE_URL}/quick-link-categories/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to delete category'
      };
    }

    revalidatePath('/dashboard/content/quick-link-categories');
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    console.error('[deleteQuickLinkCategory] Error:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
