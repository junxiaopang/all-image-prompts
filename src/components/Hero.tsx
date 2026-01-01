import React, { useEffect, useState } from 'react';
import { Search, Database, Sparkles, QrCode } from 'lucide-react';
import { Language, translations } from '../translations';

interface HeroProps {
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ totalCount, searchTerm, setSearchTerm, lang }) => {
  const t = translations[lang];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-white to-gray-50 dark:from-slate-900 dark:via-slate-900 dark:to-[#0f172a] transition-colors duration-500">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs - Adjusted positions for more compact layout */}
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[120%] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl opacity-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : ''}`} />
        <div className={`absolute top-[20%] -right-[10%] w-[40%] h-[100%] rounded-full bg-gradient-to-bl from-blue-500/10 via-cyan-400/10 to-transparent blur-3xl opacity-0 transition-opacity duration-1000 delay-300 ${mounted ? 'opacity-100' : ''}`} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Content Area */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            
            {/* Badge & Title */}
            <div className="space-y-3">
              <div className={`transform transition-all duration-700 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-sm group hover:scale-105 transition-transform cursor-default">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 uppercase tracking-wider">
                    {t.heroBadge}
                  </span>
                </div>
              </div>

              <h1 className={`text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] transform transition-all duration-700 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {t.heroTitle}
                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                  {t.heroTitleSuffix}
                </span>
              </h1>
              
              <p className={`text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed transform transition-all duration-700 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {t.heroDescription}
              </p>
            </div>

            {/* Search Section */}
            <div className={`w-full max-w-xl relative group transform transition-all duration-700 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500 group-focus-within:opacity-50" />
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-lg shadow-xl p-1.5 transition-all border border-transparent dark:border-slate-800">
                <div className="pl-3 pr-2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Search size={20} />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent border-none focus:ring-0 outline-none text-base py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                />
                <div className="hidden sm:flex items-center gap-3 pr-2 pl-2 border-l border-slate-100 dark:border-slate-800 ml-2">
                   <div className="flex flex-col items-end leading-none min-w-[70px]">
                      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">{t.collectedCountLabel}</span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {totalCount > 0 ? totalCount.toLocaleString() : '---'}
                      </span>
                   </div>
                   <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md text-slate-400 dark:text-slate-500">
                      <Database size={16} />
                   </div>
                </div>
              </div>
              <div className="sm:hidden mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Sparkles size={12} className="text-primary" />
                <span>{totalCount.toLocaleString()} {t.collectedCountLabel}</span>
              </div>
            </div>
          </div>

          {/* Right/Bottom QR Code Area */}
          <div className={`md:col-span-4 lg:col-span-3 flex justify-center md:justify-end transform transition-all duration-700 delay-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="relative group cursor-default">
              {/* Decorative background blob */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 md:block md:w-auto">
                <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
                   <img src="./static/gh_qrcode.jpeg" alt="QR Code" className="w-20 h-20 md:w-40 md:h-40 object-cover rounded" />
                </div>
                <div className="md:mt-3 text-center md:px-2">
                  <div className="flex items-center justify-center gap-1.5 text-slate-900 dark:text-slate-100 font-bold text-sm md:text-base mb-0.5">
                    <span>{t.heroQrLabel}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                    {t.ad1Subtitle || "Scan to join us"}
                  </p>
                </div>
              </div>
              
              {/* Floating elements decoration */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full blur-md opacity-20 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full blur-md opacity-20 animate-pulse delay-75" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
