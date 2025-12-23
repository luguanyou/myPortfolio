'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { SiteInfo } from '@/lib/types/content';

interface HeaderProps {
  siteInfo: SiteInfo;
}

export default function Header({ siteInfo }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-[var(--header-h)] border-b border-[var(--border)] bg-white/90 backdrop-blur-md flex items-center">
      <div className="container-custom w-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-[1.1] min-w-[160px] group">
          <strong className="text-[16px] tracking-[0.2px] text-[var(--text)] group-hover:underline">
            {siteInfo.branding.name}
          </strong>
          <span className="text-[12px] text-[var(--text-muted)]">
            {siteInfo.branding.subtitle}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-end gap-[20px] flex-wrap">
          {siteInfo.navigation.map((item) => {
            // Check if the link is active
            // For homepage ('/'), exact match. For others, startsWith.
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
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
            <Link href={siteInfo.ctaButton.href}>
              {siteInfo.ctaButton.label}
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
