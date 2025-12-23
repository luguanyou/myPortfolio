# 作品集网站 API 文档

## 1. 概述

本项目 API 基于 Next.js App Router 构建，提供全站内容管理、项目展示及联系表单功能。

**Base URL:** `/api`

### 1.1 统一响应格式

所有接口均返回 JSON 格式，遵循以下结构：

```typescript
interface ApiResponse<T> {
  success: boolean;    // 请求是否成功
  data?: T;           // 成功时的返回数据
  error?: {           // 失败时的错误信息
    code: string;     // 错误码
    message: string;  // 错误描述
    details?: any;    // 错误详情（仅在开发环境下可能存在）
  };
}
```

### 1.2 错误码说明

| 错误码 | HTTP 状态码 | 说明 |
| :--- | :--- | :--- |
| `VALIDATION_ERROR` | 400 | 请求参数格式错误或缺失 |
| `NOT_FOUND` | 404 | 请求的资源不存在 |
| `RATE_LIMIT` | 429 | 请求过于频繁（主要用于联系表单） |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

---

## 2. 全局信息接口

### 2.1 获取站点配置 `/api/site`
获取品牌信息、导航菜单、页脚内容及 SEO 设置。

- **方法:** `GET`
- **成功响应:**
  ```json
  {
    "success": true,
    "data": {
      "brand": { "logo": "...", "name": "..." },
      "nav": [ { "title": "...", "href": "..." } ],
      "footer": { "social": [...], "copyright": "..." }
    }
  }
  ```

---

## 3. 页面内容接口

### 3.1 获取首页内容 `/api/home`
获取 Hero 区域、关键指标、核心优势、精选项目及技术栈。

- **方法:** `GET`

### 3.2 获取关于我内容 `/api/about`
获取个人简介、教育背景、工作经历及核心技能。

- **方法:** `GET`

### 3.3 获取联系页面信息 `/api/contact-info`
获取联系方式（邮箱、电话、社交账号）及联系表单配置。

- **方法:** `GET`

### 3.4 获取简历页面内容 `/api/resume`
获取个人简历的结构化数据（工作经历、教育背景、技能等）。

- **方法:** `GET`

---

## 4. 项目管理接口

### 4.1 获取项目列表 `/api/projects`
支持按类别筛选、关键词搜索及分页。

- **方法:** `GET`
- **查询参数:**
  | 参数 | 类型 | 说明 | 默认值 |
  | :--- | :--- | :--- | :--- |
  | `category` | string | 类别筛选（数字孪生/可视化/AI 应用/全部） | `全部` |
  | `search` | string | 关键词搜索（匹配标题、描述、标签） | - |
  | `page` | number | 页码 | `1` |
  | `limit` | number | 每页数量（最大 50） | `10` |

- **成功响应:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        { "id": "1", "slug": "...", "title": "...", "tags": [...], ... }
      ],
      "total": 10,
      "page": 1,
      "limit": 10
    }
  }
  ```

### 4.2 获取项目详情 `/api/projects/[slug]`
根据项目标识符获取完整详情，包括背景、职责、技术方案、KPI 及截图。

- **方法:** `GET`
- **路径参数:** `slug` (项目唯一标识)
- **成功响应:**
  ```json
  {
    "success": true,
    "data": {
      "id": "1",
      "title": "...",
      "background": "...",
      "technicalSolution": [...],
      "challenges": [...],
      ...
    }
  }
  ```

---

## 5. 交互接口

### 5.1 提交联系表单 `/api/contact`
用户通过网站发送联系消息。

- **方法:** `POST`
- **请求体 (JSON):**
  ```json
  {
    "name": "姓名",
    "email": "email@example.com",
    "message": "消息内容"
  }
  ```
- **成功响应:**
  ```json
  {
    "success": true,
    "data": {
      "id": "contact_1739846...",
      "createdAt": "2025-02-18T..."
    }
  }
  ```
- **限制:** 1 分钟内同一 IP 最多提交 5 次。

### 5.2 下载简历 `/api/resume/download`
获取简历 PDF 文件。

- **方法:** `GET`
- **响应:** `application/pdf` 文件流。

---

## 6. 数据存储说明

本项目支持两种数据存储模式，通过环境变量自动切换：

1. **JSON 模式 (默认):**
   - 数据来源: `data/projects.json` 和 `data/content.json`。
   - 联系表单: 仅存储在服务器内存中（重启丢失）。

2. **MySQL 模式:**
   - 启用条件: 设置 `DB_HOST` 环境变量。
   - 数据来源: 数据库表。
   - 联系表单: 持久化存储至 `contacts` 表。

---

## 7. 开发与测试

### 7.1 测试工具
推荐使用 `Postman` 或 `VS Code REST Client` 测试。项目根目录提供了 `API_TEST.md` 包含常用测试命令。

### 7.2 环境变量配置
在 `.env.local` 中配置：
```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db

# 邮件配置 (用于联系表单提醒)
SMTP_HOST=smtp.qq.com
SMTP_USER=...
SMTP_PASS=...
```
