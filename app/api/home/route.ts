/**
 * GET /api/home
 * 获取首页内容（Hero、KPI、优势、精选项目、技术栈）
 */
import { NextRequest } from 'next/server';
import { getContentData } from '@/lib/api/content';
import { successResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const content = await getContentData();
    return successResponse(content.home);
  } catch (error) {
    console.error('GET /api/home error:', error);
    return internalErrorResponse('获取首页内容失败', error);
  }
}

