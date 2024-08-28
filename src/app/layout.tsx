// src/app/layout.tsx

import { Inter, Public_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from '../redux/provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';


const inter = Inter({ subsets: ["latin"] });
const publicSans = Public_Sans({ subsets: ["latin"], variable: '--font-public-sans' });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: '--font-noto-sans' });

export { metadata } from './metadata';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${publicSans.variable} ${notoSans.variable} relative flex min-h-screen flex-col bg-white overflow-x-hidden`}>
        <UserProvider>
          <Providers>
            <Header />
            <main className="flex-grow">
            <ScrollToTop />
              {children}
            </main>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
