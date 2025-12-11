import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Box } from 'lucide-react';
import { translations, Language } from '../translations';

interface ModelOption {
  id: string;
  name: string;
  category?: string;
  children?: ModelOption[];
}

interface ModelSelectorProps {
  models: ModelOption[]; // 支持嵌套结构的模型选项
  selectedModel: string | null;
  onSelectModel: (modelId: string | null) => void;
  lang: Language;
  className?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
  lang,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-expand if there's only one category
  useEffect(() => {
    if (models.length === 1 && models[0].children && models[0].children.length > 0) {
      setExpandedCategories(new Set([models[0].id]));
    }
  }, [models]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getSelectedModelName = () => {
    if (!selectedModel) return t.allModels || 'All Models';
    
    // 在扁平化的模型列表中查找
    const findModel = (options: ModelOption[]): string | undefined => {
      for (const option of options) {
        if (option.id === selectedModel) return option.name;
        if (option.children) {
          const found = findModel(option.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    
    return findModel(models) || t.allModels || 'All Models';
  };

  const renderModelOption = (option: ModelOption, level: number = 0) => {
    const hasChildren = option.children && option.children.length > 0;
    const isExpanded = expandedCategories.has(option.id);
    const isSelected = selectedModel === option.id;

    if (hasChildren) {
      return (
        <div key={option.id}>
          <div
            className={`w-full flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
              isSelected
                ? 'text-primary font-medium bg-slate-50 dark:bg-slate-700/30'
                : 'text-slate-600 dark:text-slate-300'
            }`}
            style={{ paddingLeft: `${16 + level * 16}px` }}
          >
            {/* Main Click Area - Selects Category */}
            <button
              onClick={() => {
                onSelectModel(option.id);
                setIsOpen(false);
              }}
              className="flex-1 text-left py-2 flex items-center gap-2"
            >
              <span>{option.name}</span>
              {isSelected && <Check size={14} />}
            </button>

            {/* Expand Toggle Area */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(option.id);
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg mr-2 transition-colors"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isExpanded && (
            <div>
              {option.children!.map(child => renderModelOption(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf node (actual model)
    return (
      <div key={option.id}>
        <button
          onClick={() => {
            onSelectModel(option.id);
            setIsOpen(false);
          }}
          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
            isSelected
              ? 'text-primary font-medium bg-slate-50 dark:bg-slate-700/30'
              : 'text-slate-600 dark:text-slate-300'
          }`}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <div className="flex items-center gap-2">
            <span>{option.name}</span>
          </div>
          {isSelected && <Check size={14} />}
        </button>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
          isOpen || selectedModel
            ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:text-primary-foreground'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        <Box size={16} />
        <span className="max-w-[100px] truncate">{getSelectedModelName()}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {/* 所有模型选项 */}
            <button
              onClick={() => {
                onSelectModel(null);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                selectedModel === null 
                  ? 'text-primary font-medium bg-slate-50 dark:bg-slate-700/30' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{t.allModels || 'All Models'}</span>
              {selectedModel === null && <Check size={14} />}
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />

            {/* 模型选项 */}
            {models.map(option => renderModelOption(option))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;