import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InstitutionSearch } from '@/components/institution-search';

export const metadata: Metadata = {
  title: 'Explore institutions',
  description: 'Search verified schools, colleges and universities on EduSetu.',
};

export default function InstitutionsPage() {
  return (
    <main className="directory-page">
      <div className="directory-page-hero"><div className="container"><span className="eyebrow eyebrow-light">THE EDUSETU DIRECTORY</span><h1>Find the right<br /><em>fit for your future.</em></h1><p>Thoughtful discovery starts with clear information. Explore verified institutions and the experiences shared about them.</p></div></div>
      <div className="container directory-main"><Suspense fallback={<div className="state-panel">Loading directory…</div>}><InstitutionSearch /></Suspense></div>
    </main>
  );
}
