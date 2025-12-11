
export interface PromptSource {
  name: string;
  url: string;
}

export interface PromptItem {
  id: number;
  slug: string;
  title: string;
  source: PromptSource;
  images: string[];
  prompts: string[];      // Array of prompts, displayed as "提示词 1", "提示词 2", etc.
  tags: string[];
  coverImage: string;
  examples: string[];
  notes: string[];
  // Enriched UI fields (not in JSON, but added by app logic)
  likes?: number;
  ratio?: string;
  model?: string;
  // authorAvatar removed
}

export type SearchFilter = string;
