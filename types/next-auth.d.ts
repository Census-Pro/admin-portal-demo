import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    fullName: string;
    roleType: string;
    accessToken: string;
    refreshToken?: string;
    sessionId?: string; // Redis session ID for activity tracking
    tokenExpiry?: number;
    rememberMe?: boolean;
    organizationId?: string;
    dzongkhagId?: string;
    gewogId?: string;
    departmentId?: string;
    ndiId?: string;
    cidNo?: string;
    mobileNo?: string | null;
    email?: string | null;
    officeLocationId?: string;
    agencyId?: string;
    officeLocation?: {
      id: string;
      name: string;
    };
    agency?: {
      id: string;
      name: string;
    };
    status: string;
    roles: Array<{
      id: string;
      name: string;
      permissions: Array<{
        id: string;
        name: string;
      }>;
    }>;
    // Supports both formats for backward compatibility:
    // - Legacy object format: { name, action, subject }
    // - Condensed string format: "action:subject"
    ability: Array<
      | string
      | {
          name: string;
          action: string[];
          subject: string | string[]; // Subject can be a string or array of strings
        }
    >;
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
    accessToken: string;
    refreshToken?: string;
    sessionId?: string; // Redis session ID for activity tracking
    tokenExpiry?: number;
    rememberMe?: boolean;
  }

  interface JWT {
    user: User;
    accessToken: string;
    refreshToken?: string;
    sessionId?: string; // Redis session ID for activity tracking
    tokenExpiry?: number;
    rememberMe?: boolean;
  }
}

export interface CredentialsInputs {
  cidNumber: string;
  password: string;
}
