/**
 * GET /api/projects
 * 项目列表接口（支持筛选、搜索、分页）
 */
import { NextRequest } from 'next/server';
import { getProjects } from '@/lib/api/data';
import { projectsQuerySchema } from '@/lib/api/schemas';
import { successResponse, validationErrorResponse, internalErrorResponse } from '@/lib/api/response';
import { Project, ProjectCategory } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const query = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    // 校验查询参数
    const validationResult = projectsQuerySchema.safeParse(query);
    if (!validationResult.success) {
      return validationErrorResponse(
        '查询参数格式错误',
        validationResult.error.issues
      );
    }

    const { category, search, page = 1, limit = 10 } = validationResult.data;

    // 获取所有项目
    const allProjects = await getProjects();

    // 筛选：类别
    let filteredProjects = allProjects;
    if (category && category !== '全部') {
      filteredProjects = filteredProjects.filter(
        (p) => p.category === category
      );
    }

    // 筛选：搜索关键词（标题、描述、标签）
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredProjects = filteredProjects.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(searchLower);
        const descMatch = p.description.toLowerCase().includes(searchLower);
        const tagsMatch = p.tags.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );
        return titleMatch || descMatch || tagsMatch;
      });
    }

    // 分页
    const total = filteredProjects.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    // 转换为列表格式（不包含详情字段）
    const items: Project[] = paginatedProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      tags: p.tags,
      category: p.category,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return successResponse({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return internalErrorResponse('获取项目列表失败', error);
  }
}

