'use client';

import { useEffect, useState, FormEvent } from 'react';
import { fetchAPI, authHeaders, getToken } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  level: string;
  isActive: boolean;
  order: number;
  imageUrl: string | null;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [edit, setEdit] = useState<Partial<Course> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState('');

  function load() {
    fetchAPI<Course[]>('/courses/all', { headers: authHeaders() }).then(setCourses);
  }

  useEffect(() => { load(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !edit) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      setEdit({ ...edit, imageUrl: data.url });
    } catch {}
    setUploading(false);
  }

  const courseFields = ['title', 'description', 'price', 'currency', 'level', 'imageUrl', 'videoUrl', 'category', 'isActive', 'order'];

  function sanitize(data: any) {
    const clean: any = {};
    for (const key of courseFields) {
      if (data[key] !== undefined) clean[key] = data[key];
    }
    return clean;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaveError('');

    const isNew = !edit.id;
    const url = isNew ? '/courses' : `/courses/${edit.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      await fetchAPI(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(sanitize(edit)),
      });
      setShowForm(false);
      setEdit(null);
      load();
    } catch (err: any) {
      setSaveError(err.message || 'فشل الحفظ');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الكورس؟')) return;
    await fetchAPI(`/courses/${id}`, { method: 'DELETE', headers: authHeaders() });
    load();
  }

  function openEdit(course: Course) {
    setEdit(course);
    setShowForm(true);
  }

  function openNew() {
    setEdit({ title: '', description: '', price: 0, currency: 'SAR', level: 'beginner', isActive: true, order: 0, imageUrl: '' });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">إدارة الكورسات</h1>
        <button onClick={openNew} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition">
          + إضافة كورس
        </button>
      </div>

      {showForm && edit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{edit.id ? 'تعديل كورس' : 'إضافة كورس جديد'}</h2>
            {saveError && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">{saveError}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <input value={edit.title || ''} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} required rows={3} className="w-full border rounded-lg p-3 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">السعر</label>
                  <input type="number" value={edit.price || 0} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} className="w-full border rounded-lg p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">العملة</label>
                  <select value={edit.currency || 'SAR'} onChange={(e) => setEdit({ ...edit, currency: e.target.value })} className="w-full border rounded-lg p-3 outline-none">
                    <option value="SAR">ريال سعودي</option>
                    <option value="USD">دولار</option>
                    <option value="IQD">دينار عراقي</option>
                    <option value="AED">درهم إماراتي</option>
                    <option value="KWD">دينار كويتي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الترتيب</label>
                  <input type="number" value={edit.order || 0} onChange={(e) => setEdit({ ...edit, order: +e.target.value })} className="w-full border rounded-lg p-3 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المستوى</label>
                <select value={edit.level} onChange={(e) => setEdit({ ...edit, level: e.target.value })} className="w-full border rounded-lg p-3 outline-none">
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">صورة الكورس</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg p-3 outline-none" />
                {uploading && <p className="text-sm text-gray-500 mt-1">جاري الرفع...</p>}
                {edit.imageUrl && (
                  <img src={`http://localhost:4000${edit.imageUrl}`} alt="preview" className="mt-2 h-32 rounded object-cover" />
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition">
                حفظ
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEdit(null); }} className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right p-4">الصورة</th>
              <th className="text-right p-4">العنوان</th>
              <th className="text-right p-4">السعر</th>
              <th className="text-right p-4">العملة</th>
              <th className="text-right p-4">المستوى</th>
              <th className="text-right p-4">فعال</th>
              <th className="text-left p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="p-2">
                  {c.imageUrl ? (
                    <img src={`http://localhost:4000${c.imageUrl}`} alt="" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-400">لا</div>
                  )}
                </td>
                <td className="p-4 font-medium">{c.title}</td>
                <td className="p-4">{c.price === 0 ? 'مجاني' : `${c.price}`}</td>
                <td className="p-4">{c.price === 0 ? '-' : c.currency}</td>
                <td className="p-4">{c.level}</td>
                <td className="p-4">{c.isActive ? '✓' : '✗'}</td>
                <td className="p-4 text-left">
                  <button onClick={() => openEdit(c)} className="text-primary hover:underline ml-4">تعديل</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
