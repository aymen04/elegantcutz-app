import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface HeaderProps {
  onBookClick: () => void;
  currentSection: string;
}

const navLinks = [
  { href: '#services', label: 'header.services' },
  { href: '#team', label: 'header.team' },
  { href: '#gallery', label: 'header.gallery' },
  { href: '#testimonials', label: 'header.testimonials' },
  { href: '#contact', label: 'header.contact' },
];

export function Header({ onBookClick, currentSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-amber-500/10'
          : 'bg-gradient-to-b from-zinc-950/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/logo.GIF"
              alt="Elegant Cutz"
              className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 py-2 ${
                  currentSection === link.href.slice(1)
                    ? 'text-amber-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t(link.label)}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-amber-500 transition-all duration-300 ${
                    currentSection === link.href.slice(1) ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              onClick={onBookClick}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold tracking-wider uppercase text-sm px-6 py-5 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
            >
              {t('header.book')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-80 bg-zinc-950 border-zinc-800 p-0"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                  <img
                    src="/logo.GIF"
                    alt="Elegant Cutz"
                    className="h-16 w-auto object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="w-full text-left text-lg font-medium text-zinc-300 hover:text-amber-500 py-3 px-4 rounded-lg hover:bg-zinc-900 transition-all duration-200"
                        >
                          {t(link.label)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 border-t border-zinc-800">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      onBookClick();
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold tracking-wider uppercase py-6"
                  >
                    Réserver Maintenant
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
