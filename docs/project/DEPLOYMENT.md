# FramePulse — Deployment

**Son Güncelleme:** 2026-06-18  
**Repo:** https://github.com/gorkemkyolai0666/stitchpulse-2  
**Not:** Repo yeniden adlandırma (stitchpulse-2 → framepulse) manuel olarak gerekli — GitHub API 403

## Deployment Durumu

| Bileşen | Durum |
|---------|-------|
| GitHub Repo | ✅ https://github.com/gorkemkyolai0666/stitchpulse-2 |
| CI Pipeline | ⏳ Push sonrası doğrulanacak |
| Railway Backend | ❌ RAILWAY_API_TOKEN agent ortamında mevcut değil |
| Vercel Frontend | ❌ GitHub entegrasyonu yapılandırılmamış |
| PostgreSQL | ❌ Railway provisioning bekliyor |

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@galleryframes.com |
| Şifre | demo123456 |

## Gerekli Ortam Değişkenleri

### Backend (Railway)
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — Vercel frontend URL (virgülle ayrılmış çoklu origin desteklenir)
- `PORT` — 4017 (varsayılan)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` — Railway backend `/api` URL

## Provisioning

```bash
npm run provision
```

Organization secrets gerekli: `GH_PAT`, `RAILWAY_API_TOKEN`, `VERCEL_TOKEN`

## Deployment URL'leri

| Servis | URL |
|--------|-----|
| Frontend | _Bekliyor — Vercel GitHub entegrasyonu_ |
| Backend | _Bekliyor — Railway GitHub entegrasyonu_ |
| Health | _Bekliyor — `{BACKEND_URL}/api/health`_ |

## Manuel Kurulum Adımları

1. Organization secrets yapılandır
2. Railway: repo bağla, root `backend/`, Wait for CI etkinleştir
3. Vercel: repo bağla, root `frontend/`
4. Ortam değişkenlerini ayarla
5. Smoke testleri çalıştır
