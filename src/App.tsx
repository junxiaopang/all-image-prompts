import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Hero from './components/Hero';
import PromptCard from './components/PromptCard';
import Modal from './components/Modal';
import Drawer from './components/Drawer';
import TagsFilter from './components/TagsFilter';
import ModelSelector from './components/ModelSelector';
import { getPromptList, PROMPT_LIST, MODEL_MAP, MODEL_CATEGORIES, getModelCategory } from './constants';
import { PromptItem } from './types';
import { GalleryVerticalEnd, Tag, Heart, Filter, Box, Search, Calendar } from 'lucide-react';
import { translations, Language } from './translations';
import BackToTop from './components/BackToTop';
import PromptCardSkeleton from './components/PromptCardSkeleton';
import EmptyState from './components/EmptyState';
import MobileNav from './components/MobileNav';

import CategoryFilter, { Category, CATEGORIES } from './components/CategoryFilter';
import DateFilter, { DateFilterType, DateRange } from './components/DateFilter';

type SortOption = 'latest' | 'title' | 'likes' | 'source';

const App: React.FC = () => {
  // 状态管理 - 数据加载
  const [promptList, setPromptList] = useState<PromptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterType>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
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
      if (item.model || item.modelId) {
        // 优先使用 modelId，否则尝试从 MODEL_MAP 反查
        const modelId = item.modelId || Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model) || item.model;
        
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

      // 1. Text Search - 标题/标签/来源/提示词/模型的搜索匹配
      // 只检查标题匹配（用于 AND 逻辑）
      let matchesTitleSearch = false;
      // 检查全部内容匹配（用于无分类时的搜索）
      let matchesFullSearch = false;

      if (term) {
        // 标题匹配（用于与分类标签组合时的 AND 条件）
        matchesTitleSearch = item.title.toLowerCase().includes(term);
        
        // 全内容匹配（标题、标签、来源、提示词、模型）
        matchesFullSearch =
          matchesTitleSearch ||
          item.tags.some(tag => tag.toLowerCase().includes(term)) ||
          item.source.name.toLowerCase().includes(term) ||
          item.prompts.some(prompt => prompt.toLowerCase().includes(term)) ||
          (item.model && item.model.toLowerCase().includes(term));
      }

      // 2. 分类标签匹配（如果选择了分类）
      // 标签之间默认是 OR 关系
      let matchesCategoryTags = false;
      if (selectedCategoryInfo) {
        const { logic = 'OR' } = selectedCategoryInfo;
        
        // 将 item 的标签全部转为小写用于比较
        const itemTagsLower = item.tags.map(t => t.toLowerCase());
        
        if (logic === 'AND') {
          // AND: Item must contain ALL tags defined in the category (case-insensitive)
          matchesCategoryTags = selectedCategoryInfo.tags.every(tag => 
            itemTagsLower.includes(tag.toLowerCase())
          );
        } else {
          // OR: Item must contain AT LEAST ONE of the tags (case-insensitive)
          matchesCategoryTags = selectedCategoryInfo.tags.some(tag => 
            itemTagsLower.includes(tag.toLowerCase())
          );
        }
      }

      // 3. 判断是否有有效的用户输入搜索词
      // [暂时废弃]如果搜索词等于分类名称（自动填充的），则忽略这个搜索条件
      // const isAutoPopulatedSearch = selectedCategoryInfo && 
      //                              (term === categoryNameLower || term === selectedCategoryInfo.label['en'].toLowerCase());
      const effectiveSearchTerm = term;
      const hasEffectiveSearch = !!effectiveSearchTerm;
      const hasCategory = !!selectedCategoryInfo;

      // 4. 最终搜索匹配逻辑
      // 规则：(标签1 OR 标签2 OR ...) AND 标题搜索
      let finalSearchMatch = true;
      
      if (hasCategory) {
        // 有分类选择
        if (!matchesCategoryTags) {
          // 不匹配分类标签，直接排除
          finalSearchMatch = false;
        } else if (hasEffectiveSearch) {
          // 匹配了分类标签，且有用户输入的额外搜索词
          // 应用 AND 逻辑：(标签匹配) AND (搜索词匹配标题)
          finalSearchMatch = matchesTitleSearch;
        }
        // 如果匹配分类标签且没有额外搜索词，finalSearchMatch 保持 true
      } else {
        // 没有分类选择，只有搜索
        if (term) {
          // 有搜索词时，使用全内容搜索
          finalSearchMatch = matchesFullSearch;
        }
        // 没有搜索词，finalSearchMatch 保持 true（显示所有）
      }

      // 2. Tag Filter (OR Logic: Item must have ANY selected tags)
      // 如果选择了分类，分类的标签匹配已经在 matchesCategorySearch 中处理过了，
      // 所以只需要检查用户手动选择的额外标签（非分类默认标签）
      let matchesTags = true;
      if (selectedTags.length > 0) {
        // 获取分类默认的标签（如果有分类的话）
        const categoryDefaultTags = selectedCategoryInfo 
          ? selectedCategoryInfo.tags.map(t => t.toLowerCase()) 
          : [];
        
        // 过滤出用户手动添加的标签（不在分类默认标签中的）
        const manuallySelectedTags = selectedTags.filter(
          tag => !categoryDefaultTags.includes(tag.toLowerCase())
        );
        
        // 如果有手动选择的额外标签，需要额外匹配
        if (manuallySelectedTags.length > 0) {
          const itemTagsLower = item.tags.map(t => t.toLowerCase());
          matchesTags = manuallySelectedTags.some(selected => 
            itemTagsLower.includes(selected.toLowerCase())
          );
        }
        // 如果只有分类默认标签（没有手动额外选择的），则已在分类匹配中处理，这里直接通过
      }

      // 3. Model Filter - 支持分类过滤
      let matchesModel = !selectedModel && !selectedModelCategory;
      if (selectedModel) {
        // 如果选择的是分类（如"Seedream"），检查项目是否属于该分类
        if (MODEL_CATEGORIES[selectedModel]) {
          const categoryModelIds = MODEL_CATEGORIES[selectedModel];
          const itemModelId = item.modelId || Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model);
          matchesModel = itemModelId ? categoryModelIds.includes(itemModelId) : false;
        } else {
          // 如果选择的是具体模型，按原逻辑匹配
          matchesModel = (item.modelId === selectedModel) || (item.model === MODEL_MAP[selectedModel]) || (item.model === selectedModel);
        }
      } else if (selectedModelCategory) {
        // 如果通过顶部导航栏选择了模型分类
        const categoryModelIds = MODEL_CATEGORIES[selectedModelCategory] || [];
        const itemModelId = item.modelId || Object.keys(MODEL_MAP).find(id => MODEL_MAP[id] === item.model);
        matchesModel = itemModelId ? categoryModelIds.includes(itemModelId) : false;
      }
      
      // 4. Date Filter
      let matchesDate = true;
      if (selectedDateFilter !== 'all') {
        const itemTime = item.create_time || item.update_time || 0; // Use create_time, fallback to update_time
        if (itemTime > 0) {
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          switch (selectedDateFilter) {
            case 'today':
              matchesDate = (now - itemTime) < oneDay;
              break;
            case 'week':
              matchesDate = (now - itemTime) < (oneDay * 7);
              break;
            case 'month':
              matchesDate = (now - itemTime) < (oneDay * 30);
              break;
            case 'custom':
              // 自定义日期范围过滤
              if (dateRange.startDate || dateRange.endDate) {
                const startTime = dateRange.startDate ? new Date(dateRange.startDate).getTime() : 0;
                const endTime = dateRange.endDate ? new Date(dateRange.endDate).setHours(23, 59, 59, 999) : Date.now();
                matchesDate = itemTime >= startTime && itemTime <= endTime;
              }
              break;
          }
        } else {
             // If item has no time data, filter it out if a date filter is active
             // OR keep it if we want to be lenient. Let's filter it out strictly for now as per "filter".
             matchesDate = false; 
        }
      }

      return finalSearchMatch && matchesTags && matchesModel && matchesDate;
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
          // Newer items first (higher update_time, then higher ID)
          const timeDiff = (b.update_time || 0) - (a.update_time || 0);
          if (timeDiff !== 0) return timeDiff;
          return b.id - a.id;
      }
    });

    return filtered;
  }, [searchTerm, selectedTags, showLikedOnly, likedIds, selectedModel, selectedModelCategory, selectedCategory, lang, sortBy, promptList, selectedDateFilter, dateRange]);


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

      // Handle search term population
      // Default to true if undefined (matching previous behavior where label is used)
      // But now we explicitly put it in the search box as requested
      const shouldIncludeLabel = category.includeLabelInSearch !== false; 
      if (shouldIncludeLabel) {
        setSearchTerm(category.label[lang]);
      } else {
        setSearchTerm('');
      }
    } else {
      setSelectedCategory(null);
      setSelectedTags([]);
      setSearchTerm('');
    }
    // Search term is handled inside above if/else blocks
    // setSearchTerm(''); removed
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-gray-50 dark:from-slate-900 dark:via-slate-900 dark:to-[#0f172a]">
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

      {/* Hero Section - Full Width */}
      <Hero 
        totalCount={promptList.length} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        lang={lang} 
      />
        
      {/* Tools Section: Tabs + Filter */}
      <div className="sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800/50 shadow-sm mb-4">
        <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Top Row: Gallery Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <GalleryVerticalEnd size={24} className="text-indigo-500" />
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
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800/90 border rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  isTagsFilterVisible
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Tag size={16} />
                {t.filter || '标签'}
                {selectedTags.length > 0 && (
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTags.length}
                  </span>
                )}
              </button>
              
              {/* Date Filter - Desktop */}
              <div className="hidden md:block">
                <DateFilter 
                  selectedFilter={selectedDateFilter}
                  onSelectFilter={setSelectedDateFilter}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  lang={lang}
                />
              </div>


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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-32 sm:w-48 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 text-sm shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400/50"
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
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto">

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
              onSwitchModel={handleModelCategorySelect}
              selectedModelCategory={selectedModelCategory}
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

          {/* Mobile Date Filter */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar size={14} />
              {t.dateFilter}
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => {
                  setSelectedDateFilter('all');
                  setDateRange({ startDate: null, endDate: null });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${
                  selectedDateFilter === 'all'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t.dateAll}
              </button>
              <button
                onClick={() => setSelectedDateFilter('today')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${
                  selectedDateFilter === 'today'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t.dateToday}
              </button>
              <button
                onClick={() => setSelectedDateFilter('week')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${
                  selectedDateFilter === 'week'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t.dateWeek}
              </button>
              <button
                onClick={() => setSelectedDateFilter('month')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border h-8 flex items-center ${
                  selectedDateFilter === 'month'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {t.dateMonth}
              </button>
            </div>
            {/* 自定义日期范围 */}
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.dateCustom}</div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 w-10">{t.dateStart}</label>
                <input
                  type="date"
                  value={dateRange.startDate || ''}
                  onChange={(e) => {
                    setDateRange(prev => ({ ...prev, startDate: e.target.value || null }));
                    setSelectedDateFilter('custom');
                  }}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 w-10">{t.dateEnd}</label>
                <input
                  type="date"
                  value={dateRange.endDate || ''}
                  onChange={(e) => {
                    setDateRange(prev => ({ ...prev, endDate: e.target.value || null }));
                    setSelectedDateFilter('custom');
                  }}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {(dateRange.startDate || dateRange.endDate) && (
                <button
                  onClick={() => {
                    setDateRange({ startDate: null, endDate: null });
                    setSelectedDateFilter('all');
                  }}
                  className="w-full mt-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  {t.clearDateRange}
                </button>
              )}
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