import { CheckCircle2, MessageCircle, Star } from 'lucide-react';
import type { InstitutionReview } from '@/lib/types';

function perspectiveLabel(value: InstitutionReview['perspective']): string {
  if (value === 'PARENT_GUARDIAN') return 'Parent / guardian';
  if (value === 'ALUMNI') return 'Alumni';
  return 'Student';
}

export function ReviewList({ reviews }: { reviews: InstitutionReview[] }) {
  if (reviews.length === 0) {
    return <div className="review-empty"><MessageCircle size={22} /><strong>No published experiences yet</strong><span>Published reviews will appear here after moderation.</span></div>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <article className="review-card" key={review.id}>
          <div className="review-card-top">
            <span className="review-perspective">{perspectiveLabel(review.perspective)}</span>
            <div className="review-rating"><Star size={15} fill="currentColor" /> {review.overallRating.toFixed(1)}</div>
          </div>
          <h3>{review.title || 'An institution experience'}</h3>
          <p>{review.body}</p>
          <div className="review-card-bottom">
            <span>{review.experienceYear ? `Experience year ${review.experienceYear}` : 'Shared experience'}</span>
            {review.affiliationStatus === 'VERIFIED' && <span className="verified-inline"><CheckCircle2 size={13} /> Affiliation verified</span>}
          </div>
          {review.categoryScores.length > 0 && (
            <div className="review-score-row">
              {review.categoryScores.slice(0, 4).map((score) => <span key={score.category.key}>{score.category.label} <b>{score.score}/5</b></span>)}
            </div>
          )}
          {review.responses.map((response, index) => (
            <div className="institution-response" key={`${review.id}-response-${index}`}>
              <span className="response-label">Institution response</span>
              <p>{response.body}</p>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}
