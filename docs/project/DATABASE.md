# FramePulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| FramingShop | framing_shops | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| FramingOrder | framing_orders | Ders gelir kayıtları |
| EquipmentMaintenance | equipment_maintenance | Top makinesi bakım |
| QualityChecklist | quality_checklists | Kort bakım planı |
| MouldingOrder | moulding_orders | Kordon siparişleri |
| PricingTier | pricing_tiers | Tarife kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Gallery Frames & Fine Art (Phoenix, AZ)
- 1 demo kullanıcı: demo@galleryframes.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
