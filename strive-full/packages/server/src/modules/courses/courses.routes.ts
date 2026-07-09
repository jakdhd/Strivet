import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { authMiddleware, AuthRequest } from '../../common/middleware';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { lessons: true } } },
    });
    return res.json(courses);
  } catch (err) {
    console.error('Get courses error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/all', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { lessons: true } } },
    });
    return res.json(courses);
  } catch (err) {
    console.error('Get all courses error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.json(course);
  } catch (err) {
    console.error('Get course error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function notifyBot(course: { title: string; description: string; price: number; currency?: string }) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return;

    const subscribers = await prisma.telegramUser.findMany({ where: { isSubscribed: true } });
    if (subscribers.length === 0) return;

    const curr = course.currency || 'ريال';
    const price = course.price === 0 ? 'مجاني' : `${course.price} ${curr}`;
    const message = `🎉 *كورس جديد!*\n\n*${course.title}*\n${course.description}\n💰 السعر: ${price}\n\nللاشتراك تواصل معنا على الموقع`;

    for (const user of subscribers) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: user.chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch {}
    }
  } catch {}
}

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    notifyBot(course);
    return res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.update({
      where: { id },
      data: req.body,
    });
    return res.json(course);
  } catch (err) {
    console.error('Update course error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.course.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete course error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
