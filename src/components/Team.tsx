import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { barbers, type Barber } from '@/lib/data';
import { InteractiveBackground } from './InteractiveBackground';

interface TeamProps {
  onSelectBarber: (barber: Barber) => void;
}

export function Team({ onSelectBarber }: TeamProps) {
  return (
    <section id="team" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Interactive Background */}
      <InteractiveBackground />

      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Notre Équipe
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Nos Barbiers Experts
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Une équipe passionnée et expérimentée, dédiée à sublimer votre style.
            Choisissez votre barbier préféré.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber, index) => (
            <Card
              key={barber.id}
              className="group bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-zinc-800 overflow-hidden">
                {/* Barber Photo */}
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Badge */}
                {index === 0 && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-zinc-950 font-semibold gap-1">
                    <Award className="w-3 h-3" />
                    Propriétaire
                  </Badge>
                )}

                {/* Quick Stats */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-zinc-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-white font-semibold text-sm">{barber.rating}</span>
                    <span className="text-zinc-400 text-sm">({barber.reviews})</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
                  {barber.name}
                </h3>
                <p className="text-amber-500/80 text-sm mb-4">{barber.role}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {barber.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => onSelectBarber(barber)}
                  className="w-full bg-zinc-800 hover:bg-amber-500 text-white hover:text-zinc-950 font-medium transition-all duration-300"
                >
                  Réserver avec {barber.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

