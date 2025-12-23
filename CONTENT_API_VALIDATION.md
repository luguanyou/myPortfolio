# 内容 API 验收清单

## 概述

所有硬编码数据已替换为通过 API 获取。数据源：`/data/content.json`，API 路由：`/app/api/**/route.ts`。

---

## 一、API 接口测试

### 1. GET /api/site - 站点信息

```bash
curl http://localhost:3000/api/site
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "branding": {
      "name": "Allen Lu",
      "subtitle": "前端 · 可视化 · AI 应用"
    },
    "navigation": [...],
    "ctaButton": {...},
    "footer": {...},
    "seo": {...}
  }
}
```

**验证点：**
- ✅ 返回站点品牌信息
- ✅ 返回导航菜单
- ✅ 返回页脚信息
- ✅ 返回 SEO 信息

---

### 2. GET /api/home - 首页内容

```bash
curl http://localhost:3000/api/home
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "hero": {...},
    "kpis": [...],
    "advantages": {...},
    "featuredProjects": {...},
    "techStack": {...}
  }
}
```

**验证点：**
- ✅ Hero 标题、描述、CTA 按钮
- ✅ KPI 卡片（3个）
- ✅ 核心优势（3个）
- ✅ 精选项目 slug 列表
- ✅ 技术栈分类和标签

---

### 3. GET /api/about - 关于我内容

```bash
curl http://localhost:3000/api/about
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "page": {...},
    "intro": {...},
    "timeline": [...],
    "methodology": {...}
  }
}
```

**验证点：**
- ✅ 页面标题和描述
- ✅ 一句话介绍和工作方式
- ✅ 经历时间线（3条）
- ✅ 方法论卡片（3个）

---

### 4. GET /api/contact-info - 联系页面信息

```bash
curl http://localhost:3000/api/contact-info
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "page": {...},
    "info": {...},
    "form": {...}
  }
}
```

**验证点：**
- ✅ 页面标题和描述
- ✅ 联系方式（邮箱、GitHub、微信）
- ✅ 表单提示文案

---

### 5. GET /api/resume - 简历页面内容

```bash
curl http://localhost:3000/api/resume
```

**预期响应：**
```json
{
  "success": true,
  "data": {
    "page": {...},
    "summary": {...},
    "download": {...},
    "preview": {...}
  }
}
```

**验证点：**
- ✅ 页面标题和描述
- ✅ 简历摘要列表
- ✅ 下载链接和邮箱
- ✅ 预览占位文案

---

## 二、前端页面验证

### 1. 首页 (http://localhost:3000/)

**验证步骤：**
1. 访问首页
2. 检查 Hero 区域：
   - ✅ 标题显示："前端工程师｜可视化/Three.js｜AI 应用"
   - ✅ 描述显示正确
   - ✅ 3个 CTA 按钮（查看项目、下载简历、联系我）
   - ✅ 3个 KPI 卡片显示
3. 检查核心优势区域：
   - ✅ 标题："核心优势"
   - ✅ 3个优势卡片显示
4. 检查精选项目区域：
   - ✅ 显示 3 个精选项目（从 projects.json 获取）
   - ✅ 项目卡片可点击跳转
5. 检查技术栈区域：
   - ✅ 4个技术栈分类显示
   - ✅ 每个分类的标签显示正确

**数据来源：** `/api/home` + `/api/projects`

---

### 2. Header 导航栏

**验证步骤：**
1. 检查品牌区域：
   - ✅ 显示 "Allen Lu"
   - ✅ 显示副标题："前端 · 可视化 · AI 应用"
2. 检查导航菜单：
   - ✅ 显示 5 个导航项（首页、项目、关于我、简历、联系）
   - ✅ 当前页面高亮显示
3. 检查 CTA 按钮：
   - ✅ 显示 "约聊 / 合作" 按钮

**数据来源：** `/api/site`（在 layout.tsx 中获取）

---

### 3. Footer 页脚

**验证步骤：**
1. 检查版权信息：
   - ✅ 显示 "© 2025 Allen Lu · 极简商务作品集原型"
2. 检查联系方式：
   - ✅ 显示邮箱、GitHub、微信

**数据来源：** `/api/site`（在 layout.tsx 中获取）

---

### 4. 项目列表页 (http://localhost:3000/projects)

**验证步骤：**
1. 检查页面标题和描述
2. 检查筛选栏：
   - ✅ 显示分类按钮（全部、数字孪生、可视化、AI 应用）
   - ✅ 显示搜索框
   - ✅ 显示项目总数（从 projects.json 获取）
3. 检查项目列表：
   - ✅ 显示所有项目卡片
   - ✅ 项目信息正确显示

**数据来源：** `/api/projects`（已有接口）

---

### 5. 关于我页面 (http://localhost:3000/about)

**验证步骤：**
1. 检查页面标题和描述
2. 检查左侧卡片：
   - ✅ 一句话介绍显示
   - ✅ 工作方式列表（3条）显示
