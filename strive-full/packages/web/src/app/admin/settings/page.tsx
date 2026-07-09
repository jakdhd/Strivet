'use client';

import { useEffect, useState, FormEvent } from 'react';
import { fetchAPI, authHeaders, getToken } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    fetchAPI<Record<string, string>>('/settings').then(setSettings);
    fetchAPI<{ admin: any }>('/auth/me', { headers: authHeaders() }).then(d => {
      setAdminEmail(d.admin.email);
      setAdminName(d.admin.name || '');
    }).catch(() => {});
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    await fetchAPI('/settings', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleAdminSave(e: FormEvent) {
    e.preventDefault();
    const body: any = { email: adminEmail, name: adminName };
    if (adminPassword) body.password = adminPassword;
    await fetchAPI('/auth/profile', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    setAdminPassword('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      update('logo_url', data.url);
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">الإعدادات</h1>

      {saved && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">تم الحفظ ✅</div>}

      <div className="space-y-6">
        <form onSubmit={handleAdminSave} className="bg-white p-8 rounded-xl shadow-md max-w-3xl">
          <h2 className="text-xl font-bold mb-4">بيانات الأدمن</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم</label>
              <input value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة سر جديدة (اترك فارغاً)</label>
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className="w-full border rounded-lg p-3 outline-none" />
            </div>
          </div>
          <button className="mt-4 bg-secondary hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition">
            تحديث بيانات الأدمن
          </button>
        </form>

        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-md max-w-3xl space-y-6">
          <fieldset className="border rounded-xl p-6">
            <legend className="font-bold text-lg px-2">الشعار والهوية</legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">شعار الموقع</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full border rounded-lg p-3 outline-none" />
                {settings.logo_url && (
                  <img src={`http://localhost:4000${settings.logo_url}`} alt="logo" className="mt-2 h-16 rounded" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم الموقع</label>
                <input value={settings.site_name || ''} onChange={(e) => update('site_name', e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">وصف الموقع (SEO)</label>
                <textarea value={settings.site_description || ''} onChange={(e) => update('site_description', e.target.value)} rows={2} className="w-full border rounded-lg p-3 outline-none" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-xl p-6">
            <legend className="font-bold text-lg px-2">الصفحة الرئيسية</legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان الرئيسي</label>
                <input value={settings.hero_title || ''} onChange={(e) => update('hero_title', e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">النص الفرعي</label>
                <textarea value={settings.hero_subtitle || ''} onChange={(e) => update('hero_subtitle', e.target.value)} rows={2} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">نص "عن المنصة"</label>
                <textarea value={settings.about_text || ''} onChange={(e) => update('about_text', e.target.value)} rows={4} className="w-full border rounded-lg p-3 outline-none" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-xl p-6">
            <legend className="font-bold text-lg px-2">التواصل</legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">رابط قناة تليجرام</label>
                <input value={settings.telegram || ''} onChange={(e) => update('telegram', e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رابط واتساب</label>
                <input value={settings.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border rounded-xl p-6">
            <legend className="font-bold text-lg px-2">بوت تليجرام</legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">رسالة الترحيب</label>
                <textarea value={settings.bot_welcome || ''} onChange={(e) => update('bot_welcome', e.target.value)} rows={3} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">معرفات المشتركين (chat_id)</label>
                <input value={settings.telegram_chat_ids || ''} onChange={(e) => update('telegram_chat_ids', e.target.value)} className="w-full border rounded-lg p-3 outline-none" />
              </div>
            </div>
          </fieldset>

          <button className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold transition text-lg">
            حفظ جميع الإعدادات
          </button>
        </form>
      </div>
    </div>
  );
}
