import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { config } from '@/config/config';
import { APP_NAME } from '@/lib/constants';
import Providers from '@/provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import '@/app/hljs.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'A modern blogging platform for writers to share knowledge and insights.',
  metadataBase: new URL(config.NEXT_PUBLIC_BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              showSpinner={false}
              color="var(--progress)"
              height={2.5}
              showForHashAnchor={false}
            />
            <Toaster richColors />
            <main>{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
