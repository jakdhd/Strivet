# Strive - منصة تعليم التداول

## هيكل المشروع

```
strive/
├── packages/
│   ├── server/     # Backend API (Express + Prisma)
│   ├── web/        # Frontend (Next.js + Tailwind)
│   └── bot/        # Telegram Bot (Telegraf.js)
├── docker-compose.yml
└── package.json
```

## التشغيل محلياً

### 1. المتطلبات

- Node.js 18+
- Docker (لـ PostgreSQL + Redis)

### 2. تشغيل قواعد البيانات

```bash
docker compose up -d
```

### 3. إعداد المتغيرات

انسخ ملفات `.env.example` إلى `.env` في كل package وعدّل القيم.

### 4. تشغيل المشروع

```bash
# تثبيت الاعتماديات
npm install

# إنشاء جداول قاعدة البيانات
npm run db:push -w packages/server

# تشغيل البذور (admin)
npm run seed -w packages/server

# تشغيل جميع الخدمات في وقت واحد
npm run dev

# أو تشغيل كل خدمة على حدة:
npm run server   # http://localhost:4000
npm run web      # http://localhost:3000
npm run bot      # بوت تليجرام
```

### 5. الدخول للوحة التحكم

- الرابط: http://localhost:3000/admin/login
- البريد: admin@strive.com
- كلمة المرور: admin123

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | - | تسجيل دخول الأدمن |
| GET | /api/auth/me | ✓ | معلومات الأدمن |
| GET | /api/courses | - | قائمة الكورسات النشطة |
| GET | /api/courses/all | ✓ | جميع الكورسات |
| GET | /api/courses/:id | - | تفاصيل كورس |
| POST | /api/courses | ✓ | إضافة كورس |
| PUT | /api/courses/:id | ✓ | تعديل كورس |
| DELETE | /api/courses/:id | ✓ | حذف كورس |
| POST | /api/contacts | - | إرسال رسالة |
| GET | /api/contacts | ✓ | عرض الرسائل |
| PUT | /api/contacts/:id/read | ✓ | تحديد مقروء |
| GET | /api/settings | - | إعدادات الموقع |
| PUT | /api/settings | ✓ | تحديث الإعدادات |
