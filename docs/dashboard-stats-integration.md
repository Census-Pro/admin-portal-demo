# Dashboard Statistics Integration Guide

## Overview

The admin portal dashboard now displays real-time statistics from the `auth_service` backend. The dashboard fetches and displays:

- **Total Users**: Count of all users in the system
- **Active Roles**: Count of active roles with pending approval count
- **Permissions**: Total number of configured permissions
- **System Health**: Static indicator (99.9% uptime)

## Architecture

### Backend APIs (auth_service)

The integration uses the following endpoints:

1. **GET /users/all**

   - Returns all users without pagination
   - No query parameters required
   - Response: Array of user objects

2. **GET /roles/all**

   - Returns all roles without pagination
   - No query parameters required
   - Response: Array of role objects with `isActive` field

3. **GET /permissions/all**
   - Returns all permissions without pagination
   - No query parameters required
   - Response: Array of permission objects

### Frontend Implementation

#### File Structure

```
admin-portal/src/
├── actions/dashboard/
│   └── stats-actions.ts          # Server action to fetch dashboard stats
├── app/dashboard/overview/
│   ├── page.tsx                  # Server component (main page)
│   └── _components/
│       └── dashboard-client.tsx  # Client component with animations
```

#### Components

**1. `stats-actions.ts` - Server Action**

```typescript
export async function getDashboardStats();
```

- Fetches data from `/users/all`, `/roles/all`, and `/permissions/all` in parallel
- Calculates statistics:
  - `totalUsers`: Total number of users
  - `totalRoles`: Total number of roles
  - `activeRoles`: Roles where `isActive !== false`
  - `pendingRoles`: `totalRoles - activeRoles`
  - `totalPermissions`: Total number of permissions
- Returns structured data with error handling

**2. `page.tsx` - Server Component**

- Fetches dashboard statistics on server-side
- Builds dashboard configuration with real data
- Passes data to client component for rendering
- Handles errors gracefully

**3. `dashboard-client.tsx` - Client Component**

- Renders animated statistics cards using Framer Motion
- Displays error messages if data fetching fails
- Shows loading states and animations
- Responsive grid layout (1 col on mobile, 2 on tablet, 4 on desktop)

## Features

### Real-time Data

- Dashboard statistics are fetched fresh on every page load
- No caching (`cache: 'no-store'`) ensures up-to-date information
- Parallel API calls for optimal performance

### Error Handling

- Graceful fallback to "0" values if API calls fail
- Error messages displayed to users
- Console logging for debugging

### Authentication

- Uses `instance()` helper to include authentication headers
- Automatically includes JWT bearer token from session
- Handles 401 (unauthorized) and 403 (forbidden) errors

### Statistics Calculated

1. **Total Users**: Direct count from `/users/all`
2. **Active Roles**: Count of roles where `isActive !== false`
3. **Pending Roles**: Difference between total and active roles
4. **Total Permissions**: Direct count from `/permissions/all`

## Usage

The dashboard automatically displays statistics when you navigate to `/dashboard/overview`.

### Example Response Format

**GET /users/all**

```json
[
  {
    "id": "uuid",
    "cidNo": "11111111111",
    "roleType": "CITIZEN",
    "createdAt": "2024-01-01T00:00:00Z"
  }
  // ... more users
]
```

**GET /roles/all**

```json
[
  {
    "id": "uuid",
    "name": "Admin",
    "description": "Administrator role",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
  // ... more roles
]
```

**GET /permissions/all**

```json
[
  {
    "id": "uuid",
    "name": "manage_users",
    "description": "Manage system users",
    "actions": ["CREATE", "READ", "UPDATE", "DELETE"],
    "subjects": ["User"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
  // ... more permissions
]
```

## Configuration

### Environment Variables

Ensure your `.env.local` file has the correct API URL:

```env
API_URL=http://localhost:5001
# or
AUTH_SERVICE=http://localhost:5001
```

### Backend Requirements

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: User must have appropriate permissions (Super Admin or Admin)
3. **CORS**: Backend must allow requests from admin portal domain

## Customization

### Adding New Statistics

To add a new statistic to the dashboard:

1. **Update `stats-actions.ts`**:

   ```typescript
   // Add new API call
   const newDataResponse = await fetch(`${API_URL}/new-endpoint/all`, {
     method: 'GET',
     headers,
     cache: 'no-store'
   });

   // Parse and calculate
   const newData = newDataResponse.ok ? await newDataResponse.json() : null;
   const newStatCount = newData?.length || 0;

   // Add to return object
   return {
     success: true,
     data: {
       // ...existing stats,
       newStatCount
     }
   };
   ```

2. **Update `page.tsx`**:
   ```typescript
   const dashboardStats = [
     // ...existing stats,
     {
       label: 'New Stat',
       value: statsData?.newStatCount.toString() || '0',
       icon: SomeIcon,
       trend: 'Some trend text',
       trendUp: true,
       color: 'text-purple-600'
     }
   ];
   ```

### Styling

The dashboard uses Tailwind CSS classes:

- Color classes: `text-blue-600`, `text-emerald-600`, `text-indigo-600`
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Animations via Framer Motion with staggered delays

## Performance

- **Parallel Fetching**: All API calls execute simultaneously using `Promise.all()`
- **Server-Side Rendering**: Statistics fetched on server, reducing client-side load
- **No Client State**: Client component only handles presentation
- **Optimistic Loading**: Fast initial render with smooth animations

## Security

- JWT authentication required for all API calls
- Token automatically included from session via `instance()` helper
- Error messages don't expose sensitive backend details
- Failed requests gracefully handled without breaking UI

## Troubleshooting

### Statistics Show "0"

1. Check if backend is running: `http://localhost:5001`
2. Verify authentication token in browser DevTools > Network tab
3. Check backend logs for errors
4. Ensure user has appropriate permissions (Admin or Super Admin role)

### "Session Expired" Error

- User needs to log in again
- JWT token may have expired
- Redirect to login page will occur automatically

### "Permission Denied" Error

- User doesn't have required permissions
- Contact system administrator to assign appropriate role
- Minimum required: Read permissions for users, roles, and permissions

### API Call Failures

- Check browser console for detailed error messages
- Verify `API_URL` environment variable
- Ensure backend endpoints exist and are accessible
- Check CORS configuration if running on different ports

## Testing

### Manual Testing

1. Navigate to `/dashboard/overview`
2. Verify statistics display correctly
3. Check that numbers match backend data
4. Refresh page to ensure real-time updates

### Backend Endpoints Testing

```bash
# Test users endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5001/users/all

# Test roles endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5001/roles/all

# Test permissions endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5001/permissions/all
```

## Future Enhancements

- [ ] Add real-time updates using WebSockets or Server-Sent Events
- [ ] Implement trend calculation based on historical data
- [ ] Add date range filters for statistics
- [ ] Create detailed analytics charts
- [ ] Export statistics as CSV/PDF reports
- [ ] Add refresh button for manual updates
- [ ] Implement caching with revalidation strategy
- [ ] Add loading skeletons for better UX

## Related Files

- `/src/actions/common/user-actions.ts` - User management actions
- `/src/actions/common/role-actions.ts` - Role management actions
- `/src/actions/common/permission-actions.ts` - Permission management actions
- `/src/config/dashboard-config.tsx` - Static dashboard configuration (deprecated)
- `/auth_service/src/modules/users/users.controller.ts` - Users API
- `/auth_service/src/modules/roles/roles.controller.ts` - Roles API
- `/auth_service/src/modules/permissions/permissions.controller.ts` - Permissions API
