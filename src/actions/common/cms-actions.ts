'use server';

// ============================================================================
// DUMMY DATA FOR CMS
// ============================================================================

export interface Announcement {
  id: string;
  title: string;
  status: 'Published' | 'Draft' | 'Archived';
  publishedDate: string;
}

let announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Portal Launch',
    status: 'Published',
    publishedDate: '2026-02-01'
  },
  {
    id: '2',
    title: 'Maintenance Scheduled',
    status: 'Draft',
    publishedDate: '2026-03-01'
  }
];

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: 'Published' | 'Draft';
  updatedAt: string;
}

let cmsPages: CmsPage[] = [
  {
    id: '1',
    title: 'About Us',
    slug: '/about',
    status: 'Published',
    updatedAt: '2026-01-15'
  },
  {
    id: '2',
    title: 'Contact',
    slug: '/contact',
    status: 'Draft',
    updatedAt: '2026-02-20'
  }
];

export interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  size: string;
  uploadDate: string;
}

let mediaItems: MediaItem[] = [
  {
    id: '1',
    fileName: 'logo.png',
    fileType: 'image/png',
    size: '24 KB',
    uploadDate: '2026-01-10'
  },
  {
    id: '2',
    fileName: 'guidelines.pdf',
    fileType: 'application/pdf',
    size: '1.2 MB',
    uploadDate: '2026-02-18'
  }
];

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

let navigationItems: NavigationItem[] = [
  { id: '1', label: 'Home', url: '/', order: 1, isActive: true },
  { id: '2', label: 'Services', url: '/services', order: 2, isActive: true }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// ANNOUNCEMENTS ACTIONS
// ============================================================================

export async function getAnnouncements() {
  await delay(300);
  return { success: true, data: [...announcements] };
}

export async function createAnnouncement(data: Omit<Announcement, 'id'>) {
  await delay(300);
  const newAnnouncement = { ...data, id: String(Date.now()) };
  announcements.unshift(newAnnouncement);
  return {
    success: true,
    message: 'Announcement created successfully',
    data: newAnnouncement
  };
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Announcement>
) {
  await delay(300);
  const index = announcements.findIndex((a) => a.id === id);
  if (index === -1) return { success: false, error: 'Not found' };
  announcements[index] = { ...announcements[index], ...data };
  return {
    success: true,
    message: 'Announcement updated successfully',
    data: announcements[index]
  };
}

export async function deleteAnnouncement(id: string) {
  await delay(300);
  announcements = announcements.filter((a) => a.id !== id);
  return { success: true, message: 'Announcement deleted successfully' };
}

// ============================================================================
// CONTENT PAGES ACTIONS
// ============================================================================

export async function getCmsPages() {
  await delay(300);
  return { success: true, data: [...cmsPages] };
}

export async function createCmsPage(data: Omit<CmsPage, 'id'>) {
  await delay(300);
  const newPage = { ...data, id: String(Date.now()) };
  cmsPages.unshift(newPage);
  return { success: true, message: 'Page created successfully', data: newPage };
}

export async function updateCmsPage(id: string, data: Partial<CmsPage>) {
  await delay(300);
  const index = cmsPages.findIndex((p) => p.id === id);
  if (index === -1) return { success: false, error: 'Not found' };
  cmsPages[index] = { ...cmsPages[index], ...data };
  return {
    success: true,
    message: 'Page updated successfully',
    data: cmsPages[index]
  };
}

export async function deleteCmsPage(id: string) {
  await delay(300);
  cmsPages = cmsPages.filter((p) => p.id !== id);
  return { success: true, message: 'Page deleted successfully' };
}

// ============================================================================
// MEDIA LIBRARY ACTIONS
// ============================================================================

export async function getMediaItems() {
  await delay(300);
  return { success: true, data: [...mediaItems] };
}

export async function createMediaItem(
  data: Omit<MediaItem, 'id' | 'uploadDate'>
) {
  await delay(300);
  const newItem = {
    ...data,
    uploadDate: new Date().toISOString().split('T')[0],
    id: String(Date.now())
  };
  mediaItems.unshift(newItem);
  return {
    success: true,
    message: 'Media uploaded successfully',
    data: newItem
  };
}

export async function updateMediaItem(id: string, data: Partial<MediaItem>) {
  await delay(300);
  const index = mediaItems.findIndex((m) => m.id === id);
  if (index === -1) return { success: false, error: 'Not found' };
  mediaItems[index] = { ...mediaItems[index], ...data };
  return {
    success: true,
    message: 'Media updated successfully',
    data: mediaItems[index]
  };
}

export async function deleteMediaItem(id: string) {
  await delay(300);
  mediaItems = mediaItems.filter((m) => m.id !== id);
  return { success: true, message: 'Media deleted successfully' };
}

// ============================================================================
// NAVIGATION ACTIONS
// ============================================================================

export async function getNavigationItems() {
  await delay(300);
  // Sort by order
  const sorted = [...navigationItems].sort((a, b) => a.order - b.order);
  return { success: true, data: sorted };
}

export async function createNavigationItem(data: Omit<NavigationItem, 'id'>) {
  await delay(300);
  const newItem = { ...data, id: String(Date.now()) };
  navigationItems.push(newItem);
  return {
    success: true,
    message: 'Navigation item created successfully',
    data: newItem
  };
}

export async function updateNavigationItem(
  id: string,
  data: Partial<NavigationItem>
) {
  await delay(300);
  const index = navigationItems.findIndex((n) => n.id === id);
  if (index === -1) return { success: false, error: 'Not found' };
  navigationItems[index] = { ...navigationItems[index], ...data };
  return {
    success: true,
    message: 'Navigation item updated successfully',
    data: navigationItems[index]
  };
}

export async function deleteNavigationItem(id: string) {
  await delay(300);
  navigationItems = navigationItems.filter((n) => n.id !== id);
  return { success: true, message: 'Navigation item deleted successfully' };
}
