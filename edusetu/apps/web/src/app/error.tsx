'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="auth-page"><div className="auth-shell"><div className="auth-card"><span className="auth-icon"><AlertTriangle size={24} /></span><span className="eyebrow">A TEMPORARY INTERRUPTION</span><h1>Let's try<br /><em>that again.</em></h1><p>Something interrupted this page. Your review or account information has not been confirmed as saved.</p><button type="button" className="button button-dark button-full" onClick={() => reset()}><RefreshCw size={15} /> Try again</button><Link href="/" className="text-link error-home-link">Return to the homepage</Link></div></div></main>
  );
}
