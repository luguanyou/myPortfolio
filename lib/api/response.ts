/**
 * 统一响应工具函数
 */
import { NextResponse } from 'next/server';
import { ApiResponse, ApiError, ErrorCodes } from './types';

/**
 * 成功响应
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * 错误响应
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    },
    { status }
  );
}

/**
 * 验证错误响应
 */
export function validationErrorResponse(message: string, details?: any) {
  return errorResponse(ErrorCodes.VALIDATION_ERROR, message, 400, details);
}

/**
 * 未找到错误响应
 */
export function notFoundResponse(message: string = '资源不存在') {
  return errorResponse(ErrorCodes.NOT_FOUND, message, 404);
}

/**
 * 频率限制错误响应
 */
export function rateLimitResponse(message: string = '请求过于频繁，请稍后再试') {
  return errorResponse(ErrorCodes.RATE_LIMIT, message, 429);
}

/**
 * 服务器错误响应
 */
export function internalErrorResponse(message: string = '服务器内部错误', details?: any) {
  return errorResponse(ErrorCodes.INTERNAL_ERROR, message, 500, details);
}

