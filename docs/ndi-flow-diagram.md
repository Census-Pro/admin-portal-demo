# NDI Login Flow Diagram

## Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NDI ADMIN LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │         │              │
│   Browser    │         │    Admin     │         │     Auth     │         │     NDI      │
│   (React)    │         │    Portal    │         │    Service   │         │   Service    │
│              │         │   (Next.js)  │         │   (NestJS)   │         │   (External) │
│              │         │              │         │              │         │              │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │                        │
       │                        │                        │                        │
       │  1. Click "Login      │                        │                        │
       │     with NDI"          │                        │                        │
       ├───────────────────────>│                        │                        │
       │                        │                        │                        │
       │                        │  2. POST /api/auth/    │                        │
       │                        │     ndi/admin-login    │                        │
       │                        ├───────────────────────>│                        │
       │                        │                        │                        │
       │                        │                        │  3. POST /auth/ndi/    │
       │                        │                        │     admin-login        │
       │                        │                        ├───────────────────────>│
       │                        │                        │                        │
       │                        │                        │  4. Authenticate &     │
       │                        │                        │     Create Proof Req   │
       │                        │                        │<───────────────────────┤
       │                        │                        │                        │
       │                        │  5. Return:            │                        │
       │                        │     - threadId         │                        │
       │                        │     - qrCodeUrl        │                        │
       │                        │     - deepLinkUrl      │                        │
       │                        │<───────────────────────┤                        │
       │                        │                        │                        │
       │  6. Display QR Code    │                        │                        │
       │<───────────────────────┤                        │                        │
       │                        │                        │                        │
       │                        │  7. GET /api/auth/ndi/ │                        │
       │                        │     stream/:threadId   │                        │
       │                        │     (SSE Connection)   │                        │
       │                        ├───────────────────────>│                        │
       │                        │                        │                        │
       │                        │                        │  8. GET /auth/ndi/     │
       │                        │                        │     stream/:threadId   │
       │                        │                        │     (Proxy SSE)        │
       │                        │                        │<───────────────────────┤
       │                        │                        │                        │
       │                        │                        │  9. Subscribe to NATS  │
       │                        │                        │     topic: threadId    │
       │                        │                        │                        │
       │                        │                        │                        │
┌──────┴───────┐               │                        │                        │
│              │               │                        │                        │
│   NDI Wallet │               │                        │                        │
│   Mobile App │               │                        │                        │
│              │               │                        │                        │
└──────┬───────┘               │                        │                        │
       │                       │                        │                        │
       │  10. User scans QR    │                        │                        │
       │      or uses deep     │                        │                        │
       │      link             │                        │                        │
       │                       │                        │                        │
       │  11. Approve          │                        │                        │
       │      verification     │                        │                        │
       │      in app           │                        │                        │
       │                       │                        │                        │
       │                       │                        │  12. NDI sends result  │
       │                       │                        │      via NATS          │
       │                       │                        │<───────────────────────┤
       │                       │                        │                        │
       │                       │                        │  13. Validate CID &    │
       │                       │                        │      Check admin       │
       │                       │                        │                        │
       │                       │                        │  14. Generate tokens   │
       │                       │                        │      (access + refresh)│
       │                       │                        │                        │
       │                       │  15. SSE Event:        │                        │
       │                       │      {                 │                        │
       │                       │        status: "verified",                      │
       │                       │        loginData: {     │                        │
       │                       │          accessToken,   │                        │
       │                       │          refreshToken,  │                        │
       │                       │          user {...}     │                        │
       │                       │        }                │                        │
       │                       │      }                 │                        │
       │  16. Receive tokens   │<───────────────────────┤                        │
       │<──────────────────────┤                        │                        │
       │                       │                        │                        │
       │  17. signIn() with    │                        │                        │
       │      NextAuth tokens  │                        │                        │
       │───────────────────────>│                        │                        │
       │                       │                        │                        │
       │  18. Create session   │                        │                        │
       │<──────────────────────┤                        │                        │
       │                       │                        │                        │
       │  19. Redirect to      │                        │                        │
       │      /dashboard       │                        │                        │
       │<──────────────────────┤                        │                        │
       │                       │                        │                        │
       │  20. ✅ Logged In!    │                        │                        │
       │                       │                        │                        │
```

## Error Flow Examples

### Case 1: User Not Admin

```
Auth Service receives verification
     ↓
Check database for CID
     ↓
User found but roles = ["CITIZEN"]
     ↓
