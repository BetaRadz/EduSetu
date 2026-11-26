export type InstitutionType = 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'OTHER';

export interface InstitutionSummary {
  id: string;
  slug: string;
  name: string;
  type: InstitutionType;
  city: string;
  state: string;
  locality?: string | null;
  verifiedAt?: string | null;
  publishedReviewCount: number;
}

export interface InstitutionProfile extends InstitutionSummary {
  description?: string | null;
  websiteUrl?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  rating: number | null;
  createdAt?: string;
}

export interface InstitutionSearchResponse {
  data: InstitutionSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewCategoryScore {
  score: number;
  category: {
    key: string;
    label: string;
  };
}

export interface InstitutionReview {
  id: string;
  perspective: 'PARENT_GUARDIAN' | 'ALUMNI' | 'STUDENT';
  overallRating: number;
  title?: string | null;
  body: string;
  experienceYear?: number | null;
  affiliationStatus: 'NOT_VERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  publishedAt?: string | null;
  categoryScores: ReviewCategoryScore[];
  responses: Array<{ body: string; createdAt: string }>;
}

export interface ReviewsResponse {
  data: InstitutionReview[];
  summary: { count: number; averageRating: number | null };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiErrorShape {
  status: number;
  message: string;
}
