import { SiteInfo } from '@/lib/types/content';

interface FooterProps {
  siteInfo: SiteInfo;
}

export default function Footer({ siteInfo }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] py-[40px] text-[14px] text-[var(--text-muted)]">
      <div className="container-custom flex flex-wrap justify-between gap-4">
        <div>&copy; {new Date().getFullYear()} {siteInfo.footer.copyright}</div>
        <div>
          邮箱：{siteInfo.footer.links.email} · GitHub：{siteInfo.footer.links.github} · 微信：{siteInfo.footer.links.wechat}
        </div>
      </div>
    </footer>
  );
}
