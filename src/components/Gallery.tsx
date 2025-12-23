import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InteractiveBackground } from './InteractiveBackground';

const galleryItems = [
  { id: 1, title: 'Skin Fade', category: 'Fade', placeholder: '✂️', image: '/coupe.webp' },
  { id: 2, title: 'Coupe Classique', category: 'Classic', placeholder: '💈', image: '/coupe1.webp' },
  { id: 3, title: 'Hair Design', category: 'Design', placeholder: '🎨', image: '/coupe3.webp' },
  { id: 4, title: 'Style Moderne', category: 'Tendance', placeholder: '⚡', image: '/coupeenfant.webp' },
  { id: 5, title: 'Forfait Complet', category: 'Premium', placeholder: '👑', image: '/combo.webp' }, 
];

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryItems.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryItems.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Interactive Background */}
      <InteractiveBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Notre Travail
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Galerie
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Découvrez nos réalisations. Chaque coupe raconte une histoire de style et de précision.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg bg-zinc-900 transition-all duration-500 hover:-translate-y-2 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ aspectRatio: index === 0 ? '1' : '1' }}
            >
              {/* Image or Placeholder Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className={`${index === 0 ? 'text-8xl' : 'text-4xl'} opacity-30`}>
                    {item.placeholder}
                  </span>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-white font-bold text-lg">{item.title}</h4>
                <p className="text-amber-500 text-sm">{item.category}</p>
              </div>

              {/* Zoom Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/elegantcut_beautylounge/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-medium tracking-wide">Suivez-nous sur Instagram</span>
            <span className="text-amber-500">@elegantcut_beautylounge</span>
          </a>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 p-0">
          {selectedIndex !== null && (
            <div className="relative">
              {/* Image Container */}
              <div className="aspect-square bg-zinc-900 flex items-center justify-center">
                {galleryItems[selectedIndex].image ? (
                  <img 
                    src={galleryItems[selectedIndex].image} 
                    alt={galleryItems[selectedIndex].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl opacity-30">
                    {galleryItems[selectedIndex].placeholder}
                  </span>
                )}
              </div>

              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 to-transparent">
                <h4 className="text-white font-bold text-xl">
                  {galleryItems[selectedIndex].title}
                </h4>
                <p className="text-amber-500">{galleryItems[selectedIndex].category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
