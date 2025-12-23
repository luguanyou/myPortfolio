/**
 * 内容数据类型定义
 */

// ========== 站点信息 ==========
export interface SiteInfo {
  branding: {
    name: string;
    subtitle: string;
  };
  navigation: Array<{
    label: string;
    href: string;
  }>;
  ctaButton: {
    label: string;
    href: string;
  };
  footer: {
    copyright: string;
    links: {
      email: string;
      github: string;
      wechat: string;
    };
  };
  seo: {
    title: string;
    description: string;
  };
}

// ========== 首页内容 ==========
export interface HomeContent {
  hero: {
    title: string;
    description: string;
    mediaPlaceholder?: string;
    ctas: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'default';
    }>;
  };
  kpis: Array<{
    value: string;
    label: string;
  }>;
  advantages: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  featuredProjects: {
    title: string;
    description: string;
    projectSlugs: string[];
  };
  techStack: {
    title: string;
    description: string;
    categories: Array<{
      title: string;
      tags: string[];
    }>;
  };
}

// ========== 关于我内容 ==========
export interface AboutContent {
  page: {
    title: string;
    description: string;
  };
  intro: {
    summary: string;
    workStyle: string[];
  };
  timeline: Array<{
    period: string;
    company?: string;
    description: string;
  }>;
  methodology: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
}

// ========== 联系页面信息 ==========
export interface ContactInfo {
  page: {
    title: string;
    description: string;
  };
  info: {
    title: string;
    description: string;
    contacts: {
      email: string;
      github: string;
      wechat: string;
    };
  };
  form: {
    submitHint: string;
  };
}

// ========== 简历页面内容 ==========
export interface ResumeContent {
  page: {
    title: string;
    description: string;
  };
  summary: {
    title: string;
    items: string[];
  };
  download: {
    pdfUrl: string;
    email: string;
  };
  preview: {
    placeholder: string;
  };
}

// ========== 完整内容数据 ==========
export interface ContentData {
  site: SiteInfo;
  home: HomeContent;
  about: AboutContent;
  contact: ContactInfo;
  resume: ResumeContent;
}

