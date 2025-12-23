/**
 * 数据访问层 - MySQL 数据库版本
 */
import { query, queryOne, execute } from '@/lib/db/connection';
import { Project, ProjectDetail } from './types';

/**
 * 读取所有项目数据（包含详情）
 */
export async function getProjects(): Promise<ProjectDetail[]> {
  try {
    // 查询项目基本信息
    const projects = await query<{
      id: string;
      slug: string;
      title: string;
      description: string;
      category: '数字孪生' | '可视化' | 'AI 应用';
      role: string | null;
      period: string | null;
      thumbnail_url: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT id, slug, title, description, category, role, period, 
       thumbnail_url, created_at, updated_at 
       FROM projects 
       ORDER BY created_at DESC`
    );

    // 为每个项目加载关联数据
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const [tags, techStack, links, kpis, sections, screenshots] = await Promise.all([
          // 标签
          query<{ tag: string }>(
            'SELECT tag FROM project_tags WHERE project_id = ? ORDER BY tag',
            [project.id]
          ),
          // 技术栈
          query<{ tech: string }>(
            'SELECT tech FROM project_tech_stack WHERE project_id = ? ORDER BY tech',
            [project.id]
          ),
          // 链接
          query<{ type: string; url: string }>(
            'SELECT type, url FROM project_links WHERE project_id = ?',
            [project.id]
          ),
          // KPI
          query<{ label: string; value: string; sort_order: number }>(
            'SELECT label, value, sort_order FROM project_kpis WHERE project_id = ? ORDER BY sort_order, id',
            [project.id]
          ),
          // 详细内容
          query<{ section_type: string; title: string | null; content: string; sort_order: number }>(
            'SELECT section_type, title, content, sort_order FROM project_sections WHERE project_id = ? ORDER BY section_type, sort_order, id',
            [project.id]
          ),
          // 截图
          query<{ url: string; sort_order: number }>(
            'SELECT url, sort_order FROM project_screenshots WHERE project_id = ? ORDER BY sort_order, id',
            [project.id]
          ),
        ]);

        // 构建链接对象
        const linksObj: { demo?: string; github?: string; article?: string } = {};
        links.forEach((link) => {
          if (link.type === 'demo') linksObj.demo = link.url;
          if (link.type === 'github') linksObj.github = link.url;
          if (link.type === 'article') linksObj.article = link.url;
        });

        // 构建详细内容
        const background = sections.find((s) => s.section_type === 'background')?.content || '';
        const responsibilities = sections
          .filter((s) => s.section_type === 'responsibility')
          .map((s) => s.content);
        const technicalSolution = sections
          .filter((s) => s.section_type === 'technical_solution')
          .map((s) => ({
            title: s.title || '',
            description: s.content,
          }));
        const challenges = sections
          .filter((s) => s.section_type === 'challenge')
          .map((s) => ({
            title: s.title || '',
            description: s.content,
          }));

        return {
          id: project.id,
          slug: project.slug,
          title: project.title,
          description: project.description,
          tags: tags.map((t) => t.tag),
          category: project.category,
          thumbnailUrl: project.thumbnail_url || undefined,
          createdAt: project.created_at.toISOString(),
          updatedAt: project.updated_at.toISOString(),
          role: project.role || '',
          period: project.period || '',
          techStack: techStack.map((t) => t.tech),
          links: linksObj,
          kpis: kpis.map((k) => ({ label: k.label, value: k.value })),
          background,
          responsibilities,
          technicalSolution,
          challenges,
          screenshots: screenshots.map((s) => s.url),
        } as ProjectDetail;
      })
    );

    return projectsWithDetails;
  } catch (error) {
    console.error('Failed to read projects from database:', error);
    return [];
  }
}

/**
 * 根据 slug 获取项目详情
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const project = await queryOne<{
      id: string;
      slug: string;
      title: string;
      description: string;
      category: '数字孪生' | '可视化' | 'AI 应用';
      role: string | null;
      period: string | null;
      thumbnail_url: string | null;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT id, slug, title, description, category, role, period, 
       thumbnail_url, created_at, updated_at 
       FROM projects 
       WHERE slug = ?`,
      [slug]
    );

    if (!project) {
      return null;
    }

    // 加载关联数据（与 getProjects 相同的逻辑）
    const [tags, techStack, links, kpis, sections, screenshots] = await Promise.all([
      query<{ tag: string }>(
        'SELECT tag FROM project_tags WHERE project_id = ? ORDER BY tag',
        [project.id]
      ),
      query<{ tech: string }>(
        'SELECT tech FROM project_tech_stack WHERE project_id = ? ORDER BY tech',
        [project.id]
      ),
      query<{ type: string; url: string }>(
        'SELECT type, url FROM project_links WHERE project_id = ?',
        [project.id]
      ),
      query<{ label: string; value: string; sort_order: number }>(
        'SELECT label, value, sort_order FROM project_kpis WHERE project_id = ? ORDER BY sort_order, id',
        [project.id]
      ),
      query<{ section_type: string; title: string | null; content: string; sort_order: number }>(
        'SELECT section_type, title, content, sort_order FROM project_sections WHERE project_id = ? ORDER BY section_type, sort_order, id',
        [project.id]
      ),
      query<{ url: string; sort_order: number }>(
        'SELECT url, sort_order FROM project_screenshots WHERE project_id = ? ORDER BY sort_order, id',
        [project.id]
      ),
    ]);

    const linksObj: { demo?: string; github?: string; article?: string } = {};
    links.forEach((link) => {
      if (link.type === 'demo') linksObj.demo = link.url;
      if (link.type === 'github') linksObj.github = link.url;
      if (link.type === 'article') linksObj.article = link.url;
    });

    const background = sections.find((s) => s.section_type === 'background')?.content || '';
    const responsibilities = sections
      .filter((s) => s.section_type === 'responsibility')
      .map((s) => s.content);
    const technicalSolution = sections
      .filter((s) => s.section_type === 'technical_solution')
      .map((s) => ({
        title: s.title || '',
        description: s.content,
      }));
    const challenges = sections
      .filter((s) => s.section_type === 'challenge')
      .map((s) => ({
        title: s.title || '',
        description: s.content,
      }));

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      tags: tags.map((t) => t.tag),
      category: project.category,
      thumbnailUrl: project.thumbnail_url || undefined,
      createdAt: project.created_at.toISOString(),
      updatedAt: project.updated_at.toISOString(),
      role: project.role || '',
      period: project.period || '',
      techStack: techStack.map((t) => t.tech),
      links: linksObj,
      kpis: kpis.map((k) => ({ label: k.label, value: k.value })),
      background,
      responsibilities,
      technicalSolution,
      challenges,
      screenshots: screenshots.map((s) => s.url),
    } as ProjectDetail;
  } catch (error) {
    console.error('Failed to read project from database:', error);
    return null;
  }
}

/**
 * 联系表单数据存储
 */
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

/**
 * 保存联系表单提交
 */
export async function saveContactSubmission(data: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactSubmission> {
  const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  try {
    await execute(
      'INSERT INTO contacts (id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, data.name, data.email, data.message, createdAt]
    );

    return {
      id,
      ...data,
      createdAt,
    };
  } catch (error) {
    console.error('Failed to save contact submission:', error);
    throw error;
  }
}

/**
 * 获取联系表单提交数量（用于统计）
 */
export async function getContactSubmissionCount(): Promise<number> {
  try {
    const result = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM contacts'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get contact submission count:', error);
    return 0;
  }
}
