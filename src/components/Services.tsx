import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Sparkles, Scissors, Crown, Hand, Star, PlusCircle } from 'lucide-react';
import { services, type Service } from '@/lib/data';
import { AnimatedGradient } from './AnimatedGradient';

interface ServicesProps {
  onBookService: (service: Service) => void;
}

const categories = [
  { id: 'all', label: 'Tous', icon: Sparkles },
  { id: 'haircut', label: 'Coupes', icon: Scissors },
  { id: 'combo', label: 'Combos', icon: Scissors },
  { id: 'special', label: 'Spéciaux', icon: Star },
  { id: 'extra', label: 'Extra', icon: PlusCircle },
  { id: 'nails', label: 'Ongles', icon: Hand },
  { id: 'other', label: 'Autres', icon: Crown },
];

export function Services({ onBookService }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      
      {/* Animated Gradient Background */}
      <AnimatedGradient 
        className="absolute inset-0"
        speed={0.003}
        height="h-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Nos Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ce Que Nous Offrons
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Des services premium pour tous vos besoins de la coiffure à la barbier, aux ongles .
            
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="px-6 py-3 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-400 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 data-[state=active]:border-amber-500 transition-all duration-300 font-medium tracking-wide"
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <Card
              key={service.id}
              className="group bg-zinc-800/50 border-zinc-700/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6 relative">
                {/* Popular Badge */}
                {service.popular && (
                  <Badge className="absolute top-4 right-4 bg-amber-500 text-zinc-950 font-semibold">
                    Populaire
                  </Badge>
                )}

                {/* Category Icon */}
                <div className="w-14 h-14 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all duration-300">
                  {service.category === 'nails' ? (
                    <Hand className="w-6 h-6 text-amber-500" />
                  ) : service.category === 'special' || service.category === 'other' ? (
                    <Crown className="w-6 h-6 text-amber-500" />
                  ) : service.category === 'extra' ? (
                    <PlusCircle className="w-6 h-6 text-amber-500" />
                  ) : (
                    <Scissors className="w-6 h-6 text-amber-500" />
                  )}
                </div>

                {/* Service Info */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Duration & Price */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-amber-500">
                      ${service.price}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => onBookService(service)}
                  className="w-full bg-zinc-700 hover:bg-amber-500 text-white hover:text-zinc-950 font-medium transition-all duration-300"
                >
                  Réserver
                </Button>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
