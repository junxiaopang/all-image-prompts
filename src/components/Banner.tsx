
import React from 'react';
import { AD_BANNERS } from '../constants';
import { Sparkles, QrCode } from 'lucide-react';
import { Language, translations } from '../translations';

interface BannerProps {
  lang: Language;
}

const Banner: React.FC<BannerProps> = ({ lang }) => {
  const t = translations[lang];

  // Helper function to safely access translations dynamically
  const getAdText = (key: string, field: 'Title' | 'Subtitle' | 'Cta') => {
    const translationKey = `${key}${field}` as keyof typeof t;
    return t[translationKey] as string;
  };

  return (
    <div className="hidden md:block w-full px-4 pt-4 pb-2">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AD_BANNERS.map((ad) => (
            <div 
              key={ad.id}
              className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300 bg-gradient-to-br ${ad.gradient} group`}
            >
              <div className="flex items-center justify-between p-5 h-full min-h-[140px]">
                
                {/* Left Side: Text */}
                <div className="flex flex-col justify-center gap-1.5 flex-1 z-10">
                  <span className="text-[10px] font-bold bg-white/20 text-white w-fit px-1.5 py-0.5 rounded border border-white/10 mb-1">
                    {t.adLabel}
                  </span>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {getAdText(ad.key, 'Title')}
                  </h2>
                  <p className="text-white/80 text-xs font-medium">
                    {getAdText(ad.key, 'Subtitle')}
                  </p>
                  
                  <button className={`mt-3 w-fit flex items-center gap-1.5 bg-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform ${ad.iconColor}`}>
                    <Sparkles size={12} />
                    {getAdText(ad.key, 'Cta')}
                  </button>
                </div>

                {/* Right Side: QR Code Area */}
                <div className="flex-shrink-0 relative ml-2 group-hover:-translate-y-1 transition-transform duration-500">
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-white/30 blur-xl rounded-full transform scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* QR Box */}
                  <div className="relative w-24 h-24 bg-white rounded-lg p-1.5 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300 flex flex-col items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center bg-gray-50">
                        <img src={ad.qrCode} alt={`${getAdText(ad.key, 'Title')} QR Code`} className="w-20 h-20" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