3. 检查右侧卡片：
   - ✅ 经历时间线（3条）显示
4. 检查方法论区域：
   - ✅ 标题和描述显示
   - ✅ 3个方法论卡片显示

**数据来源：** `/api/about`

---

### 6. 联系页面 (http://localhost:3000/contact)

**验证步骤：**
1. 检查页面标题和描述
2. 检查左侧联系方式卡片：
   - ✅ 显示邮箱、GitHub、微信
3. 检查右侧表单：
   - ✅ 表单可正常提交
   - ✅ 提交后显示成功提示
4. 检查表单提示文案：
   - ✅ 显示 "提交后我会收到邮件通知，并尽快回复你。"

**数据来源：** `/api/contact-info`

---

### 7. 简历页面 (http://localhost:3000/resume)

**验证步骤：**
1. 检查页面标题和描述
2. 检查左侧摘要卡片：
   - ✅ 显示 4 条摘要信息
   - ✅ "下载 PDF" 按钮可点击
   - ✅ "复制邮箱" 按钮可点击
3. 检查右侧预览区域：
   - ✅ 显示占位文案

**数据来源：** `/api/resume`

---

## 三、数据修改验证

### 修改 content.json 测试

1. **修改站点名称：**
   - 编辑 `data/content.json`，将 `site.branding.name` 改为 "Test Name"
   - 重启开发服务器：`npm run dev`
   - 访问首页，检查 Header 是否显示 "Test Name"

2. **修改首页 Hero 标题：**
   - 编辑 `data/content.json`，修改 `home.hero.title`
   - 刷新首页，检查标题是否更新

3. **修改联系方式：**
   - 编辑 `data/content.json`，修改 `contact.info.contacts.email`
   - 刷新联系页面，检查邮箱是否更新

---

## 四、错误处理验证

### 1. 数据文件缺失

**测试步骤：**
1. 临时重命名 `data/content.json` 为 `content.json.bak`
2. 访问首页
3. **预期：** 显示降级内容（使用 layout.tsx 中的默认值）或错误提示

### 2. API 请求失败

**测试步骤：**
1. 停止开发服务器
2. 访问联系页面（Client Component）
3. **预期：** 显示 "加载失败，请刷新页面重试"

---

## 五、性能验证

### 1. 缓存机制

- ✅ 内容数据有 5 分钟缓存（`lib/api/content.ts`）
- ✅ 多次请求同一接口，应该使用缓存

### 2. SSR 性能

- ✅ 首页、关于我、项目列表使用 Server Component，数据在服务端获取
- ✅ Header/Footer 在 layout.tsx 中获取，所有页面共享

---

## 六、类型安全验证

### 1. TypeScript 类型检查

```bash
npm run build
```

**预期：** ✅ 无 TypeScript 错误

### 2. 类型定义完整性

- ✅ `lib/types/content.ts` 定义了所有数据结构
- ✅ API 响应类型与前端使用类型一致

---

## 七、完整验收清单

| 项目 | 状态 | 说明 |
|------|------|------|
| API 接口全部实现 | ✅ | 5 个新接口 + 2 个已有接口 |
| 数据源文件创建 | ✅ | `/data/content.json` |
| 类型定义完整 | ✅ | `/lib/types/content.ts` |
| Header 使用 API | ✅ | 通过 layout.tsx 传递 props |
| Footer 使用 API | ✅ | 通过 layout.tsx 传递 props |
| 首页使用 API | ✅ | Server Component，直接 fetch |
| 项目列表使用 API | ✅ | Server Component，使用已有接口 |
| 关于我页面使用 API | ✅ | Server Component，直接 fetch |
| 联系页面使用 API | ✅ | Client Component，useEffect fetch |
| 简历页面使用 API | ✅ | Client Component，useEffect fetch |
| 错误处理 | ✅ | 所有页面都有错误降级 |
| Loading 状态 | ✅ | Client Component 有加载提示 |
| 构建通过 | ✅ | `npm run build` 成功 |
| 类型检查通过 | ✅ | TypeScript 编译无错误 |

---

## 八、快速验证命令

```bash
# 1. 启动开发服务器
npm run dev

# 2. 测试所有 API 接口
curl http://localhost:3000/api/site
curl http://localhost:3000/api/home
curl http://localhost:3000/api/about
curl http://localhost:3000/api/contact-info
curl http://localhost:3000/api/resume
curl http://localhost:3000/api/projects

# 3. 访问所有页面验证
# - http://localhost:3000/ (首页)
# - http://localhost:3000/projects (项目列表)
# - http://localhost:3000/about (关于我)
# - http://localhost:3000/contact (联系)
# - http://localhost:3000/resume (简历)

# 4. 修改数据测试
# 编辑 data/content.json，修改任意字段
# 重启服务器，刷新页面查看是否更新
```

---

## 完成 ✅

所有硬编码数据已成功替换为 API 数据源，所有页面和组件都已改造完成，构建通过，类型安全，可以正常使用！

