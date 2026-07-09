import { Telegraf, Markup } from 'telegraf';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const API_URL = process.env.API_URL || 'http://localhost:4000/api';

if (!token || token === 'your-telegram-bot-token-here') {
  console.error('Please set TELEGRAM_BOT_TOKEN in .env');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'عزيزي';
  let welcome = `مرحباً ${name}! 👋\n\nأهلاً بك في بوت *Strive* التعليمي.\n\nاختر من القائمة أدناه:`;
  try {
    const res = await fetch(`${API_URL}/settings`);
    const s = await res.json() as Record<string, string>;
    if (s.bot_welcome) welcome = s.bot_welcome.replace('{name}', name);
  } catch {}
  await ctx.reply(welcome, Markup.keyboard([
    ['📚 عرض الكورسات', '🌐 زيارة الموقع'],
    ['📞 التواصل مع المدرب', 'ℹ️ عن المنصة'],
  ]).resize());
});

bot.hears('📚 عرض الكورسات', async (ctx) => {
  try {
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error('API error');
    const courses = await res.json() as any[];

    if (courses.length === 0) {
      return ctx.reply('لا توجد كورسات متاحة حالياً');
    }

    let msg = '*الكورسات المتاحة:*\n\n';
    courses.forEach((c: any, i: number) => {
      const price = c.price === 0 ? 'مجاني' : `${c.price} ${c.currency || 'ريال'}`;
      const level = c.level === 'beginner' ? 'مبتدئ' : c.level === 'intermediate' ? 'متوسط' : 'متقدم';
      msg += `${i + 1}. *${c.title}*\n`;
      msg += `   المستوى: ${level} | السعر: ${price}\n\n`;
    });

    msg += 'للتواصل والاشتراك: /contact';

    await ctx.reply(msg, { parse_mode: 'Markdown' });
  } catch (err) {
    await ctx.reply('عذراً، حدث خطأ في تحميل الكورسات');
  }
});

bot.hears('🌐 زيارة الموقع', async (ctx) => {
  await ctx.reply(
    'يمكنك زيارة الموقع عبر الرابط التالي:',
    Markup.inlineKeyboard([Markup.button.url('🔗 Strive', 'http://localhost:3000')])
  );
});

bot.hears('📞 التواصل مع المدرب', async (ctx) => {
  await ctx.reply(
    '📢 تابع قناة Strive الرسمية:\n\n' +
    'https://t.me/Strive108\n\n' +
    'لمتابعة أحدث الكورسات والدروس.',
    Markup.inlineKeyboard([Markup.button.url('📢 القناة', 'https://t.me/Strive108')])
  );
});

bot.hears('ℹ️ عن المنصة', async (ctx) => {
  let about = '*Strive* هي منصة تعليمية متخصصة في مجال التداول.\n\nنقدم كورسات احترافية في التحليل الفني والأساسي وإدارة رأس المال.';
  try {
    const res = await fetch(`${API_URL}/settings`);
    const s = await res.json() as Record<string, string>;
    if (s.about_text) about = s.about_text;
  } catch {}
  await ctx.reply(about);
});

bot.command('contact', async (ctx) => {
  await ctx.reply(
    'أرسل رسالتك وسنرد عليك في أقرب وقت:\n\n' +
    'يمكنك كتابة أي استفسار وسيتم إرساله للإدارة.'
  );
});

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  const name = ctx.from.first_name || 'مستخدم';
  const username = ctx.from.username || 'لا يوجد';

  await ctx.reply(
    `شكراً لك ${name}! تم استلام رسالتك ✅\n\nسنتواصل معك قريباً.`
  );

  console.log(`[Bot Message] From: ${name} (@${username}) | ${ctx.message.text}`);
});

async function notifyNewCourse(course: { title: string; description: string; price: number; currency?: string }) {
  try {
    const res = await fetch(`${API_URL}/settings`);
    const settings = await res.json() as Record<string, string>;
    const chatIds = settings.telegram_chat_ids;

    if (!chatIds) return;

    const ids = chatIds.split(',');
    const price = course.price === 0 ? 'مجاني' : `${course.price} ${course.currency || 'ريال'}`;

    const message =
      `🎉 *كورس جديد!*\n\n` +
      `*${course.title}*\n` +
      `${course.description}\n\n` +
      `💰 السعر: ${price}\n\n` +
      `📞 للاشتراك: /contact`;

    for (const chatId of ids) {
      try {
        await bot.telegram.sendMessage(chatId.trim(), message, { parse_mode: 'Markdown' });
      } catch {}
    }
  } catch {}
}

export { notifyNewCourse };

bot.launch().then(() => {
  console.log('🤖 Strive Bot is running!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
