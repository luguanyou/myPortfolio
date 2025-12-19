/**
 * 数据访问层
 */
import { promises as fs } from 'fs';
import path from 'path';
import { Project, ProjectDetail } from './types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

/**
 * 读取项目数据
 */
export async function getProjects(): Promise<ProjectDetail[]> {
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
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * 联系表单数据存储（内存，生产环境应使用数据库）
 */
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const contactSubmissions: ContactSubmission[] = [];

/**
 * 保存联系表单提交
 */
export function saveContactSubmission(data: {
  name: string;
  email: string;
  message: string;
}): ContactSubmission {
  const submission: ContactSubmission = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  contactSubmissions.push(submission);
  
  // 可选：追加到文件（用于持久化）
  // 生产环境建议使用数据库
  
  return submission;
}

/**
 * 获取联系表单提交数量（用于统计）
 */
export function getContactSubmissionCount(): number {
  return contactSubmissions.length;
}

