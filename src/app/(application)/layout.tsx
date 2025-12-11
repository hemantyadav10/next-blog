import Header from '@/components/Header';
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
      {children}
    </div>
  );
}
