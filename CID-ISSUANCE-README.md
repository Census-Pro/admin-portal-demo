# CID Issuance Feature - Quick Start

## 🎉 What's Been Created

I've created a complete **CID (Citizenship Identity Document) Issuance** UI feature for your admin portal based on typical government CID issuance workflows.

## 📁 Files Created

### Navigation & Configuration

- ✅ Updated `/src/config/nav-config.ts` - Added CID Issuance menu with 4 sub-items
- ✅ Updated `/src/config/permissions.ts` - Added all required permissions

### Pages

1. **Main Pages**:

   - `/src/app/dashboard/cid-issuance/page.tsx` - Redirects to pending
   - `/src/app/dashboard/cid-issuance/pending/page.tsx` - Pending applications list
   - `/src/app/dashboard/cid-issuance/verify/page.tsx` - Verification queue
   - `/src/app/dashboard/cid-issuance/approve/page.tsx` - Approval queue
   - `/src/app/dashboard/cid-issuance/print/page.tsx` - Print queue

2. **Detail Page**:
   - `/src/app/dashboard/cid-issuance/pending/[id]/page.tsx` - Detailed application view

### Components

- `/src/app/dashboard/cid-issuance/_components/columns.tsx` - Table columns for main lists
- `/src/app/dashboard/cid-issuance/_components/print-columns.tsx` - Table columns for print queue

### Documentation

- `/docs/cid-issuance-feature.md` - Complete feature documentation
- `/docs/cid-issuance-schema.sql` - PostgreSQL database schema

## 🎨 What It Looks Like

### Sidebar Menu

```
📊 Dashboard
👥 User
💼 Masters
🛡️ Roles & Permission
👶 Birth Registration
⚰️ Death Registration
🆔 CID Issuance          ← NEW!
   ├── Pending Applications
   ├── Verify
   ├── Approve
   └── Print CID
```

### Application Types Supported

- **NEW** - First-time CID for 18-year-olds
- **RENEWAL** - Renewing expired CIDs
- **REPLACEMENT** - Lost/damaged CID replacement
- **UPDATE** - Information updates

### Workflow Stages

```
SUBMITTED → PENDING_VERIFICATION → VERIFIED → APPROVED → READY_TO_PRINT → PRINTED → COLLECTED
```

## 🔑 Permissions Added

```typescript
MANAGE_CID_ISSUANCE; // General permission (all access)
MANAGE_CID_ISSUANCE_PENDING; // Pending applications page
MANAGE_CID_ISSUANCE_VERIFY; // Verification page
MANAGE_CID_ISSUANCE_APPROVE; // Approval page
MANAGE_CID_ISSUANCE_PRINT; // Print page
MANAGE_ALL; // Super admin (has all access)
```

## 📊 Data Fields Included

### Personal Information

- Full name, CID number, DOB, Gender, Blood group
- Place of birth

### Contact Information

- Phone number, Email
- Present & permanent address

### Location

- Dzongkhag, Gewog, Village
- Household number

### Parent Information

- Father's name & CID
- Mother's name & CID

### Documents

- Birth certificate
- Census certificate
- Passport photo
- Parent CID copies

## 🚀 How to Use

### 1. Start Your Development Server

```bash
cd admin-portal
npm run dev
# or
pnpm dev
```

### 2. View the Feature

Navigate to: `http://localhost:3000/dashboard/cid-issuance/pending`

### 3. Test the UI

- All pages have **dummy data** already populated
- Click through the workflow stages
- View application details
- Test the table columns and filters

## 🎯 Next Steps (Backend Integration)

### Required API Endpoints

```
GET    /api/cid-issuance/pending      - List pending applications
GET    /api/cid-issuance/verify       - List verification queue
GET    /api/cid-issuance/approve      - List approval queue
GET    /api/cid-issuance/print        - List print queue
GET    /api/cid-issuance/:id          - Get application details
POST   /api/cid-issuance/:id/forward  - Forward to next stage
POST   /api/cid-issuance/:id/reject   - Reject application
POST   /api/cid-issuance/:id/print    - Print CID card
GET    /api/cid-issuance/:id/download - Download application PDF
```

### Database Setup

Use the provided schema file:

```bash
# In your backend service
psql -U your_user -d your_database -f admin-portal/docs/cid-issuance-schema.sql
```

### Create Backend Service

Similar to `birth-death-service`, create a `cid-service` or add to `common_service`:

**Suggested structure:**

```
cid-service/
  src/
    modules/
      cid-application/
        entities/
          cid-application.entity.ts
          cid-document.entity.ts
          cid-print-queue.entity.ts
        dto/
          create-application.dto.ts
          update-application.dto.ts
        cid-application.service.ts
        cid-application.controller.ts
        cid-application.module.ts
```

## 📱 Features Implemented

✅ Responsive design  
✅ Table with sorting/filtering ready  
✅ Status badges with color coding  
✅ Application type badges  
✅ Detail view with comprehensive information  
✅ Action buttons (ready for API integration)  
✅ Print queue tracking  
✅ Navigation with permissions  
✅ Clean card-based layout  
✅ Icon integration

## 🔐 Permission Testing

To test different permission levels, ensure your users have the appropriate permissions in the database:

```sql
-- Example: Grant CID verification permission to a role
INSERT INTO role_permissions (role_id, permission_id)
VALUES (
  (SELECT id FROM roles WHERE name = 'CID Verifier'),
  (SELECT id FROM permissions WHERE action = 'manage' AND subject = 'cid-issuance-verify')
);
```

## 📖 Documentation

Full documentation available in:

- **Feature Overview**: `/docs/cid-issuance-feature.md`
- **Database Schema**: `/docs/cid-issuance-schema.sql`

## 🎨 Customization

### To Change Colors

Edit the badge variants in the columns files:

- `/src/app/dashboard/cid-issuance/_components/columns.tsx`
- `/src/app/dashboard/cid-issuance/_components/print-columns.tsx`

### To Add More Fields

1. Update the interface in columns files
2. Add dummy data in page files
3. Update the detail view page
4. Update the database schema

### To Change Workflow

1. Modify statuses in the columns
2. Update the nav-config.ts menu items
3. Add/remove pages as needed
4. Update permissions

## 🐛 Known Limitations

- Uses dummy data (needs API integration)
- File upload UI not implemented (backend needed)
- Print function is placeholder (needs printer integration)
- No real-time status updates (needs WebSocket/SSE)
- No search/filter implementation (needs backend)
- No pagination (uses dummy data)

## 🎉 Ready to Go!

Everything is set up and ready to use! The UI is fully functional with dummy data. You can:

1. Navigate through all pages
2. View application details
3. See different statuses and application types
4. Test the responsive design
5. Plan your backend integration

**Happy Coding! 🚀**
