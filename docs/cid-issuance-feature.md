# CID Issuance Feature Documentation

## Overview

The CID (Citizenship Identity Document) Issuance feature manages the complete workflow for issuing citizenship identity cards to Bhutanese citizens. This includes new CID applications, renewals, replacements, and updates.

## Feature Structure

### Pages Created

1. **Pending Applications** (`/dashboard/cid-issuance/pending`)

   - Lists all newly submitted CID applications
   - Shows application summary with key details
   - Allows viewing individual application details

2. **Verify** (`/dashboard/cid-issuance/verify`)

   - Lists applications ready for verification
   - Officers verify document authenticity and applicant information
   - Status: `PENDING_VERIFICATION`

3. **Approve** (`/dashboard/cid-issuance/approve`)

   - Lists verified applications awaiting final approval
   - Senior officers provide final approval
   - Status: `VERIFIED`

4. **Print CID** (`/dashboard/cid-issuance/print`)

   - Lists approved applications ready for printing
   - Tracks printing status (READY_TO_PRINT, PRINTED, COLLECTED)
   - Provides print and download functionality

5. **Application Detail View** (`/dashboard/cid-issuance/pending/[id]`)
   - Comprehensive view of individual application
   - Shows all applicant information, documents, and status
   - Action buttons for forwarding or rejecting applications

## Data Structure

### CID Application Fields

#### Basic Information

- **applicant_name**: Full name of the applicant
- **applicant_cid**: Current CID number (for renewals/updates)
- **date_of_birth**: Date of birth
- **gender**: Gender of applicant
- **blood_group**: Blood group type
- **place_of_birth**: Birth place

#### Contact Information

- **phone_number**: Contact phone number
- **email**: Email address (optional)
- **present_address**: Current residential address
- **permanent_address**: Permanent address

#### Location Information

- **dzongkhag**: District
- **gewog**: Block/Sub-district
- **village**: Village name
- **household_number**: Household identification number

#### Parent Information

- **father_name**: Father's full name
- **father_cid**: Father's CID number
- **mother_name**: Mother's full name
- **mother_cid**: Mother's CID number

#### Application Metadata

- **application_type**: NEW | RENEWAL | REPLACEMENT | UPDATE
- **status**: Application workflow status
- **created_at**: Application submission timestamp
- **birth_certificate_number**: Birth certificate reference
- **remarks**: Additional notes or comments

#### Supporting Documents

- Birth Certificate
- Census Certificate
- Passport Photo
- Parent CID Copies
- Additional documents based on application type

## Application Types

### 1. NEW

- First-time CID application for citizens turning 18
- Requires birth certificate and parent CID verification
- Most common for young adults

### 2. RENEWAL

- Renewing expired CID cards
- Requires existing CID number
- Simpler verification process

### 3. REPLACEMENT

- Lost or damaged CID card replacement
- Requires police report (for lost cards)
- Verification against existing records

### 4. UPDATE

- Updating information on existing CID
- Name changes, address updates, etc.
- Requires supporting documents for changes

## Workflow Stages

```
SUBMITTED → PENDING_VERIFICATION → VERIFIED → APPROVED → READY_TO_PRINT → PRINTED → COLLECTED
```

### Status Definitions

- **SUBMITTED**: Initial application submission
- **PENDING_VERIFICATION**: Awaiting document verification
- **VERIFIED**: Documents and information verified
- **APPROVED**: Final approval granted
- **READY_TO_PRINT**: Approved and queued for printing
- **PRINTED**: CID card physically printed
- **COLLECTED**: Card collected by applicant
- **REJECTED**: Application rejected (with reason)
- **CANCELLED**: Application cancelled by applicant

## Permissions

### Required Permissions

```typescript
// Workflow-specific permissions
MANAGE_CID_ISSUANCE_PENDING;
MANAGE_CID_ISSUANCE_VERIFY;
MANAGE_CID_ISSUANCE_APPROVE;
MANAGE_CID_ISSUANCE_PRINT;

// General permission (grants all access)
MANAGE_CID_ISSUANCE;

// Super admin
MANAGE_ALL;
```

## Components

### Table Columns (`columns.tsx`)

- Displays application summary in table format
- Sortable and filterable columns
- Action buttons for viewing details

### Print Columns (`print-columns.tsx`)

- Specialized columns for printing workflow
- Shows CID numbers and print status
- Print and download action buttons

### Application Detail Page

- Comprehensive card-based layout
- Organized information sections
- Action buttons for workflow progression

