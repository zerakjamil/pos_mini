import React from 'react';
  import { useTranslation } from 'react-i18next';
  import { Button } from '@/components/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
  import { Globe } from 'lucide-react';
  import { useSidebar } from '@/components/ui/sidebar';

  export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);
    const { state } = useSidebar();

    const languages = [
      { code: 'kur', name: 'کوردی' },
      { code: 'en', name: 'English' }
    ];

    const changeLanguage = (language: string) => {
      i18n.changeLanguage(language);
    };

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-full flex justify-between items-center gap-2 px-2">
            <Globe className="h-4 w-4" />
            {state !== "collapsed" && (
              <span className="text-sm">{i18n.language === 'en' ? 'English' : 'کوردی'}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`${i18n.language === language.code ? 'bg-accent text-accent-foreground' : ''}`}
            >
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
