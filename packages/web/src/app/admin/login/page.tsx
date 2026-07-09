'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI, setToken } from '@/lib/api';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await fetchAPI<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      router.push('/admin');
    } catch {
      setError('بيانات الدخول غير صحيحة');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-primary flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-secondary">STRIVE</Link>
          <p className="text-gray-500 mt-2">لوحة التحكم</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@strive.com"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition text-lg">
            دخول
          </button>
        </form>
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary transition">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
