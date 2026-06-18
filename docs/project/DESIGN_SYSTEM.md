# FramePulse — Tasarım Sistemi

**Tasarım Yönü:** Art Gallery Minimalist  
**Farklılaşma:** StitchPulse'tan farklı — sol kenar navigasyon (üst nav yerine), keskin köşeler (4px), indigo-bronz paleti

## Renk Paleti

| Token | Light | Dark | Kullanım |
|-------|-------|------|----------|
| Primary | #141824 (indigo) | #f0ebe3 (ivory) | Başlıklar |
| Accent | #b8935e (bronze) | #c9a66b | CTA, aktif nav |
| Background | #f5f6f8 | #0d1018 | Sayfa arka planı |
| Success | #487a5a | #5a9470 | Müsait tezgah |
| Muted | #6b7280 | #9ca3af | İkincil metin |

## Tipografi

- **Display:** Cormorant Garamond 400/600/700 — galeri estetiği
- **Body:** Source Sans 3 400-700 — okunabilirlik

## Bileşen Dili

- `.gallery-card` — keskin köşeli kart, ince border
- `.gallery-btn` — köşeli buton, bronze vurgu
- `.bench-pill-*` — tezgah durum etiketleri
- Sol kenar navigasyon — `SideNav` bileşeni

## Spacing

4px taban: 4, 8, 12, 16, 24, 32, 48, 64

## Border Radius

- Kartlar: 4px (`--radius`)
- Butonlar: 4px
- Pill etiketler: 4px
