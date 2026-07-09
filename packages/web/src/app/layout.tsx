import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Strive | أكاديمية التداول الاحترافية',
  description: 'أكاديمية Strive لتعليم التداول في الأسواق المالية. نوفر كورساًت احترافية في التحليل الفني والأساسي وإدارة رأس المال، من مبتدئ إلى متقدم.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
