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
                        ? 'bg-primary dark:bg-slate-200 text-white dark:text-slate-900 border-primary dark:border-slate-200 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                                ? 'bg-primary text-white border-primary shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary'
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
