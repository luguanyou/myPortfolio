# 环境变量配置说明

## 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件（此文件不会被 Git 提交），添加以下配置：

```env
# 数据库配置（MySQL）
# 如果配置了数据库，系统将自动使用数据库存储数据
# 如果不配置，将使用 JSON 文件模式（开发模式）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=portfolio_db

# 邮件服务配置（SMTP）
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ邮箱@qq.com
SMTP_PASS=你的授权码
CONTACT_RECIPIENT_EMAIL=923206295@qq.com
```

## QQ 邮箱授权码获取步骤

1. 登录 QQ 邮箱：https://mail.qq.com
2. 点击右上角 **设置** → **账户**
3. 找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
4. 开启 **POP3/SMTP服务** 或 **IMAP/SMTP服务**
5. 点击 **生成授权码**，按提示发送短信验证
6. 复制生成的 **授权码**（16位字符，不是登录密码）

## 配置示例

### 完整配置示例（包含数据库和邮件）

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db

# 邮件服务配置
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=923206295@qq.com
SMTP_PASS=abcdefghijklmnop
CONTACT_RECIPIENT_EMAIL=923206295@qq.com
```

### 仅邮件配置（不使用数据库）

```env
# 不配置 DB_HOST，系统将使用 JSON 文件模式
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=923206295@qq.com
SMTP_PASS=abcdefghijklmnop
CONTACT_RECIPIENT_EMAIL=923206295@qq.com
```

**注意：** 
- `SMTP_PASS` 是授权码，不是 QQ 邮箱的登录密码！
- 如果配置了 `DB_HOST`，系统会自动使用数据库；否则使用 JSON 文件模式

## 其他邮箱服务商配置

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 163 邮箱
```env
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@163.com
SMTP_PASS=your-authorization-code
```

## 数据库配置说明

### MySQL 数据库设置

1. **安装 MySQL**
   - Windows: 下载 MySQL Installer 或使用 XAMPP/WAMP
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server` 或 `sudo yum install mysql-server`

2. **创建数据库**
   ```sql
   CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **执行数据库迁移**
   - 运行 SQL 脚本创建表结构：`database/migrations/001_initial_schema.sql`
   - 运行迁移脚本导入数据：`node database/migrations/002_migrate_projects.js`

4. **配置环境变量**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=portfolio_db
   ```

### 数据库迁移步骤

1. **创建数据库和表结构**
   ```bash
   mysql -u root -p < database/migrations/001_initial_schema.sql
   ```

2. **迁移项目数据（从 JSON 到数据库）**
   ```bash
   # 确保已配置环境变量
   node database/migrations/002_migrate_projects.js
   ```

3. **验证数据**
   - 启动应用：`npm run dev`
   - 访问项目列表页面，确认数据正常显示

### 数据存储模式

- **数据库模式**：当配置了 `DB_HOST` 时，所有数据存储在 MySQL 数据库中
- **JSON 文件模式**：当未配置 `DB_HOST` 时，项目数据从 `data/projects.json` 读取，联系表单存储在内存中

详细配置说明请查看：
- 数据库设计：`DATABASE_DESIGN.md`
- 邮件配置：`EMAIL_SETUP.md`

