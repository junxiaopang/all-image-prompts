import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { translations, Language } from '../translations';

interface TagsFilterProps {
    allTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    onClearTags: () => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
    lang: Language;
    className?: string;
}

const TagsFilter: React.FC<TagsFilterProps> = ({
    allTags,
    selectedTags,
    onToggleTag,
    onClearTags,
    isExpanded,
    onToggleExpand,
    lang,
    className = ''
}) => {
    const t = translations[lang];

    return (
        <div className={`flex items-start gap-2 ${className}`}>
            {/* Scrollable/Wrap Container */}
            <div
                className={`flex-1 flex gap-2 transition-all duration-300 ${isExpanded
                    ? 'flex-wrap'
                    : 'overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                    }`}
            >
                <button
                    onClick={onClearTags}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${selectedTags.length === 0
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                        }`}
                >
                    {t.tagAll}
                </button>

                {allTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            onClick={() => onToggleTag(tag)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center gap-1 ${isSelected
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/30'
                                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                                }`}
                        >
                            {tag}
                            {isSelected && <X size={12} className="opacity-80" />}
                        </button>
                    );
                })}
            </div>

            {/* Expand/Collapse Toggle Button */}
            <button
                onClick={onToggleExpand}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm z-10"
                title={isExpanded ? t.collapseTags : t.expandTags}
            >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </div>
    );
};

export default TagsFilter;
