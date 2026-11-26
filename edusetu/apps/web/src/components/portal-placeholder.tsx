import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function PortalPlaceholder({
  role,
  title,
  description,
  features,
}: {
  role: string;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <main className="portal-page">
      <div className="container portal-container">
        <div className="portal-breadcrumb"><Link href="/">EduSetu</Link><span>/</span><span>{role}</span></div>
        <div className="portal-hero">
          <div>
            <span className="eyebrow">{role} workspace</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="portal-illustration"><Sparkles size={25} /><span>One connected space</span><strong>Built around trust.</strong></div>
        </div>
        <div className="portal-status-card">
          <span className="portal-status-icon"><ShieldCheck size={22} /></span>
          <div><strong>Secure sign-in is not connected yet</strong><p>This workspace is a UI foundation. Account access and live records will appear after the EduSetu identity provider and protected backend workflows are configured.</p></div>
          <span className="status-pill">Setup required</span>
        </div>
        <div className="portal-feature-grid">
          {features.map((feature, index) => <div className="portal-feature" key={feature}><span className="feature-index">0{index + 1}</span><strong>{feature}</strong><span className="feature-unavailable">Not connected</span></div>)}
        </div>
        <div className="portal-bottom-cta"><div><strong>Ready to explore EduSetu?</strong><span>Public institution discovery is available without an account.</span></div><Link href="/institutions" className="button button-dark">Explore institutions <ArrowRight size={16} /></Link></div>
      </div>
    </main>
  );
}
