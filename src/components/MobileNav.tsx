import React from 'react';
import { Home, Search, Filter, Heart } from 'lucide-react';
import { Language, translations } from '../translations';

interface MobileNavProps {
    activeTab: 'home' | 'search' | 'filter' | 'likes';
    onTabChange: (tab: 'home' | 'search' | 'filter' | 'likes') => void;
    lang: Language;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, lang }) => {
    const t = translations[lang];

    const navItems = [
        { id: 'home', icon: Home, label: t.home },
        { id: 'search', icon: Search, label: t.search },
        { id: 'filter', icon: Filter, label: t.filter },
        { id: 'likes', icon: Heart, label: t.likes },
    ] as const;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive
                                    ? 'text-primary dark:text-primary'
                                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'fill-current' : ''} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