SSE Event: {status: "failed", error: "User not found or not an admin"}
     ↓
Browser displays error message
```

### Case 2: User Rejects Verification

```
User clicks "Reject" in NDI Wallet app
     ↓
NDI sends rejection via NATS
     ↓
Auth Service receives rejection
     ↓
SSE Event: {status: "rejected"}
     ↓
Browser displays "Verification was rejected"
```

### Case 3: Timeout

```
QR code displayed but not scanned within 5 minutes
     ↓
Auth Service timeout timer expires
     ↓
SSE Event: {status: "timeout"}
     ↓
Browser displays "Verification timed out"
     ↓
User can click "Refresh" to get new QR code
```

## Component Interaction

```
┌────────────────────────────────────────────────────────────────┐
│                       Browser Components                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ LoginPage (login-page.tsx)                               │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ NDILoginButton (ndi-login-button.tsx)             │ │ │
│  │  │                                                    │ │ │
│  │  │  • Handles button click                           │ │ │
│  │  │  • Fetches QR code from API                       │ │ │
│  │  │  • Manages modal state                            │ │ │
│  │  │  • Handles refresh logic                          │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌──────────────────────────────────────────────┐ │ │ │
│  │  │  │ NDILoginModal (ndi-login-modal.tsx)         │ │ │ │
│  │  │  │                                              │ │ │ │
│  │  │  │  • Displays QR code (desktop)                │ │ │ │
│  │  │  │  • Shows deep link button (mobile)           │ │ │ │
│  │  │  │  • Connects to SSE stream                    │ │ │ │
│  │  │  │  • Listens for verification events           │ │ │ │
│  │  │  │  • Calls NextAuth signIn() with tokens       │ │ │ │
│  │  │  │  • Redirects on success                      │ │ │ │
│  │  │  │                                              │ │ │ │
│  │  │  └──────────────────────────────────────────────┘ │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Structures                           │
└─────────────────────────────────────────────────────────────────┘

1. Proof Request Response:
   {
     proofRequestThreadId: "uuid-thread-id",
     deepLinkURL: "bhutanndi://proof-request?threadId=...",
     proofRequestURL: "https://staging.bhutanndi.com/qr/...",
     accessToken: "ndi-service-token",
     tokenType: "Bearer"
   }

2. SSE Verification Event (Success):
   {
     status: "verified",
     cidNo: "11234567890",
     loginData: {
       accessToken: "jwt-access-token",
       refreshToken: "jwt-refresh-token",
       user: {
         id: "user-uuid",
         cidNo: "11234567890",
         fullName: "John Doe",
         roles: ["ADMIN", "SUPER_ADMIN"],
         ability: [
           {action: ["create", "read"], subject: ["Birth Registration"]},
           {action: ["manage"], subject: ["all"]}
         ]
       }
     }
   }

3. NextAuth Session:
   {
     user: {
       id: "user-uuid",
       cidNo: "11234567890",
       fullName: "John Doe",
       roles: ["ADMIN"],
       ability: [...],
       permissions: ["create:birth-registration", "read:birth-registration", ...]
     },
     accessToken: "jwt-access-token",
     refreshToken: "jwt-refresh-token",
     sessionId: "user-uuid",
     expires: "2026-02-10T..."
   }
```

## Technology Stack

```
┌──────────────────────────────────────────────────────────────┐
│ Frontend (Admin Portal)                                       │
├──────────────────────────────────────────────────────────────┤
│ • Next.js 14 (App Router)                                    │
│ • React 18                                                   │
│ • NextAuth.js v5 (Authentication)                            │
│ • TypeScript                                                 │
│ • Tailwind CSS                                               │
│ • Server-Sent Events (SSE)                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Backend (Auth Service)                                        │
├──────────────────────────────────────────────────────────────┤
│ • NestJS (Node.js framework)                                 │
│ • TypeORM (Database)                                         │
│ • NATS (Message broker from NDI)                             │
│ • EventEmitter2 (Internal events)                            │
│ • JWT (Token generation)                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ External (NDI Service)                                        │
├──────────────────────────────────────────────────────────────┤
│ • Bhutan NDI API                                             │
│ • NATS Message Broker                                        │
│ • QR Code Generation                                         │
│ • Deep Link Support                                          │
└──────────────────────────────────────────────────────────────┘
```

---

**Legend:**

- `─>` : HTTP Request
- `<─` : HTTP Response
- `├──>` : Event/Message Flow
- `✅` : Success State
- `❌` : Error State
