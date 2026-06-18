import Link from 'next/link';
import { Frame, ClipboardList, Wrench, CheckSquare, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Frame,
    title: 'Tezgah Envanteri',
    description: 'Standart, müze kalitesi, gölge kutu ve tuval germe tezgahlarınızı bölge bazında takip edin.',
  },
  {
    icon: ClipboardList,
    title: 'Çerçeveleme Siparişleri',
    description: 'Günlük gelir, parça sayısı ve acil sipariş ücretlerini tek panelden izleyin.',
  },
  {
    icon: Wrench,
    title: 'Ekipman Bakımı',
    description: 'Mat kesici, profil kesici ve cam istasyonu arızalarını öncelik sırasıyla yönetin.',
  },
  {
    icon: CheckSquare,
    title: 'Kalite Kontrol Listeleri',
    description: 'Cam kontrolü, köşe birleşimi ve paspartu hizası planlarını takip edin.',
  },
  {
    icon: Package,
    title: 'Profil Siparişleri',
    description: 'Müşteri profil siparişlerini tedarikçi ve durum bazında yönetin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card gallery-nav-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-accent/40 bg-background">
              <Frame className="h-5 w-5 text-accent" strokeWidth={1.75} />
            </div>
            <span className="font-display text-2xl text-primary">FramePulse</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="gallery-btn bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-secondary/40 via-background to-accent/5">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--success)) 0, transparent 40%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Özel Çerçeve Atölyesi Operasyon Yönetimi
            </p>
            <h1 className="font-display max-w-2xl text-4xl leading-tight text-primary md:text-5xl">
              Atölyenizi, çerçeveleme siparişlerinizi ve müşteri teslimatlarınızı tek platformda yönetin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bağımsız çerçeve atölyeleri için tezgah envanteri, sipariş takibi, ekipman bakımı,
              kalite kontrol listeleri, profil siparişleri ve fiyatlandırma yönetimi.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gallery-btn">
                <Link href="/register">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-sm">
                <Link href="/login">Demo Hesabıyla Giriş</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Demo: demo@galleryframes.com / demo123456
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display mb-8 text-2xl text-primary">Özellikler</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="gallery-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
