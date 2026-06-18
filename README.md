# FramePulse

Özel çerçeve atölyesi operasyon yönetimi B2B SaaS platformu.

## Stack

- **Backend:** NestJS, Prisma, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Deployment:** Railway (backend) + Vercel (frontend)

## Demo

- E-posta: demo@galleryframes.com
- Şifre: demo123456

## Geliştirme

```bash
# Backend
cd backend && npm ci && npm run db:migrate && npm run db:seed && npm run start:dev

# Frontend
cd frontend && npm ci && npm run dev
```

## Provisioning

```bash
npm run provision
```

## Dokümantasyon

- [PRD](docs/project/PRD.md)
- [Deployment](docs/project/DEPLOYMENT.md)
- [Design System](docs/project/DESIGN_SYSTEM.md)
