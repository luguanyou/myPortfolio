/**
 * GET /api/resume
 * 获取简历页面内容
 */
import { NextRequest } from 'next/server';
import { getContentData } from '@/lib/api/content';
import { successResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const content = await getContentData();
    return successResponse(content.resume);
  } catch (error) {
    console.error('GET /api/resume error:', error);
    return internalErrorResponse('获取简历内容失败', error);
  }
}

