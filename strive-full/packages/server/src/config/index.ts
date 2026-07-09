export const config = {
  port: parseInt(process.env.PORT || '4000'),
  jwtSecret: process.env.JWT_SECRET || 'strive-secret',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@strive.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
