"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_LANGUAGES } from "@/lib/supabase/constants";

interface LanguageSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  maxLanguages: number;
  excludeLanguage?: string;
}

export function LanguageSelector({
  selected,
  onChange,
  maxLanguages,
  excludeLanguage,
}: LanguageSelectorProps) {
  const regions = [...new Set(SUPPORTED_LANGUAGES.map((l) => l.region))];

  function toggle(code: string) {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else if (selected.length < maxLanguages) {
      onChange([...selected, code]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Select target languages ({selected.length}/{maxLanguages})
        </p>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {regions.map((region) => (
        <div key={region}>
          <h4 className="text-sm font-medium mb-3">{region}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPPORTED_LANGUAGES.filter((l) => l.region === region)
              .filter((l) => l.code !== excludeLanguage)
              .map((lang) => {
                const isSelected = selected.includes(lang.code);
                const isDisabled =
                  !isSelected && selected.length >= maxLanguages;

                return (
                  <label
                    key={lang.code}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-accent"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => !isDisabled && toggle(lang.code)}
                      disabled={isDisabled}
                    />
                    <span>{lang.flag} {lang.name}</span>
                  </label>
                );
              })}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {selected.map((code) => (
            <Badge
              key={code}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggle(code)}
            >
              {SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag} {SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code}
              <span className="ml-1">&times;</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
