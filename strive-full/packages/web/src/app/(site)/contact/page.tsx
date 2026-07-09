'use client';

import { useState, FormEvent } from 'react';
import { fetchAPI } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await fetchAPI('/contacts', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setDone(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert('حدث خطأ، حاول مرة أخرى');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
      <p className="text-gray-600 mb-8">
        تواصل معنا عبر الواتساب أو تليجرام أو املأ النموذج وسنرد عليك فوراً
      </p>

      <div className="flex gap-4 mb-10">
        <a
          href="https://t.me/SSSSSTVE"
          target="_blank"
          className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white text-center py-4 rounded-xl font-semibold transition"
        >
          💬 راسلنا على تليجرام
        </a>
        <a
          href="https://t.me/Strive108"
          target="_blank"
          className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white text-center py-4 rounded-xl font-semibold transition"
        >
          📢 القناة
        </a>
      </div>

      {done && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رقم الجوال</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرسالة</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white w-full py-3 rounded-lg font-semibold transition">
          إرسال
        </button>
      </form>
    </div>
  );
}
