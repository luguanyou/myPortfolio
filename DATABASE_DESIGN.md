# 数据库设计文档

## 概述

本项目使用 MySQL 数据库存储项目数据和联系表单提交记录。

## 数据库表设计

### 1. `projects` 表 - 项目数据

存储所有项目信息，包括基本信息、技术栈、链接、KPI、背景、职责、技术方案、挑战和截图等。

```sql
CREATE TABLE `projects` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT '项目ID',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT '项目标识符（URL友好）',
  `title` VARCHAR(200) NOT NULL COMMENT '项目标题',
  `description` TEXT NOT NULL COMMENT '项目描述',
  `category` ENUM('数字孪生', '可视化', 'AI 应用') NOT NULL COMMENT '项目类别',
  `role` VARCHAR(200) COMMENT '角色/职责',
  `period` VARCHAR(100) COMMENT '项目周期',
  `thumbnail_url` VARCHAR(500) COMMENT '缩略图URL',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_category` (`category`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';
```

### 2. `project_tags` 表 - 项目标签

存储项目的标签（多对多关系）。

```sql
CREATE TABLE `project_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_tag` (`project_id`, `tag`),
  INDEX `idx_project_id` (`project_id`),
  INDEX `idx_tag` (`tag`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目标签表';
```

### 3. `project_tech_stack` 表 - 项目技术栈

存储项目使用的技术栈。

```sql
CREATE TABLE `project_tech_stack` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `tech` VARCHAR(100) NOT NULL COMMENT '技术名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_tech` (`project_id`, `tech`),
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目技术栈表';
```

### 4. `project_links` 表 - 项目链接

存储项目的相关链接（demo、github、article等）。

```sql
CREATE TABLE `project_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `type` ENUM('demo', 'github', 'article') NOT NULL COMMENT '链接类型',
  `url` VARCHAR(500) NOT NULL COMMENT '链接URL',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_link_type` (`project_id`, `type`),
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目链接表';
```

### 5. `project_kpis` 表 - 项目KPI指标

存储项目的关键绩效指标。

```sql
CREATE TABLE `project_kpis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `label` VARCHAR(200) NOT NULL COMMENT 'KPI标签',
  `value` VARCHAR(200) NOT NULL COMMENT 'KPI值',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目KPI表';
```

### 6. `project_sections` 表 - 项目详细内容

存储项目的背景、职责、技术方案、挑战等详细内容。

```sql
CREATE TABLE `project_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `section_type` ENUM('background', 'responsibility', 'technical_solution', 'challenge') NOT NULL COMMENT '内容类型',
  `title` VARCHAR(200) COMMENT '标题（用于technical_solution和challenge）',
  `content` TEXT NOT NULL COMMENT '内容',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_project_id` (`project_id`),
  INDEX `idx_section_type` (`section_type`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目详细内容表';
```

### 7. `project_screenshots` 表 - 项目截图

存储项目的截图URL。

```sql
CREATE TABLE `project_screenshots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `url` VARCHAR(500) NOT NULL COMMENT '截图URL',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目截图表';
```

### 8. `contacts` 表 - 联系表单提交

存储联系表单的提交记录。

```sql
CREATE TABLE `contacts` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT '提交ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `message` TEXT NOT NULL COMMENT '消息内容',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='联系表单表';
```

## 数据库关系图

```
projects (1) ──< (N) project_tags
projects (1) ──< (N) project_tech_stack
projects (1) ──< (N) project_links
projects (1) ──< (N) project_kpis
projects (1) ──< (N) project_sections
projects (1) ──< (N) project_screenshots
```

## 索引设计

- `projects.category`: 用于按类别筛选
- `projects.slug`: 用于快速查找项目详情
- `projects.created_at`: 用于排序
- `project_tags.tag`: 用于标签搜索
- `contacts.created_at`: 用于按时间查询联系记录
- `contacts.email`: 用于按邮箱查询

## 数据迁移

从 JSON 文件迁移到数据库的步骤：

1. 创建数据库和表结构（执行 `database/migrations/001_initial_schema.sql`）
2. 运行数据迁移脚本（`database/migrations/002_migrate_projects.js`）
3. 验证数据完整性

## 注意事项

1. **字符集**: 使用 `utf8mb4` 以支持完整的 Unicode 字符（包括 emoji）
2. **外键约束**: 使用 `ON DELETE CASCADE` 确保数据一致性
3. **时间戳**: 使用 `DATETIME` 类型，支持时区转换
4. **ID 生成**: 项目 ID 使用字符串类型，保持与现有 JSON 数据兼容
5. **性能优化**: 在常用查询字段上建立索引
