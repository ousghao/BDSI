import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'ar', name: 'AR', flag: '🇲🇦' },
  ];

  return (
    <Select value={language} onValueChange={setLanguage} data-testid="select-language">
      <SelectTrigger className="w-20 bg-transparent border border-slate-300 dark:border-slate-600 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center space-x-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
