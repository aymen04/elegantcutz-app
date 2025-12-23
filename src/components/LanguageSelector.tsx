import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

type Language = 'fr' | 'en';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const languages = [
  {
    code: 'fr' as Language,
    name: 'Français',
    flag: '🇫🇷',
    description: 'Continuer en français'
  },
  {
    code: 'en' as Language,
    name: 'English',
    flag: '🇬🇧', 
    description: 'Continue in English'
  }
];

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if language has already been selected
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (!savedLanguage) {
      // Show language selector after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (language: Language) => {
    localStorage.setItem('selectedLanguage', language);
    onLanguageSelect(language);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-amber-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            Bienvenue / Welcome
          </DialogTitle>
          <p className="text-zinc-400 text-sm">
            Choisissez votre langue / Choose your language
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex flex-col items-center gap-3 h-24 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 transition-all duration-300"
              variant="outline"
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="text-center">
                <div className="font-semibold text-white">{lang.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{lang.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-zinc-500">
            Cette sélection sera mémorisée pour vos prochaines visites
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
