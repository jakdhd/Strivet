'use client';

import { useEffect, useState } from 'react';
import { fetchAPI, authHeaders } from '@/lib/api';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  function load() {
    fetchAPI<Contact[]>('/contacts', { headers: authHeaders() }).then(setContacts);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await fetchAPI(`/contacts/${id}/read`, { method: 'PUT', headers: authHeaders() });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">الرسائل</h1>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className={`bg-white p-6 rounded-xl shadow-md ${!c.isRead ? 'border-r-4 border-primary' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-bold text-lg">{c.name}</span>
                {!c.isRead && <span className="bg-primary text-white text-xs px-2 py-1 rounded mr-2">جديد</span>}
              </div>
              <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
            {c.email && <div className="text-sm text-gray-600">📧 {c.email}</div>}
            {c.phone && <div className="text-sm text-gray-600">📱 {c.phone}</div>}
            <p className="mt-3 text-gray-700">{c.message}</p>
            {!c.isRead && (
              <button onClick={() => markRead(c.id)} className="mt-3 text-sm text-primary hover:underline">
                تحديد كمقروء
              </button>
            )}
          </div>
        ))}
        {contacts.length === 0 && <p className="text-gray-500 text-center py-8">لا توجد رسائل</p>}
      </div>
    </div>
  );
}
