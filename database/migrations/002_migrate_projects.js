/**
 * 数据迁移脚本：从 JSON 文件迁移到 MySQL 数据库
 * 
 * 使用方法：
 * 1. 确保已创建数据库和表结构（执行 001_initial_schema.sql）
 * 2. 配置环境变量：DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 * 3. 运行：node database/migrations/002_migrate_projects.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  charset: 'utf8mb4',
};

// 读取 JSON 文件
async function loadProjectsFromJSON() {
  const filePath = path.join(process.cwd(), 'data', 'projects.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

// 迁移项目数据
async function migrateProjects() {
  let connection;
  
  try {
    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ 数据库连接成功');

    // 读取 JSON 数据
    const projects = await loadProjectsFromJSON();
    console.log(`📦 找到 ${projects.length} 个项目需要迁移`);

    // 开始事务
    await connection.beginTransaction();

    for (const project of projects) {
      // 1. 插入项目基本信息
      await connection.execute(
        `INSERT INTO projects 
         (id, slug, title, description, category, role, period, thumbnail_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         description = VALUES(description),
         category = VALUES(category),
         role = VALUES(role),
         period = VALUES(period),
         thumbnail_url = VALUES(thumbnail_url),
         updated_at = VALUES(updated_at)`,
        [
          project.id,
          project.slug,
          project.title,
          project.description,
          project.category,
          project.role || null,
          project.period || null,
          project.thumbnailUrl || null,
          project.createdAt,
          project.updatedAt,
        ]
      );

      // 2. 插入标签
      if (project.tags && project.tags.length > 0) {
        // 先删除旧标签
        await connection.execute('DELETE FROM project_tags WHERE project_id = ?', [project.id]);
        // 插入新标签
        for (const tag of project.tags) {
          await connection.execute(
            'INSERT INTO project_tags (project_id, tag) VALUES (?, ?) ON DUPLICATE KEY UPDATE tag = tag',
            [project.id, tag]
          );
        }
      }

      // 3. 插入技术栈
      if (project.techStack && project.techStack.length > 0) {
        // 先删除旧技术栈
        await connection.execute('DELETE FROM project_tech_stack WHERE project_id = ?', [project.id]);
        // 插入新技术栈
        for (const tech of project.techStack) {
          await connection.execute(
            'INSERT INTO project_tech_stack (project_id, tech) VALUES (?, ?) ON DUPLICATE KEY UPDATE tech = tech',
            [project.id, tech]
          );
        }
      }

      // 4. 插入链接
      if (project.links) {
        // 先删除旧链接
        await connection.execute('DELETE FROM project_links WHERE project_id = ?', [project.id]);
        // 插入新链接
        if (project.links.demo) {
          await connection.execute(
            'INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url)',
            [project.id, 'demo', project.links.demo]
          );
        }
        if (project.links.github) {
          await connection.execute(
            'INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url)',
            [project.id, 'github', project.links.github]
          );
        }
        if (project.links.article) {
          await connection.execute(
            'INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url)',
            [project.id, 'article', project.links.article]
          );
        }
      }

      // 5. 插入 KPI
      if (project.kpis && project.kpis.length > 0) {
        // 先删除旧 KPI
        await connection.execute('DELETE FROM project_kpis WHERE project_id = ?', [project.id]);
        // 插入新 KPI
        for (let i = 0; i < project.kpis.length; i++) {
          const kpi = project.kpis[i];
          await connection.execute(
            'INSERT INTO project_kpis (project_id, label, value, sort_order) VALUES (?, ?, ?, ?)',
            [project.id, kpi.label, kpi.value, i]
          );
        }
      }

      // 6. 插入详细内容
      if (project.background || project.responsibilities || project.technicalSolution || project.challenges) {
        // 先删除旧内容
        await connection.execute('DELETE FROM project_sections WHERE project_id = ?', [project.id]);

        // 插入背景
        if (project.background) {
          await connection.execute(
            'INSERT INTO project_sections (project_id, section_type, content, sort_order) VALUES (?, ?, ?, ?)',
            [project.id, 'background', project.background, 0]
          );
        }

        // 插入职责
        if (project.responsibilities && project.responsibilities.length > 0) {
          for (let i = 0; i < project.responsibilities.length; i++) {
            await connection.execute(
              'INSERT INTO project_sections (project_id, section_type, content, sort_order) VALUES (?, ?, ?, ?)',
              [project.id, 'responsibility', project.responsibilities[i], i]
            );
          }
        }

        // 插入技术方案
        if (project.technicalSolution && project.technicalSolution.length > 0) {
          for (let i = 0; i < project.technicalSolution.length; i++) {
            const solution = project.technicalSolution[i];
            await connection.execute(
              'INSERT INTO project_sections (project_id, section_type, title, content, sort_order) VALUES (?, ?, ?, ?, ?)',
              [project.id, 'technical_solution', solution.title, solution.description, i]
            );
          }
        }

        // 插入挑战
        if (project.challenges && project.challenges.length > 0) {
          for (let i = 0; i < project.challenges.length; i++) {
            const challenge = project.challenges[i];
            await connection.execute(
              'INSERT INTO project_sections (project_id, section_type, title, content, sort_order) VALUES (?, ?, ?, ?, ?)',
              [project.id, 'challenge', challenge.title, challenge.description, i]
            );
          }
        }
      }

      // 7. 插入截图
      if (project.screenshots && project.screenshots.length > 0) {
        // 先删除旧截图
        await connection.execute('DELETE FROM project_screenshots WHERE project_id = ?', [project.id]);
        // 插入新截图
        for (let i = 0; i < project.screenshots.length; i++) {
          await connection.execute(
            'INSERT INTO project_screenshots (project_id, url, sort_order) VALUES (?, ?, ?)',
            [project.id, project.screenshots[i], i]
          );
        }
      }

      console.log(`✅ 已迁移项目: ${project.title} (${project.slug})`);
    }

    // 提交事务
    await connection.commit();
    console.log('✅ 所有项目迁移完成！');

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行迁移
if (require.main === module) {
  migrateProjects()
    .then(() => {
      console.log('🎉 迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('迁移脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { migrateProjects };
