/**
 * GET /api/resume/download
 * 简历 PDF 下载接口
 */
import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { notFoundResponse, internalErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    // 简历 PDF 文件路径
    const resumePath = path.join(process.cwd(), 'public', 'resume.pdf');

    // 检查文件是否存在
    try {
      await fs.access(resumePath);
    } catch {
      // 文件不存在，返回 404
      return notFoundResponse('简历文件不存在');
    }

    // 读取文件
    const fileBuffer = await fs.readFile(resumePath);

    // 返回 PDF 文件流
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('GET /api/resume/download error:', error);
    return internalErrorResponse('下载简历失败', error);
  }
}

