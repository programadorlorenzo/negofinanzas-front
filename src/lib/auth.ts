import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUser } from "../types/next-auth";

// Tipamos la respuesta del backend
interface BackendLoginResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    role: string;
    sucursales: string[];
    permissions: string[];
  };
  accessToken: string;
  refreshToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            }/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data: BackendLoginResponse = await response.json();

          const authUser: SessionUser & { accessToken: string } = {
            id: data.user.id.toString(), // Convertir a string para NextAuth
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            role: data.user.role,
            sucursales: data.user.sucursales,
            permissions: data.user.permissions,
            accessToken: data.accessToken,
          };

          console.log("Authenticated user:", authUser);

          return authUser;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // SIEMPRE sobrescribir completamente con datos del usuario cuando hay un login
      if (user) {
        // Crear un token completamente nuevo para evitar datos anteriores
        const newToken = {
          accessToken: user.accessToken,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || undefined,
          role: user.role,
          sucursales: user.sucursales,
          permissions: user.permissions,
          // Agregar timestamp para forzar actualización
          iat: Math.floor(Date.now() / 1000),
        };
        return newToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      // Asegurar que todos los campos existan antes de mapear
      if (token.id && token.firstName && token.lastName && token.email && token.role) {
        session.user = {
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email,
          role: token.role,
          sucursales: token.sucursales || [],
          permissions: token.permissions || [],
        };
      } else {
        // Fallback si el token no tiene todos los datos
        session.user = {
          id: token.sub || "unknown",
          firstName: token.firstName || "Usuario",
          lastName: token.lastName || "",
          email: token.email || "",
          role: token.role || "USER",
          sucursales: token.sucursales || [],
          permissions: token.permissions || [],
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 0, // Forzar actualización de sesión en cada request
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // false para desarrollo local
        maxAge: 24 * 60 * 60 // 24 horas
      }
    }
  },
};
