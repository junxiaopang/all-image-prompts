import React, { useMemo } from 'react';
import { Heart, Tag, Sparkles, Search } from 'lucide-react';
import { Language, translations } from '../translations';

interface EmptyStateProps {
    showLikedOnly: boolean;
    selectedTags: string[];
    onClearFilters: () => void;
    allTags: string[];
    onSelectTag: (tag: string) => void;
    onRandomExplore: () => void;
    lang: Language;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    showLikedOnly,
    selectedTags,
    onClearFilters,
    allTags,
    onSelectTag,
    onRandomExplore,
    lang
}) => {
    const t = translations[lang];

    // Randomly select 5 tags for "Popular Tags" simulation
    const popularTags = useMemo(() => {
        const shuffled = [...allTags].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6);
    }, [allTags]);

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600 shadow-inner">
                {showLikedOnly ? <Heart size={40} /> : <Search size={40} />}
            </div>

            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
                {showLikedOnly ? t.noResultsLikedTitle : t.noResultsTitle}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                {showLikedOnly
                    ? t.noResultsDescLiked
                    : selectedTags.length > 0
                        ? t.noResultsDescTags.replace('{tags}', selectedTags.join(' + '))
                        : t.noResultsDescSearch
                }
            </p>

            {!showLikedOnly && (
                <div className="space-y-8 w-full max-w-md">
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={onClearFilters}
                            className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            {t.clearFilters}
                        </button>
                        <button
                            onClick={onRandomExplore}
                            className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={16} />
                            {t.randomExplore}
                        </button>
                    </div>

                    {/* Popular Tags */}
                    {popularTags.length > 0 && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.popularTags}</h4>
                            <div className="flex flex-wrap justify-center gap-2">
                                {popularTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => onSelectTag(tag)}
                                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
