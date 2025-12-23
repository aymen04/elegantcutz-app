import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '@/lib/data';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Quote */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Quote className="w-96 h-96 text-amber-500/5" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Témoignages
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ce Que Disent Nos Clients
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <p className="text-zinc-400">
            Note moyenne de <span className="text-amber-500 font-semibold">5.0</span> sur Google
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative">
          <Card className="bg-zinc-800/50 border-zinc-700/50 overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 text-center px-4"
                    >
                      {/* Quote Icon */}
                      <Quote className="w-12 h-12 text-amber-500/30 mx-auto mb-6" />

                      {/* Text */}
                      <p className="text-xl sm:text-2xl text-white italic leading-relaxed mb-8 font-serif">
                        "{testimonial.text}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                          <span className="text-xl font-bold text-zinc-950">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div className="text-left">
                          <h4 className="text-white font-semibold">{testimonial.name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-amber-500 fill-amber-500"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-12 h-12 shadow-lg border border-zinc-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full w-12 h-12 shadow-lg border border-zinc-700"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-amber-500'
                  : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Google Review Link */}
        <div className="mt-12 text-center">
          <a
            href="https://g.page/elegantcutz/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Laissez-nous un avis sur Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
