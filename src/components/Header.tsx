
import React, { useState, useEffect } from 'react';
import { Search, Wand2, Github, Moon, Sun, Languages, Upload, ChevronDown } from 'lucide-react';
import { Language, translations } from '../translations';
import { MODEL_CATEGORIES } from '../constants';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  selectedModelCategory?: string | null;
  onSelectModelCategory?: (category: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, isDarkMode, toggleTheme, lang, setLang, selectedModelCategory, onSelectModelCategory }) => {
  const t = translations[lang];
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header if scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Hide header if scrolling down and not at top
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const handleModelCategoryChange = (category: string | null) => {
    if (onSelectModelCategory) {
      onSelectModelCategory(category);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-dark-bg/80 border-b border-gray-200 dark:border-slate-800 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-dark-bg/60 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Wand2 size={18} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 hidden sm:block">
            {t.appName}
          </span>
        </div>

        {/* Model Categories Navigation */}
        {onSelectModelCategory && (
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
              <button
                onClick={() => handleModelCategoryChange(null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  !selectedModelCategory
                    ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.allModels}
              </button>
              {Object.entries(MODEL_CATEGORIES).map(([category, models]) => (
                <button
                  key={category}
                  onClick={() => handleModelCategoryChange(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedModelCategory === category
                      ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Submit Button - Hidden on Mobile */}
          <a
            href="https://tcn1uh5rxo87.feishu.cn/share/base/form/shrcne5gDolOMDd0oJsj2XfvxQc"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Upload size={14} />
            {t.submitBtn}
          </a>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1"
            title="Switch Language"
          >
            <Languages size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={t.themeToggle}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/junxiaopang/image-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:flex items-center justify-center"
            title={t.githubTitle}
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;