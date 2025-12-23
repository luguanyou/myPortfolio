# 数据库集成总结

## 概述

本项目已集成 MySQL 数据库支持，可以自动在数据库模式和 JSON 文件模式之间切换。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

这将安装 `mysql2` 和 `@types/mysql2`。

### 2. 设置 MySQL 数据库

参考 `MYSQL_SETUP.md` 完成数据库安装和配置。

### 3. 创建数据库和表结构

```bash
mysql -u root -p < database/migrations/001_initial_schema.sql
```

### 4. 配置环境变量

在 `.env.local` 文件中添加：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
```

### 5. 迁移数据（可选）

如果已有 JSON 数据，运行迁移脚本：

```bash
node database/migrations/002_migrate_projects.js
```

### 6. 启动应用

```bash
npm run dev
```

## 数据库设计

### 表结构

- **projects**: 项目基本信息
- **project_tags**: 项目标签（多对多）
- **project_tech_stack**: 项目技术栈
- **project_links**: 项目链接（demo、github、article）
- **project_kpis**: 项目 KPI 指标
- **project_sections**: 项目详细内容（背景、职责、技术方案、挑战）
- **project_screenshots**: 项目截图
- **contacts**: 联系表单提交记录

详细设计请参考 `DATABASE_DESIGN.md`。

## 工作模式

### 数据库模式

当配置了 `DB_HOST` 环境变量时，系统自动使用数据库：

- 项目数据从 MySQL 读取
- 联系表单提交保存到 MySQL
- 支持事务和连接池

### JSON 文件模式（默认）

当未配置 `DB_HOST` 时，系统使用 JSON 文件：

- 项目数据从 `data/projects.json` 读取
- 联系表单提交存储在内存中（重启后丢失）

## 代码结构

```
lib/
├── db/
│   └── connection.ts          # 数据库连接配置和工具函数
└── api/
    ├── data.ts                # 数据访问层（自动切换模式）
    └── data-db.ts             # 数据库版本的数据访问层

database/
└── migrations/
    ├── 001_initial_schema.sql # 数据库表结构
    └── 002_migrate_projects.js # 数据迁移脚本
```

## API 使用

数据访问层会自动根据环境变量选择模式，API 调用方式不变：

```typescript
import { getProjects, getProjectBySlug, saveContactSubmission } from '@/lib/api/data';

// 这些函数会自动使用数据库或 JSON 文件
const projects = await getProjects();
const project = await getProjectBySlug('smart-warehouse');
const submission = await saveContactSubmission({ name, email, message });
```

## 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `DB_HOST` | MySQL 主机地址 | `localhost` | 否（不配置则使用 JSON 模式）|
| `DB_PORT` | MySQL 端口 | `3306` | 否 |
| `DB_USER` | MySQL 用户名 | `root` | 否 |
| `DB_PASSWORD` | MySQL 密码 | `''` | 否 |
| `DB_NAME` | 数据库名称 | `portfolio_db` | 否 |

## 故障排查

### 数据库连接失败

1. 检查 MySQL 服务是否运行
2. 检查环境变量配置是否正确
3. 检查数据库是否存在
4. 检查用户权限

### 数据读取失败

系统会自动回退到 JSON 文件模式，检查控制台日志查看错误信息。

### 迁移脚本失败

1. 确保已执行 `001_initial_schema.sql` 创建表结构
2. 检查 JSON 文件路径是否正确
3. 检查数据库连接配置

## 相关文档

- **数据库设计**: `DATABASE_DESIGN.md` - 详细的表结构设计
- **MySQL 设置**: `MYSQL_SETUP.md` - 安装和配置指南
- **环境变量**: `ENV_CONFIG.md` - 完整的环境变量说明

## 下一步

1. ✅ 数据库连接已配置
2. ✅ 数据访问层已实现
3. ✅ 迁移脚本已准备
4. 🔄 运行迁移脚本导入数据
5. 🔄 测试数据库功能
6. 🔄 部署到生产环境
