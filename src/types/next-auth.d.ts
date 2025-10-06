export interface SessionUser {
  id: string; // NextAuth necesita que el id sea string
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
    refreshToken?: string;
    user: SessionUser;
  }

  interface User extends SessionUser {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id?: string; // Cambiado a string para consistencia con NextAuth
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    sucursales?: string[];
    permissions?: string[];
  }
}