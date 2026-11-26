import type {
  ApiErrorShape,
  InstitutionProfile,
  InstitutionSearchResponse,
  InstitutionType,
  ReviewsResponse,
} from '@/lib/types';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (init?.body) headers.set('Content-Type', 'application/json');
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      cache: init?.cache ?? 'no-store',
    });
  } catch {
    throw new ApiError(0, 'EduSetu could not reach its API. Check that the backend is running.');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message)) message = payload.message.join(' ');
      else if (payload.message) message = payload.message;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    const error: ApiErrorShape = { status: response.status, message };
    throw new ApiError(error.status, error.message);
  }

  return (await response.json()) as T;
}

export interface SearchParams {
  q?: string;
  city?: string;
  type?: InstitutionType | '';
  page?: number;
  limit?: number;
}

export function searchInstitutions(params: SearchParams = {}): Promise<InstitutionSearchResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.city) search.set('city', params.city);
  if (params.type) search.set('type', params.type);
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 12));
  return request<InstitutionSearchResponse>(`/institutions?${search.toString()}`);
}

export function getInstitution(slug: string): Promise<InstitutionProfile> {
  return request<InstitutionProfile>(`/institutions/${encodeURIComponent(slug)}`);
}

export function getInstitutionReviews(institutionId: string): Promise<ReviewsResponse> {
  return request<ReviewsResponse>(`/institutions/${encodeURIComponent(institutionId)}/reviews?page=1&limit=20`);
}

export function getApiBase(): string {
  return API_BASE;
}
