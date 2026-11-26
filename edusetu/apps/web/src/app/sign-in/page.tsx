import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to EduSetu</Link>
        <div className="auth-card">
          <span className="auth-icon"><LockKeyhole size={24} /></span>
          <span className="eyebrow">ACCOUNT ACCESS</span>
          <h1>Your EduSetu<br /><em>starts here.</em></h1>
          <p>Secure sign-in is part of the platform foundation, but an identity provider has not been selected and configured yet.</p>
          <div className="auth-notice"><ShieldCheck size={18} /><div><strong>Sign-in is not enabled in this build</strong><span>Public institution discovery is available. Protected actions will open once authentication, session security and account recovery are ready.</span></div></div>
          <Link href="/institutions" className="button button-dark button-full">Continue exploring <ArrowLeft size={15} className="icon-flip" /></Link>
          <span className="auth-microcopy">No demo credentials. No pretend accounts. Just a clear setup status.</span>
        </div>
        <div className="auth-footer"><span>EDUSETU · EDUCATION, CONNECTED.</span><span>Trust before growth.</span></div>
      </div>
    </main>
  );
}
