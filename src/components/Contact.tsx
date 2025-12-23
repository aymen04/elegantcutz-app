import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Navigation, Instagram, Facebook } from 'lucide-react';
import { businessHours, businessInfo } from '@/lib/data';

interface ContactProps {
  onBookClick: () => void;
}

export function Contact({ onBookClick }: ContactProps) {
  return (
    <section id="contact" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-amber-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Nous Trouver
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Horaires & Emplacement
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hours Card */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Heures d'Ouverture</h3>
              </div>

              <ul className="space-y-4">
                {businessHours.map((item) => (
                  <li
                    key={item.day}
                    className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                  >
                    <span className="text-white font-medium">{item.day}</span>
                    <span className={item.isOpen ? 'text-amber-500' : 'text-zinc-500'}>
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Note */}
              <p className="mt-6 text-sm text-zinc-500 italic">
                * Derniers rendez-vous acceptés 30 minutes avant la fermeture
              </p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Notre Adresse</h3>
              </div>

              {/* Address */}
              <div className="mb-6">
                <p className="text-zinc-300 text-lg">{businessInfo.address}</p>
               
              </div>

              {/* Map Placeholder */}
              <div className="relative aspect-video bg-zinc-800 rounded-lg mb-6 overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-amber-500/50 mx-auto mb-2" />
                    <p className="text-zinc-500">Cliquez pour ouvrir Google Maps</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
                <a
                 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                />
              </div>

              {/* Directions Button */}
              <Button
                asChild
                className="w-full bg-zinc-800 hover:bg-amber-500 text-white hover:text-zinc-950 font-medium transition-all duration-300"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=2152+Boul.+Lapini%C3%A8re+local+112%2C+Brossard%2C+Qu%C3%A9bec%2C+J4W+1L9`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Obtenir l'itinéraire
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Phone */}
          <a
            href={`tel:${businessInfo.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Phone className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Téléphone</p>
              <p className="text-white font-medium">{businessInfo.phone}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${businessInfo.email}`}
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Mail className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Email</p>
              <p className="text-white font-medium">{businessInfo.email}</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={`https://www.instagram.com/elegantcut_beautylounge/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Instagram className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Instagram</p>
              <p className="text-white font-medium">{businessInfo.instagram}</p>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/elegant.cutz.92`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <Facebook className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Facebook</p>
              <p className="text-white font-medium">{businessInfo.facebook}</p>
            </div>
          </a>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 rounded-2xl p-12 border border-amber-500/20">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt Pour Votre Transformation?
          </h3>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Réservez votre rendez-vous en quelques clics et découvrez l'expérience Elegant Cutz.
          </p>
          <Button
            onClick={onBookClick}
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wider uppercase px-10 py-7 text-base transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30"
          >
            Réserver Maintenant
          </Button>
        </div>
      </div>
    </section>
  );
}
