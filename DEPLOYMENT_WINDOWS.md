# Windows 服务器部署指南

## 一、打包后的代码位置

### 构建输出目录

Next.js 执行 `npm run build` 后，会在项目根目录生成以下文件夹：

```
my-portfolio/
├── .next/              # ⭐ 构建输出目录（最重要）
│   ├── server/        # 服务端代码
│   ├── static/         # 静态资源
│   ├── cache/          # 缓存文件
│   └── ...
├── node_modules/       # 依赖包（需要一起部署）
├── public/            # 静态文件（需要一起部署）
├── data/              # 数据文件（需要一起部署）
└── ...
```

**关键文件/文件夹：**
- `.next/` - 编译后的代码（必须部署）
- `node_modules/` - 依赖包（必须部署）
- `public/` - 静态资源（必须部署）
- `data/` - 数据文件（必须部署）
- `package.json` - 项目配置（必须部署）
- `.env.local` - 环境变量（必须部署，但不要提交到 Git）

---

## 二、Windows 服务器部署方案

### 方案 1：使用 PM2（推荐）

PM2 是 Node.js 进程管理器，支持自动重启、日志管理、集群模式等。

#### 步骤 1：在服务器上安装 Node.js

1. 下载 Node.js：https://nodejs.org/
2. 安装 Node.js（建议 LTS 版本）
3. 验证安装：
```powershell
node --version
npm --version
```

#### 步骤 2：安装 PM2

```powershell
npm install -g pm2
```

#### 步骤 3：准备部署文件

**方式 A：直接复制整个项目（推荐）**

1. 在本地构建项目：
```powershell
cd my-portfolio
npm run build
```

2. 将以下文件/文件夹复制到服务器：
   - `.next/` （整个文件夹）
   - `node_modules/` （整个文件夹）
   - `public/` （整个文件夹）
   - `data/` （整个文件夹）
   - `package.json`
   - `package-lock.json`
   - `.env.local` （环境变量文件）
   - `next.config.ts`
   - `tsconfig.json`

**方式 B：在服务器上构建（更推荐）**

1. 将源代码复制到服务器（排除 `node_modules` 和 `.next`）
2. 在服务器上安装依赖：
```powershell
npm install --production
```
3. 在服务器上构建：
```powershell
npm run build
```

#### 步骤 4：配置 PM2

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'my-portfolio',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: 'F:/path/to/my-portfolio',  // 修改为你的项目路径
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

#### 步骤 5：启动应用

```powershell
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs my-portfolio

# 设置开机自启
pm2 startup
pm2 save
```

#### 步骤 6：配置 Windows 防火墙

```powershell
# 允许端口 3000（如果使用其他端口，替换为对应端口）
New-NetFirewallRule -DisplayName "Next.js Portfolio" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

### 方案 2：使用 IIS + iisnode（适合 IIS 环境）

#### 步骤 1：安装 iisnode

1. 下载 iisnode：https://github.com/Azure/iisnode/releases
2. 安装 iisnode

#### 步骤 2：配置 IIS

1. 在 IIS 中创建新网站
2. 设置物理路径为项目根目录
3. 添加 `web.config` 文件到项目根目录：

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

4. 创建 `server.js` 文件：

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

---

### 方案 3：使用 Windows Service（NSSM）

NSSM 可以将 Node.js 应用注册为 Windows 服务。

#### 步骤 1：下载 NSSM

下载地址：https://nssm.cc/download

#### 步骤 2：安装服务

```powershell
# 解压 NSSM，进入对应架构目录（win64 或 win32）
cd nssm-2.24\win64

# 安装服务
.\nssm.exe install MyPortfolio "C:\Program Files\nodejs\node.exe" "F:\path\to\my-portfolio\node_modules\next\dist\bin\next start"

# 设置工作目录
.\nssm.exe set MyPortfolio AppDirectory "F:\path\to\my-portfolio"

# 设置环境变量
.\nssm.exe set MyPortfolio AppEnvironmentExtra NODE_ENV=production

