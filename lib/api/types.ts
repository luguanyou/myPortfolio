/**
 * API 共享类型定义
 */

// ========== 统一响应格式 ==========
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// ========== 联系表单 ==========
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  createdAt: string;
}

// ========== 项目相关 ==========
export type ProjectCategory = '数字孪生' | '可视化' | 'AI 应用' | '全部';

export interface ProjectsQuery {
  category?: ProjectCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: '数字孪生' | '可视化' | 'AI 应用';
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface ProjectDetail extends Project {
  role: string;
  period: string;
  techStack: string[];
  links: {
    demo?: string;
    github?: string;
    article?: string;
  };
  kpis: Array<{
    label: string;
    value: string;
  }>;
  background: string;
  responsibilities: string[];
  technicalSolution: Array<{
    title: string;
    description: string;
  }>;
  challenges: Array<{
    title: string;
    description: string;
  }>;
  screenshots: string[];
}

// ========== 错误码常量 ==========
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

