import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { verifyAuth } from '@/lib/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await verifyAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={authResult} />
      <SidebarProvider>
        <AppSidebar />
        <section className="w-full">
          <div className="flex items-center gap-3 p-4">
            <SidebarTrigger />
            <p>Dashboard</p>
          </div>
          <section className="mx-auto max-w-7xl px-4 pt-2 pb-12 md:px-8 md:pt-4">
            {children}
          </section>
        </section>
      </SidebarProvider>
    </div>
  );
}
