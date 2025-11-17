import { ReactNode } from 'react';

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="h-screen overflow-hidden"> {children} </div>;
}
