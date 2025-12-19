/**
 * 简单的 Rate Limit 实现（内存存储）
 * 生产环境建议使用 Redis 或专业限流中间件
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// 内存存储：IP -> 限流记录
const rateLimitStore = new Map<string, RateLimitEntry>();

// 清理过期记录（每5分钟执行一次）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Rate Limit 配置
 */
interface RateLimitConfig {
  maxRequests: number;      // 最大请求数
  windowMs: number;         // 时间窗口（毫秒）
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 5,            // 5 次
  windowMs: 60 * 1000,       // 1 分钟
};

/**
 * 检查是否超过频率限制
 * @param identifier 标识符（通常是 IP 地址）
 * @param config 限流配置
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // 创建新记录或重置过期记录
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // 检查是否超过限制
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // 增加计数
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * 从请求中获取客户端 IP
 */
export function getClientIP(request: Request): string {
  // 尝试从 headers 获取真实 IP（如果经过代理）
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // 降级到 localhost（开发环境）
  return 'localhost';
}

