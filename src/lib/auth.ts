import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
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

// Interfaz extendida para el token JWT
interface ExtendedJWT {
  accessToken?: string;
  user?: SessionUser;
  expired?: boolean;
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
          // Debug: verificar variables de entorno
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          console.log("🔍 API URL being used:", apiUrl);
          console.log("🔍 All env vars:", {
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            NODE_ENV: process.env.NODE_ENV,
            NEXTAUTH_URL: process.env.NEXTAUTH_URL
          });

          // Crear instancia de axios específica para autenticación
          const authAxios = axios.create({
            baseURL: apiUrl,
            timeout: 10000,
          });

          const response = await authAxios.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const data: BackendLoginResponse = response.data;

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
        return token;
      }

      // Solo verificar si el token sigue siendo válido
      if (token.accessToken) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          console.log("🔍 JWT callback API URL:", apiUrl);
          
          // Hacer una verificación ligera del token usando /auth/me
          const response = await axios.post(
            `${apiUrl}/auth/me`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
              timeout: 5000,
            }
          );

          // Si la respuesta es exitosa, el token sigue siendo válido
          if (response.status === 200) {
            return token;
          }
        } catch (error) {
          console.error('Token validation failed:', error);

          // Si el token es inválido, marcar como expirado
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            (token as ExtendedJWT).expired = true;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Si el token está marcado como expirado, no retornar sesión
      if ((token as ExtendedJWT).expired) {
        return {} as Session;
      }

      session.accessToken = token.accessToken as string;
      session.user = token.user as SessionUser;
      
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Redirigir errores al login
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 0, // Forzar actualización en cada request
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },
};