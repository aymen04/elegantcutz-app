import { Button } from '@/components/ui/button';
import { ChevronDown, Star, Clock, MapPin } from 'lucide-react';
import { businessInfo } from '@/lib/data';
import { useTranslation } from '@/hooks/useTranslation';

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  const { t } = useTranslation();
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-zinc-950">
        {/* Shop Image */}
        <img
          src="/magasin.webp"
          alt="Elegant Cutz Barbershop"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-zinc-950/90" />

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 mb-8 animate-fade-in-up">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-500 font-medium tracking-wider uppercase">
            Brossard, Québec
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 animate-fade-in-up animation-delay-100">
          <span className="text-white block">{t('hero.title')}</span>
          <span className="text-amber-500 italic font-serif block mt-2">
            {t('hero.subtitle')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
          Elegant Cut Barber Shop – Plus de 10 ans d’excellence-<br></br>

Depuis plus de dix ans, Elegant Cut Barber Shop s’engage à offrir des coupes et des services de soins de haute qualité. Avec une passion pour la précision et le style, nous avons bâti une réputation d’excellence, alliant techniques classiques et tendances modernes pour garantir à chaque client une allure impeccable.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 animate-fade-in-up animation-delay-300">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-white font-semibold">{businessInfo.googleRating}</span>
            <span className="text-zinc-500">{t('sur Google')}</span>
          </div>
          <div className="w-px h-6 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{businessInfo.totalClients.toLocaleString()}+</span>
            <span className="text-zinc-500">{t('avis')}</span>
          </div>
          <div className="w-px h-6 bg-zinc-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
             <span className="text-zinc-500">{t('Lundi-Samedi')}</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Button
            onClick={onBookClick}
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wider uppercase text-base px-10 py-7 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
          >
            {t('hero.bookNow')}
          </Button>
          <Button
            onClick={scrollToServices}
            variant="outline"
            size="lg"
            className="border-zinc-700 text-white hover:bg-zinc-800 hover:border-amber-500/50 font-medium tracking-wider uppercase text-base px-10 py-7"
          >
            {t('hero.discoverServices')}
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in animation-delay-500">
        <span className="text-xs text-zinc-500 tracking-[0.3em] uppercase">
          Défiler
        </span>
        <div className="w-px h-16 bg-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-500 to-transparent animate-scroll-line" />
        </div>
        <ChevronDown className="w-5 h-5 text-zinc-600 animate-bounce" />
      </div>

      <style>{`
        @keyframes patternMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(141px); }
        }
        
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </section>
  );
}
