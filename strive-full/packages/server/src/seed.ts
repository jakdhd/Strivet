import prisma from './config/database';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@strive.com' },
    update: {},
    create: { email: 'admin@strive.com', name: 'Admin', password: hashed },
  });

  const courses = [
    { title: 'مقدمة في التداول', description: 'أساسيات التداول للمبتدئين', price: 0, currency: 'SAR', level: 'beginner', order: 1 },
    { title: 'التحليل الفني', description: 'تعلم قراءة الشارت والمؤشرات', price: 199, currency: 'SAR', level: 'intermediate', order: 2 },
    { title: 'إدارة رأس المال', description: 'كيف تدير مخاطرك وتحمي رأس مالك', price: 299, currency: 'SAR', level: 'advanced', order: 3 },
  ];

  for (const c of courses) {
    await prisma.course.create({ data: c });
  }

  console.log('Seed completed!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
