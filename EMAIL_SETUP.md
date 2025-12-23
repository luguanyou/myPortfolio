# 邮件服务配置指南

## 概述

联系表单提交后会自动发送邮件通知到你的邮箱（923206295@qq.com）。

## QQ 邮箱配置步骤

### 1. 开启 SMTP 服务

1. 登录 QQ 邮箱：https://mail.qq.com
2. 点击右上角 **设置** → **账户**
3. 找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
4. 开启 **POP3/SMTP服务** 或 **IMAP/SMTP服务**
5. 点击 **生成授权码**，按提示发送短信验证
6. 复制生成的 **授权码**（16位字符，不是登录密码）

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（已添加到 .gitignore，不会被提交）：

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ邮箱@qq.com
SMTP_PASS=你的授权码
CONTACT_RECIPIENT_EMAIL=923206295@qq.com
```

### 3. 其他邮箱服务商配置

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # 需要使用应用专用密码
```

#### 163 邮箱
```env
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@163.com
SMTP_PASS=your-authorization-code
```

#### 企业邮箱（腾讯企业邮箱）
```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

## 测试邮件发送

### 方法 1：通过前端页面测试

1. 启动开发服务器：`npm run dev`
2. 访问：http://localhost:3000/contact
3. 填写表单并提交
4. 检查你的邮箱（923206295@qq.com）是否收到邮件

### 方法 2：通过 API 测试

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "email": "test@example.com",
    "message": "这是一条测试消息，用于验证邮件发送功能。"
  }'
```

## 故障排查

### 问题 1：邮件发送失败

**可能原因：**
- 环境变量未配置或配置错误
- 授权码错误（QQ 邮箱需要使用授权码，不是登录密码）
- SMTP 服务未开启

**解决方法：**
1. 检查 `.env.local` 文件是否存在且配置正确
2. 确认使用的是授权码而不是登录密码
3. 确认 QQ 邮箱已开启 SMTP 服务

### 问题 2：连接超时

**可能原因：**
- 网络问题
- 端口配置错误（QQ 邮箱 465 端口使用 SSL，587 端口使用 TLS）

**解决方法：**
- 尝试使用 587 端口，并设置 `SMTP_SECURE=false`
- 检查防火墙设置

### 问题 3：认证失败

**可能原因：**
- 用户名或密码错误
- 授权码已过期

**解决方法：**
- 重新生成授权码
- 确认邮箱地址格式正确

## 安全注意事项

1. **不要提交 `.env.local` 文件到 Git**
   - 该文件已添加到 `.gitignore`
   - 授权码是敏感信息，不要泄露

2. **生产环境建议：**
   - 使用环境变量管理服务（如 Vercel、Railway）
   - 考虑使用专业的邮件服务（如 SendGrid、Mailgun）
   - 添加邮件发送失败的重试机制

3. **Rate Limit：**
   - 联系表单接口已有频率限制（1 分钟内最多 5 次）
   - 防止恶意发送大量邮件

## 邮件模板

邮件会以 HTML 格式发送，包含：
- 发送者姓名
- 发送者邮箱（可点击回复）
- 消息内容
- 提交时间

邮件主题格式：`【作品集网站】新的联系表单提交 - {姓名}`

