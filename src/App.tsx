import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Team } from '@/components/Team';
import { Gallery } from '@/components/Gallery';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CustomCursor } from '@/components/CustomCursor';
import { Toaster } from '@/components/ui/sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { type Service, type Barber } from '@/lib/data';
import { useBookingStore } from '@/lib/store';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);
  const [preSelectedBarber, setPreSelectedBarber] = useState<Barber | null>(null);
  const [currentSection, setCurrentSection] = useState('');
  const { changeLanguage } = useTranslation();
  const { reset } = useBookingStore();
  useEffect(() => {
    const sections = ['services', 'team', 'gallery', 'testimonials', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const openBooking = (service?: Service, barber?: Barber) => {
    reset();
    setPreSelectedService(service || null);
    setPreSelectedBarber(barber || null);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setPreSelectedService(null);
    setPreSelectedBarber(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white md:cursor-none">
      <CustomCursor />

      <Header
        onBookClick={() => openBooking()}
        currentSection={currentSection}
      />
      
      <main>
        <Hero onBookClick={() => openBooking()} />
        
        <Services onBookService={(service) => openBooking(service)} />
        
        <Team onSelectBarber={(barber) => openBooking(undefined, barber)} />
        
        <Gallery />
        
        <Testimonials />
        
        <Contact onBookClick={() => openBooking()} />
      </main>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        preSelectedService={preSelectedService}
        preSelectedBarber={preSelectedBarber}
      />

      <LanguageSelector onLanguageSelect={changeLanguage} />

      <Toaster />

      {/* Global Styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        ::selection {
          background: rgba(245, 158, 11, 0.3);
          color: white;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #18181b;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
