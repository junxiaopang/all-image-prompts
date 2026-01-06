# All Image Prompts

[简体中文](./README.md) | English

This is a modern AI image prompt showcase and management platform built with **React 19** + **Vite 6**. It collects high-quality prompts from major AI models including **Midjourney**, **DALL-E 3**, **Flux**, **Grok**, **Gemini** (NanoBanana), and **Seedream**, aiming to provide inspiration and reference for creators.

🎉 **Documentation**: [Prompts Catalog](public/prompts/prompts.md)

🚀 **Live Demo**: [https://prompts.kkkm.cn](https://prompts.kkkm.cn)

## 一键部署

1. **Fork 本项目**：点击右上角的 Fork 按钮，将本项目复制到你的 GitHub 仓库。

### Vercel 部署

<a href="https://vercel.com/new/clone?repository-url=https://github.com/junxiaopang/all-image-prompts" target="_blank" rel="noopener noreferrer">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

## ✨ Core Features

- **🤖 Multi-Model Support**: Comprehensive support and categorized display for various models including Midjourney, DALL-E, GPT-4o, Flux, Grok, Gemini, Seedream, etc.
- **⚡ High Performance**:
  - Powered by **Vite** for blazing fast builds.
  - Image and data **Lazy Loading** for smooth browsing of large content.
- **🎨 Modern UI Design**:
  - Built with **Tailwind CSS 4.0**, featuring a clean and elegant style.
  - **Responsive Layout**: Perfectly adapted for both desktop and mobile (mobile supports bottom navigation and drawer menu).
  - **Masonry Layout**: Immersive browsing experience.
  - **Dark Mode**: Built-in exquisite dark/light theme switching, supporting automatic system follow or manual control.
- **🔍 Powerful Filtering & Search**:
  - **Model Classification**: Filter by model series (e.g., GPT series, Seedream series).
  - **Tag Filtering**: Support multi-select tags for precise lookup.
  - **Instant Search**: Support global search by title, prompt content, and tags.
- **🌍 Internationalization (i18n)**: Native support for English and Chinese interface switching.
- **💡 Convenient Interactions**:
  - **One-Click Copy**: Quickly copy prompts to clipboard.
  - **Detail Preview**: Click cards to view high-definition images, complete prompts, and parameters.
  - **Back to Top**: Easier browsing for long pages.

## 🛠 Tech Stack

| Technology    | Description                                   |
| ------------- | --------------------------------------------- |
| **Framework** | [React 19](https://react.dev/)                |
| **Bundler**   | [Vite 6](https://vitejs.dev/)                 |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com/)    |
| **Language**  | [TypeScript](https://www.typescriptlang.org/) |
| **Icons**     | [Lucide React](https://lucide.dev/)           |

## 🚀 Quick Start

### 1. Prerequisites

Ensure your environment has the following installed:

- **Node.js**: Recommended v18 or higher
- **Package Manager**: [pnpm](https://pnpm.io/) is recommended (npm or yarn also works)

### 2. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/junxiaopang/all-image-prompts.git
cd all-image-prompts

# Install dependencies
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

After starting, visit `http://localhost:3000` in your browser to preview the project.

### 4. Build for Production

```bash
pnpm build
```

The build artifacts will be output to the `dist/` directory.

## 📂 Project Structure

This project follows standard React engineering directory structure:

```text
├── public/            # Static assets (favicon, manifest, etc.)
├── src/
│   ├── components/    # UI Components (Header, PromptCard, Filters, etc.)
│   ├── data/          # Prompt data source JSON files
│   ├── App.tsx        # Main application component
│   ├── index.tsx      # Application entry
│   ├── constants.ts   # Core constants (Model mapping, Configuration)
│   ├── translations.ts# i18n texts
│   ├── types.ts       # TypeScript type definitions
│   └── styles.css     # Global styles (Tailwind imports)
├── index.html         # HTML template
├── package.json       # Project dependencies and scripts
├── tailwind.config.js # Tailwind configuration
└── vite.config.ts     # Vite configuration
```

## 📝 Data Management

The core data of this project is stored in JSON files under the `src/data/` directory, achieving separation of data and view.

### Add New Prompt

1.  Find the corresponding model data file (e.g., `src/data/grok.json`).
2.  Add a new object to the array:

```json
{
  "id": "unique-uuid-or-number",
  "title": "Example Title",
  "prompts": ["Enter complete prompt here...", "Supports multiple prompts"],
  "images": ["/path/to/image.jpg"],
  "model": "grok",
  "tags": ["landscape", "cyberpunk"],
  "source": {
    "name": "Author Name",
    "url": "https://www.kkkm.cn"
  }
}
```

### Add New Model

If you need to support a new model:

1.  Add the mapping relationship in `MODEL_MAP` in `src/constants.ts`.
2.  Categorize it in `MODEL_CATEGORIES`.

## 🤝 Contribution

We welcome community contributions! Whether it's submitting new Prompts, fixing bugs, or improving documentation:

Prompt Submission: [Feishu Form](https://tcn1uh5rxo87.feishu.cn/share/base/form/shrcne5gDolOMDd0oJsj2XfvxQc) or [Issues](https://github.com/junxiaopang/all-image-prompts/issues/new)

## 🤝 Acknowledgements

The prompts in this project are collected from the internet, including but not limited to [Jimeng Community](https://jimeng.jianying.com/ai-tool/asset), [gpt4o-image-prompts](https://github.com/songguoxs/gpt4o-image-prompts/), [x.com](https://x.com), and [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts). If we have infringed upon your rights, please contact us for removal!

## 🤝 Sponsorship

If you find this project helpful, scan the WeChat QR code to buy me a milk tea!

![Sponsorship Code](public/static/shang.png)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