# 启动服务
.\nssm.exe start MyPortfolio
```

---

## 三、部署清单

### 必须部署的文件/文件夹

```
✅ .next/              # 构建输出（必须）
✅ node_modules/       # 依赖包（必须）
✅ public/             # 静态资源（必须）
✅ data/               # 数据文件（必须）
✅ package.json        # 项目配置（必须）
✅ .env.local          # 环境变量（必须，但不要提交 Git）
✅ next.config.ts      # Next.js 配置（必须）
✅ tsconfig.json       # TypeScript 配置（必须）
```

### 可选文件（建议部署）

```
📦 package-lock.json   # 锁定依赖版本
📦 README.md           # 文档
📦 ecosystem.config.js # PM2 配置（如果使用 PM2）
```

### 不需要部署的文件

```
❌ .git/               # Git 仓库
❌ .next/cache/        # 缓存文件（可重新生成）
❌ node_modules/.cache/ # 缓存文件
❌ *.log               # 日志文件
❌ .env.example        # 示例文件
```

---

## 四、环境变量配置

### 在服务器上创建 `.env.local`

```env
# 邮件服务配置
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ邮箱@qq.com
SMTP_PASS=你的授权码
CONTACT_RECIPIENT_EMAIL=923206295@qq.com

# 其他环境变量
NODE_ENV=production
PORT=3000
```

---

## 五、Nginx 反向代理配置（可选）

如果使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 六、快速部署脚本

创建 `deploy.ps1`（PowerShell 脚本）：

```powershell
# 部署脚本
$projectPath = "F:\path\to\my-portfolio"

# 1. 进入项目目录
Set-Location $projectPath

# 2. 安装依赖
Write-Host "安装依赖..."
npm install --production

# 3. 构建项目
Write-Host "构建项目..."
npm run build

# 4. 重启 PM2（如果使用）
Write-Host "重启应用..."
pm2 restart my-portfolio

Write-Host "部署完成！"
```

---

## 七、常见问题

### 1. 端口被占用

```powershell
# 查看端口占用
netstat -ano | findstr :3000

# 结束进程
taskkill /PID <进程ID> /F
```

### 2. 权限问题

确保运行服务的用户有项目目录的读写权限。

### 3. 内存不足

如果服务器内存较小，可以：
- 减少 PM2 实例数
- 设置 `max_memory_restart`
- 使用 `--max-old-space-size` 限制 Node.js 内存

### 4. 静态资源 404

确保 `public/` 文件夹已正确部署。

### 5. 数据文件找不到

确保 `data/` 文件夹已正确部署，路径正确。

---

## 八、验证部署

### 1. 检查服务状态

```powershell
# PM2
pm2 status

# Windows Service
Get-Service MyPortfolio
```

### 2. 检查日志

```powershell
# PM2 日志
pm2 logs my-portfolio

# Windows Service 日志
# 查看事件查看器或配置的日志文件
```

### 3. 测试访问

```powershell
# 本地测试
curl http://localhost:3000

# 或浏览器访问
# http://your-server-ip:3000
```

---

## 九、推荐部署流程

1. **在本地构建测试**
   ```powershell
   npm run build
   npm start  # 测试生产环境
   ```

2. **准备服务器环境**
   - 安装 Node.js
   - 安装 PM2
   - 配置防火墙

3. **部署代码**
   - 复制项目文件到服务器
   - 或使用 Git 拉取代码

4. **安装依赖并构建**
   ```powershell
   npm install --production
   npm run build
   ```

5. **配置环境变量**
   - 创建 `.env.local`
   - 配置邮件服务等

6. **启动服务**
   ```powershell
   pm2 start ecosystem.config.js
   pm2 save
   ```

7. **配置反向代理**（可选）
   - 使用 Nginx 或 IIS

8. **验证部署**
   - 访问网站
   - 检查日志
   - 测试功能

---

## 完成 ✅

按照以上步骤即可将 Next.js 应用部署到 Windows 服务器。推荐使用 **PM2 方案**，简单易用且功能强大。

