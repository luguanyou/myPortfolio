/**
 * GET /api/projects/[slug]
 * 项目详情接口
 */
import { NextRequest } from 'next/server';
import { getProjectBySlug } from '@/lib/api/data';
import { projectSlugSchema } from '@/lib/api/schemas';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  internalErrorResponse,
} from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 等待 params Promise 解析
    const { slug } = await params;
    
    // 校验 slug 参数
    const validationResult = projectSlugSchema.safeParse({ slug });
    if (!validationResult.success) {
      return validationErrorResponse(
        '项目标识格式错误',
        validationResult.error.issues
      );
    }

    const validatedSlug = validationResult.data.slug;

    // 获取项目详情
    const project = await getProjectBySlug(validatedSlug);

    if (!project) {
      return notFoundResponse(`项目 "${validatedSlug}" 不存在`);
    }

    return successResponse(project);
  } catch (error) {
    console.error('GET /api/projects/[slug] error:', error);
    return internalErrorResponse('获取项目详情失败', error);
  }
}

