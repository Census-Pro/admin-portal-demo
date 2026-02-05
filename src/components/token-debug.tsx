'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * Token Debug Component
 * Shows current token status and expiry times
 * Only for development - remove in production
 */
export function TokenDebug() {
  const { data: session, status } = useSession();
  const [timeInfo, setTimeInfo] = useState({
    currentTime: 0,
    tokenExpiry: 0,
    timeUntilExpiry: 0,
    minutesUntilExpiry: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const tokenExpiry = (session as any)?.tokenExpiry || 0;
      const timeUntilExpiry = tokenExpiry - now;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);

      setTimeInfo({
        currentTime: now,
        tokenExpiry,
        timeUntilExpiry,
        minutesUntilExpiry
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, [session]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  if (status === 'loading') {
    return (
      <div className="bg-card fixed right-4 bottom-4 rounded-lg border p-4 shadow-lg">
        <p className="text-muted-foreground text-sm">Loading session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-card fixed right-4 bottom-4 rounded-lg border p-4 shadow-lg">
        <p className="text-destructive text-sm font-medium">
          Not authenticated
        </p>
      </div>
    );
  }

  const isExpiringSoon = timeInfo.minutesUntilExpiry < 10;
  const isExpired = timeInfo.timeUntilExpiry <= 0;

  return (
    <div className="bg-card fixed right-4 bottom-4 min-w-[300px] space-y-2 rounded-lg border p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">🔐 Token Debug</h3>
        {isExpired && (
          <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs">
            EXPIRED
          </span>
        )}
        {!isExpired && isExpiringSoon && (
          <span className="rounded-full bg-amber-500 px-2 py-1 text-xs text-white">
            EXPIRING SOON
          </span>
        )}
        {!isExpired && !isExpiringSoon && (
          <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
            VALID
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-mono">{status}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">User:</span>
          <span className="max-w-[150px] truncate font-mono">
            {(session?.user as any)?.cidNo || 'N/A'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Role:</span>
          <span className="font-mono">
            {(session?.user as any)?.roleType || 'N/A'}
          </span>
        </div>

        <div className="mt-2 border-t pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time Until Expiry:</span>
            <span
              className={`font-mono font-semibold ${
                isExpired
                  ? 'text-destructive'
                  : isExpiringSoon
                    ? 'text-amber-500'
                    : 'text-green-500'
              }`}
            >
              {isExpired
                ? 'EXPIRED'
                : `${timeInfo.minutesUntilExpiry}m ${timeInfo.timeUntilExpiry % 60}s`}
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Remember Me:</span>
          <span className="font-mono">
            {(session as any)?.rememberMe ? 'Yes (7d)' : 'No (24h)'}
          </span>
        </div>

        <div className="text-muted-foreground mt-2 border-t pt-2 text-[10px]">
          <div>
            Current:{' '}
            {new Date(timeInfo.currentTime * 1000).toLocaleTimeString()}
          </div>
          <div>
            Expires:{' '}
            {new Date(timeInfo.tokenExpiry * 1000).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground border-t pt-2 text-[10px]">
        💡 Auto-refresh triggers at 5 minutes before expiry
      </div>
    </div>
  );
}

/**
 * Token Inspector Component
 * Decodes and displays JWT token contents
 * Only for development
 */
export function TokenInspector() {
  const { data: session } = useSession();
  const [showTokens, setShowTokens] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const accessToken = (session as any)?.accessToken;
  const refreshToken = (session as any)?.refreshToken;
  const decodedAccess = accessToken ? decodeJWT(accessToken) : null;
  const decodedRefresh = refreshToken ? decodeJWT(refreshToken) : null;

  return (
    <div className="fixed top-4 right-4 max-w-md">
      <button
        onClick={() => setShowTokens(!showTokens)}
        className="bg-primary text-primary-foreground rounded px-3 py-1 text-xs"
      >
        {showTokens ? 'Hide' : 'Show'} Tokens
      </button>

      {showTokens && (
        <div className="bg-card mt-2 space-y-2 rounded-lg border p-4 shadow-lg">
          <div>
            <h4 className="mb-1 text-xs font-semibold">Access Token</h4>
            <pre className="bg-muted max-h-[200px] overflow-auto rounded p-2 text-[10px]">
              {JSON.stringify(decodedAccess, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="mb-1 text-xs font-semibold">Refresh Token</h4>
            <pre className="bg-muted max-h-[200px] overflow-auto rounded p-2 text-[10px]">
              {JSON.stringify(decodedRefresh, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
