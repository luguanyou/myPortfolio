/**
 * GET /api/about
 * 获取关于我页面内容
 */
import { NextRequest } from 'next/server';
import { getContentData } from '@/lib/api/content';
import { successResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const content = await getContentData();
    return successResponse(content.about);
  } catch (error) {
    console.error('GET /api/about error:', error);
    return internalErrorResponse('获取关于我内容失败', error);
  }
}

