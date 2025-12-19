/**
 * Zod 校验 Schema
 */
import { z } from 'zod';

// ========== 联系表单校验 ==========
export const contactRequestSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(50, '姓名不能超过50个字符'),
  email: z.string().email('邮箱格式不正确'),
  message: z.string().min(10, '消息内容至少10个字符').max(2000, '消息内容不能超过2000个字符'),
});

// ========== 项目列表查询校验 ==========
export const projectsQuerySchema = z.object({
  category: z.enum(['数字孪生', '可视化', 'AI 应用', '全部']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
});

// ========== 项目详情路径参数校验 ==========
export const projectSlugSchema = z.object({
  slug: z.string().min(1, '项目标识不能为空'),
});

