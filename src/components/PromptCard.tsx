
import React from 'react';
import { Heart, Copy } from 'lucide-react';
import { PromptItem } from '../types';
import LazyImage from './LazyImage';
import { Language, translations } from '../translations';
import { useToast } from './Toast';
interface PromptCardProps {
  item: PromptItem;
  onClick: (item: PromptItem) => void;
  isLiked: boolean;
  onToggleLike: () => void;
  lang: Language;
}

const PromptCard: React.FC<PromptCardProps> = ({ item, onClick, isLiked, onToggleLike, lang }) => {
  const t = translations[lang];
  const { showToast } = useToast();
  const handleCopy = (e: React.MouseEvent) => {
    if (item.prompts && item.prompts[0]) {
      e.stopPropagation();
      navigator.clipboard.writeText(item.prompts[0]);
      // Could add toast here
      showToast(t.promptInfo + t.copySuccess, 'success');
    }

  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike();
  }

  return (
    <div
      className="group relative break-inside-avoid mb-4 rounded-xl overflow-hidden bg-white dark:bg-dark-card shadow-sm hover:shadow-xl dark:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 cursor-zoom-in border border-gray-100 dark:border-dark-border"
      onClick={() => onClick(item)}
    >
      {/* Image Container */}
      <div className="relative w-full overflow-hidden">
        {/* Replaced standard img with LazyImage */}
        <LazyImage
          src={item.coverImage}
          alt={item.title}
          className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          placeholderColor="bg-gray-200 dark:bg-slate-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Copy Button Overlay */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 backdrop-blur-sm"
          title={t.copyPrompt}
        >
          <Copy size={14} />
        </button>
      </div>

      {/* Info Content - Redesigned Layout */}
      <div className="p-3">
        {/* Row 1: Title & Like Button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm leading-tight pt-0.5">{item.title}</h3>

          <div
            className={`flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0 ${isLiked ? 'text-pink-500' : 'text-gray-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400'}`}
            onClick={handleLike}
          >
            <Heart size={14} className={isLiked ? "fill-current" : ""} />
            <span className="text-xs font-medium">{item.likes}</span>
          </div>
        </div>

        {/* Row 2: Tags List (replacing Author) */}
        <div className="flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-[10px] rounded-md truncate max-w-[80px]"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-[10px] text-gray-400 py-0.5">+{item.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;