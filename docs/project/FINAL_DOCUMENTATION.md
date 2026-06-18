# FramePulse — Final Documentation

**Proje:** FramePulse  
**Repo:** https://github.com/gorkemkyolai0666/stitchpulse-2  
**Tamamlanma:** 2026-06-18  
**Durum:** MVP Tamamlandı — Deploy Bekliyor

## Özet

Özel çerçeve atölyeleri için operasyon yönetim SaaS platformu. NestJS + Prisma + PostgreSQL backend, Next.js + Tailwind + shadcn/ui frontend.

## API Modülleri

| Modül | Endpoint | Açıklama |
|-------|----------|----------|
| FramingShop | /api/framing-shop | Atölye profili |
| WorkBenches | /api/work-benches | Tezgah envanteri |
| FramingOrders | /api/framing-orders | Çerçeveleme siparişleri |
| EquipmentMaintenance | /api/equipment-maintenance | Ekipman bakımı |
| QualityChecklists | /api/quality-checklists | Kalite kontrol |
| MouldingOrders | /api/moulding-orders | Profil siparişleri |
| PricingTiers | /api/pricing-tiers | Fiyatlandırma |
| Dashboard | /api/dashboard/stats | Operasyon paneli |
| Health | /api/health | Sağlık kontrolü |

## Demo

- E-posta: demo@galleryframes.com
- Şifre: demo123456

## Teknik Kararlar

1. StitchPulse fork + domain transform — hızlı MVP üretimi
2. Sol kenar navigasyon — StitchPulse üst nav'dan farklılaşma
3. Art Gallery Minimalist tasarım — indigo-bronz-krem paleti
4. Railway backend + Vercel frontend — standart deployment mimarisi

## Deployment Engelleyiciler

- RAILWAY_API_TOKEN agent ortamında mevcut değil
- Vercel/Railway GitHub native integration yapılandırılmamış
- Repo rename API 403 — stitchpulse-2 → framepulse manuel gerekli
