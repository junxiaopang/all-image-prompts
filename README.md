# All Image Prompts (AI 绘图词)

简体中文 | [English](./README_en.md)

这是一个基于 **React 19** + **Vite 6** 构建的现代化 AI 绘画提示词展示与管理平台。它汇集了来自**Gemini** (NanoBanana) 、**Midjourney**、**DALL-E 3**、**Flux**、**Grok**以及 **Seedream** 等多个主流 AI 模型的优质提示词（Prompts），旨在为创作者提供灵感与参考。

![](public/static/screenshot.png)

🎉 **查看文档**: [提示词目录汇总](public/prompts/prompts.md)

🚀 **在线预览**: [https://prompts.kkkm.cn](https://prompts.kkkm.cn)

## 一键部署

1. **Fork 本项目**：点击右上角的 Fork 按钮，将本项目复制到你的 GitHub 仓库。

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fjunxiaopang%2fall-image-prompts)

### 腾讯云 EdgeOne 部署

> EdgeOne 中国版，需要有备案域名

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?repository-url=https%3a%2f%2fgithub.com%2fjunxiaopang%2fall-image-prompts)

> EdgeOne 国际版，选：全球(不包含中国大陆版)

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3a%2f%2fgithub.com%2fjunxiaopang%2fall-image-prompts)

###

## 🆕 获取最新提示词

<img src="public/static/qrcode.png" alt="qrcode" width="100" height="100">

> 请添加微信号：`jxppro` ，备注`提示词`

## ✨ 核心特性

- **🤖 多模型支持**：完整支持并分类展示 Midjourney, DALL-E, GPT-4o, Flux, Grok, Gemini(Nano Bananan), Seedream 等多种模型的提示词。
- **⚡ 高性能体验**：
  - 采用 **Vite** 极速构建。
  - 图片与数据按需加载 (Lazy Loading)，流畅浏览大量内容。
- **🎨 现代化 UI 设计**：
  - 基于 **Tailwind CSS 4.0** 构建，风格简约大气。
  - **响应式布局**：完美适配桌面端与移动端（移动端支持底部导航与抽屉菜单）。
  - **瀑布流展示**：沉浸式浏览体验。
  - **深色模式**：内置精美的暗色/亮色主题切换，自动跟随系统或手动控制。
- **🔍 强大的筛选与搜索**：
  - **模型分类**：支持按模型系列筛选（如 GPT 系列, Seedream 系列等）。
  - **标签过滤**：支持多选标签进行精确查找。
  - **即时搜索**：支持标题、提示词内容、标签的全局搜索。
- **🌍 国际化 (i18n)**：原生支持中英文界面切换。
- **💡 便捷交互**：
  - **一键复制**：快速复制提示词到剪贴板。
  - **详情预览**：点击卡片查看高清大图、完整提示词及参数。
  - **回到顶部**：长页面浏览更轻松。

## 🛠 技术栈

| 技术          | 说明                                          |
| ------------- | --------------------------------------------- |
| **Framework** | [React 19](https://react.dev/)                |
| **Bundler**   | [Vite 6](https://vitejs.dev/)                 |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com/)    |
| **Language**  | [TypeScript](https://www.typescriptlang.org/) |
| **Icons**     | [Lucide React](https://lucide.dev/)           |

## 🚀 快速开始

### 1. 环境准备

确保你的环境已安装：

- **Node.js**: 推荐 v18 或更高版本
- **包管理器**: 推荐使用 [pnpm](https://pnpm.io/) (也可以使用 npm 或 yarn)

### 2. 安装依赖

```bash
# 克隆项目
git clone https://github.com/junxiaopang/all-image-prompts.git
cd all-image-prompts

# 安装依赖
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

启动后，在浏览器访问 `http://localhost:3000` 即可预览项目。

### 4. 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录。

## 📂 项目结构

本项目遵循标准的 React 工程化目录结构：

```text
├── public/            # 静态资源 (favicon, manifest, etc.)
├── src/
│   ├── components/    # UI 组件 (Header, PromptCard, Filters, etc.)
│   ├── data/          # 提示词数据源 JSON 文件
│   ├── App.tsx        # 主应用组件
│   ├── index.tsx      # 应用入口
│   ├── constants.ts   # 核心常量 (模型映射, 配置)
│   ├── translations.ts# 国际化文案
│   ├── types.ts       # TypeScript 类型定义
│   └── styles.css     # 全局样式 (Tailwind 引入)
├── index.html         # HTML 模板
├── package.json       # 项目依赖与脚本
├── tailwind.config.js # Tailwind 配置
└── vite.config.ts     # Vite 配置
```

## 📝 数据管理

本项目的核心数据存储在 `src/data/` 目录下的 JSON 文件中，实现了数据与视图的分离。

### 添加新提示词

1.  找到对应的模型数据文件（如 `src/data/grok.json`）。
2.  在数组中添加新的对象：

```json
{
  "id": "unique-uuid-or-number",
  "title": "示例标题",
  "prompts": ["这里填写完整的提示词...", "支持多个提示词"],
  "images": ["/path/to/image.jpg"],
  "model": "grok",
  "tags": ["landscape", "cyberpunk"],
  "source": {
    "name": "作者名",
    "url": "https://www.kkkm.cn"
  }
}
```

### 添加新模型

如果需要支持新的模型：

1.  在 `src/constants.ts` 的 `MODEL_MAP` 中添加映射关系。
2.  在 `MODEL_CATEGORIES` 中将其归类。

## 🤝 贡献指南

我们非常欢迎社区贡献！不论是提交新的 Prompt、修复 Bug 还是改进文档：

提示词投稿方式：[飞书投稿](https://tcn1uh5rxo87.feishu.cn/share/base/form/shrcne5gDolOMDd0oJsj2XfvxQc) or [issues](https://github.com/junxiaopang/all-image-prompts/issues/new)

## 🤝 致谢

本项目提示词来源于网上收集，包括但不限于[即梦社区](https://jimeng.jianying.com/ai-tool/asset)、[gpt4o-image-prompts](https://github.com/songguoxs/gpt4o-image-prompts/)、[x.com](https://x.com)、[awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)，如果侵犯了你的权益，请联系我们删除！

## 🤝 赞赏

如果你觉得本项目对你有帮助，使用微信扫一扫，可以请我喝奶茶！

![赞赏码](public/static/shang.png)

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。
