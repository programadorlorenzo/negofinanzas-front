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

          return {
            id: data.user.id.toString(),
            accessToken: data.accessToken,
            user: {
              id: data.user.id,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
              role: data.user.role,
              sucursales: data.user.sucursales,
              permissions: data.user.permissions,
            } as SessionUser,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // En el login inicial
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.user = (user as { user?: SessionUser }).user as SessionUser;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as SessionUser;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
};