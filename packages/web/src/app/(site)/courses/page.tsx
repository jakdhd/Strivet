'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  level: string;
  imageUrl: string | null;
  _count: { lessons: number };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchAPI<Course[]>('/courses')
      .then(setCourses)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">الكورسات المتاحة</h1>
      <p className="text-gray-600 mb-10">اختر الكورس المناسب لمستواك وابدأ التعلم</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-40 flex items-center justify-center bg-gray-100">
              {course.imageUrl ? (
                <img src={`http://localhost:4000${course.imageUrl}`} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">📚</span>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {course.price === 0 ? 'مجاني' : `${course.price} ${course.currency}`}
                </span>
                <span className="text-sm text-gray-500">{course._count.lessons} دروس</span>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="block text-center mt-4 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition"
              >
                عرض الكورس
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
