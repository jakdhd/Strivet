'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI, authHeaders } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, contacts: 0 });

  useEffect(() => {
    Promise.all([
      fetchAPI<any[]>('/courses/all', { headers: authHeaders() }),
      fetchAPI<any[]>('/contacts', { headers: authHeaders() }),
    ]).then(([courses, contacts]) => {
      setStats({ courses: courses.length, contacts: contacts.length });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-3xl font-bold text-primary">{stats.courses}</div>
          <div className="text-gray-600 mt-1">كورس</div>
          <Link href="/admin/courses" className="text-sm text-primary hover:underline mt-2 inline-block">إدارة الكورسات</Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-3xl font-bold text-accent">{stats.contacts}</div>
          <div className="text-gray-600 mt-1">رسالة</div>
          <Link href="/admin/contacts" className="text-sm text-primary hover:underline mt-2 inline-block">عرض الرسائل</Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-3xl font-bold text-green-600">✓</div>
          <div className="text-gray-600 mt-1">النظام يعمل</div>
          <Link href="/admin/settings" className="text-sm text-primary hover:underline mt-2 inline-block">الإعدادات</Link>
        </div>
      </div>
    </div>
  );
}
