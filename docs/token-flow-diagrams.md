# Token & Refresh Flow Diagrams

## 🔄 Complete Token Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant R as Redis

    Note over U,R: 1. LOGIN PHASE
    U->>F: Enter CID + Password
    F->>B: POST /auth/login
    B->>DB: Verify credentials
    DB-->>B: User data
    B->>B: Generate Access Token (6h)
    B->>B: Generate Refresh Token (90d)
    B->>R: Store session
    B-->>F: { accessToken, refreshToken, expiresIn: 21600 }
    F->>F: Store in HTTP-only cookie
    F-->>U: Redirect to dashboard

    Note over U,R: 2. ACTIVE SESSION (0-6 hours)
    U->>F: Click "View Agencies"
    F->>B: GET /api/agencies + Bearer {accessToken}
    B->>B: Verify access token
    B->>DB: Fetch agencies
    DB-->>B: Agency data
    B-->>F: 200 OK + data
    F-->>U: Display agencies

    Note over U,R: 3. AUTO-REFRESH (at 5:55 - 5 min before expiry)
    F->>F: Detect: < 5 min until expiry
    F->>B: POST /auth/refresh-token + {refreshToken}
    B->>B: Verify refresh token signature
    B->>R: Check if blacklisted
    R-->>B: Not blacklisted ✓
    B->>DB: Verify user still active
    DB-->>B: User active ✓
    B->>B: Generate NEW access token (6h)
    B->>B: Generate NEW refresh token (90d)
    B->>R: Blacklist old refresh token (rotation)
    B-->>F: { accessToken, refreshToken, expiresIn: 21600 }
    F->>F: Update session
    Note over F: User doesn't notice anything!

    Note over U,R: 4. CONTINUED USE (6-12 hours)
    U->>F: Continue working...
    F->>B: API calls with NEW access token
    B-->>F: 200 OK
    F-->>U: Data

    Note over U,R: 5. LOGOUT
    U->>F: Click "Logout"
    F->>B: POST /auth/logout + {refreshToken}
    B->>R: Blacklist refresh token
    R-->>B: Blacklisted
    B-->>F: 200 OK
    F->>F: Clear cookies
    F-->>U: Redirect to login
```

## 🚨 Token Expiry Scenarios

```mermaid
flowchart TD
    Start([User Active]) --> Check{Check Token Expiry}

    Check -->|> 5 min remaining| Continue[Continue normally]
    Check -->|< 5 min remaining| AutoRefresh[Auto-refresh triggered]
    Check -->|Expired| Expired[Show session expired dialog]

    AutoRefresh --> Refresh[POST /auth/refresh-token]
    Refresh --> Validate{Validate Refresh Token}

    Validate -->|Valid & Not Blacklisted| NewTokens[Issue new tokens]
    Validate -->|Invalid or Blacklisted| Expired
    Validate -->|Network Error| Expired

    NewTokens --> UpdateSession[Update session]
    UpdateSession --> Continue

    Continue --> Wait[Wait 1 second]
    Wait --> Check

    Expired --> Dialog[Show Alert Dialog]
    Dialog --> UserChoice{User Action}
    UserChoice -->|Log In Again| Logout[Sign out + Redirect to login]
    UserChoice -->|Stay on Page| Close[Close dialog]
    Close --> ShowError[Show errors on actions]

    Logout --> End([End])
    ShowError --> End

    style Start fill:#90EE90
    style NewTokens fill:#90EE90
    style Continue fill:#90EE90
    style Expired fill:#FFB6C1
    style Dialog fill:#FFD700
    style Logout fill:#87CEEB
```

## 🔐 Token Refresh Flow

```mermaid
flowchart LR
    A[Access Token<br/>6 hours] -->|Used for| B[API Requests]
    B -->|Every request| C{Token Valid?}

    C -->|Yes| D[✓ Request Succeeds]
    C -->|No 401| E[❌ Unauthorized]

    E --> F{< 5 min until expiry?}
    F -->|Yes| G[Auto Refresh]
    F -->|No, already expired| H[Manual Refresh]

    G --> I[Use Refresh Token<br/>90 days]
    H --> I

    I --> J{Refresh Token Valid?}
    J -->|Yes| K[Issue New Tokens]
    J -->|No| L[Force Logout]

    K --> M[New Access Token 6h]
    K --> N[New Refresh Token 90d]

    M --> A
    N --> O[Store securely]

    L --> P[Redirect to Login]

    style A fill:#FFE4B5
    style I fill:#E6E6FA
    style K fill:#90EE90
    style L fill:#FFB6C1
    style D fill:#90EE90
```

## 🔄 Refresh Token Rotation

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant R as Redis

    Note over F,R: Initial State
    F->>F: Has: RT1 (Refresh Token 1)

    Note over F,R: 5 min before AT expires
    F->>B: POST /refresh { refreshToken: RT1 }

    B->>R: Check blacklist for RT1
    R-->>B: Not blacklisted ✓

    B->>B: Validate RT1 signature ✓
    B->>B: Generate AT2 (new access)
    B->>B: Generate RT2 (new refresh)

    B->>R: Blacklist RT1
    R-->>B: RT1 blacklisted ✓

    B-->>F: { accessToken: AT2, refreshToken: RT2 }
    F->>F: Now has: RT2

    Note over F,R: 6 hours later...
    F->>B: POST /refresh { refreshToken: RT2 }

    B->>R: Check blacklist for RT2
    R-->>B: Not blacklisted ✓

    B->>B: Generate AT3, RT3
    B->>R: Blacklist RT2
    B-->>F: { accessToken: AT3, refreshToken: RT3 }

    Note over F,R: If attacker tries old token
    Note over F,R: Attacker steals RT1
    F->>B: Attacker: POST /refresh { RT1 }
    B->>R: Check blacklist for RT1
    R-->>B: BLACKLISTED ❌
    B-->>F: 401 Unauthorized

    Note over F,R: Both attacker and real user logged out!
```

