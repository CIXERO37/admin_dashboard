"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, type Locale } from "@/lib/i18n";

interface Language {
  code: Locale;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "id", name: "Indonesia" },
];

// Flag SVG Components
function USFlag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd">
        <g strokeWidth="1pt">
          <path
            fill="#bd3d44"
            d="M0 0h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8V197H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8V512H0z"
            transform="scale(.9375 .9377)"
          />
          <path
            fill="#fff"
            d="M0 39.4h972.8v39.4H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0z"
            transform="scale(.9375 .9377)"
          />
        </g>
        <path
          fill="#192f5d"
          d="M0 0h389.1v275.7H0z"
          transform="scale(.9375 .9377)"
        />
      </g>
      <path
        fill="#fff"
        d="M32.4 11.8 36 22.6H47l-9 6.6 3.4 10.7-9-6.5-9 6.5 3.4-10.7-9-6.6h11.1zm64.9 0 3.5 10.8h11l-9 6.6 3.5 10.7-9-6.5-9 6.5 3.4-10.7-9-6.6h11zm64.8 0 3.5 10.8h11l-9 6.6 3.5 10.7-9-6.5-9 6.5 3.4-10.7-9-6.6h11.1zm64.9 0 3.5 10.8h11l-9 6.6 3.4 10.7-9-6.5-9 6.5 3.5-10.7-9-6.6h11zm64.8 0 3.5 10.8h11l-9 6.6 3.5 10.7-9-6.5-9 6.5 3.4-10.7-9-6.6H262zm64.9 0 3.5 10.8h11l-9 6.6L330 40l-9-6.5-9 6.5 3.5-10.7-9-6.6h11z"
        transform="scale(.9375 .9377)"
      />
    </svg>
  );
}

function IDFlag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#e70011" d="M0 0h640v240H0z" />
        <path fill="#fff" d="M0 240h640v240H0z" />
      </g>
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const FlagIcon = locale === "en" ? USFlag : IDFlag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-secondary"
          suppressHydrationWarning
        >
          <div className="flex items-center gap-1">
            <FlagIcon className="h-4 w-6 rounded-sm overflow-hidden" />
          </div>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 bg-popover border-border"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer flex items-center gap-3 ${
              locale === language.code
                ? "bg-primary/10 text-primary"
                : "text-foreground"
            }`}
          >
            {language.code === "en" ? (
              <USFlag className="h-4 w-6 rounded-sm" />
            ) : (
              <IDFlag className="h-4 w-6 rounded-sm" />
            )}
            <span>{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
