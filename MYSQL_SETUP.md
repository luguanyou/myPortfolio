# MySQL 数据库设置指南

## 快速开始

### 1. 安装 MySQL

#### Windows
- 下载 MySQL Installer: https://dev.mysql.com/downloads/installer/
- 或使用 XAMPP/WAMP（包含 MySQL）

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. 创建数据库

登录 MySQL：
```bash
mysql -u root -p
```

创建数据库：
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;
```

### 3. 执行数据库迁移

#### 方法 1：使用 MySQL 命令行
```bash
mysql -u root -p portfolio_db < database/migrations/001_initial_schema.sql
```

#### 方法 2：在 MySQL 客户端中执行
```sql
SOURCE database/migrations/001_initial_schema.sql;
```

### 4. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
```

### 5. 迁移项目数据

从 JSON 文件迁移到数据库：

```bash
# 确保已安装依赖
npm install

# 运行迁移脚本
node database/migrations/002_migrate_projects.js
```

### 6. 验证安装

启动开发服务器：
```bash
npm run dev
```

访问 http://localhost:3000/projects，确认项目数据正常显示。

## 数据库连接测试

创建测试脚本 `test-db-connection.js`：

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_db',
    });
    
    console.log('✅ 数据库连接成功！');
    await connection.end();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('请检查：');
    console.error('1. MySQL 服务是否运行');
    console.error('2. 环境变量配置是否正确');
    console.error('3. 数据库是否存在');
    console.error('4. 用户名和密码是否正确');
  }
}

testConnection();
```

运行测试：
```bash
node test-db-connection.js
```

## 常见问题

### 问题 1：连接被拒绝

**错误信息**：`ECONNREFUSED`

**解决方案**：
- 检查 MySQL 服务是否运行：`sudo systemctl status mysql` (Linux) 或 `brew services list` (macOS)
- 检查端口是否正确（默认 3306）
- 检查防火墙设置

### 问题 2：访问被拒绝

**错误信息**：`Access denied for user`

**解决方案**：
- 检查用户名和密码是否正确
- 检查用户是否有访问数据库的权限：
  ```sql
  GRANT ALL PRIVILEGES ON portfolio_db.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### 问题 3：数据库不存在

**错误信息**：`Unknown database 'portfolio_db'`

**解决方案**：
- 创建数据库：`CREATE DATABASE portfolio_db;`
- 或修改环境变量中的 `DB_NAME`

### 问题 4：字符编码问题

**解决方案**：
- 确保数据库使用 `utf8mb4` 字符集
- 检查表结构是否正确创建

### 问题 5：迁移脚本执行失败

**解决方案**：
- 确保已执行 `001_initial_schema.sql` 创建表结构
- 检查 JSON 文件路径是否正确
- 检查数据库连接配置

## 生产环境建议

1. **使用连接池**：已配置连接池，最大连接数 10
2. **使用环境变量**：不要在代码中硬编码数据库密码
3. **定期备份**：设置数据库自动备份
4. **监控连接**：监控数据库连接数和性能
5. **使用 SSL**：生产环境建议启用 SSL 连接

## 数据库维护

### 备份数据库
```bash
mysqldump -u root -p portfolio_db > backup_$(date +%Y%m%d).sql
```

### 恢复数据库
```bash
mysql -u root -p portfolio_db < backup_20240101.sql
```

### 查看表结构
```sql
DESCRIBE projects;
SHOW CREATE TABLE projects;
```

### 查看数据统计
```sql
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM contacts;
SELECT category, COUNT(*) FROM projects GROUP BY category;
```

## 相关文档

- 数据库设计：`DATABASE_DESIGN.md`
- 环境变量配置：`ENV_CONFIG.md`
- API 文档：`API_README.md`
