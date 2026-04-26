import { AppNavbar } from "@/components/app-navbar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen noise">
      <AppNavbar />
      {children}
    </div>
  );
}
