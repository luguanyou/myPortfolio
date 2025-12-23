import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getContentData } from "@/lib/api/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 获取站点信息
  let siteInfo;
  try {
    const content = await getContentData();
    siteInfo = content.site;
  } catch (error) {
    console.error('Failed to load site info:', error);
    // 降级到默认值
    siteInfo = {
      branding: { name: 'Allen Lu', subtitle: '前端 · 可视化 · AI 应用' },
      navigation: [
        { label: '首页', href: '/' },
        { label: '项目', href: '/projects' },
        { label: '关于我', href: '/about' },
        { label: '简历', href: '/resume' },
        { label: '联系', href: '/contact' },
      ],
      ctaButton: { label: '约聊 / 合作', href: '/contact' },
      footer: {
        copyright: 'Allen Lu · 极简商务作品集原型',
        links: {
          email: '923206295@qq.com',
          github: 'github.com/yourname',
          wechat: 'yourwechat',
        },
      },
      seo: {
        title: 'Allen Lu - 前端工程师作品集',
        description: '个人作品集网站',
      },
    };
  }

  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <title>{siteInfo.seo.title}</title>
        <meta name="description" content={siteInfo.seo.description} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <Header siteInfo={siteInfo} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer siteInfo={siteInfo} />
      </body>
    </html>
  );
}
