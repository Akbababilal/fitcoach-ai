import Link from 'next/link'
import { Dumbbell, Utensils, Bot, Scale, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Utensils,
    title: 'Akıllı Beslenme Takibi',
    desc: 'Öğünlerinizi kolayca kaydedin, kalori ve makrolarınızı anlık takip edin.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Dumbbell,
    title: 'AI Antrenman Planı',
    desc: 'Hedeflerinize ve tecrübenize özel haftalık antrenman programları.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Bot,
    title: 'Kişisel AI Koç',
    desc: '7/24 sorularınızı yanıtlayan, verilerinizi analiz eden fitness koçunuz.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Scale,
    title: 'Kilo Takibi',
    desc: 'Kilo değişiminizi grafiklerle izleyin, hedefinize ulaşma yolculuğunuzu takip edin.',
    color: 'bg-orange-100 text-orange-600',
  },
]

const benefits = [
  'Türkçe & İngilizce destek',
  'Kişiselleştirilmiş kalori ve makro hesaplama',
  'Gemini AI destekli koçluk',
  'Mobil uyumlu tasarım',
  'Tamamen ücretsiz başlayın',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">FitCoach AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link href="/register">
            <Button>Ücretsiz Başla</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-20 text-center">
        <Badge variant="secondary" className="mb-6 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
          Gemini AI Destekli
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          AI Destekli{' '}
          <span className="text-primary">Fitness Koçun</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Kişiselleştirilmiş beslenme planları, akıllı antrenman programları
          ve gerçek zamanlı AI koçluk ile hedeflerine ulaş.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-base px-8 gap-2">
              Ücretsiz Başla
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-base px-8">
              Hesabım Var
            </Button>
          </Link>
        </div>

        {/* Benefits list */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Her İhtiyacın İçin
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Fitness yolculuğunun her adımında yanında.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="hover:shadow-md transition-shadow border-0 shadow-sm"
            >
              <CardContent className="p-6">
                <div className={`inline-flex rounded-xl p-3 mb-4 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Bugün Başla, Ücretsiz
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Kredi kartı gerekmez. Hemen kaydol ve AI destekli fitness koçunla tanış.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-10 gap-2 bg-white text-primary hover:bg-white/90"
              >
                Ücretsiz Kayıt Ol
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 pb-8 text-center text-sm text-muted-foreground border-t border-border pt-8">
        <p>© 2025 FitCoach AI. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
