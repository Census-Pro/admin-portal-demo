import { NextAuthConfig, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialProvider from 'next-auth/providers/credentials';
import { authenticateUser } from './lib/mock-users';

// ============================================
// DEMO MODE - NO BACKEND REQUIRED
// ============================================
// This is a frontend-only demo application
// See DEMO_CREDENTIALS.md for login credentials
// ============================================

// Validate required environment variables
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
          console.log('🔐 [DEMO MODE] Authenticating with mock users');

          // Demo Mode: Use mock authentication
          if (!credentials?.cidNo || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          const user = authenticateUser(
            credentials.cidNo as string,
            credentials.password as string
          );

          if (!user) {
            console.log('❌ Invalid credentials');
            return null;
          }

          console.log('✅ Authentication successful for:', user.fullName);

          const rememberMe = credentials?.rememberMe === 'true';
          const sessionDuration = rememberMe
            ? SESSION_MAX_AGE_REMEMBER
            : SESSION_MAX_AGE_DEFAULT;

          // Get ability from user data
          const ability = user.ability || [];

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

          // Generate mock tokens
          const mockAccessToken = `demo-access-token-${user.id}-${Date.now()}`;
          const mockRefreshToken = `demo-refresh-token-${user.id}-${Date.now()}`;

          return {
            ...user,
            ability,
            permissions: transformedAbilities,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken,
            sessionId: user.id,
            tokenExpiry: Math.floor(Date.now() / 1000) + sessionDuration,
            accessTokenExpiry: Math.floor(Date.now() / 1000) + 3600,
            rememberMe
          };
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
        token.rememberMe = session.rememberMe;
        const sessionDuration = token.rememberMe
          ? SESSION_MAX_AGE_REMEMBER
          : SESSION_MAX_AGE_DEFAULT;
        token.tokenExpiry = now + sessionDuration;
      }

      // Initial sign in - store tokens
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sessionId = user.sessionId;
        token.tokenExpiry = user.tokenExpiry;
        token.accessTokenExpiry = user.accessTokenExpiry;
        token.rememberMe = user.rememberMe;
      }

      // Validate we have required data
      if (!token.accessToken || !token.user || !token.tokenExpiry) {
        console.error(
          '❌ JWT Callback - Missing required data, invalidating session'
        );
        return null;
      }

      // Check if session has expired (based on rememberMe setting)
      const timeUntilExpiry = (token.tokenExpiry as number) - now;
      if (timeUntilExpiry <= 0) {
        console.log('🔐 [DEMO MODE] Session expired');
        return null;
      }

      // Demo mode: No need to refresh tokens from backend
      // Tokens are valid for the entire session duration
      console.log(
        `🔐 [DEMO MODE] Session valid for ${Math.floor(timeUntilExpiry / 60)} more minutes`
      );

      return token;
    },
    async session({ session, token }) {
      if (!token.user || !token.accessToken) {
        console.error('❌ Session Callback - Missing required data');
        return null as any;
      }

      session.user = token.user as AdapterUser & User;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.sessionId = token.sessionId as string;
      session.tokenExpiry = token.tokenExpiry as number;
      session.rememberMe = token.rememberMe as boolean;

      console.log('🔐 [DEMO MODE] Session active for:', session.user.fullName);

      return session;
    }
  }
  // debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;

export default authConfig;
