import { verifyAuth } from '@/lib/auth';
import Link from 'next/link';
import TabNav from './components/TabNav';

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authResult = await verifyAuth();
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
        <Link
          href={`/author/${authResult.user?.username}`}
          className="text-lg hover:underline"
        >
          {authResult.user?.fullName}{' '}
          <span className="text-muted-foreground">
            (@{authResult.user?.username})
          </span>
        </Link>
      </div>
      <section className="space-y-8">
        <TabNav />
        {children}
      </section>
    </div>
  );
}
