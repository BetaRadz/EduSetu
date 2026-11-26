import Link from 'next/link';
import { ArrowUpRight, Building2, CheckCircle2, GraduationCap, School } from 'lucide-react';
import type { InstitutionSummary } from '@/lib/types';

function InstitutionIcon({ type }: { type: InstitutionSummary['type'] }) {
  if (type === 'SCHOOL') return <School size={22} />;
  if (type === 'UNIVERSITY') return <GraduationCap size={22} />;
  return <Building2 size={22} />;
}

function typeLabel(type: InstitutionSummary['type']): string {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export function InstitutionCard({ institution }: { institution: InstitutionSummary }) {
  return (
    <Link href={`/institutions/${institution.slug}`} className="institution-card">
      <div className="institution-card-top">
        <span className="institution-icon"><InstitutionIcon type={institution.type} /></span>
        <span className="card-open"><ArrowUpRight size={17} /></span>
      </div>
      <div className="institution-card-copy">
        <div className="eyebrow-row">
          <span className="eyebrow">{typeLabel(institution.type)}</span>
          {institution.verifiedAt && <span className="verified-inline"><CheckCircle2 size={13} /> Verified</span>}
        </div>
        <h3>{institution.name}</h3>
        <p className="institution-location">{[institution.locality, institution.city, institution.state].filter(Boolean).join(', ')}</p>
      </div>
      <div className="institution-card-meta">
        <span>{institution.publishedReviewCount} {institution.publishedReviewCount === 1 ? 'experience' : 'experiences'}</span>
        <span className="card-detail">View profile <ArrowUpRight size={14} /></span>
      </div>
    </Link>
  );
}
