import { Scissors, Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { businessInfo } from '@/lib/data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-amber-500/50 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-amber-500">Elegant</span>
                <span className="text-white">Cutz</span>
              </span>
            </a>
            <p className="text-zinc-500 leading-relaxed mb-6">
              Votre destination premium pour des coupes de cheveux impeccables 
              et un service professionnel à Brossard.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${businessInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://facebook.com/${businessInfo.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${businessInfo.email}`}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`tel:${businessInfo.phone.replace(/[^0-9]/g, '')}`}
                className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {['Services', 'Équipe', 'Galerie', 'Avis', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace('é', 'e')}`}
                    className="text-zinc-500 hover:text-amber-500 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {['Coupe Classique', 'Fade / Dégradé', 'Taille de Barbe', 'Forfait Complet', 'Hair Design'].map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    className="text-zinc-500 hover:text-amber-500 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 text-zinc-500">
              <li>{businessInfo.address}</li>
            
              <li className="pt-2">
                <a
                  href={`tel:${businessInfo.phone.replace(/[^0-9]/g, '')}`}
                  className="hover:text-amber-500 transition-colors"
                >
                  {businessInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="hover:text-amber-500 transition-colors"
                >
                  {businessInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">
            © {currentYear} {businessInfo.name}. Tous droits réservés.<a href="mailto:acreator.websites@gmail.com"> ACreator</a>
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
