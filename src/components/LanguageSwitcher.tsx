"use client";

import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
    { code: 'np', label: 'नग' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
      <Languages className="w-4 h-4 ml-2 text-green-700" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          variant={language === lang.code ? 'default' : 'ghost'}
          size="sm"
          className={`rounded-full h-8 px-3 text-sm font-semibold transition-all ${
            language === lang.code
              ? 'bg-green-600 text-white shadow-md'
              : 'text-green-800 hover:bg-green-100'
          }`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}
