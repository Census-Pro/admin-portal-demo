import { NextAuthConfig, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialProvider from 'next-auth/providers/credentials';

// import { createSession } from './lib/session';

const API_URL = `${process.env.AUTH_SERVICE}`;

// Validate required environment variables
if (!process.env.AUTH_SERVICE) {
  throw new Error('AUTH_SERVICE environment variable is required');
}

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error(
    'AUTH_SECRET or NEXTAUTH_SECRET environment variable is required'
  );
}

// Session durations
const SESSION_MAX_AGE_REMEMBER = 7 * 24 * 60 * 60; // 7 days when "Remember Me" checked
const SESSION_MAX_AGE_DEFAULT = 24 * 60 * 60; // 24 hours when "Remember Me" unchecked

const authConfig = {
  trustHost: true, // Important for production behind proxy
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_REMEMBER // Max possible, actual expiry controlled in JWT callback
  },
  cookies: {
    sessionToken: {
      // Use a unique cookie name so the admin portal session doesn't collide
      // with the client portal session when both run simultaneously in development.
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-admin-portal.session-token'
          : 'admin-portal.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    CredentialProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        cidNo: { label: 'CID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' },
        // For NDI login
        accessToken: { label: 'Access Token', type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
        user: { label: 'User', type: 'text' }
      },
      async authorize(credentials, req) {
        try {
          // NDI Login Flow - If tokens are provided directly
          if (credentials?.accessToken && credentials?.user) {
            console.log('🔐 NDI Login - Processing token-based authentication');

            const userData = JSON.parse(credentials.user as string);
            const rememberMe = credentials?.rememberMe === 'true';
            const sessionDuration = rememberMe
              ? SESSION_MAX_AGE_REMEMBER
              : SESSION_MAX_AGE_DEFAULT;

            // Validate required user data structure
            if (!userData.roles || !Array.isArray(userData.roles)) {
              console.warn(
                'User missing roles array, defaulting to empty array'
              );
              userData.roles = [];
            }

            // Get ability from user data
            const ability = userData.ability || [];
            console.log('Ability array:', ability);

            // Transform backend ability format to frontend permission format
            const transformedAbilities = ability.flatMap((abilityItem: any) => {
              if (!abilityItem.action || !abilityItem.subject) {
                console.warn('Invalid ability item:', abilityItem);
                return [];
              }

              const subjects = Array.isArray(abilityItem.subject)
                ? abilityItem.subject
                : [abilityItem.subject];

              const actions = Array.isArray(abilityItem.action)
                ? abilityItem.action
                : [abilityItem.action];

              return subjects.flatMap((subject: string) => {
                const normalizedSubject = subject
                  .toLowerCase()
                  .replace(/\s+/g, '-');

                return actions.map(
                  (action: string) => `${action}:${normalizedSubject}`
                );
              });
            });

            console.log('Transformed abilities:', transformedAbilities);

            return {
              ...userData,
              ability,
              permissions: transformedAbilities,
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              sessionId: userData.id,
              tokenExpiry: Math.floor(Date.now() / 1000) + sessionDuration,
              rememberMe
            };
          }

          // Regular Password Login Flow
          console.log('Attempting login for:', credentials?.cidNo);
          console.log('API URL:', API_URL);
          console.log('Full URL:', `${API_URL}/auth/admin/login`);

          const response = await fetch(`${API_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cidNo: credentials?.cidNo,
              password: credentials?.password
            })
          });

          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.log('Login failed - HTTP status:', response.status);
            console.log('Error response:', errorText);
            return null;
          }

          const data = await response.json();
          console.log('Response data:', JSON.stringify(data, null, 2));

          console.log('Login successful for:', data.user?.cidNo);
          console.log('User roles:', data.user?.roles);
          console.log('User abilities:', data.ability);

          if (data?.user && data?.accessToken) {
            const rememberMe = credentials?.rememberMe === 'true';
            const sessionDuration = rememberMe
              ? SESSION_MAX_AGE_REMEMBER
              : SESSION_MAX_AGE_DEFAULT;

            // Validate required user data structure
            if (!data.user.roles || !Array.isArray(data.user.roles)) {
              console.warn(
                'User missing roles array, defaulting to empty array'
              );
              data.user.roles = [];
            }

            // Add ability from top-level to user object
            const ability = data.ability || [];
            console.log('Ability array:', ability);

            // Transform backend ability format to frontend permission format
            // Backend: {action: ["create", "update"], subject: ["Birth Registration", "Death Registration"]}
            // Frontend: ["create:birth-registration", "update:birth-registration", "create:death-registration", ...]
            const transformedAbilities = ability.flatMap((abilityItem: any) => {
              if (!abilityItem.action || !abilityItem.subject) {
                console.warn('Invalid ability item:', abilityItem);
                return [];
              }

              // Ensure subject is an array
              const subjects = Array.isArray(abilityItem.subject)
                ? abilityItem.subject
                : [abilityItem.subject];

              // Ensure action is an array
              const actions = Array.isArray(abilityItem.action)
                ? abilityItem.action
                : [abilityItem.action];

              // Map each action+subject combination to permission format
              return subjects.flatMap((subject: string) => {
                // Normalize subject: "Birth Registration" -> "birth-registration"
                const normalizedSubject = subject
                  .toLowerCase()
                  .replace(/\s+/g, '-');

                return actions.map(
                  (action: string) => `${action}:${normalizedSubject}`
                );
              });
            });

            console.log('Transformed abilities:', transformedAbilities); // Store tokens, sessionId, and rememberMe preference in user object for JWT callback
            return {
              ...data.user,
              ability, // Keep original for subject-based checks
              permissions: transformedAbilities, // Add transformed permissions
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              sessionId: data.user.id, // Use user ID as session ID for activity tracking
              tokenExpiry: Math.floor(Date.now() / 1000) + sessionDuration,
              accessTokenExpiry:
                Math.floor(Date.now() / 1000) + (data.expiresIn || 3600), // Access token expiry from backend
              rememberMe
            };
          }

          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);

      // Handle manual session update
      if (trigger === 'update' && session?.rememberMe !== undefined) {
        console.log('🔄 JWT Callback - Manual update triggered:', session);
        token.rememberMe = session.rememberMe;
        const sessionDuration = token.rememberMe
          ? SESSION_MAX_AGE_REMEMBER
          : SESSION_MAX_AGE_DEFAULT;
        token.tokenExpiry = now + sessionDuration;
        console.log('✅ JWT Callback - Session updated. New expiry:', {
          rememberMe: token.rememberMe,
          tokenExpiry: token.tokenExpiry
        });
      }

      // Initial sign in - store tokens
      if (user) {
        console.log('🔐 JWT Callback - Initial sign in, storing user data');
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId; // Redis session ID for activity tracking
        token.tokenExpiry = user.tokenExpiry;
        token.accessTokenExpiry = user.accessTokenExpiry;
        token.rememberMe = user.rememberMe;
        console.log('✅ JWT Callback - User data stored:', {
          hasUser: !!token.user,
          hasAccessToken: !!token.accessToken,
          hasRefreshToken: !!token.refreshToken,
          tokenExpiry: token.tokenExpiry,
          accessTokenExpiry: token.accessTokenExpiry
        });
      }

      // Validate we have required data
      if (!token.accessToken) {
        console.error(
          '❌ JWT Callback - Missing accessToken, invalidating session'
        );
        return null;
      }

      if (!token.user) {
        console.error(
          '❌ JWT Callback - Missing user data, invalidating session'
        );
        return null;
      }

      if (!token.tokenExpiry) {
        console.error(
          '❌ JWT Callback - Missing tokenExpiry, invalidating session'
        );
        return null;
      }

      // Check if session has expired (based on rememberMe setting)
      const timeUntilExpiry = (token.tokenExpiry as number) - now;
      if (timeUntilExpiry <= 0) {
        console.log('⏰ JWT Callback - Session expired, logging out');
        // Session expired - force logout
        return null;
      }

      // Check if access token needs refresh (refresh 5 minutes before expiry)
      // We use accessTokenExpiry to decide when to refresh the backend token
      const accessTokenExpiry = (token.accessTokenExpiry as number) || 0;
      const timeUntilAccessTokenExpiry = accessTokenExpiry - now;

      // Refresh if less than 5 minutes left, OR if it's already expired (and we have a refresh token)
      const shouldRefresh = timeUntilAccessTokenExpiry < 300;

      if (shouldRefresh && token.refreshToken) {
        try {
          console.log('🔄 Refreshing access token...');
          const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken })
          });

          if (response.ok) {
            const data = await response.json();
            // Keep original session expiry based on rememberMe, just refresh access token
            token.accessToken = data.accessToken || data.token.accessToken;
            token.refreshToken = data.refreshToken || data.token.refreshToken;

            // Update access token expiry
            token.accessTokenExpiry =
              Math.floor(Date.now() / 1000) + (data.expiresIn || 3600);

            // Extend session expiry based on rememberMe preference (optional: keep session alive as long as specific activity occurs)
            const sessionDuration = token.rememberMe
              ? SESSION_MAX_AGE_REMEMBER
              : SESSION_MAX_AGE_DEFAULT;
            token.tokenExpiry = Math.floor(Date.now() / 1000) + sessionDuration;

            console.log(
              '✅ Token refresh successful. New expiry:',
              token.accessTokenExpiry
            );
          } else {
            console.error(
              'Token refresh failed - HTTP status:',
              response.status
            );
            // If refresh failed and token is already expired, we must return null
            if (timeUntilAccessTokenExpiry <= 0) {
              return null;
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          if (timeUntilAccessTokenExpiry <= 0) {
            return null;
          }
        }
      } else if (shouldRefresh && !token.refreshToken) {
        // If we should refresh but have no refresh token, and token is expired, die.
        if (timeUntilAccessTokenExpiry <= 0) {
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.user || !token.accessToken) {
        console.error('❌ Session Callback - Missing required data:', {
          hasUser: !!token.user,
          hasAccessToken: !!token.accessToken
        });
        return null as any; // TypeScript workaround
      }

      session.user = token.user as AdapterUser & User;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.sessionId = token.sessionId as string; // Redis session ID for activity tracking
      session.tokenExpiry = token.tokenExpiry as number;
      session.rememberMe = token.rememberMe as boolean;

      console.log('✅ Session Callback - Session created:', {
        userId: session.user.id,
        hasAccessToken: !!session.accessToken,
        tokenExpiry: session.tokenExpiry
      });

      return session;
    }
  }
  // debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;

export default authConfig;
