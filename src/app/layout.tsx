import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider';
import { ClientMantineProvider } from '@/components/ClientMantineProvider';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NegoFinanzas",
  description: "Sistema de gestión financiera empresarial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ClientMantineProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClientMantineProvider>
      </body>
    </html>
  );
}