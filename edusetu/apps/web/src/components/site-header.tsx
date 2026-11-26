'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, GraduationCap, Menu, X } from 'lucide-react';

const links = [
  { href: '/institutions', label: 'Explore institutions' },
  { href: '/for-institutions', label: 'For institutions' },
  { href: '/pricing', label: 'Pricing' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="EduSetu home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.1} /></span>
          <span className="brand-word">edu<span>setu</span><small>EDUCATION, CONNECTED.</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'nav-link active' : 'nav-link'}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/parent" className="text-link header-portal">Your space <ArrowUpRight size={15} /></Link>
          <Link href="/sign-in" className="button button-dark button-small">Sign in <ArrowUpRight size={15} /></Link>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          <Link href="/parent" onClick={() => setMenuOpen(false)}>Your space</Link>
          <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Sign in <ArrowUpRight size={15} /></Link>
        </nav>
      )}
    </header>
  );
}
