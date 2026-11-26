import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = { title: 'Platform administration' };

export default function AdminPage() {
  return <main className="auth-page"><div className="auth-shell"><Link href="/" className="back-link"><ArrowLeft size={15} /> Back to EduSetu</Link><div className="auth-card"><span className="auth-icon"><LockKeyhole size={24} /></span><span className="eyebrow">PLATFORM OPERATIONS</span><h1>Trust needs<br /><em>careful hands.</em></h1><p>The EduSetu administration console is reserved for explicitly provisioned platform roles. It is not a public registration destination.</p><div className="auth-notice"><ShieldAlert size={18} /><div><strong>Privileged access is not configured</strong><span>Moderator and verification workflows are protected by server-side permissions. The first admin must be provisioned through the documented bootstrap process.</span></div></div><Link href="/" className="button button-dark button-full">Return to public site</Link></div><div className="auth-footer"><span>EDUSETU · PLATFORM TRUST</span><span>Every action accountable.</span></div></div></main>;
}