## 🎯 Session vs Token Expiry

```mermaid
gantt
    title Token & Session Timeline
    dateFormat X
    axisFormat %H:%M

    section Access Token
    Access Token 1 :active, at1, 0, 6h
    Refresh 1 :milestone, r1, 5h55m
    Access Token 2 :active, at2, 6h, 12h
    Refresh 2 :milestone, r2, 11h55m
    Access Token 3 :active, at3, 12h, 18h
    Refresh 3 :milestone, r3, 17h55m
    Access Token 4 :active, at4, 18h, 24h

    section Frontend Session (No Remember Me)
    Session Active :active, fs1, 0, 24h
    Session Expires :crit, fse, 24h, 24h

    section Frontend Session (Remember Me)
    Session Active :active, fs2, 0, 168h

    section Refresh Token
    Refresh Token Valid :active, rt, 0, 2160h
```

## 💾 Storage & Security

```mermaid
flowchart TB
    subgraph Frontend
        A[Login Response] --> B{Store Where?}
        B -->|✅ Correct| C[HTTP-only Cookie]
        B -->|❌ Wrong| D[localStorage]
        B -->|❌ Wrong| E[sessionStorage]
        B -->|❌ Wrong| F[Redux/State]

        C --> G[Secure from XSS]
        D --> H[Vulnerable to XSS]
        E --> H
        F --> H
    end

    subgraph Backend
        I[Refresh Token] --> J{Check}
        J -->|1| K[Valid Signature?]
        J -->|2| L[Not Expired?]
        J -->|3| M[Not Blacklisted?]
        J -->|4| N[User Active?]

        K --> O{All Pass?}
        L --> O
        M --> O
        N --> O

        O -->|Yes| P[Issue New Tokens]
        O -->|No| Q[Reject]
    end

    subgraph Redis
        R[(Blacklist)] -->|Check| M
        S[(Sessions)] -->|Track| I
    end

    style C fill:#90EE90
    style G fill:#90EE90
    style H fill:#FFB6C1
    style P fill:#90EE90
    style Q fill:#FFB6C1
```

## 📱 Real-World Timeline

```mermaid
timeline
    title Your 90-Day Session Journey

    section Day 1
        8:00 AM Login : Access Token 1 : Refresh Token 1
        2:00 PM Auto-refresh : Access Token 2 : Refresh Token 2
        8:00 PM Auto-refresh : Access Token 3 : Refresh Token 3

    section Day 2
        8:00 AM Auto-refresh : Access Token 4 : Refresh Token 4
        Continue working : Seamless experience

    section Day 7
        Session continues : No re-login needed
        48 refreshes so far : All automatic

    section Day 30
        Still working : 120 refreshes so far
        No interruptions : Perfect UX

    section Day 90
        Refresh Token Expires : Must re-login
        Security maintained : Long session end
```

## 🔍 Decision Tree

```mermaid
flowchart TD
    Start([API Request]) --> HasToken{Has Access Token?}

    HasToken -->|No| Login[Redirect to Login]
    HasToken -->|Yes| CheckExpiry{Token Expiry?}

    CheckExpiry -->|> 5 min| MakeRequest[Make API Request]
    CheckExpiry -->|< 5 min| NeedRefresh[Need Refresh]
    CheckExpiry -->|Expired| NeedRefresh

    NeedRefresh --> HasRefresh{Has Refresh Token?}
    HasRefresh -->|No| Login
    HasRefresh -->|Yes| CheckRefreshExpiry{Refresh Valid?}

    CheckRefreshExpiry -->|Yes| DoRefresh[POST /auth/refresh]
    CheckRefreshExpiry -->|No| Login

    DoRefresh --> RefreshSuccess{Success?}
    RefreshSuccess -->|Yes| UpdateTokens[Update Tokens]
    RefreshSuccess -->|No| ShowDialog[Show Session Expired Dialog]

    UpdateTokens --> MakeRequest

    MakeRequest --> APIResponse{Response?}
    APIResponse -->|200 OK| Success[✓ Success]
    APIResponse -->|401| ShowDialog
    APIResponse -->|Other Error| Error[Show Error]

    ShowDialog --> UserAction{User Choice}
    UserAction -->|Login Again| Login
    UserAction -->|Stay| Close[Close Dialog]

    Login --> End([Re-authenticate])
    Success --> End
    Error --> End
    Close --> End

    style Success fill:#90EE90
    style Login fill:#87CEEB
    style ShowDialog fill:#FFD700
    style Error fill:#FFB6C1
```

---

## 📊 Key Metrics

| Metric                     | Value         | Explanation              |
| -------------------------- | ------------- | ------------------------ |
| **Access Token Lifetime**  | 6 hours       | Short for security       |
| **Refresh Token Lifetime** | 90 days       | Long for convenience     |
| **Auto-refresh Trigger**   | 5 min before  | Safety buffer            |
| **Max Refreshes**          | ~360          | 90 days ÷ 6 hours        |
| **Session Without Login**  | Up to 90 days | With valid refresh token |

## 🎯 Summary

The diagrams show:

1. **Complete flow**: From login to logout
2. **Auto-refresh**: Happens every 6 hours
3. **Token rotation**: Old tokens blacklisted for security
4. **Error handling**: Session expired dialog
5. **Storage**: HTTP-only cookies (secure)
6. **Validation**: Multi-step checks before refresh

All working together to give you a secure, seamless experience! 🎉
