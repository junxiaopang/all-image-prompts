import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Language, translations } from '../translations';

export interface Category {
    id: string;
    label: { zh: string; en: string };
    tags: string[];
}

export const CATEGORIES: Category[] = [
    {
        id: 'emoji',
        label: { zh: '表情包', en: 'Emoji' },
        tags: ['表情包', 'emoji', 'sticker', 'Q版', 'chibi']
    },
    {
        id: 'photo',
        label: { zh: '写真摄影', en: 'Photography' },
        tags: ['写真', 'photo', 'realistic', 'photography']
    },
    {
        id: 'style',
        label: { zh: '风格转换', en: 'Style Transfer' },
        tags: [ "anime","cartoon","chinese-style","oil-painting","watercolor", 'art-style']
    },
    {
        id: 'avatar',
        label: { zh: '头像生成', en: 'Avatar' },
        tags: ['头像', 'portrait', 'avatar', 'headshot']
    },
    {
        id: 'comic',
        label: { zh: '多格漫画', en: 'Comic' },
        tags: ['漫画', '多格', '分镜',  "comic", "graphic-novel", "line-art","hand-drawn", 'manga']
    },
    {
        id: 'ecommerce',
        label: { zh: '电商营销', en: 'E-commerce' },
        tags: ['电商', 'e-commerce', 'product', 'advertisement','product','flat-design','节日', 'festival', 'christmas', 'new-year','poster',"festival","festive"]
    },
    {
        id: 'product',
        label: { zh: '文创周边', en: 'Product' },
        tags: ['文创', '产品', 'product', 'design', 'mockup', '3d-model', 'blind-box', '3D', 'figure', 'blind-box',  "clay","miniature","sculpture","toy","craftsmanship"]
    },
    {
        id: 'illustration',
        label: { zh: '风格插画', en: 'Illustration' },
        tags: ['插画', 'illustration', 'art', 'graphic-novel', 'line-art', 'hand-drawn', 'cartoon']
    },
    {
        id: 'architecture',
        label: { zh: '建筑及室内设计', en: 'Architecture and Interior Design' },
        tags: ['建筑', 'architecture', 'interior-design','modern', 'classical', 'minimalist']
    },
    {
        id: 'traditional-chinese',
        label: { zh: '国风创作', en: 'Traditional Chinese Art' },
        tags: ['国风', '中式', 'chinese-style', 'ink', 'calligraphy', 'traditional']
    },
    {
        id: 'gaming-asset',
        label: { zh: '游戏素材', en: 'Gaming Asset' },
        tags: ['游戏', 'gaming', 'concept-art','cg','prop','pixel','game']
    },
    {
        id: 'ui-ux-design',
        label: { zh: 'UI/UX设计', en: 'UI/UX Design' },
        tags: ['UI', 'UX', 'ui', 'flat-design', 'grid', 'typography', 'graphic-novel']
    },
    {
        id: 'food-photo',
        label: { zh: '美食摄影', en: 'Food Photography' },
        tags: ['美食', 'food', 'photography', 'macro-photography', 'colorful', 'high-quality']
    },
    {
        id: 'children-illustration',
        label: { zh: '儿童插画', en: 'Children Illustration' },
        tags: ['儿童', 'children', 'children_book', 'childlike', 'cute', 'cartoon', 'watercolor', 'hand-drawn']
    },
    {
        id: 'cinematic-shot',
        label: { zh: '电影感镜头', en: 'Cinematic Shot' },
        tags: ['电影感', 'cinematic', 'film', 'movie', 'dramatic', 'landscape', 'night']
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
                    ? 'bg-primary dark:bg-slate-200 text-white dark:text-slate-900 border-primary dark:border-slate-200 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
            >
                {lang === 'zh' ? '全部' : 'All'}
            </button>

                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(selectedCategory === category.id ? null : category)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center gap-1 whitespace-nowrap ${selectedCategory === category.id
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary'
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