## UI Features

### Badges and Status Indicators

- Color-coded status badges
- Application type badges
- Print status indicators

### Navigation

- Collapsible sidebar menu
- Breadcrumb navigation
- Back button on detail pages

### Tables

- Server-side pagination ready
- Sortable columns
- Responsive design

## Integration Points (For Backend)

### API Endpoints Needed

```
GET    /api/cid-issuance/pending
GET    /api/cid-issuance/verify
GET    /api/cid-issuance/approve
GET    /api/cid-issuance/print
GET    /api/cid-issuance/:id
POST   /api/cid-issuance/:id/forward
POST   /api/cid-issuance/:id/reject
POST   /api/cid-issuance/:id/print
GET    /api/cid-issuance/:id/download
```

### Database Tables Needed

#### cid_applications

```sql
- id (UUID, Primary Key)
- applicant_name (VARCHAR)
- applicant_cid (VARCHAR, nullable)
- date_of_birth (DATE)
- gender (VARCHAR)
- blood_group (VARCHAR)
- place_of_birth (VARCHAR)
- dzongkhag_id (FK)
- gewog_id (FK)
- village (VARCHAR)
- household_number (VARCHAR)
- phone_number (VARCHAR)
- email (VARCHAR, nullable)
- present_address (TEXT)
- permanent_address (TEXT)
- father_name (VARCHAR)
- father_cid (VARCHAR)
- mother_name (VARCHAR)
- mother_cid (VARCHAR)
- birth_certificate_number (VARCHAR)
- application_type (ENUM: NEW, RENEWAL, REPLACEMENT, UPDATE)
- status (VARCHAR)
- remarks (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- created_by (FK to users)
- updated_by (FK to users)
```

#### cid_application_documents

```sql
- id (UUID, Primary Key)
- application_id (FK to cid_applications)
- document_type (VARCHAR)
- document_url (VARCHAR)
- file_name (VARCHAR)
- file_size (INTEGER)
- mime_type (VARCHAR)
- uploaded_at (TIMESTAMP)
- uploaded_by (FK to users)
```

#### cid_workflow_history

```sql
- id (UUID, Primary Key)
- application_id (FK to cid_applications)
- from_status (VARCHAR)
- to_status (VARCHAR)
- action (VARCHAR: FORWARD, REJECT, APPROVE, etc.)
- remarks (TEXT)
- performed_by (FK to users)
- performed_at (TIMESTAMP)
```

#### cid_print_queue

```sql
- id (UUID, Primary Key)
- application_id (FK to cid_applications)
- cid_number (VARCHAR, unique)
- print_status (ENUM: READY_TO_PRINT, PRINTED, COLLECTED)
- printed_at (TIMESTAMP, nullable)
- printed_by (FK to users, nullable)
- collected_at (TIMESTAMP, nullable)
- created_at (TIMESTAMP)
```

## Future Enhancements

### Phase 2

- [ ] Biometric integration (fingerprint, photo)
- [ ] QR code generation on CID
- [ ] Mobile app integration
- [ ] SMS notifications at each stage
- [ ] Email notifications
- [ ] Document scanner integration
- [ ] Bulk import/export functionality

### Phase 3

- [ ] Self-service portal for citizens
- [ ] Online application submission
- [ ] Payment gateway integration
- [ ] Digital CID (e-CID)
- [ ] Integration with other government systems
- [ ] Analytics dashboard
- [ ] Appointment scheduling system

## Testing Checklist

### UI Testing

- [ ] All pages render correctly
- [ ] Navigation works between all sections
- [ ] Tables display data properly
- [ ] Badges show correct colors
- [ ] Detail view shows all information
- [ ] Action buttons are functional
- [ ] Responsive design works on mobile

### Permission Testing

- [ ] Only authorized users can access pages
- [ ] Menu items show/hide based on permissions
- [ ] Actions are restricted by role

### Data Flow Testing

- [ ] Applications appear in correct workflow stage
- [ ] Status updates reflect in UI
- [ ] Search and filter functionality
- [ ] Pagination works correctly

## Notes

- All pages currently use dummy data
- Backend API integration required
- File upload functionality needs implementation
- Print functionality needs hardware integration
- Permission system configured but needs backend validation
- All timestamps should be in Bhutan Time (BTT)

## Related Documentation

- See `admin-portal/docs/` for general system documentation
- Permission system: `permission-action-alignment-fix.md`
- Navigation: `dynamic-navigation-permissions.md`
