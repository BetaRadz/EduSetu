import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EduSetu — Find the place where you can grow',
    template: '%s | EduSetu',
  },
  description: 'Discover verified schools, colleges and universities. Read authentic experiences and build a stronger connection between families and institutions.',
  applicationName: 'EduSetu',
};

export const viewport: Viewport = {
  themeColor: '#f5f5ef',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
