# CID Issuance Workflow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                        (Admin Portal)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION SIDEBAR                           │
│  🆔 CID Issuance                                               │
│     ├── 📝 Pending Applications                                │
│     ├── ✅ Verify                                              │
│     ├── ✔️  Approve                                            │
│     └── 🖨️  Print CID                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Workflow Process

```
┌──────────────┐
│   CITIZEN    │
│  SUBMITS     │
│ APPLICATION  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  PENDING (SUBMITTED) │ ◄─── 📝 Pending Applications Page
│  ✓ Basic validation  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│ VERIFICATION STAGE       │ ◄─── ✅ Verify Page
│ ✓ Document verification  │
│ ✓ Parent CID validation  │
│ ✓ Birth cert validation  │
│ ✓ Census data check      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   APPROVAL STAGE         │ ◄─── ✔️ Approve Page
│ ✓ Senior officer review  │
│ ✓ Final authorization    │
│ ✓ CID number generation  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│    PRINT QUEUE           │ ◄─── 🖨️ Print CID Page
│ ✓ Physical card printing │
│ ✓ Quality check          │
│ ✓ Collection tracking    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│  COLLECTED   │
│   BY CITIZEN │
└──────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION DATA                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Personal Info          Location Info       Parent Info         │
│  ├─ Name               ├─ Dzongkhag        ├─ Father Name      │
│  ├─ DOB                ├─ Gewog            ├─ Father CID       │
│  ├─ Gender             ├─ Village          ├─ Mother Name      │
│  └─ Blood Group        └─ Household #      └─ Mother CID       │
│                                                                 │
│  Contact Info          Documents            Application Meta    │
│  ├─ Phone              ├─ Birth Cert       ├─ Type (NEW/etc)   │
│  ├─ Email              ├─ Census Cert      ├─ Status           │
│  ├─ Present Addr       ├─ Photo            └─ Created Date     │
│  └─ Permanent Addr     └─ Parent CIDs                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Application Types

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     NEW     │    │   RENEWAL   │    │ REPLACEMENT │    │   UPDATE    │
├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤
│ First-time  │    │ Expired CID │    │ Lost/Damaged│    │ Info change │
│ Age: 18     │    │ Valid docs  │    │ Police rep. │    │ Name/Address│
│ Birth cert  │    │ Existing ID │    │ Old CID #   │    │ Supporting  │
│ Census cert │    │ Simple proc │    │ Verify iden │    │ documents   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## User Roles & Permissions

```
┌─────────────────────────────────────────────────────────────────┐
│                         PERMISSIONS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔐 MANAGE_ALL                                                 │
│     └─ Super Admin (All Access)                               │
│                                                                 │
│  🔐 MANAGE_CID_ISSUANCE                                        │
│     └─ Full CID Issuance Access                               │
│                                                                 │
│  🔐 MANAGE_CID_ISSUANCE_PENDING                                │
│     └─ View Pending Applications                              │
│                                                                 │
│  🔐 MANAGE_CID_ISSUANCE_VERIFY                                 │
│     └─ Document Verification Role                             │
│                                                                 │
│  🔐 MANAGE_CID_ISSUANCE_APPROVE                                │
│     └─ Senior Officer Approval                                │
│                                                                 │
│  🔐 MANAGE_CID_ISSUANCE_PRINT                                  │
│     └─ Print Queue Management                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Database Structure

```
┌──────────────────────┐
│  cid_applications    │
├──────────────────────┤
│ - id (PK)           │
│ - applicant_name    │◄────┐
│ - applicant_cid     │     │
│ - date_of_birth     │     │
│ - gender            │     │
│ - dzongkhag_id (FK) │     │
│ - gewog_id (FK)     │     │
│ - application_type  │     │
│ - status            │     │
│ - created_at        │     │
│ - ...               │     │
└──────────────────────┘     │
          │                   │
          │                   │
    ┌─────┴─────┐        ┌───┴────────────────────┐
    ▼           ▼        │                        │
┌─────────┐  ┌──────────────────┐  ┌────────────────────┐
│documents│  │ workflow_history │  │  cid_print_queue   │
├─────────┤  ├──────────────────┤  ├────────────────────┤
│- id     │  │- id              │  │- id                │
│- app_id │  │- app_id (FK)     │  │- app_id (FK)       │
│- type   │  │- from_status     │  │- cid_number        │
│- url    │  │- to_status       │  │- print_status      │
│- ...    │  │- action          │  │- printed_at        │
└─────────┘  │- performed_by    │  │- collected_at      │
             │- performed_at    │  │- ...               │
             └──────────────────┘  └────────────────────┘
```

