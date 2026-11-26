import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BarChart3, MessageSquareText, ShieldCheck, UsersRound } from 'lucide-react';

export const metadata: Metadata = { title: 'For institutions', description: 'Tools for education institutions to manage their profiles and build stronger relationships.' };

const tools = [
  { icon: ShieldCheck, title: 'Own your official profile', text: 'Claim your institution listing and keep important public details accurate after verification.' },
  { icon: MessageSquareText, title: 'Respond with context', text: 'A clear, professional response gives families a fuller picture of how your institution listens.' },
  { icon: BarChart3, title: 'Understand feedback', text: 'Use aggregated feedback to spot patterns and understand where communication can improve.' },
  { icon: UsersRound, title: 'Keep your team aligned', text: 'Give the right staff the right institution-scoped access as your team grows.' },
];

export default function ForInstitutionsPage() {
  return (
    <main className="marketing-page">
      <section className="marketing-hero"><div className="container marketing-hero-inner"><span className="eyebrow eyebrow-light">FOR SCHOOLS, COLLEGES & UNIVERSITIES</span><h1>Better relationships<br />make <em>stronger institutions.</em></h1><p>EduSetu gives education teams a more thoughtful way to manage their public presence, listen to feedback and build trust with families.</p><Link href="/sign-in" className="button button-light">Institution sign-in <ArrowUpRight size={16} /></Link><div className="marketing-hero-foot"><span>01 / PROFILE</span><span>02 / RESPOND</span><span>03 / UNDERSTAND</span></div></div></section>
      <section className="section"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> A practical toolkit</span><h2>Listen well.<br /><em>Lead thoughtfully.</em></h2></div><p>Institution tools are designed to strengthen communication, not to influence what families are allowed to say.</p></div><div className="tool-grid">{tools.map(({ icon: Icon, title, text }, index) => <article className="tool-card" key={title}><span className="tool-icon"><Icon size={21} /></span><span className="tool-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="fairness-section"><div className="container fairness-layout"><div><span className="eyebrow"><span className="eyebrow-dot" /> The independence promise</span><h2>Pay for better tools.<br /><em>Never for better ratings.</em></h2></div><div className="fairness-copy"><p>Institution subscriptions can unlock profile tools, communication workflows and aggregated analytics. They cannot buy a higher rating, remove legitimate criticism or change organic search ranking.</p><div className="fairness-rule"><ShieldCheck size={19} /><span>Review decisions are handled through independent, policy-based moderation.</span></div><Link href="/pricing" className="text-link">Explore plan concepts <ArrowRight size={15} /></Link></div></div></section>
      <section className="simple-cta"><div className="container simple-cta-inner"><div><span className="eyebrow eyebrow-light">READY WHEN YOU ARE</span><h2>Put listening at the<br /><em>centre of your work.</em></h2></div><Link href="/sign-in" className="button button-light">Get started <ArrowUpRight size={16} /></Link></div></section>
    </main>
  );
}
