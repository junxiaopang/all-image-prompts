import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import PromptCard from './components/PromptCard';
import Modal from './components/Modal';
import Drawer from './components/Drawer';
import TagsFilter from './components/TagsFilter';
import ModelSelector from './components/ModelSelector';
import { getPromptList, PROMPT_LIST, MODEL_MAP, MODEL_CATEGORIES, getModelCategory } from './constants';
import { PromptItem } from './types';
import { GalleryVerticalEnd, Tag, Heart, Filter, Box, Search } from 'lucide-react';
import { translations, Language } from './translations';
import BackToTop from './components/BackToTop';
import PromptCardSkeleton from './components/PromptCardSkeleton';
import EmptyState from './components/EmptyState';
import MobileNav from './components/MobileNav';

import CategoryFilter, { Category, CATEGORIES } from './components/CategoryFilter';

type SortOption = 'latest' | 'title' | 'likes' | 'source';

const App: React.FC = () => {
  // 状态管理 - 数据加载
  const [promptList, setPromptList] = useState<PromptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // 状态管理 - 只有当 localStorage 明确有值且不为 "ALL" 时才使用该值，否则为 null (代表"全部")
  // 如果 localStorage 为空（首次访问），则默认选中 'NanoBanana'
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const saved = localStorage.getItem('pv_category');
    return saved === 'ALL' ? null : (saved || null);
  });

  const [selectedModel, setSelectedModel] = useState<string | null>(() => {
    const saved = localStorage.getItem('pv_model');
    // 如果没有记录，默认为 NanoBanana
    if (saved === null) return 'NanoBanana';
    // 如果记录是 ALL，则是 null
    return saved === 'ALL' ? null : saved;
  });

  const [selectedModelCategory, setSelectedModelCategory] = useState<string | null>(() => {
    const saved = localStorage.getItem('pv_model_category');
    // 如果没有记录，默认为 NanoBanana
    if (saved === null) return 'NanoBanana';
    // 如果记录是 ALL，则是 null
    return saved === 'ALL' ? null : saved;
  });
  
  // Persist selection changes
  useEffect(() => {
    localStorage.setItem('pv_category', selectedCategory || 'ALL');
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('pv_model', selectedModel || 'ALL');
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('pv_model_category', selectedModelCategory || 'ALL');
  }, [selectedModelCategory]);
  const [selectedItem, setSelectedItem] = useState<PromptItem | null>(null);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isTagsFilterVisible, setIsTagsFilterVisible] = useState(false);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'search' | 'filter' | 'likes'>('home');


  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(20);
  const LOAD_MORE_STEP = 20;

  // State for LocalStorage
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for Sorting
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Initialize Language based on UA
  const [lang, setLang] = useState<Language>(() => {
    const navLang = navigator.language || 'en';
    return navLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  const t = translations[lang];

  // Update document title based on language
  useEffect(() => {
    document.title = lang === 'zh' ? '绘图词-即梦4.0 Seedream4.0,nanobanana, gpt4o, chatgpt 提示词案例' : 'Draw Prompts - AI Art Gallery - Seedream4.0,nanobanana, gpt4o, chatgpt prompts';
  }, [lang]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getPromptList();
        
        // 验证数据格式
        if (!Array.isArray(data)) {
          console.error('数据格式错误: 期望数组，实际得到', typeof data);
          setPromptList([]);
          return;
        }
        
        // 验证数据项格式
        const validData = data.filter((item, index) => {
          if (!item || typeof item !== 'object') {
            console.warn(`数据项 ${index} 格式错误:`, item);
            return false;
          }
          if (!item.id) {
            console.warn(`数据项 ${index} 缺少id字段:`, item);
            return false;
          }
          if (!item.title) {
            console.warn(`数据项 ${index} 缺少title字段:`, item);
            return false;
          }
          return true;
        });
        
        setPromptList(validData);
      } catch (error) {
        console.error('加载数据失败:', error);
        setPromptList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Load from LocalStorage on mount
  useEffect(() => {
    // Load Likes
    const savedLikes = localStorage.getItem('pv_liked_ids');
    if (savedLikes) {
      try {
        setLikedIds(JSON.parse(savedLikes));
      } catch (e) {
        console.error("Failed to parse liked IDs", e);
      }
    }

    // Load Theme
    const savedTheme = localStorage.getItem('pv_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pv_theme', 'light');
    }
  };

  // Toggle Like
  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      let newLikes;
      if (prev.includes(id)) {
        newLikes = prev.filter(lid => lid !== id);
      } else {
        newLikes = [...prev, id];
      }
      localStorage.setItem('pv_liked_ids', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    promptList.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [promptList]);

  // Extract unique models from all prompts
  const allModels = useMemo(() => {
    const categoryMap = new Map<string, Set<string>>(); // 用于按分类组织模型
    
    promptList.forEach(item => {
      if (item.model) {
        // 从MODEL_MAP中找到对应的模型ID
        const modelId = Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model) || item.model;
        
        // 获取模型的分类
        const category = getModelCategory(modelId);
        
        // 如果该分类已经存在，将模型ID添加到分类中
        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Set());
        }
        categoryMap.get(category)!.add(modelId);
      }
    });
    
    // 创建嵌套的模型结构
    const result: Array<{id: string, name: string, children?: Array<{id: string, name: string}>}> = [];
    
    // 按分类排序
    const sortedCategories = Array.from(categoryMap.keys()).sort();
    sortedCategories.forEach(category => {
      const modelIds = Array.from(categoryMap.get(category)!);
      
      const children = modelIds.map(modelId => ({
        id: modelId,
        name: MODEL_MAP[modelId] || modelId
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      result.push({
        id: category,
        name: category,
        children: children
      });
    });
    
    return result;
  }, [promptList]);

  // Compute available models for the selector based on selected category
  const availableModelsForSelector = useMemo(() => {
    if (!selectedModelCategory) return allModels;
    return allModels.filter(m => m.id === selectedModelCategory);
  }, [allModels, selectedModelCategory]);

  // Filter logic
  const filteredPrompts = useMemo(() => {
    const term = searchTerm.toLowerCase();

    // 获取当前分类的信息（如果选择分类）
    const selectedCategoryInfo = selectedCategory ? CATEGORIES.find(cat => cat.id === selectedCategory) : null;
    const categoryName = selectedCategoryInfo ? (selectedCategoryInfo.label[lang] || selectedCategoryInfo.label['en'] || '') : '';
    const categoryNameLower = categoryName.toLowerCase();

    let filtered = promptList.filter(item => {
      // 0. Liked Filter
      if (showLikedOnly && !likedIds.includes(item.id)) {
        return false;
      }

      // 1. Text Search & Category Search（合并处理，实现"或"关系）
      let matchesSearch = false;

      // 基础搜索匹配
      if (term) {
        matchesSearch =
          item.title.toLowerCase().includes(term) ||
          item.tags.some(tag => tag.toLowerCase().includes(term)) ||
          item.source.name.toLowerCase().includes(term) ||
          item.prompts.some(prompt => prompt.toLowerCase().includes(term)) ||
          (item.model && item.model.toLowerCase().includes(term));
      }

      // 分类搜索匹配（如果选择分类）
      let matchesCategorySearch = false;
      if (selectedCategoryInfo) {
        const titleMatchesCategory = item.title.toLowerCase().includes(categoryNameLower);
        const tagsMatchCategory = selectedCategoryInfo.tags.some(tag => item.tags.includes(tag));
        matchesCategorySearch = titleMatchesCategory || tagsMatchCategory;
      }

      // 最终搜索条件：基础搜索和分类搜索是"或"关系
      // 如果只有其中一个存在，则只匹配那个；如果两个都存在，则满足任一即可；如果都不存在，则匹配所有
      const hasSearch = !!term;
      const hasCategory = !!selectedCategoryInfo;

      let finalSearchMatch = true;
      if (hasSearch || hasCategory) {
        finalSearchMatch = (hasSearch && matchesSearch) || (hasCategory && matchesCategorySearch);
      }

      // 2. Tag Filter (OR Logic: Item must have ANY selected tags)
      const matchesTags = selectedTags.length === 0
        ? true
        : selectedTags.some(selected => item.tags.includes(selected));

      // 3. Model Filter - 支持分类过滤
      let matchesModel = !selectedModel && !selectedModelCategory;
      if (selectedModel) {
        // 如果选择的是分类（如"Seedream"），检查项目是否属于该分类
        if (MODEL_CATEGORIES[selectedModel]) {
          const categoryModelIds = MODEL_CATEGORIES[selectedModel];
          const itemModelId = Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model);
          matchesModel = itemModelId ? categoryModelIds.includes(itemModelId) : false;
        } else {
          // 如果选择的是具体模型，按原逻辑匹配
          matchesModel = item.model === MODEL_MAP[selectedModel] || item.model === selectedModel;
        }
      } else if (selectedModelCategory) {
        // 如果通过顶部导航栏选择了模型分类
        const categoryModelIds = MODEL_CATEGORIES[selectedModelCategory] || [];
        const itemModelId = Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model);
        matchesModel = itemModelId ? categoryModelIds.includes(itemModelId) : false;
      }

      return finalSearchMatch && matchesTags && matchesModel;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'source':
          return a.source.name.localeCompare(b.source.name);
        case 'latest':
        default:
          return b.id - a.id; // Newer items first (higher ID)
      }
    });

    return filtered;
  }, [searchTerm, selectedTags, showLikedOnly, likedIds, selectedModel, selectedModelCategory, selectedCategory, lang, sortBy, promptList]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(LOAD_MORE_STEP);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, selectedTags, showLikedOnly, selectedModel, selectedModelCategory]);

  // Slice prompts for display
  const displayedPrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredPrompts.length) {
          setVisibleCount(prev => Math.min(prev + LOAD_MORE_STEP, filteredPrompts.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredPrompts.length]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Mobile Navigation Handlers
  const handleMobileTabChange = useCallback((tab: 'home' | 'search' | 'filter' | 'likes') => {
    setActiveMobileTab(tab);
    if (tab === 'filter') {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
    if (tab === 'likes') {
      setShowLikedOnly(true);
    } else {
      setShowLikedOnly(false);
    }
    if (tab === 'search') {
      // Optionally focus search input or show a search overlay
      // setIsSearchOpen(true); // Removed
    }
    // For 'home', ensure filters are reset or show all
    if (tab === 'home') {
      setSearchTerm('');
      setSelectedTags([]);
      setSelectedModel(null);
      setSelectedModelCategory(null);
      setShowLikedOnly(false);
    }
  }, []);

  const handleRandomExplore = useCallback(() => {
    // Randomly select a tag
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    setSelectedTags([randomTag]);
    setSearchTerm('');
    setSelectedModel(null);
    setSelectedModelCategory(null);
    setShowLikedOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allTags]);

  const handleCategorySelect = (category: Category | null) => {
    if (category) {
      setSelectedCategory(category.id);
      // Find tags that actually exist in allTags to avoid empty filters
      const validTags = category.tags.filter(tag => allTags.includes(tag) || allTags.some(t => t.includes(tag)));
      // If no exact match, use the defined tags anyway (OR logic in filter will handle it)
      setSelectedTags(validTags.length > 0 ? validTags : category.tags);
    } else {
      setSelectedCategory(null);
      setSelectedTags([]);
    }
    setSearchTerm(''); // 清空搜索词，因为分类过滤已经整合标题匹配
    // 保留当前模型选择，不清除
    setShowLikedOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 首次加载时确保显示所有数据
  useEffect(() => {
    // 只在数据加载完成后且所有筛选条件为空时执行一次
    if (promptList.length > 0 && 
        !selectedCategory && 
        selectedTags.length === 0 && 
        !searchTerm && 
        !selectedModel && 
        !selectedModelCategory && 
        !showLikedOnly) {
      
      // 确保显示所有数据
      setVisibleCount(Math.max(LOAD_MORE_STEP, filteredPrompts.length));
    }
  }, [promptList.length]); // 只在数据加载完成后执行一次

  // 处理模型分类选择变化
  // Synchronized Handlers
  const handleModelCategorySelect = (category: string | null) => {
    setSelectedModelCategory(category);
    if (category) {
      // Set model to category name so dropdown shows it too
      setSelectedModel(category);
      // Clear other filters
      setSelectedCategory(null);
      setSelectedTags([]);
      setSearchTerm('');
      setShowLikedOnly(false);
    } else {
      setSelectedModel(null);
    }
  };

  const handleModelSelect = (modelId: string | null) => {
    setSelectedModel(modelId);
    if (modelId) {
      // Find category for this model
      // If the modelId is itself a category key, use it. Otherwise find its category.
      const isCategory = Object.keys(MODEL_CATEGORIES).includes(modelId);
      const category = isCategory ? modelId : getModelCategory(modelId);
      
      // Only update category if it's a known category, otherwise it might be a standalone model
      if (Object.keys(MODEL_CATEGORIES).includes(category)) {
        setSelectedModelCategory(category);
      } else {
        setSelectedModelCategory(null);
      }

      // Clear other filters
      setSelectedCategory(null);
      setSelectedTags([]);
      setSearchTerm('');
      setShowLikedOnly(false);
    } else {
      setSelectedModelCategory(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* 现有的头部组件 */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        lang={lang}
        setLang={setLang}
        selectedModelCategory={selectedModelCategory}
        onSelectModelCategory={handleModelCategorySelect}
      />

      {/* Main Content */}
      <main className="container mx-auto">
        {/* Banner Area */}
        <Banner lang={lang} />

        {/* Tools Section: Tabs + Filter */}
        <div className="px-4 py-4 space-y-4 sticky top-0 z-30 bg-gray-50/95 dark:bg-dark-bg/95 backdrop-blur-sm transition-colors duration-300">

          {/* Top Row: Gallery Title & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <GalleryVerticalEnd size={24} className="text-primary" />
                {t.galleryTitle}
              </h2>

              <div className="flex items-center gap-3">
                {/* Tabs: All vs Liked */}
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                  <button
                    onClick={() => setShowLikedOnly(false)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${!showLikedOnly
                      ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                  >
                    <GalleryVerticalEnd size={14} className={!showLikedOnly ? "fill-current" : ""} />
                    <span className="hidden sm:inline">{t.tabAll}</span>
                  </button>
                  <button
                    onClick={() => setShowLikedOnly(true)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${showLikedOnly
                      ? 'bg-white dark:bg-slate-600 text-pink-500 dark:text-pink-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                  >
                    <Heart size={14} className={showLikedOnly ? "fill-current" : ""} />
                    <span className="hidden sm:inline">{t.tabLiked}</span>
                    {likedIds.length > 0 && <span className="ml-1 opacity-80">({likedIds.length})</span>}
                  </button>
                </div>

                {/* Desktop Model Selector */}
                <div className="hidden md:block">
                  <ModelSelector
                    models={availableModelsForSelector}
                    selectedModel={selectedModel}
                    onSelectModel={handleModelSelect}
                    lang={lang}
                  />
                </div>
                {/* tags filter button - Desktop */}
                <button
                  onClick={() => setIsTagsFilterVisible(!isTagsFilterVisible)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Tag size={16} />
                  {t.filter || '标签'}
                  {selectedTags.length > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedTags.length}
                    </span>
                  )}
                </button>

              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Mobile Filter Button - Removed in favor of Bottom Nav, but keeping as fallback or alternative if needed, or just hide it completely now? 
                  The plan said "Mobile Bottom Bar will change the main interaction... original top Filter button might be removed". 
                  Let's hide it for now since we have the bottom bar. 
              */}
              {/* 
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm"
              >
                <Filter size={16} />
                {t.filter || 'Filter'}
                {(selectedTags.length > 0 || selectedModel) && (
                  <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTags.length + (selectedModel ? 1 : 0)}
                  </span>
                )}
              </button>
              */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-32 sm:w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-900 text-gray-800 dark:text-slate-100 rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-slate-500 text-sm shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="latest">{t.sortLatest || 'Latest'}</option>
                  <option value="title">{t.sortTitle || 'Title'}</option>
                  <option value="likes">{t.sortLikes || 'Likes'}</option>
                  <option value="source">{t.sortSource || 'Source'}</option>
                </select>
              </div>
              <div className="text-xs text-slate-400 font-medium min-w-[5rem] text-right tabular-nums">
                {t.resultsCount.replace('{count}', filteredPrompts.length.toString())}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:hidden overflow-hidden">
            {/* Mobile view handled by horizontal scroll in component */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              lang={lang}
              isExpanded={isCategoriesExpanded}
              onToggleExpand={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            />
          </div>
          <div className="hidden md:block">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              lang={lang}
              isExpanded={isCategoriesExpanded}
              onToggleExpand={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            />
          </div>

          {/* Tags Filter Area - Desktop Only */}
          {isTagsFilterVisible && (
            <div className="hidden md:block">
              <TagsFilter
                allTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
                onClearTags={() => setSelectedTags([])}
                isExpanded={isTagsExpanded}
                onToggleExpand={() => setIsTagsExpanded(!isTagsExpanded)}
                lang={lang}
              />
            </div>
          )}
        </div>

        {/* Gallery Grid - Masonry style using CSS columns */}
        <div className="px-4 min-h-[50vh]">

          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {[...Array(12)].map((_, i) => (
                <PromptCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {displayedPrompts.map(item => (
                <PromptCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                  isLiked={likedIds.includes(item.id)}
                  onToggleLike={() => toggleLike(item.id)}
                  lang={lang}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              showLikedOnly={showLikedOnly}
              selectedTags={selectedTags}
              onClearFilters={() => {
                setSearchTerm('');
                setSelectedTags([]);
                setSelectedModel(null);
                setSelectedModelCategory(null);
              }}
              allTags={allTags}
              onSelectTag={(tag) => setSelectedTags([...selectedTags, tag])}
              onRandomExplore={handleRandomExplore}
              lang={lang}
            />
          )}

          {/* Scroll Sentinel & Skeletons */}
          {filteredPrompts.length > 0 && (
            <div id="scroll-sentinel" className="w-full">
              {visibleCount < filteredPrompts.length && (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 py-4">
                  {[...Array(4)].map((_, i) => (
                    <PromptCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-dark-card py-8 transition-colors pb-24 md:pb-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            {t.footerCopyright.replace('{year}', new Date().getFullYear().toString())} <a href="http://www.kkkm.cn" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.kkkm.cn</a>
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400 dark:text-slate-500">
            <a href="https://github.com/junxiaopang/all-image-prompts" target="_blank" className="hover:text-primary">{t.githubTitle}</a>
            <a href="http://www.kkkm.cn" target="_blank" className="hover:text-primary">{t.footerAbout}</a>
            <a href="http://www.kkkm.cn" target="_blank" className="hover:text-primary">{t.footerTerms}</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedItem && (
        <Modal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isLiked={likedIds.includes(selectedItem.id)}
          onToggleLike={() => toggleLike(selectedItem.id)}
          lang={lang}
        />
      )}

      {/* Mobile Drawer for Tags */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={t.filter || 'Filter'}
        position="bottom"
      >
        <div className="pb-8 space-y-6">
          {/* Mobile Sort Selector */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Filter size={14} />
              {t.sortLabel || 'Sort'}
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${sortBy === 'latest'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t.sortLatest || 'Latest'}
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${sortBy === 'title'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t.sortTitle || 'Title'}
              </button>
              <button
                onClick={() => setSortBy('likes')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${sortBy === 'likes'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t.sortLikes || 'Likes'}
              </button>
              <button
                onClick={() => setSortBy('source')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${sortBy === 'source'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t.sortSource || 'Source'}
              </button>
            </div>
          </div>

          {/* Mobile Model Selector */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Box size={14} />
              {t.modelLabel || 'Model'}
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedModel(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${selectedModel === null
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t.allModels || 'All'}
              </button>
              {availableModelsForSelector.map((option) => {
                if (option.children) {
                  // 如果有子选项，渲染分类下的所有子模型
                  return option.children.map(child => {
                    const isSelected = selectedModel === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedModel(isSelected ? null : child.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center gap-1 ${isSelected
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary'}`}
                      >
                        {child.name}
                      </button>
                    );
                  });
                } else {
                  // 如果没有子选项，直接渲染为一级选项
                  const isSelected = selectedModel === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedModel(isSelected ? null : option.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center gap-1 ${isSelected
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary'}`}
                    >
                      {option.name}
                    </button>
                  );
                }
              }).flat()}
            </div>
          </div>

          {/* Mobile Tags */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Tag size={14} />
              {t.tagsLabel || 'Tags'}
            </h4>
            <TagsFilter
              allTags={allTags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onClearTags={() => setSelectedTags([])}
              isExpanded={true} // Always expanded in drawer
              onToggleExpand={() => { }} // No-op in drawer
              lang={lang}
              className="flex-col" // Stack vertically if needed, or keep default
            />
          </div>
        </div>
      </Drawer>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeMobileTab}
        onTabChange={handleMobileTabChange}
        lang={lang}
      />


    </div>
  );
};

export default App;