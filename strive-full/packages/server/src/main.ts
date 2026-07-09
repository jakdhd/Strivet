import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './common/middleware';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import contactsRoutes from './modules/contacts/contacts.routes';
import settingsRoutes from './modules/settings/settings.routes';
import uploadRoutes from './modules/upload/upload.routes';
import prisma from './config/database';
import bcrypt from 'bcryptjs';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use(errorHandler);

async function seedAdmin() {
  const existing = await prisma.admin.findUnique({ where: { email: config.adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash(config.adminPassword, 10);
    await prisma.admin.create({
      data: { email: config.adminEmail, name: 'Admin', password: hashed },
    });
    console.log('Admin seeded:', config.adminEmail);
  }
}

async function bootstrap() {
  await prisma.$connect();
  await seedAdmin();

  app.listen(config.port, () => {
    console.log(`Strive API running on http://localhost:${config.port}`);
  });
}

bootstrap().catch(console.error);
