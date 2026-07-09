'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, clearToken } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthed(true);
      return;
    }
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (!authed) return null;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  function handleLogout() {
    clearToken();
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-secondary text-white p-6">
        <h2 className="text-xl font-bold mb-8 text-center">STRIVE</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-white/10 transition">
            الرئيسية
          </Link>
          <Link href="/admin/courses" className="block py-2 px-4 rounded hover:bg-white/10 transition">
            الكورسات
          </Link>
          <Link href="/admin/contacts" className="block py-2 px-4 rounded hover:bg-white/10 transition">
            الرسائل
          </Link>
          <Link href="/admin/settings" className="block py-2 px-4 rounded hover:bg-white/10 transition">
            الإعدادات
          </Link>
        </nav>
        <button onClick={handleLogout} className="mt-8 text-sm text-gray-400 hover:text-white transition">
          تسجيل خروج
        </button>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
