import type { Metadata } from 'next';
import { PortalPlaceholder } from '@/components/portal-placeholder';

export const metadata: Metadata = { title: 'Parent space' };

export default function ParentPage() {
  return <PortalPlaceholder role="Parent & guardian" title="Your family's education journey, in one place." description="Keep track of the institutions you are exploring, your published experiences and the conversations you have with education teams." features={['Saved institutions and comparisons', 'Your reviews and edit history', 'Institution requests and conversations', 'Privacy and notification preferences']} />;
}
