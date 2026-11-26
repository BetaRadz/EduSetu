import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Eye, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trust, ratings and safety',
  description: 'Understand how EduSetu separates verified institution profiles, community experiences, moderation and institution subscriptions.',
};

const principles = [
  { icon: Scale, title: 'Ratings stay independent', text: 'Public ratings are calculated from published reviews. Institution subscriptions do not alter ratings, remove criticism or change organic search order.' },
  { icon: CheckCircle2, title: 'Verification has a clear meaning', text: 'A verified institution label means the institution identity or authorised representative has been checked. A verified affiliation label means the reviewer met the platform’s evidence standard.' },
  { icon: Eye, title: 'Reviews are experiences, not verdicts', text: 'A review represents a person’s reported experience and opinion. Verifying an affiliation does not mean every statement has been independently proven as fact.' },
  { icon: LockKeyhole, title: 'Private identity stays private', text: 'Public review views do not reveal reviewer identity. Paid institution tools are not designed to expose private verification evidence.' },
];

export default function TrustPage() {
  return (
    <main className="trust-page">
      <section className="marketing-hero trust-hero"><div className="container marketing-hero-inner"><span className="eyebrow eyebrow-light">THE EDUSETU STANDARD</span><h1>Trust is the bridge.<br /><em>We protect it.</em></h1><p>EduSetu works only when families can speak honestly and institutions can participate with confidence. These are the principles guiding our product and moderation design.</p><div className="marketing-hero-foot"><span>INDEPENDENCE</span><span>CLARITY</span><span>PRIVACY</span></div></div></section>
      <section className="section"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> What trust means here</span><h2>Clear labels.<br /><em>Fair treatment.</em></h2></div><p>Not every kind of verification means the same thing. We explain what is checked, what is an opinion and where moderation fits.</p></div><div className="trust-principle-grid">{principles.map(({ icon: Icon, title, text }, index) => <article className="trust-principle" key={title}><span className="trust-principle-icon"><Icon size={21} /></span><span className="tool-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="trust-process-section"><div className="container trust-process-layout"><div><span className="eyebrow eyebrow-light">HOW THE SYSTEM WORKS</span><h2>Experience first.<br /><em>Moderation always.</em></h2><p>New reviews enter a pending state and are not public until a platform moderation decision publishes them. Institutions may respond to published reviews, but cannot edit the reviewer’s rating or review text.</p></div><div className="trust-process-list"><div><span>01</span><strong>A review is submitted</strong><small>It is not public immediately.</small></div><div><span>02</span><strong>Independent moderation</strong><small>Policy decisions are separate from institution subscriptions.</small></div><div><span>03</span><strong>Published with context</strong><small>Review count, ratings and available institution responses are shown together.</small></div></div></div></section>
      <section className="section trust-safety-section"><div className="container trust-safety-layout"><div><span className="eyebrow"><span className="eyebrow-dot" /> Families and student safety</span><h2>Privacy is part<br />of the <em>foundation.</em></h2></div><div><p>Because education communities include minors, student participation and communication need stricter safeguards. In this build, student review submission is not enabled and unrestricted adult-to-minor private messaging is not offered. Guardian-mediated communication and the required consent workflows must be completed before those features are introduced.</p><div className="trust-warning"><ShieldCheck size={18} /><span>EduSetu is still under development. This page describes product principles, not a legal privacy policy or a claim of regulatory compliance.</span></div><Link href="/institutions" className="text-link">Explore verified institutions <ArrowUpRight size={15} /></Link></div></div></section>
      <section className="simple-cta"><div className="container simple-cta-inner"><div><span className="eyebrow eyebrow-light">BUILT TO BE FAIR</span><h2>Trust before growth.<br /><em>Always.</em></h2></div><Link href="/for-institutions" className="button button-light">For institutions <ArrowUpRight size={16} /></Link></div></section>
    </main>
  );
}
