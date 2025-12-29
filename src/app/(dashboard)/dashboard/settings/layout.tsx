import { Separator } from '@/components/ui/separator';
import TabNav from './components/TabNav';

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
      <Separator />
      <section className="flex flex-col gap-8 lg:flex-row">
        <aside className="bg-background lg:sticky lg:top-20 lg:z-40 lg:min-w-60 lg:self-start">
          <TabNav />
        </aside>
        <section className="flex-1">{children}</section>
      </section>
    </div>
  );
}
