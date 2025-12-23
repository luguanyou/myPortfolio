/**
 * 邮件服务模块
 * 使用 nodemailer 发送邮件
 */
import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 创建邮件传输器
 */
function createTransporter(): nodemailer.Transporter | null {
  // 从环境变量读取配置
  const smtpHost = process.env.SMTP_HOST || 'smtp.qq.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpSecure = process.env.SMTP_SECURE !== 'false'; // 默认 true (SSL)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 检查必要的配置
  if (!smtpUser || !smtpPass) {
    console.warn('邮件服务未配置：缺少 SMTP_USER 或 SMTP_PASS 环境变量');
    return null;
  }

  const config: EmailConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  };

  return nodemailer.createTransport(config);
}

/**
 * 发送邮件
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const transporter = createTransporter();

  if (!transporter) {
    console.error('邮件服务未配置，无法发送邮件');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"作品集网站" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // 纯文本版本
    });

    console.log('邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

/**
 * 发送联系表单通知邮件
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || '923206295@qq.com';
  
  const subject = `【作品集网站】新的联系表单提交 - ${data.name}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f6f7f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #475569; margin-bottom: 5px; display: block; }
        .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; }
        .message-box { background: white; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0; white-space: pre-wrap; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">新的联系表单提交</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">姓名：</span>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>
          <div class="field">
            <span class="label">邮箱：</span>
            <div class="value">${escapeHtml(data.email)}</div>
          </div>
          <div class="field">
            <span class="label">消息内容：</span>
            <div class="message-box">${escapeHtml(data.message)}</div>
          </div>
          <div class="footer">
            <p>此邮件来自作品集网站联系表单，发送时间：${new Date().toLocaleString('zh-CN')}</p>
            <p>回复此邮件可直接联系：<a href="mailto:${data.email}">${data.email}</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
  });
}

/**
 * HTML 转义函数（防止 XSS）
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

