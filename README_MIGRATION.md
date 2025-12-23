# 数据库迁移工具使用说明

## 快速开始

### 方法 1: 使用一键迁移脚本（推荐）

直接双击运行 `migrate-database.bat`，脚本会自动：

1. 检查 Node.js 和 MySQL 是否安装
2. 读取 `.env.local` 中的数据库配置（如果存在）
3. 提示输入数据库密码（如果未配置）
4. 创建数据库和表结构
5. 从 JSON 文件迁移数据到数据库

### 方法 2: 使用简化版脚本

如果遇到问题，可以尝试使用 `migrate-database-simple.bat`，这是一个更简单的版本。

## 使用前准备

### 1. 确保已安装 MySQL

- Windows: 下载 MySQL Installer 或使用 XAMPP/WAMP
- 确保 MySQL 服务正在运行
- 确保 `mysql` 命令在系统 PATH 中

### 2. 确保已安装 Node.js

- 下载地址: https://nodejs.org/
- 确保 `node` 和 `npm` 命令可用

### 3. 配置数据库信息（可选）

在 `.env.local` 文件中配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db
```

如果不配置，脚本会提示输入密码。

## 手动迁移步骤

如果批处理文件无法运行，可以手动执行：

### 步骤 1: 创建数据库和表结构

```bash
mysql -u root -p < database/migrations/001_initial_schema.sql
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 运行迁移脚本

```bash
# 设置环境变量（Windows CMD）
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=your_password
set DB_NAME=portfolio_db

# 运行迁移
node database/migrations/002_migrate_projects.js
```

或者使用 PowerShell：

```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_USER="root"
$env:DB_PASSWORD="your_password"
$env:DB_NAME="portfolio_db"
node database/migrations/002_migrate_projects.js
```

## 常见问题

### 问题 1: "未检测到 MySQL 命令行工具"

**解决方案**:
- 将 MySQL 的 `bin` 目录添加到系统 PATH
- 或手动执行 SQL 脚本：`mysql -u root -p < database/migrations/001_initial_schema.sql`

### 问题 2: "数据库连接失败"

**检查项**:
- MySQL 服务是否运行
- 用户名和密码是否正确
- 数据库主机和端口是否正确
- 防火墙是否阻止连接

### 问题 3: "SQL 脚本执行失败"

**可能原因**:
- 数据库已存在但表结构不同
- 权限不足
- SQL 语法错误

**解决方案**:
- 删除现有数据库重新创建：`DROP DATABASE portfolio_db;`
- 检查用户权限
- 查看 MySQL 错误日志

### 问题 4: "数据迁移失败"

**检查项**:
- `data/projects.json` 文件是否存在
- JSON 文件格式是否正确
- 数据库表结构是否已创建
- 环境变量是否正确设置

## 验证迁移结果

### 方法 1: 使用 MySQL 命令行

```bash
mysql -u root -p portfolio_db

# 查看项目数量
SELECT COUNT(*) FROM projects;

# 查看项目列表
SELECT id, slug, title, category FROM projects;

# 查看联系表单数量
SELECT COUNT(*) FROM contacts;
```

### 方法 2: 启动应用验证

```bash
npm run dev
```

访问 http://localhost:3000/projects，确认项目数据正常显示。

## 回滚迁移

如果需要回滚，可以删除数据库：

```sql
DROP DATABASE portfolio_db;
```

然后重新运行迁移脚本。

## 注意事项

1. **备份数据**: 迁移前建议备份现有数据库（如果存在）
2. **环境变量**: 确保 `.env.local` 中的配置正确
3. **权限**: 确保数据库用户有创建数据库和表的权限
4. **字符集**: 数据库使用 `utf8mb4` 字符集，支持中文和 emoji

## 相关文件

- `migrate-database.bat` - 完整版迁移脚本（带详细检查和提示）
- `migrate-database-simple.bat` - 简化版迁移脚本
- `database/migrations/001_initial_schema.sql` - 数据库表结构
- `database/migrations/002_migrate_projects.js` - 数据迁移脚本
- `MYSQL_SETUP.md` - MySQL 安装和配置指南
