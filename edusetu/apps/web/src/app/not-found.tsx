import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="auth-page"><div className="auth-shell"><div className="auth-card"><span className="auth-icon"><Compass size={24} /></span><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This path<br /><em>isn't on the map.</em></h1><p>The page may have moved, or the address may be incorrect. Start again from the EduSetu directory.</p><Link href="/" className="button button-dark button-full"><ArrowLeft size={15} className="icon-flip" /> Return home</Link></div></div></main>
  );
}
