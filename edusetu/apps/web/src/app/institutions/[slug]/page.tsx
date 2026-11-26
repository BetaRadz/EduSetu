import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Building2, CheckCircle2, ExternalLink, MapPin, ShieldCheck, Star } from 'lucide-react';
import { ReviewList } from '@/components/review-list';
import { getInstitution, getInstitutionReviews } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const institution = await getInstitution(slug);
    return { title: institution.name, description: institution.description || `Explore the verified profile and published experiences for ${institution.name}.` };
  } catch {
    return { title: 'Institution profile' };
  }
}

export default async function InstitutionProfilePage({ params }: PageProps) {
  const { slug } = await params;
  let institution = null;
  try { institution = await getInstitution(slug); } catch { institution = null; }

  if (!institution) {
    return <main className="profile-page"><div className="container profile-error"><Link href="/institutions" className="back-link"><ArrowLeft size={15} /> Back to directory</Link><div className="state-panel state-error"><Building2 size={25} /><strong>This profile is unavailable</strong><span>The institution may not be verified yet, or the API may be offline. Return to the directory and try again.</span><Link href="/institutions" className="button button-outline">Browse directory <ArrowUpRight size={15} /></Link></div></div></main>;
  }

  let reviews = null;
  try { reviews = await getInstitutionReviews(institution.id); } catch { reviews = null; }
  const location = [institution.addressLine1, institution.addressLine2, institution.locality, institution.city, institution.state, institution.postalCode].filter(Boolean).join(', ');
  const typeLabel = institution.type.charAt(0) + institution.type.slice(1).toLowerCase();
  let safeWebsiteUrl: string | null = null;
  if (institution.websiteUrl) {
    try {
      const parsedWebsiteUrl = new URL(institution.websiteUrl);
      if (parsedWebsiteUrl.protocol === 'https:' || parsedWebsiteUrl.protocol === 'http:') safeWebsiteUrl = parsedWebsiteUrl.toString();
    } catch {
      safeWebsiteUrl = null;
    }
  }

  return (
    <main className="profile-page">
      <div className="container profile-container">
        <Link href="/institutions" className="back-link"><ArrowLeft size={15} /> Back to directory</Link>
        <section className="profile-hero-card">
          <div className="profile-hero-decoration profile-deco-one" /><div className="profile-hero-decoration profile-deco-two" />
          <div className="profile-type-mark"><Building2 size={26} /></div>
          <div className="profile-title-area">
            <div className="profile-meta-line"><span className="eyebrow eyebrow-light">{typeLabel}</span><span className="profile-verified"><CheckCircle2 size={14} /> Verified institution</span></div>
            <h1>{institution.name}</h1>
            <p><MapPin size={15} /> {[institution.locality, institution.city, institution.state].filter(Boolean).join(', ')}</p>
          </div>
          <div className="profile-rating-panel"><span className="rating-label">COMMUNITY RATING</span><div className="rating-number">{institution.rating === null ? '—' : institution.rating.toFixed(1)} <Star size={20} fill="currentColor" /></div><span>{institution.publishedReviewCount} published {institution.publishedReviewCount === 1 ? 'experience' : 'experiences'}</span></div>
        </section>

        <div className="profile-content-grid">
          <div className="profile-main-column">
            <section className="profile-section"><div className="profile-section-heading"><span className="eyebrow">ABOUT THE INSTITUTION</span><span className="subtle-tag"><ShieldCheck size={13} /> Verified profile</span></div><h2>Get to know <em>{institution.name}.</em></h2><p className="profile-description">{institution.description || 'This institution has not added a public description yet. Check back as its profile is updated.'}</p></section>
            <section className="profile-section review-section"><div className="profile-section-heading"><span className="eyebrow">COMMUNITY EXPERIENCES</span><span className="review-summary">{reviews?.summary.count ?? institution.publishedReviewCount} published</span></div><h2>Experiences that<br /><em>add perspective.</em></h2>{reviews ? <ReviewList reviews={reviews.data} /> : <div className="state-inline state-error"><span>Published experiences could not be loaded. Check that the API is available.</span></div>}</section>
          </div>

          <aside className="profile-sidebar">
            <div className="sidebar-card sidebar-actions-card"><span className="eyebrow">TAKE THE NEXT STEP</span><h3>Start a conversation.</h3><p>Have a question or an experience to share? Account actions will become available once secure sign-in is configured.</p><Link href="/sign-in" className="button button-dark button-full">Sign-in setup <ArrowUpRight size={16} /></Link><span className="sidebar-footnote"><ShieldCheck size={13} /> Reviewer identity is not shown publicly.</span></div>
            <div className="sidebar-card"><span className="eyebrow">INSTITUTION DETAILS</span><div className="detail-list"><div><span>Institution type</span><strong>{typeLabel}</strong></div>{location && <div><span>Location</span><strong>{location}</strong></div>}{safeWebsiteUrl && <div><span>Official website</span><a href={safeWebsiteUrl} target="_blank" rel="noreferrer">Visit website <ExternalLink size={13} /></a></div>}<div><span>Profile status</span><strong className="detail-verified"><CheckCircle2 size={13} /> Verified</strong></div></div></div>
            <div className="sidebar-trust-note"><ShieldCheck size={18} /><p><strong>Independent by design.</strong> Institution subscriptions do not change ratings or public search order.</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
