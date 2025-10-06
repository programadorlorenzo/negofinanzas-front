export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sucursales: string[];
  permissions: string[];
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: SessionUser;
  }

  interface User {
    accessToken?: string;
    user: SessionUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user: SessionUser;
  }
}