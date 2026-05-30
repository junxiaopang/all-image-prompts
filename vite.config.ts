import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// 复制 public 目录的插件（跳过 images 和 prompts）
const copyPublicDir = (skipImages: boolean) => {
  // 始终跳过的目录
  const alwaysSkip = new Set(['prompts']);

  return {
    name: 'copy-public-dir',
    writeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const distDir = path.resolve(__dirname, 'dist');

      // 递归复制目录
      const copyDir = (src: string, dest: string) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          // 始终跳过的目录
          if (alwaysSkip.has(entry.name)) {
            console.log(`[build] 跳过目录: ${srcPath}`);
            continue;
          }

          // 如果设置了跳过图片目录
          if (skipImages && entry.name === 'images') {
            console.log(`[build] 跳过图片目录: ${srcPath}`);
            continue;
          }

          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      if (fs.existsSync(publicDir)) {
        copyDir(publicDir, distDir);
      }
    }
  };
};

export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '');
    
    // 图片资源基地址（如：https://cdn.example.com/images）
    const imageBaseUrl = env.VITE_IMAGE_BASE_URL || '';
    
    // 如果有设置图片资源地址，则跳过本地图片构建
    const skipImages = !!imageBaseUrl;
    
    if (skipImages) {
      console.log(`[build] 使用外部图片资源: ${imageBaseUrl}`);
      console.log(`[build] 跳过本地图片构建`);
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        copyPublicDir(skipImages)
      ],
      define: {
        // 将图片基地址注入到代码中
        __IMAGE_BASE_URL__: JSON.stringify(imageBaseUrl)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        postcss: './postcss.config.js',
        devSourcemap: true
      },
      build: {
        cssCodeSplit: false,
        // 使用自定义插件复制 public，禁用默认行为
        copyPublicDir: false
      }
    };
});
