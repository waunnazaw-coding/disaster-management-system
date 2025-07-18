import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

const languages = [
  { code: "en", name: "English" },
  { code: "my", name: "Myanmar" },
];

export default function LanguageMenu({
  className = "",
  menuClassName = "",
  direction = "right",
}: {
  className?: string;
  menuClassName?: string;
  direction?: "right" | "left";
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof MouseEvent) {
        if (open && menuRef.current && !menuRef.current.contains(e.target as Node))
          setOpen(false);
      }
      if (e instanceof KeyboardEvent && open && e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [open]);

  const langCode = i18n.language || "en";
  const currentLanguage = langCode.startsWith("my") ? "my" : "en";
  const currentLanguageName = languages.find((l) => l.code === currentLanguage)?.name || "English";

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language Selector"
        className="flex items-center gap-1.5 text-white/90  hover:bg-blue-800/50
        hover:text-white
        focus-visible:ring-2 focus-visible:ring-sky-300 transition font-medium"
      >
        <Globe className="h-5 w-5 text-white/90 group-hover:text-white" />
        <span className="hidden sm:inline">{currentLanguageName}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <ul
          tabIndex={-1}
          role="menu"
          className={`absolute ${direction}-0 mt-2 w-44 rounded-xl shadow-2xl bg-white/95 text-gray-800 border border-gray-100/70 ring-1 ring-sky-100 z-50
            transition-all duration-150 ease-out
            ${menuClassName}`}
        >
          {languages.map((lang) => {
            const isActive = currentLanguage === lang.code;
            return (
              <li key={lang.code} role="none">
                <button
                  role="menuitemradio"
                  aria-checked={isActive}
                  className={`flex items-center justify-between w-full px-4 py-2 text-base rounded-lg
                    transition
                    focus-visible:bg-sky-50 focus-visible:outline-none
                    ${isActive ? "bg-sky-100 text-sky-900 font-semibold" : "hover:bg-white/90 text-gray-800"}`}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setOpen(false);
                  }}
                >
                  <span>{lang.name}</span>
                  {isActive && (
                    <svg
                      className="h-4 w-4 text-sky-500 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
