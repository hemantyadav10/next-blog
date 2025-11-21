import authImage from '@/assets/auth.png';
import { Logo } from '@/components/Logo';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col gap-8 px-4 py-8 md:px-8">
        <Logo textClassName="block" />
        {/* Left Side - Login Form */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          {children}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative hidden w-1/2 md:block">
        <Image
          src={authImage}
          alt="Login page illustration"
          fill
          className="object-cover"
          placeholder="blur"
          quality={100}
          priority
          sizes="50vw"
        />
      </div>
    </div>
  );
}
