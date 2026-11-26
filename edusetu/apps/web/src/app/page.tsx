import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Building2, CheckCircle2, Compass, GraduationCap, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { SearchBox } from '@/components/search-box';
import { InstitutionCard } from '@/components/institution-card';
import { searchInstitutions } from '@/lib/api';

const categories = [
  { label: 'Schools', sub: 'A strong start for every learner', href: '/institutions?type=SCHOOL', icon: BookOpen, number: '01' },
  { label: 'Colleges', sub: 'Find the next step that fits', href: '/institutions?type=COLLEGE', icon: Building2, number: '02' },
  { label: 'Universities', sub: 'Explore where ambition can grow', href: '/institutions?type=UNIVERSITY', icon: GraduationCap, number: '03' },
];

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof searchInstitutions>> | null = null;
  try {
    featured = await searchInstitutions({ limit: 3 });
  } catch {
    featured = null;
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid-pattern" aria-hidden="true" />
        <div className="container hero-container">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> A bridge between families and education</div>
            <h1>Find a place<br />where you can <em>grow.</em></h1>
            <p className="hero-description">Choosing an institution is a big decision. Get a clearer picture through verified profiles, real experiences and more open conversations.</p>
            <SearchBox />
            <div className="hero-proof"><span><CheckCircle2 size={15} /> Verified institution profiles</span><span><ShieldCheck size={15} /> Independent reviews</span></div>
          </div>

          <div className="hero-art-wrap" aria-label="An abstract illustration representing connection and learning">
            <div className="hero-art-orbit orbit-one" /><div className="hero-art-orbit orbit-two" />
            <div className="hero-art-card hero-art-card-main">
              <div className="art-card-top"><span className="art-card-label">THE EDUSETU WAY</span><span className="art-card-number">01 — 03</span></div>
              <div className="art-bridge-illustration">
                <div className="bridge-sun" />
                <div className="bridge-arc bridge-arc-one" /><div className="bridge-arc bridge-arc-two" />
                <div className="bridge-pillar pillar-one" /><div className="bridge-pillar pillar-two" />
                <div className="bridge-water water-one" /><div className="bridge-water water-two" />
                <div className="bridge-path" />
              </div>
              <div className="art-card-bottom"><span>Discover with clarity</span><span className="art-arrow"><ArrowUpRight size={18} /></span></div>
            </div>
            <div className="floating-note floating-note-top"><span className="floating-note-icon"><ShieldCheck size={16} /></span><div><strong>Trust comes first</strong><small>Always independent</small></div></div>
            <div className="floating-note floating-note-bottom"><span className="floating-note-icon note-icon-gold"><HeartHandshake size={16} /></span><div><strong>Two-way connection</strong><small>Families + institutions</small></div></div>
            <div className="hero-art-caption">A more human way to choose education <span>↗</span></div>
          </div>
        </div>
        <div className="container hero-bottomline"><span>01 / DISCOVER</span><span>02 / UNDERSTAND</span><span>03 / CONNECT</span></div>
      </section>

      <section className="trust-strip">
        <div className="container trust-strip-inner"><span className="trust-strip-label">OUR NON-NEGOTIABLE PROMISE</span><p>Good feedback deserves a fair hearing. <strong>Ratings are never for sale.</strong></p><Link href="/for-institutions">How we keep it fair <ArrowUpRight size={14} /></Link></div>
      </section>

      <section className="section section-categories">
        <div className="container">
          <div className="section-heading split-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> Start exploring</span><h2>Every journey has<br />a <em>starting point.</em></h2></div><p>Whether you are choosing a first school, planning a degree or comparing campuses, begin with the things that matter to you.</p></div>
          <div className="category-grid">
            {categories.map(({ label, sub, href, icon: Icon, number }) => <Link href={href} className="category-card" key={label}><div className="category-top"><span>{number} / DISCOVER</span><ArrowUpRight size={18} /></div><span className="category-icon"><Icon size={23} /></span><h3>{label}</h3><p>{sub}</p><span className="category-link">Explore {label.toLowerCase()} <ArrowRight size={15} /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="section section-listings">
        <div className="container">
          <div className="section-heading listings-heading"><div><span className="eyebrow"><span className="eyebrow-dot" /> The directory</span><h2>Institutions worth<br /><em>getting to know.</em></h2></div><Link href="/institutions" className="button button-outline">Explore all institutions <ArrowUpRight size={16} /></Link></div>
          {featured?.data?.length ? <div className="institution-grid home-institution-grid">{featured.data.map((institution) => <InstitutionCard key={institution.id} institution={institution} />)}</div> : <div className="directory-preview-empty"><div className="preview-empty-icon"><Compass size={22} /></div><div><strong>{featured === null ? 'The directory could not connect.' : 'The directory is growing.'}</strong><p>{featured === null ? 'The institution service is unavailable right now. Start the EduSetu API and refresh to load live profiles.' : 'Verified institution profiles will appear here as they join EduSetu. Search the directory to explore what is currently listed.'}</p></div><Link href="/institutions" className="text-link">Open directory <ArrowRight size={15} /></Link></div>}
        </div>
      </section>

      <section className="section how-section">
        <div className="container how-layout">
          <div className="how-intro"><span className="eyebrow"><span className="eyebrow-dot" /> A clearer process</span><h2>Better decisions<br />start with <em>better context.</em></h2><p>EduSetu brings the important pieces together, without making education feel like a popularity contest.</p><Link href="/for-institutions" className="text-link">Discover our approach <ArrowUpRight size={15} /></Link></div>
          <div className="how-steps">
            <div className="how-step"><span className="step-number">01</span><div><h3>Discover the options</h3><p>Search by institution type, location and the details that matter to your family.</p></div><span className="step-mark"><Compass size={19} /></span></div>
            <div className="how-step"><span className="step-number">02</span><div><h3>Understand real experiences</h3><p>Read published feedback, category scores and professional institution responses.</p></div><span className="step-mark"><BookOpen size={19} /></span></div>
            <div className="how-step"><span className="step-number">03</span><div><h3>Connect with confidence</h3><p>Use a clearer path to ask questions and build an ongoing relationship.</p></div><span className="step-mark"><HeartHandshake size={19} /></span></div>
          </div>
        </div>
      </section>

      <section className="institution-cta-section">
        <div className="container institution-cta">
          <div className="cta-orb cta-orb-one" /><div className="cta-orb cta-orb-two" />
          <div className="cta-content"><span className="eyebrow eyebrow-light"><Sparkles size={14} /> FOR EDUCATION TEAMS</span><h2>Your institution has<br />a story worth <em>hearing.</em></h2><p>Claim your profile, respond to feedback and build stronger relationships with the families in your community.</p><Link href="/for-institutions" className="button button-light">Explore institution tools <ArrowUpRight size={16} /></Link></div>
          <div className="cta-side-note"><span className="cta-side-icon"><ShieldCheck size={22} /></span><strong>Trust is earned.<br />Never purchased.</strong><span>Paid tools do not change public ratings or organic rankings.</span></div>
        </div>
      </section>
    </main>
  );
}
