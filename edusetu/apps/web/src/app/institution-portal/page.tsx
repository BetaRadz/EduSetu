import type { Metadata } from 'next';
import { PortalPlaceholder } from '@/components/portal-placeholder';

export const metadata: Metadata = { title: 'Institution portal' };

export default function InstitutionPortalPage() {
  return <PortalPlaceholder role="Institution team" title="A clearer view of your institution's community." description="Manage your verified profile, respond professionally to feedback and build a more consistent relationship with families." features={['Profile and campus information', 'Review response workspace', 'Team roles and permissions', 'Aggregated insights and plan management']} />;
}
