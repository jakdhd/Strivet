'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const logoUrl = settings.logo_url ? `http://localhost:4000${settings.logo_url}` : null;

  return (
    <>
      <header className="bg-secondary text-white shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wider flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Strive" className="h-10" />
            ) : (
              'STRIVE'
            )}
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition">الرئيسية</Link>
            <Link href="/courses" className="hover:text-primary transition">الكورسات</Link>
            <Link href="/contact" className="hover:text-primary transition">تواصل معنا</Link>
          </div>
        </nav>
      </header>
      <main className="min-h-screen">{children}</main>
      <footer className="bg-secondary text-white text-center py-6 text-sm">
        © {new Date().getFullYear()} Strive. جميع الحقوق محفوظة.
      </footer>
    </>
  );
}
