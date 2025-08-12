import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇲🇦" },
];

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState("fr");

  return (
    <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
      <SelectTrigger 
        className="w-24 border-slate-300 dark:border-slate-600 bg-transparent"
        data-testid="language-selector"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} data-testid={`language-option-${lang.code}`}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.code.toUpperCase()}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