## Status Flow Diagram

```
     ┌──────────────┐
     │  SUBMITTED   │
     └──────┬───────┘
            │
            ├──────► [REJECTED] ────┐
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │   PENDING    │              │
     │ VERIFICATION │              │
     └──────┬───────┘              │
            │                       │
            ├──────► [REJECTED] ────┤
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │   VERIFIED   │              │
     └──────┬───────┘              │
            │                       │
            ├──────► [REJECTED] ────┤
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │   APPROVED   │              │
     └──────┬───────┘              │
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │ READY_TO_    │              │
     │   PRINT      │              │
     └──────┬───────┘              │
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │   PRINTED    │              │
     └──────┬───────┘              │
            │                       │
            ▼                       │
     ┌──────────────┐              │
     │  COLLECTED   │◄─────────────┘
     └──────────────┘
              │
              ▼
        [END STATE]
```

## Component Structure

```
src/app/dashboard/cid-issuance/
│
├── page.tsx                          (Redirect to pending)
│
├── _components/
│   ├── columns.tsx                   (Table columns for lists)
│   └── print-columns.tsx            (Print queue columns)
│
├── pending/
│   ├── page.tsx                     (Pending list)
│   └── [id]/
│       └── page.tsx                 (Detail view)
│
├── verify/
│   └── page.tsx                     (Verification list)
│
├── approve/
│   └── page.tsx                     (Approval list)
│
└── print/
    └── page.tsx                     (Print queue)
```

## UI Features Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    PENDING APPLICATIONS                         │
├─────────────────────────────────────────────────────────────────┤
│  📊 Data Table                                                 │
│     ├── Name column                                            │
│     ├── CID column (or "N/A" for new)                         │
│     ├── DOB column                                             │
│     ├── Gender column                                          │
│     ├── Dzongkhag column                                       │
│     ├── Type badge (NEW/RENEWAL/etc)                          │
│     ├── Status badge                                           │
│     └── Actions (View button)                                  │
│                                                                 │
│  🔍 Click row → Detail View                                    │
│     ├── Personal Info Card                                     │
│     ├── Contact Info Card                                      │
│     ├── Location Info Card                                     │
│     ├── Parent Info Card                                       │
│     ├── Documents Card                                         │
│     ├── Additional Info Card                                   │
│     └── Action Buttons (Reject/Forward)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │◄────►│   Backend    │◄────►│   Database   │
│ Admin Portal │ API  │ CID Service  │ SQL  │  PostgreSQL  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │
       │                     ├──────────────────────┤
       │                     │  External Services   │
       │                     ├──────────────────────┤
       │                     │ - Auth Service       │
       │                     │ - File Storage       │
       │                     │ - Notification       │
       │                     │ - Printer Service    │
       │                     └──────────────────────┘
       │
       └─────────────────────┐
             Features Used    │
       ┌─────────────────────┘
       ├─ DataTable Component
       ├─ Badge Component
       ├─ Card Component
       ├─ Button Component
       ├─ Sidebar Navigation
       └─ Permission Hooks
```

## Summary

✅ **4 Main Workflow Pages** (Pending, Verify, Approve, Print)  
✅ **1 Detail View Page** (Comprehensive application view)  
✅ **2 Table Column Configs** (Standard & Print views)  
✅ **6 New Permissions** (Role-based access control)  
✅ **1 Navigation Menu** (Collapsible with 4 sub-items)  
✅ **4 Application Types** (NEW, RENEWAL, REPLACEMENT, UPDATE)  
✅ **8 Status States** (Complete workflow coverage)  
✅ **20+ Data Fields** (Comprehensive citizen information)

**Total Files Created/Modified: 13**
