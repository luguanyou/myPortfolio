# API 测试文档

## 环境准备

1. 启动开发服务器：
```bash
npm run dev
```

服务器默认运行在 `http://localhost:3000`

---

## API 测试清单

### 1. GET /api/projects - 项目列表

#### 基础测试
```bash
# 获取所有项目
curl http://localhost:3000/api/projects

# 分页查询
curl "http://localhost:3000/api/projects?page=1&limit=3"

# 按类别筛选
curl "http://localhost:3000/api/projects?category=数字孪生"

# 搜索关键词
curl "http://localhost:3000/api/projects?search=Three.js"

# 组合查询
curl "http://localhost:3000/api/projects?category=可视化&search=表格&page=1&limit=5"
```

#### 预期响应
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "slug": "smart-warehouse",
        "title": "智能仓储数字孪生平台",
        "description": "三维场景 + 实时数据联动，支持设备状态与货物流转动画。",
        "tags": ["Three.js", "WebGL", "性能优化"],
        "category": "数字孪生",
        "createdAt": "2024-01-15T00:00:00.000Z",
        "updatedAt": "2024-06-30T00:00:00.000Z"
      }
    ],
    "total": 6,
    "page": 1,
    "limit": 10
  }
}
```

---

### 2. GET /api/projects/[slug] - 项目详情

#### 基础测试
```bash
# 获取项目详情
curl http://localhost:3000/api/projects/smart-warehouse

# 不存在的项目
curl http://localhost:3000/api/projects/non-existent
```

#### 预期响应（成功）
```json
{
  "success": true,
  "data": {
    "id": "1",
    "slug": "smart-warehouse",
    "title": "智能仓储数字孪生平台",
    "description": "三维场景 + 实时数据联动，支持设备状态与货物流转动画。",
    "tags": ["Three.js", "WebGL", "性能优化"],
    "category": "数字孪生",
    "role": "前端负责人 / 独立交付",
    "period": "2024.01 - 2024.06",
    "techStack": ["Next.js", "Three.js", "TypeScript", "WebSocket"],
    "links": {
      "demo": "https://demo.example.com/smart-warehouse",
      "github": "https://github.com/yourname/smart-warehouse",
      "article": "https://blog.example.com/smart-warehouse"
    },
    "kpis": [
      {
        "label": "关键场景优化",
        "value": "FPS +15"
      }
    ],
    "background": "...",
    "responsibilities": [...],
    "technicalSolution": [...],
    "challenges": [...],
    "screenshots": []
  }
}
```

#### 预期响应（404）
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "项目 \"non-existent\" 不存在"
  }
}
```

---

### 3. POST /api/contact - 联系表单提交

#### 基础测试
```bash
# 正常提交
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "message": "你好，我对你的项目很感兴趣，想了解更多细节。"
  }'
```

#### 预期响应（成功）
```json
{
  "success": true,
  "data": {
    "id": "contact_1234567890_abc123",
    "createdAt": "2025-01-XX..."
  }
}
```

#### 错误测试
```bash
# 邮箱格式错误
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "invalid-email",
    "message": "测试消息"
  }'

# 消息太短
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "test@example.com",
    "message": "短"
  }'

# 测试 Rate Limit（快速连续发送 6 次）
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "测试用户",
      "email": "test@example.com",
      "message": "这是第 '$i' 次测试消息，用于验证频率限制功能。"
    }'
  echo ""
done
```

#### 预期响应（Rate Limit）
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "请求过于频繁，请 XX 秒后再试"
  }
}
```

---

### 4. GET /api/resume/download - 简历下载

#### 基础测试
```bash
# 下载简历（需要先创建 public/resume.pdf 文件）
curl -O http://localhost:3000/api/resume/download

# 或使用浏览器访问
# http://localhost:3000/api/resume/download
```

#### 预期响应
- 成功：返回 PDF 文件流，Content-Type: `application/pdf`
- 404：如果文件不存在，返回 JSON 错误

---

## 前端页面验证

### 1. 项目列表页
访问：`http://localhost:3000/projects`
- 页面应正常显示项目列表
- 筛选按钮应可点击（前端功能）
- 搜索框应可输入（前端功能）

### 2. 项目详情页
访问：`http://localhost:3000/projects/smart-warehouse`
- 页面应显示完整的项目详情
- 所有字段应正确渲染

### 3. 联系页面
访问：`http://localhost:3000/contact`
- 表单应可提交
- 提交后应显示成功提示（需要前端集成 API）

### 4. 简历页面
访问：`http://localhost:3000/resume`
- 下载按钮应可点击（需要前端集成 API）

---

## 注意事项

1. **简历 PDF 文件**：需要在 `public/resume.pdf` 放置真实的 PDF 文件，否则下载接口会返回 404。

2. **Rate Limit**：联系表单接口有频率限制（1 分钟内最多 5 次），测试时注意间隔。

3. **数据存储**：
   - 项目数据：存储在 `data/projects.json`
   - 联系表单：内存存储（重启后丢失），生产环境应使用数据库

4. **开发环境**：错误响应会包含 `details` 字段，生产环境不会暴露。

---

## 使用 Postman 或类似工具

可以导入以下 JSON 作为 Postman Collection：

```json
{
  "info": {
    "name": "Portfolio API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Projects",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects"
      }
    },
    {
      "name": "Get Project Detail",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/projects/smart-warehouse"
      }
    },
    {
      "name": "Submit Contact Form",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"测试用户\",\n  \"email\": \"test@example.com\",\n  \"message\": \"这是一条测试消息，用于验证联系表单接口。\"\n}"
        },
        "url": "http://localhost:3000/api/contact"
      }
    },
    {
      "name": "Download Resume",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/resume/download"
      }
    }
  ]
}
```

