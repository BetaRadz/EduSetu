import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Building2, Check, Network, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = { title: 'Institution plans' };

const plans = [
  { name: 'Verified Basic', audience: 'For an institution getting started', icon: Building2, items: ['Claim and verify an official profile', 'Keep public institution details current', 'Respond to published reviews', 'Basic profile health information'], featured: false },
  { name: 'Growth', audience: 'For teams building stronger relationships', icon: Sparkles, items: ['Everything in Verified Basic', 'Aggregated feedback trends', 'Parent communication tools when available', 'Response and resolution reporting', 'Additional team members'], featured: true },
  { name: 'Network / University', audience: 'For groups and multi-campus institutions', icon: Network, items: ['Multi-campus management', 'Central and campus-level reporting', 'Delegated admin roles', 'Integration options as they become available', 'Service and support options'], featured: false },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <section className="pricing-hero"><div className="container"><span className="eyebrow eyebrow-light">CLEAR BY DESIGN</span><h1>Plans built around<br /><em>better listening.</em></h1><p>Start with a verified presence. Add tools as your institution's needs grow. Final prices and limits will be published after customer and operating-cost validation.</p></div></section>
      <section className="section pricing-content"><div className="container"><div className="pricing-disclaimer"><span className="disclaimer-mark">i</span><p><strong>Pricing is not final yet.</strong> The tiers below describe intended product capabilities, not a live offer or payment checkout.</p></div><div className="plan-grid">{plans.map(({ name, audience, icon: Icon, items, featured }) => <article className={featured ? 'plan-card plan-featured' : 'plan-card'} key={name}><div className="plan-card-top"><span className="plan-icon"><Icon size={20} /></span>{featured && <span className="plan-badge">FOR GROWING TEAMS</span>}</div><h2>{name}</h2><p className="plan-audience">{audience}</p><div className="plan-price">Custom <small>details to be announced</small></div><ul>{items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><Link href="/for-institutions" className={featured ? 'button button-dark button-full' : 'button button-outline button-full'}>Explore this plan <ArrowUpRight size={15} /></Link></article>)}</div><p className="pricing-integrity"><span><ShieldCheck size={13} /></span> No plan changes public rating calculations, review moderation decisions or organic search ranking.</p></div></section>
    </main>
  );
}

