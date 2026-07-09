'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const siteName = settings.site_name || 'Strive';
  const heroTitle = settings.hero_title || `ابدأ رحلة التداول مع <span class="text-primary">${siteName}</span>`;
  const heroSubtitle = settings.hero_subtitle || 'منصة تعليمية متكاملة لتعليم التداول من الصفر حتى الاحتراف';
  const aboutText = settings.about_text || '';

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary via-secondary to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: heroTitle }} />
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">{heroSubtitle}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              تصفح الكورسات
            </Link>
            <Link
              href="/contact"
              className="border border-white hover:bg-white hover:text-secondary px-8 py-3 rounded-lg font-semibold transition"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">لماذا {siteName}؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {aboutText && (
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">{aboutText}</p>
          </div>
        </section>
      )}
    </div>
  );
}

const features = [
  { icon: '📊', title: 'تعليم احترافي', desc: 'محتوى تعليمي مبسط من خبراء التداول' },
  { icon: '🛡️', title: 'إدارة مخاطر', desc: 'تعلم كيف تحمي رأس مالك وتدير مخاطرك' },
  { icon: '💬', title: 'دعم مباشر', desc: 'تواصل مباشر عبر تليجرام للاستفسارات' },
];
