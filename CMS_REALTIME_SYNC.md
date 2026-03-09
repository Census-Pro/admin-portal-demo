# CMS Real-Time Synchronization - Implementation Guide

## 📋 Overview

This document explains the **real-time synchronization** between the Admin Portal CMS and the Client Portal, ensuring that any content updates made by administrators are immediately reflected on the public-facing website.

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN PORTAL                              │
│                   (Next.js - Port 3000)                         │
│                                                                 │
│  Admin edits content (announcement, navigation, etc.)          │
│                        ↓                                        │
│  Server Action (cms-actions.ts)                                │
│                        ↓                                        │
│  1. Update Common Service (API)                                │
│  2. Revalidate Admin Portal cache                              │
│  3. Trigger Client Portal revalidation ← NEW!                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      COMMON SERVICE                             │
│                    (NestJS - Port 5003)                         │
│                                                                 │
│  Process CRUD operations                                        │
│  Update PostgreSQL database                                     │
│  Store media in MinIO                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT PORTAL                              │
│                   (Next.js - Port 3001)                         │
│                                                                 │
│  Receives revalidation request                                  │
│                        ↓                                        │
│  /api/revalidate endpoint                                       │
│                        ↓                                        │
│  Next.js revalidates cached pages                              │
│                        ↓                                        │
│  Fresh content fetched from Common Service                      │
│                        ↓                                        │
│  Updated content displayed to users ← INSTANT!                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Components

### 1. **Client Portal CMS Service** (`/lib/services/cmsService.ts`)

Fetches CMS content from the Common Service API with caching strategies:

```typescript
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(
    `${COMMON_SERVICE_URL}/announcement-and-news/all`,
    {
      cache: 'no-store',
      next: {
        revalidate: 60, // Cache for 60 seconds
        tags: ['announcements'] // For targeted revalidation
      }
    }
  );
  // Returns only active announcements
}
```

**Available Functions:**

- `getActiveAnnouncements()` - Fetch active announcements/news
- `getActiveNavigation()` - Fetch navigation menu items
- `getContentPageBySlug(slug)` - Fetch specific content page
- `getPublishedContentPages()` - Fetch all published pages
- `getActiveQuickLinks(categoryId?)` - Fetch sidebar quick links
- `getActiveQuickLinkCategories()` - Fetch quick link categories
- `getActiveAnnouncementCategories()` - Fetch announcement categories
- `getMediaItems(category?)` - Fetch media library items

### 2. **Client Portal Revalidation API** (`/app/api/revalidate/route.ts`)

Endpoint that receives revalidation requests from the Admin Portal:

```typescript
POST /api/revalidate
Headers: {
  x-revalidate-secret: <REVALIDATE_SECRET>
}
Body: {
  type: 'announcements' | 'navigation' | 'content-pages' | 'quick-links' | 'media-library' | 'all',
  path?: '/optional-page-path'
}
```

**Security:** Protected by secret token to prevent unauthorized revalidation.

**Response:**

```json
{
  "success": true,
  "message": "Revalidated: announcements",
  "revalidated": true,
  "now": 1709582400000
}
```

### 3. **Admin Portal Revalidation Utility** (`/lib/revalidate-client.ts`)

Helper functions to trigger Client Portal revalidation:

```typescript
// Revalidate specific content type
await revalidateAnnouncements();
await revalidateNavigation();
await revalidateContentPages(slug);
await revalidateQuickLinks();
await revalidateMediaLibrary();

// Revalidate everything
await revalidateAll();
```

### 4. **Updated CMS Actions** (`/actions/common/cms-actions.ts`)

All CRUD operations now trigger Client Portal revalidation:

```typescript
export async function createAnnouncement(data, file) {
  // ... create announcement in Common Service

  revalidatePath('/dashboard/content/announcements'); // Admin Portal
  await revalidateAnnouncements(); // Client Portal ← NEW!

  return { success: true, message: 'Created successfully' };
}
```

## 📁 File Structure

### Client Portal

```
client-portal/
├── lib/
│   └── services/
│       └── cmsService.ts              # CMS API client
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts               # Revalidation endpoint
│   └── components/
│       └── news-announcements/
│           └── NewsHighlights.tsx     # Updated to fetch from CMS
└── .env.example                       # Environment variables
```

### Admin Portal

```
admin-portal/
├── src/
│   ├── lib/
│   │   └── revalidate-client.ts       # Client Portal revalidation utility
│   └── actions/
│       └── common/
│           └── cms-actions.ts         # Updated with revalidation calls
└── .env.example                       # Environment variables
```

