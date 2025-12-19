# API 后端实现文档

## 概述

本项目为个人作品集网站提供完整的后端 API 实现，基于 Next.js App Router 的 Route Handlers。

## 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **校验**：Zod
- **存储**：JSON 文件（项目数据）+ 内存存储（联系表单）

## 项目结构

```
my-portfolio/
├── app/
│   └── api/
│       ├── contact/
│       │   └── route.ts          # POST /api/contact
│       ├── projects/
│       │   ├── route.ts          # GET /api/projects
│       │   └── [slug]/
│       │       └── route.ts      # GET /api/projects/[slug]
│       └── resume/
│           └── download/
│               └── route.ts      # GET /api/resume/download
├── lib/
│   └── api/
│       ├── types.ts              # TypeScript 类型定义
│       ├── schemas.ts             # Zod 校验 Schema
│       ├── response.ts            # 统一响应工具
│       ├── rateLimit.ts          # Rate Limit 中间件
│       └── data.ts               # 数据访问层
└── data/
    └── projects.json             # 项目数据（JSON）
```

## API 接口清单

### 1. GET /api/projects

获取项目列表，支持筛选、搜索、分页。

**查询参数：**
- `category` (可选): `'数字孪生' | '可视化' | 'AI 应用' | '全部'`
- `search` (可选): 搜索关键词（匹配标题、描述、标签）
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10，最大 50

**响应示例：**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 6,
    "page": 1,
    "limit": 10
  }
}
```

---

### 2. GET /api/projects/[slug]

获取项目详情。

**路径参数：**
- `slug`: 项目标识符

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "slug": "smart-warehouse",
    "title": "智能仓储数字孪生平台",
    ...
  }
}
```

---

### 3. POST /api/contact

提交联系表单。

**请求体：**
```json
{
  "name": "string (1-50 字符)",
  "email": "string (邮箱格式)",
  "message": "string (10-2000 字符)"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "contact_1234567890_abc123",
    "createdAt": "2025-01-XX..."
  }
}
```

**Rate Limit：** 1 分钟内最多 5 次请求

---

### 4. GET /api/resume/download

下载简历 PDF 文件。

**响应：** PDF 文件流（Content-Type: `application/pdf`）

**注意：** 需要在 `public/resume.pdf` 放置真实的 PDF 文件

---

## 统一响应格式

所有 API 接口遵循统一的响应格式：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;  // 仅开发环境
  };
}
```

## 错误码

| 错误码 | HTTP 状态码 | 说明 |
|--------|------------|------|
| `VALIDATION_ERROR` | 400 | 请求参数校验失败 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `RATE_LIMIT` | 429 | 请求频率超限 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

## 数据存储

### 项目数据

存储在 `data/projects.json`，格式如下：

```json
[
  {
    "id": "1",
    "slug": "smart-warehouse",
    "title": "...",
    "description": "...",
    "tags": [...],
    "category": "数字孪生",
    ...
  }
]
```

### 联系表单

当前使用内存存储（重启后丢失）。生产环境建议：
- 使用数据库（PostgreSQL/MySQL）
- 或发送邮件通知
- 或接入第三方服务（如 Formspree）

## 安全特性

1. **输入校验**：使用 Zod 对所有输入进行校验
2. **Rate Limiting**：联系表单接口有频率限制
3. **错误处理**：统一错误响应，生产环境不暴露敏感信息
4. **类型安全**：TypeScript 类型检查

## 开发指南

### 添加新项目

编辑 `data/projects.json`，添加新的项目对象。

### 修改 Rate Limit

编辑 `app/api/contact/route.ts` 中的 `checkRateLimit` 调用：

```typescript
checkRateLimit(`contact:${clientIP}`, {
  maxRequests: 5,      // 修改这里
  windowMs: 60 * 1000, // 修改这里
})
```

### 添加新的 API 接口

1. 在 `app/api/` 下创建新的路由文件
2. 在 `lib/api/types.ts` 中添加类型定义
3. 在 `lib/api/schemas.ts` 中添加校验 Schema
4. 使用 `lib/api/response.ts` 中的工具函数返回响应

## 环境变量

当前无需环境变量。如需添加（如数据库连接、邮件服务等），创建 `.env.local`：

```env
DATABASE_URL=...
SMTP_HOST=...
```

## 部署注意事项

1. **简历 PDF**：确保 `public/resume.pdf` 文件存在
2. **数据文件**：确保 `data/projects.json` 可读
3. **Rate Limit**：生产环境建议使用 Redis 实现分布式限流
4. **联系表单**：建议接入真实的邮件服务或数据库存储

## 测试

详见 `API_TEST.md` 文件。

## 后续优化建议

1. **数据库集成**：使用 Prisma + PostgreSQL/MySQL
2. **邮件服务**：联系表单提交后发送邮件通知
3. **Redis Rate Limit**：生产环境使用 Redis 实现分布式限流
4. **日志系统**：接入日志服务（如 Winston、Pino）
5. **监控告警**：接入 APM 工具（如 Sentry）
6. **API 文档**：使用 Swagger/OpenAPI 生成文档

