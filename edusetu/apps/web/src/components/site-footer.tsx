import Link from 'next/link';
import { ArrowUpRight, GraduationCap } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="brand brand-footer">
            <span className="brand-mark"><GraduationCap size={21} /></span>
            <span className="brand-word">edu<span>setu</span><small>EDUCATION, CONNECTED.</small></span>
          </Link>
          <p>A more thoughtful bridge between families and the institutions that help them grow.</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">Discover</span>
          <Link href="/institutions">Find an institution</Link>
          <Link href="/pricing">Institution plans</Link>
          <Link href="/for-institutions">For institutions</Link>
          <Link href="/trust">Trust, ratings & safety</Link>
        </div>
        <div className="footer-column">
          <span className="footer-label">Your EduSetu</span>
          <Link href="/parent">Parent space</Link>
          <Link href="/institution-portal">Institution portal</Link>
          <Link href="/sign-in">Sign in</Link>
        </div>
        <div className="footer-note">
          <span className="footer-label">Our promise</span>
          <p>Ratings stay independent. Paid tools never buy better reviews or a higher place in organic search.</p>
          <Link href="/for-institutions" className="footer-inline-link">How we work <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} EduSetu. A working name.</span>
        <span>Built around trust, clarity and connection.</span>
      </div>
    </footer>
  );
}
