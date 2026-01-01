import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from '../translations';

export interface Category {
    id: string;
    label: { zh: string; en: string };
    tags: string[];
    logic?: 'AND' | 'OR'; // 默认是 OR
    includeLabelInSearch?: boolean; // 默认是 false (true means label is part of search keywords)
}

export const CATEGORIES: Category[] = [
    {
        id: 'emoji',
        label: { zh: '表情包', en: 'Emoji' },
        tags: ['emoji', 'sticker', 'chibi'],
        logic: 'OR',
        includeLabelInSearch: true
    },
    {
        id: 'portrait',
        label: { zh: '写真', en: 'Portrait' },
        tags: ['portrait','photo','photography'],
        logic: 'OR',
        includeLabelInSearch: true
    },
    {
        id: 'comic',
        label: { zh: '漫画', en: 'Comic' },
        tags: ["comic"],
        logic: 'AND',
        includeLabelInSearch: false
    },
    {
        id: 'ecommerce',
        label: { zh: '电商营销', en: 'E-commerce' },
        tags: ['e-commerce', 'product', 'advertisement','product','flat-design','节日', 'festival', 'christmas', 'new-year','poster',"festival","festive"],
        logic: 'OR',
        includeLabelInSearch: false
    },
    {
        id: 'cover',
        label: { zh: '封面', en: 'Cover' },
        tags: ["cover"],
        logic: 'AND',
        includeLabelInSearch: true
    },
    {
        id: 'avatar',
        label: { zh: '头像', en: 'Avatar' },
        tags: ["avatar"],
        logic: 'AND',
        includeLabelInSearch: false
    },
    {
        id: 'style',
        label: { zh: '风格转换', en: 'Style Transfer' },
        tags: [ "anime","cartoon","chinese-style","oil-painting","watercolor", 'art-style'],
        logic: 'OR',
        includeLabelInSearch: false
    },
    {
        id: 'product',
        label: { zh: '文创周边', en: 'Product' },
        tags: ['product', 'design', 'mockup', '3d-model', 'blind-box', '3D', 'figure', 'blind-box',  "clay","miniature","sculpture","toy","craftsmanship"],
        logic: 'OR',
        includeLabelInSearch: false
    },
    {
        id: 'illustration',
        label: { zh: '插画', en: 'Illustration' },
        tags: ['illustration', 'art', 'graphic-novel', 'line-art', 'hand-drawn', 'cartoon','children_book'],
        logic: 'OR',
        includeLabelInSearch: true
    },
    {
        id: 'architecture',
        label: { zh: '建筑及室内设计', en: 'Architecture and Interior Design' },
        tags: ['architecture', 'interior-design','modern', 'classical', 'minimalist'],
        logic: 'OR',
        includeLabelInSearch: false
    },
    {
        id: 'traditional-chinese',
        label: { zh: '中国风', en: 'Chinese Art' },
        tags: ['chinese-style', 'calligraphy', 'traditional'],
        includeLabelInSearch: false
    },
    {
        id: 'gaming-asset',
        label: { zh: '游戏素材', en: 'Gaming Asset' },
        tags: ['gaming', 'cg','prop','game'],
        includeLabelInSearch: false
    },
    {
        id: 'ui-ux-design',
        label: { zh: 'UI/UX设计', en: 'UI/UX Design' },
        tags: ['UI', 'UX', 'ui', 'flat-design', 'grid', 'typography', 'graphic-novel'],
        includeLabelInSearch: false
    },
    {
        id: 'food-photo',
        label: { zh: '美食摄影', en: 'Food Photography' },
        tags: ['food', 'photography', 'macro-photography', 'colorful', 'high-quality'],
        includeLabelInSearch: false
    },
    {
        id: 'cinematic-shot',
        label: { zh: '电影感镜头', en: 'Cinematic Shot' },
        tags: ['cinematic', 'film', 'movie', 'dramatic', 'landscape', 'night'],
        includeLabelInSearch: false
    }
];

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (category: Category | null) => void;
    lang: Language;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
    selectedCategory, 
    onSelectCategory, 
    lang, 
    isExpanded = false, 
    onToggleExpand 
}) => {
    const t = translations[lang];

    return (
        <div className="flex items-start gap-2">
            {/* Scrollable/Wrap Container */}
            <div
                className={`flex-1 flex gap-2 transition-all duration-300 ${isExpanded
                    ? 'flex-wrap'
                    : 'overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                    }`}
            >
            <button
                onClick={() => onSelectCategory(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${selectedCategory === null
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                    }`}
            >
                {lang === 'zh' ? '全部' : 'All'}
            </button>

                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(selectedCategory === category.id ? null : category)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center gap-1 whitespace-nowrap ${selectedCategory === category.id
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/30'
                            : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                            }`}
                    >
                        {category.label[lang]}
                    </button>
                ))}
            </div>

            {/* Expand/Collapse Toggle Button */}
            {onToggleExpand && (
                <button
                    onClick={onToggleExpand}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm z-10"
                    title={isExpanded ? t.collapseCategories : t.expandCategories}
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            )}
        </div>
    );
};

export default CategoryFilter;
