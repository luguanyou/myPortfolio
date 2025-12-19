/**
 * POST /api/contact
 * 联系表单提交接口
 */
import { NextRequest } from 'next/server';
import { contactRequestSchema } from '@/lib/api/schemas';
import {
  successResponse,
  validationErrorResponse,
  rateLimitResponse,
  internalErrorResponse,
} from '@/lib/api/response';
import { saveContactSubmission } from '@/lib/api/data';
import { checkRateLimit, getClientIP } from '@/lib/api/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate Limit 检查
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`contact:${clientIP}`, {
      maxRequests: 5,      // 5 次
      windowMs: 60 * 1000, // 1 分钟
    });

    if (!rateLimitResult.allowed) {
      return rateLimitResponse(
        `请求过于频繁，请 ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} 秒后再试`
      );
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return validationErrorResponse('请求体格式错误，需要 JSON 格式');
    }

    // 校验请求数据
    const validationResult = contactRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        '表单数据校验失败',
        validationResult.error.issues
      );
    }

    const { name, email, message } = validationResult.data;

    // 保存提交（内存存储）
    const submission = saveContactSubmission({ name, email, message });

    // 可选：发送邮件通知（生产环境）
    // await sendEmailNotification({ name, email, message });

    // 返回成功响应
    return successResponse(
      {
        id: submission.id,
        createdAt: submission.createdAt,
      },
      201
    );
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return internalErrorResponse('提交联系表单失败', error);
  }
}

