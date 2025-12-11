
import { PromptItem } from './types';

// 动态加载数据文件
const loadPromptData = async () => {
  try {
    console.log('开始加载各个数据文件...');
    const [seedreamData, midjourneyData, gptData, grokData, geminiData] = await Promise.all([
      import('./data/seedream.json').then(m => { console.log('seedream.json loaded:', m.default?.length || 0); return m.default || m; }),
      import('./data/midjourney.json').then(m => { console.log('midjourney.json loaded:', m.default?.length || 0); return m.default || m; }),
      import('./data/chatgpt.json').then(m => { console.log('chatgpt.json loaded:', m.default?.length || 0); return m.default || m; }),
      import('./data/grok.json').then(m => { console.log('grok.json loaded:', m.default?.length || 0); return m.default || m; }),
      import('./data/gemini.json').then(m => { console.log('gemini.json loaded:', m.default?.length || 0); return m.default || m; }),
    ]);

    console.log('各个文件数据长度:', {
      seedream: seedreamData?.length || 0,
      midjourney: midjourneyData?.length || 0,
      gpt: gptData?.length || 0,
      grok: grokData?.length || 0,
      gemini: geminiData?.length || 0
    });

    // 合并所有数据
    const allData = [
      ...(Array.isArray(seedreamData) ? seedreamData : []),
      ...(Array.isArray(midjourneyData) ? midjourneyData : []),
      ...(Array.isArray(gptData) ? gptData : []),
      ...(Array.isArray(grokData) ? grokData : []),
      ...(Array.isArray(geminiData) ? geminiData : [])
    ];

    console.log('合并后的总数据条数:', allData.length);
    return { list: allData };
  } catch (error) {
    console.error('加载数据文件失败:', error);
    return { list: [] };
  }
};

// Utility to generate random stats for UI richness since JSON doesn't have them
const getRandomLikes = () => Math.floor(Math.random() * 2000) + 100;

// 模型和名称映射
export const MODEL_MAP = {
  'midjourney-v6': 'Midjourney v6',
  'dall-e-2': 'DALL-E 2',
  'dall-e-3': 'DALL-E 3',
  'gpt-image-1': 'GPT-4o',
  'gpt-4o': 'GPT-4o',
  'gpt-5': 'GPT-5',
  'gemini-3-pro-image-preview': 'NanoBanana Pro',
  'gemini-2.5-flash-image': 'NanoBanana 2.5 Flash',
  'grok-2-image': 'Grok-2',
  'high_aes_general_v40': 'Seedream4.0',
  'high_aes_general_v20_L:general_v2.0_L': 'Seedream2.0',
  'high_aes_general_v21_L:general_v2.1_L': 'Seedream2.1',
  'high_aes_general_v30l:general_v3.0_18b': 'Seedream3.0',
  'high_aes_general_v30l_art_fangzhou:general_v3.0_18b': 'Seedream3.1',
};

// 模型分类映射 - 用于将相关模型归类显示
export const MODEL_CATEGORIES = {
  'NanoBanana': ['gemini-3-pro-image-preview', 'gemini-2.5-flash-image'],
  'Seedream': [
    'high_aes_general_v40',
    'high_aes_general_v20_L:general_v2.0_L',
    'high_aes_general_v21_L:general_v2.1_L',
    'high_aes_general_v30l:general_v3.0_18b',
    'high_aes_general_v30l_art_fangzhou:general_v3.0_18b'
  ],
  'Midjourney': ['midjourney-v6'],
  'GPT': ['dall-e-2', 'dall-e-3','gpt-image-1','gpt-4o','gpt-5'],
  'Grok': ['grok-2-image']
};

// 获取模型的分类名称
export const getModelCategory = (modelId: string): string => {
  for (const [category, modelIds] of Object.entries(MODEL_CATEGORIES)) {
    if (modelIds.includes(modelId)) {
      return category;
    }
  }
  // 如果没有找到分类，返回原始模型名称
  return MODEL_MAP[modelId] || modelId;
};

// Simple placeholder image URL generator as fallback
const getPlaceholderImage = (id: number) => {
  return `https://picsum.photos/seed/${id}/600/400`;
};

// 异步获取数据
export const getPromptList = async (): Promise<PromptItem[]> => {
  const promptData = await loadPromptData();
  return promptData.list.map((item: any, index) => ({
  ...item,
  id: item.id || index + 1,  // Ensure id exists
  // 确保prompts数组存在
  prompts: item.prompts || [],
  // 修复：确保source字段始终存在且包含name和url属性
  source: item.source || { name: 'Unknown', url: '#' },
  likes: item.likes || getRandomLikes(),
  ratio: item.ratio || "",
  model: MODEL_MAP[item.model] || MODEL_MAP['grok'],
  // Ensure coverImage and images fields exist to prevent blank screen
  coverImage: item.coverImage || getPlaceholderImage(item.id || index + 1),
  images: item.images || [getPlaceholderImage(item.id || index + 1)],
    // Ensure tags exist as an array
    tags: item.tags || []
  }));
};

// 为了向后兼容，提供一个同步的占位符
export const PROMPT_LIST: PromptItem[] = [];

export const AD_BANNERS = [
  {
    id: 1,
    key: 'ad1',
    gradient: "from-indigo-600 to-violet-600 dark:from-indigo-900 dark:to-violet-900",
    iconColor: "text-indigo-600",
    hasQr: true,
    qrCode: './static/qrcode.png',
  },
  {
    id: 2,
    key: 'ad2',
    gradient: "from-pink-500 to-rose-500 dark:from-pink-900 dark:to-rose-900",
    iconColor: "text-pink-600",
    hasQr: true,
    qrCode: './static/gh_qrcode.jpeg',
  },
  {
    id: 3,
    key: 'ad3',
    gradient: "from-emerald-500 to-teal-500 dark:from-emerald-900 dark:to-teal-900",
    iconColor: "text-teal-600",
    hasQr: true,
    qrCode: './static/qrcode.png',
  }
];
