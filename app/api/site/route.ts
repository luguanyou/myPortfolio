/**
 * GET /api/site
 * 获取站点基础信息（品牌、导航、页脚、SEO）
 */
import { NextRequest } from 'next/server';
import { getContentData } from '@/lib/api/content';
import { successResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const content = await getContentData();
    return successResponse(content.site);
  } catch (error) {
    console.error('GET /api/site error:', error);
    return internalErrorResponse('获取站点信息失败', error);
  }
}

