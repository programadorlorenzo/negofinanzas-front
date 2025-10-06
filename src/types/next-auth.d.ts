export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sucursales: string[];
  permissions: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  user: SessionUser;
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: SessionUser;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    user: SessionUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: SessionUser;
  }
}