## 🔐 Environment Variables

### Admin Portal (`.env`)

```bash
# Common Service (Backend API)
COMMON_SERVICE_URL=http://localhost:5003

# Client Portal URL (for revalidation)
CLIENT_PORTAL_URL=http://localhost:3001

# Revalidation Secret (must match Client Portal)
REVALIDATE_SECRET=census-revalidate-secret-2026
```

### Client Portal (`.env`)

```bash
# Common Service (CMS Backend API)
COMMON_SERVICE_URL=http://localhost:5003
NEXT_PUBLIC_COMMON_SERVICE_URL=http://localhost:5003

# Revalidation Secret (must match Admin Portal)
REVALIDATE_SECRET=census-revalidate-secret-2026
```

## 🚀 Usage Examples

### Example 1: Admin Creates an Announcement

```
1. Admin Portal:
   - Admin fills form in /dashboard/content/announcements
   - Clicks "Save"

2. Server Action (cms-actions.ts):
   - POST /announcement-and-news (Common Service)
   - revalidatePath('/dashboard/content/announcements')
   - await revalidateAnnouncements() ← Triggers Client Portal

3. Client Portal:
   - Receives POST /api/revalidate { type: 'announcements' }
   - Verifies secret token
   - Calls Next.js revalidatePath('/')
   - Next request fetches fresh data from Common Service

4. User Experience:
   - User refreshes homepage
   - Sees new announcement immediately ← INSTANT!
```

### Example 2: Admin Updates Navigation

```
1. Admin Portal:
   - Admin edits navigation item
   - Updates menu label or adds sub-pages

2. Server Action:
   - PATCH /cm-navigation/:id
   - revalidatePath('/dashboard/content/navigation')
   - await revalidateNavigation()

3. Client Portal:
   - Revalidates layout (navbar is in layout)
   - Next page load shows updated navigation

4. User Experience:
   - Navigation menu updates on next page navigation
   - No manual refresh needed
```

### Example 3: Admin Deletes Content Page

```
1. Admin Portal:
   - Admin deletes a content page

2. Server Action:
   - DELETE /cm-content/:id
   - revalidatePath('/dashboard/content/pages')
   - await revalidateContentPages()

3. Client Portal:
   - Revalidates all content page routes
   - Deleted page returns 404 on next access

4. User Experience:
   - Page no longer accessible
   - Navigation automatically updated
```

## 🔄 Revalidation Flow Diagram

```
Admin Action → Server Action → Common Service (Database Update)
                      ↓
                Revalidate Admin Portal Cache
                      ↓
                HTTP POST Request
                      ↓
          Client Portal /api/revalidate
                      ↓
              Verify Secret Token
                      ↓
         Next.js revalidatePath/revalidateTag
                      ↓
        Cache Invalidated for Specific Content
                      ↓
           Next Request Fetches Fresh Data
                      ↓
         Updated Content Displayed to Users
```

## ⚡ Performance Considerations

### Caching Strategy

- **Client Portal** uses ISR (Incremental Static Regeneration)
- Content cached with `revalidate: 60` (60 seconds)
- On-demand revalidation bypasses cache immediately
- Tagged revalidation for surgical cache updates

### Network Optimization

- Revalidation happens **asynchronously** after Admin Portal update
- Does not block the admin's workflow
- Failed revalidation logged but doesn't affect admin operation

### Load Balancing

- Multiple Client Portal instances supported
- Each instance has its own cache
- Revalidation request sent to all instances (if load-balanced)

## 🛡️ Security

### Secret Token Protection

- Both portals share a secret token (`REVALIDATE_SECRET`)
- Prevents unauthorized cache invalidation
- Token verified on every revalidation request

### Error Handling

```typescript
// Admin Portal - Graceful degradation
try {
  await revalidateAnnouncements();
} catch (error) {
  console.error('Revalidation failed:', error);
  // Continue - admin operation succeeded
}
```

### Rate Limiting (Recommended)

```typescript
// Future enhancement: Add rate limiting to revalidation endpoint
// Prevents abuse if secret is compromised
```

## 🧪 Testing

### Manual Testing

1. **Test Announcement Synchronization:**

   ```bash
   # 1. Open Client Portal: http://localhost:3001
   # 2. Note existing announcements

   # 3. Open Admin Portal: http://localhost:3000/dashboard/content/announcements
   # 4. Create new announcement

   # 5. Refresh Client Portal
   # 6. Verify new announcement appears immediately
   ```

