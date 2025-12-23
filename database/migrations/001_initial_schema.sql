-- 数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `portfolio_db` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- 1. 项目表
CREATE TABLE IF NOT EXISTS `projects` (
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

-- 2. 项目标签表
CREATE TABLE IF NOT EXISTS `project_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_tag` (`project_id`, `tag`),
  INDEX `idx_project_id` (`project_id`),
  INDEX `idx_tag` (`tag`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目标签表';

-- 3. 项目技术栈表
CREATE TABLE IF NOT EXISTS `project_tech_stack` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `tech` VARCHAR(100) NOT NULL COMMENT '技术名称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_tech` (`project_id`, `tech`),
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目技术栈表';

-- 4. 项目链接表
CREATE TABLE IF NOT EXISTS `project_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `type` ENUM('demo', 'github', 'article') NOT NULL COMMENT '链接类型',
  `url` VARCHAR(500) NOT NULL COMMENT '链接URL',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_project_link_type` (`project_id`, `type`),
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目链接表';

-- 5. 项目KPI表
CREATE TABLE IF NOT EXISTS `project_kpis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `label` VARCHAR(200) NOT NULL COMMENT 'KPI标签',
  `value` VARCHAR(200) NOT NULL COMMENT 'KPI值',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目KPI表';

-- 6. 项目详细内容表
CREATE TABLE IF NOT EXISTS `project_sections` (
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

-- 7. 项目截图表
CREATE TABLE IF NOT EXISTS `project_screenshots` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL COMMENT '项目ID',
  `url` VARCHAR(500) NOT NULL COMMENT '截图URL',
  `sort_order` INT DEFAULT 0 COMMENT '排序顺序',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_project_id` (`project_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目截图表';

-- 8. 联系表单表
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT '提交ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `message` TEXT NOT NULL COMMENT '消息内容',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='联系表单表';
