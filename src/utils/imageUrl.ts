/**
 * 获取图片完整 URL
 * 如果配置了 VITE_IMAGE_BASE_URL 且路径以 images/ 开头，则使用外部 CDN 地址
 * 否则使用本地相对路径（static/ 等本地资源不受影响）
 */
export function getImageUrl(path: string): string {
  const cleanPath = path.replace(/^\//, '')

  // 只对 images/ 路径使用 CDN，static/ 等本地资源不受影响
  if (__IMAGE_BASE_URL__ && cleanPath.startsWith('images/')) {
    const base = __IMAGE_BASE_URL__.replace(/\/$/, '')
    return `${base}/${cleanPath}`
  }

  return `/${cleanPath}`
}
