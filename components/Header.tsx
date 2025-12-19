'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';

const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '关于我', href: '/about' },
  { label: '简历', href: '/resume' },
  { label: '联系', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-[var(--header-h)] border-b border-[var(--border)] bg-white/90 backdrop-blur-md flex items-center">
      <div className="container-custom w-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-[1.1] min-w-[160px] group">
          <strong className="text-[16px] tracking-[0.2px] text-[var(--text)] group-hover:underline">Allen Lu</strong>
          <span className="text-[12px] text-[var(--text-muted)]">前端 · 可视化 · AI 应用</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-end gap-[20px] flex-wrap">
          {NAV_ITEMS.map((item) => {
            // Check if the link is active
            // For homepage ('/'), exact match. For others, startsWith.
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[14px] transition-colors hover:underline ${
                  isActive ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          <Button asChild variant="primary" className="ml-2">
            <Link href="/contact">
              约聊 / 合作
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button (Placeholder) */}
        <button className="md:hidden p-2 text-[var(--text)]">
          <span className="sr-only">Open menu</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
