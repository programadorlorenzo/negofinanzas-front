import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CuentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}