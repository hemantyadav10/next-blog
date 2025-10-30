import authImage from '@/assets/auth.png';
import Image from 'next/image';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div className="flex justify-start gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            InfiniteInk
          </Link>
        </div>
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
