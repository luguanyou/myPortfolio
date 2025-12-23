/**
 * 数据访问层
 * 支持两种模式：
 * 1. 数据库模式（当 DB_HOST 环境变量存在时）
 * 2. JSON 文件模式（默认，用于开发或没有数据库时）
 */
import { promises as fs } from 'fs';
import path from 'path';
import { Project, ProjectDetail } from './types';

// 检查是否使用数据库
const USE_DATABASE = !!process.env.DB_HOST;

// 动态导入数据库模块（仅在需要时）
async function getDbDataAccess() {
  if (!USE_DATABASE) return null;
  
  try {
    return await import('./data-db');
  } catch (error) {
    console.warn('数据库模块加载失败，将使用 JSON 文件模式:', error);
    return null;
  }
}

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

/**
 * 读取项目数据
 */
export async function getProjects(): Promise<ProjectDetail[]> {
  // 如果配置了数据库，尝试使用数据库
  if (USE_DATABASE) {
    const dbDataAccess = await getDbDataAccess();
    if (dbDataAccess) {
      try {
        return await dbDataAccess.getProjects();
      } catch (error) {
        console.error('从数据库读取项目失败，回退到 JSON 文件:', error);
        // 继续执行 JSON 文件读取逻辑
      }
    }
  }

  // JSON 文件模式（默认）
  try {
    const fileContent = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read projects.json:', error);
    return [];
  }
}

/**
 * 根据 slug 获取项目详情
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  // 如果配置了数据库，尝试使用数据库
  if (USE_DATABASE) {
    const dbDataAccess = await getDbDataAccess();
    if (dbDataAccess) {
      try {
        return await dbDataAccess.getProjectBySlug(slug);
      } catch (error) {
        console.error('从数据库读取项目失败，回退到 JSON 文件:', error);
        // 继续执行 JSON 文件读取逻辑
      }
    }
  }

  // JSON 文件模式（默认）
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
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

// 内存存储（仅用于 JSON 文件模式）
const contactSubmissions: ContactSubmission[] = [];

/**
 * 保存联系表单提交
 */
export async function saveContactSubmission(data: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactSubmission> {
  // 如果配置了数据库，尝试使用数据库
  if (USE_DATABASE) {
    const dbDataAccess = await getDbDataAccess();
    if (dbDataAccess) {
      try {
        return await dbDataAccess.saveContactSubmission(data);
      } catch (error) {
        console.error('保存到数据库失败，回退到内存存储:', error);
        // 继续执行内存存储逻辑
      }
    }
  }

  // 内存存储模式（默认）
  const submission: ContactSubmission = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  contactSubmissions.push(submission);
  
  return submission;
}

/**
 * 获取联系表单提交数量（用于统计）
 */
export async function getContactSubmissionCount(): Promise<number> {
  // 如果配置了数据库，尝试使用数据库
  if (USE_DATABASE) {
    const dbDataAccess = await getDbDataAccess();
    if (dbDataAccess) {
      try {
        return await dbDataAccess.getContactSubmissionCount();
      } catch (error) {
        console.error('从数据库读取联系表单数量失败，回退到内存存储:', error);
        // 继续执行内存存储逻辑
      }
    }
  }

  // 内存存储模式（默认）
  return contactSubmissions.length;
}

