
import React, { useState, useEffect } from 'react';
import { X, Copy, Heart, Tag, Sparkles, AlertCircle, ExternalLink, ChevronLeft, ChevronRight, Wand2, Image as ImageIcon, FileText } from 'lucide-react';
import { PromptItem } from '../types';
import { Language, translations } from '../translations';
import { useToast } from './Toast';

interface ModalProps {
  item: PromptItem | null;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
  lang: Language;
}

const Modal: React.FC<ModalProps> = ({ item, onClose, isLiked, onToggleLike, lang }) => {
  const t = translations[lang];
  const { showToast } = useToast();
  const [optimizedText, setOptimizedText] = useState<string | null>(null);
  // 设置默认选中第一个提示词
  const getDefaultTab = () => {
    return item && item.prompts && item.prompts.length > 0 ? 0 : 'optimized';
  };

  const [activeTab, setActiveTab] = useState<number | 'optimized'>(getDefaultTab());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState<'preview' | 'detail'>('detail');

  // Reset state when item changes
  useEffect(() => {
    setOptimizedText(null);
    setActiveTab(getDefaultTab()); // 使用动态默认标签
    setCurrentImageIndex(0);
    setMobileTab('detail');
  }, [item]);

  if (!item) return null;

  const displayImages = item.images && item.images.length > 0 ? item.images : [item.coverImage];
  const hasMultipleImages = displayImages.length > 1;

  const handleCopy = (text: string) => {
    if (!text) {
      showToast(t.copyEmpty, 'error');
      return;
    }
    navigator.clipboard.writeText(text);
    showToast(t.copySuccess, 'success');
  };

  const handleMakeSimilar = () => {
    // 1. Copy the first prompt (best for AI)
    const promptToCopy = item.prompts && item.prompts.length > 0 ? item.prompts[0] : '';
    navigator.clipboard.writeText(promptToCopy);
    // 2. Open RunningHub
    window.open('https://www.runninghub.cn/?inviteCode=iyfx5sdi', '_blank');
  };

  const getCurrentText = () => {
    if (typeof activeTab === 'number' && item.prompts && activeTab < item.prompts.length) {
      return item.prompts[activeTab];
    }
    if (activeTab === 'optimized') return optimizedText || "";
    return "";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-[fadeIn_0.2s_ease-out] transition-colors duration-300 lg:flex-row lg:h-[80vh]">

        {/* Close Button Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full lg:hidden backdrop-blur-md hidden"
        >
          <X size={20} />
        </button>

        {/* Mobile Tabs Navigation */}
        <div className="flex lg:hidden w-full border-b border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card">
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
              mobileTab === 'preview' 
                ? 'text-primary' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon size={16} />
            <span>{t.preview}</span>
            {mobileTab === 'preview' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setMobileTab('detail')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors relative ${
              mobileTab === 'detail' 
                ? 'text-primary' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText size={16} />
            <span>{t.promptInfo}</span>
            {mobileTab === 'detail' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Left: Image Area */}
        <div className={`w-full lg:w-3/5 bg-gray-100 dark:bg-black/40 flex items-center justify-center bg-checkered p-2 sm:p-4 lg:p-0 overflow-hidden relative group select-none lg:flex ${mobileTab === 'preview' ? 'flex flex-1' : 'hidden'}`}>
          <img
            src={displayImages[currentImageIndex]}
            alt={`${item.title} - view ${currentImageIndex + 1}`}
            className="w-full h-full object-contain max-h-[40vh] sm:max-h-[45vh] lg:max-h-full transition-transform duration-300"
          />

          {/* Carousel Navigation */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="absolute bottom-12 sm:bottom-16 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {displayImages.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full cursor-pointer transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-3 sm:w-4' : 'bg-white/50 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono hidden lg:block">
            {t.modelLabel}: {item.model} • {item.ratio}
          </div>
        </div>

        {/* Right: Details Area */}
        <div className={`w-full lg:w-2/5 flex flex-col bg-white dark:bg-dark-card border-t lg:border-l border-gray-100 dark:border-dark-border h-full lg:flex ${mobileTab === 'detail' ? 'flex flex-1 overflow-hidden' : 'hidden'}`}>
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-dark-border flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white line-clamp-2" id="prompt-modal-title">{item.title}</h2>
              <div className="flex items-center gap-3 mt-1 sm:mt-2">
                <div>
                  <a
                    href={item.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-medium text-gray-900 dark:text-slate-200 hover:text-primary flex items-center gap-1"
                  >
                    @{item.source.name.replace('@', '')}
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
            {/* Close Button Desktop */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">

            {/* Action Bar */}
            <div className="flex flex-row gap-2 sm:gap-3" id="action-bar">
              <button
                onClick={onToggleLike}
                className={`cursor-pointer flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors font-medium active:scale-95 transform duration-100 ${isLiked
                  ? 'bg-pink-500 hover:bg-pink-600 text-white'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:hover:bg-pink-500/20 dark:text-pink-400'
                  }`}
              >
                <Heart size={14} className={`sm:w-4 sm:h-4 ${isLiked ? "fill-white" : ""}`} />
                <span className="text-xs sm:text-base">{isLiked ? t.liked : t.like} {item.likes}</span>
              </button>

              <button
                onClick={handleMakeSimilar}
                className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium active:scale-95 transform duration-100 shadow-md shadow-blue-500/20"
                title="{t.makeSimilar}"
              >
                <Wand2 size={14} className="sm:w-4 sm:h-4" /> <span className="text-xs sm:text-base">{t.makeSimilar}</span>
              </button>
            </div>

            {/* Prompts Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{t.promptInfo}</h3>
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
                  {/* 动态生成提示词标签 */}
                  {item.prompts && item.prompts.map((_, index) => (
                    <button
                      key={index}
                      className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${activeTab === index ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}
                      onClick={() => setActiveTab(index)}
                    >
                      {t.prompt} {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group/prompt">
                <div id="prompt-modal-content" className="bg-gray-50 dark:bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-dark-border text-gray-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed h-[150px] sm:h-[180px] overflow-y-auto whitespace-pre-wrap">
                  {getCurrentText()}
                </div>
                <button
                  onClick={() => handleCopy(getCurrentText())}
                  className="cursor-pointer absolute top-2 right-2 p-1.5 sm:p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary opacity-0 group-hover/prompt:opacity-100 transition-opacity"
                  title={t.copyTooltip}
                >
                  <Copy size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="mt-2 sm:mt-3 flex flex-row gap-2 sm:gap-3" id="make-copy">
                <button
                  onClick={() => handleCopy(getCurrentText())}
                  title={t.copyTooltip}
                  className="cursor-pointer w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 flex items-center justify-center gap-2 transition-all font-medium group"
                >
                  <Copy size={16} className="group-hover:scale-110 transition-transform sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{t.copyTooltip}</span>
                </button>
                
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">{t.tagsLabel}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/20 cursor-pointer transition-colors">
                    <Tag size={10} className="sm:w-3 sm:h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-900/50">
            <div className="flex justify-center items-center text-xs text-gray-400 dark:text-slate-600">
               © Image by {item.source.name}
               {/* {item.id} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
