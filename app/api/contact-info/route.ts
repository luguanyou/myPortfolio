/**
 * GET /api/contact-info
 * 获取联系页面信息
 */
import { NextRequest } from 'next/server';
import { getContentData } from '@/lib/api/content';
import { successResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const content = await getContentData();
    return successResponse(content.contact);
  } catch (error) {
    console.error('GET /api/contact-info error:', error);
    return internalErrorResponse('获取联系信息失败', error);
  }
}

