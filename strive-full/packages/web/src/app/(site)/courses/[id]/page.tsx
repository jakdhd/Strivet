'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  level: string;
  lessons: Lesson[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (id) {
      fetchAPI<Course>(`/courses/${id}`)
        .then(setCourse)
        .catch(console.error);
    }
  }, [id]);

  if (!course) return <div className="text-center py-20">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/courses" className="text-primary hover:underline mb-4 inline-block">&larr; العودة للكورسات</Link>

      <div className="bg-white rounded-xl shadow-md p-8">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
        </span>
        <h1 className="text-3xl font-bold mt-2 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        <div className="text-2xl font-bold text-primary mb-6">
          {course.price === 0 ? 'مجاني' : `${course.price} ${course.currency}`}
        </div>

        <a
          href="https://t.me/SSSSSTVE"
          target="_blank"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          💬 اشتراك عبر تليجرام
        </a>
      </div>

      {course.lessons.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">محتوى الكورس</h2>
          <div className="bg-white rounded-xl shadow-md divide-y">
            {course.lessons.map((lesson) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-400">الدرس {lesson.order}</span>
                  <h3 className="font-semibold">{lesson.title}</h3>
                </div>
                {lesson.duration && (
                  <span className="text-sm text-gray-500">{lesson.duration} دقيقة</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