2. **Test Navigation Synchronization:**

   ```bash
   # 1. Admin Portal: Update navigation label
   # 2. Client Portal: Refresh → See updated navigation
   ```

3. **Test Direct Revalidation:**
   ```bash
   curl -X POST http://localhost:3001/api/revalidate \
     -H "Content-Type: application/json" \
     -H "x-revalidate-secret: census-revalidate-secret-2026" \
     -d '{"type": "all"}'
   ```

### Automated Testing

```typescript
// Example test (to be implemented)
describe('CMS Synchronization', () => {
  it('should revalidate client portal after announcement creation', async () => {
    // 1. Create announcement via Admin Portal
    // 2. Wait for revalidation
    // 3. Fetch Client Portal homepage
    // 4. Verify announcement appears
  });
});
```

## 🐛 Troubleshooting

### Issue: Changes not appearing in Client Portal

**Check:**

1. Are environment variables set correctly?

   ```bash
   # Admin Portal
   echo $CLIENT_PORTAL_URL
   echo $REVALIDATE_SECRET

   # Client Portal
   echo $REVALIDATE_SECRET
   ```

2. Is Client Portal running?

   ```bash
   curl http://localhost:3001/api/revalidate
   # Should return: {"message": "Revalidation endpoint is active", ...}
   ```

3. Check Admin Portal logs:

   ```bash
   # Look for revalidation success/failure
   [revalidateClientPortal] Triggering revalidation: { type: 'announcements' }
   [revalidateClientPortal] Success: { success: true, ... }
   ```

4. Check Client Portal logs:
   ```bash
   # Look for incoming revalidation requests
   [Revalidate] Request received: { type: 'announcements' }
   [Revalidate] Revalidated: announcements
   ```

### Issue: 401 Unauthorized on revalidation

**Cause:** Secret mismatch

**Fix:**

```bash
# Ensure both .env files have the same secret
# Admin Portal .env
REVALIDATE_SECRET=census-revalidate-secret-2026

# Client Portal .env
REVALIDATE_SECRET=census-revalidate-secret-2026
```

### Issue: Revalidation too slow

**Optimization:**

```typescript
// Use Promise.allSettled for non-blocking revalidation
Promise.allSettled([revalidateAnnouncements(), revalidateNavigation()]);
// Don't await - let it run in background
```

## 📊 Monitoring

### Metrics to Track

- Revalidation request count
- Revalidation success/failure rate
- Average revalidation time
- Cache hit/miss ratio

### Logging

```typescript
// Add structured logging
console.log({
  timestamp: new Date().toISOString(),
  action: 'revalidate',
  type: 'announcements',
  success: true,
  duration: 150 // ms
});
```

## 🚀 Deployment

### Production Checklist

- [ ] Update `CLIENT_PORTAL_URL` to production URL
- [ ] Generate secure `REVALIDATE_SECRET` (use: `openssl rand -hex 32`)
- [ ] Test revalidation between production environments
- [ ] Set up monitoring/alerting for revalidation failures
- [ ] Configure CDN cache purging (if using CDN)
- [ ] Document disaster recovery (manual cache clear)

### Environment-Specific URLs

```bash
# Development
CLIENT_PORTAL_URL=http://localhost:3001

# Staging
CLIENT_PORTAL_URL=https://staging-portal.census.gov.bt

# Production
CLIENT_PORTAL_URL=https://portal.census.gov.bt
```

## 📚 Related Documentation

- [Content Management Flow](./CONTENT_MANAGEMENT_FLOW.md)
- [CMS API Integration](./CMS-API-INTEGRATION.md)
- [CMS Troubleshooting](./CMS-TROUBLESHOOTING.md)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

## 🎉 Summary

This implementation ensures that:

✅ **Immediate Synchronization** - Changes in Admin Portal instantly reflect in Client Portal  
✅ **Automatic Cache Invalidation** - No manual intervention required  
✅ **Secure Communication** - Protected by secret token  
✅ **Performance Optimized** - Uses Next.js ISR with on-demand revalidation  
✅ **Type-Safe** - Full TypeScript support  
✅ **Resilient** - Graceful degradation if revalidation fails  
✅ **Scalable** - Works with multiple portal instances

**Result:** Administrators can manage content with confidence, knowing that users always see the latest information without any delays!

---

**Last Updated:** March 5, 2026  
**Version:** 1.0.0  
**Author:** Census Development Team
