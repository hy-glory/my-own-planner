import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My own planner',
  description: '내가 쓰려고 만든 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
