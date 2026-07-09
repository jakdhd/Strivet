import { Router, Request, Response } from 'express';
import prisma from '../../config/database';
import { authMiddleware, AuthRequest } from '../../common/middleware';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const contact = await prisma.contact.create({ data: req.body });
    return res.status(201).json(contact);
  } catch (err) {
    console.error('Create contact error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const contact = await prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });
    return res.json(contact);
  } catch (err) {
    console.error('Mark read error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
