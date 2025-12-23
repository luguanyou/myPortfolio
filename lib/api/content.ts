/**
 * 内容数据访问层
 */
import { promises as fs } from 'fs';
import path from 'path';
import { ContentData } from '@/lib/types/content';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

let cachedContent: ContentData | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

/**
 * 读取内容数据（带缓存）
 */
export async function getContentData(): Promise<ContentData> {
  const now = Date.now();
  
  // 如果缓存有效，直接返回
  if (cachedContent && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedContent;
  }

  try {
    const fileContent = await fs.readFile(CONTENT_FILE, 'utf-8');
    const data = JSON.parse(fileContent) as ContentData;
    
    // 更新缓存
    cachedContent = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Failed to read content.json:', error);
    throw new Error('Failed to load content data');
  }
}

/**
 * 清除缓存（用于开发环境热更新）
 */
export function clearContentCache() {
  cachedContent = null;
  cacheTimestamp = 0;
}

