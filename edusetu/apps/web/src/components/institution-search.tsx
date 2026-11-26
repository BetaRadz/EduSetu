'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Filter, LoaderCircle, SearchX, SlidersHorizontal } from 'lucide-react';
import { searchInstitutions } from '@/lib/api';
import type { InstitutionType } from '@/lib/types';
import { InstitutionCard } from '@/components/institution-card';

const typeOptions: Array<{ value: InstitutionType | ''; label: string }> = [
  { value: '', label: 'All institution types' },
  { value: 'SCHOOL', label: 'Schools' },
  { value: 'COLLEGE', label: 'Colleges' },
  { value: 'UNIVERSITY', label: 'Universities' },
  { value: 'OTHER', label: 'Other' },
];

export function InstitutionSearch() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [type, setType] = useState<InstitutionType | ''>((searchParams.get('type') as InstitutionType | null) ?? '');
  const [submitted, setSubmitted] = useState({ query: searchParams.get('q') ?? '', city: searchParams.get('city') ?? '', type: (searchParams.get('type') as InstitutionType | null) ?? '' });
  const [page, setPage] = useState(1);
  const [validationMessage, setValidationMessage] = useState('');

  const results = useQuery({
    queryKey: ['institutions', submitted, page],
    queryFn: () => searchInstitutions({ q: submitted.query, city: submitted.city, type: submitted.type as InstitutionType | '', page, limit: 12 }),
  });

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length === 1) {
      setValidationMessage('Use at least two characters for a keyword search.');
      return;
    }
    setValidationMessage('');
    setPage(1);
    setSubmitted({ query: query.trim(), city: city.trim(), type });
  }

  function clearFilters() {
    setQuery('');
    setCity('');
    setType('');
    setValidationMessage('');
    setPage(1);
    setSubmitted({ query: '', city: '', type: '' });
  }

  return (
    <div className="directory-layout">
      <aside className="directory-filter-panel">
        <div className="filter-heading"><span className="filter-icon"><SlidersHorizontal size={16} /></span><strong>Refine your search</strong></div>
        <form onSubmit={applyFilters} className="filter-form">
          <label className="form-label">Institution or keyword
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. CBSE, engineering" />
          </label>
          <label className="form-label">City or locality
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Jabalpur" />
          </label>
          <label className="form-label">Institution type
            <select value={type} onChange={(event) => setType(event.target.value as InstitutionType | '')}>
              {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button className="button button-dark filter-submit" type="submit"><Filter size={16} /> Apply filters</button>
          <button className="button button-quiet filter-clear" type="button" onClick={clearFilters}>Clear all</button>
          {validationMessage && <span className="filter-validation" role="status">{validationMessage}</span>}
        </form>
        <div className="filter-note"><span className="note-dot" /> Only verified institution profiles are shown in public search.</div>
      </aside>

      <section className="directory-results" aria-live="polite">
        <div className="directory-results-top">
          <div>
            <span className="eyebrow">The directory</span>
            <h2>{submitted.query || submitted.city ? 'Your search results' : 'Explore institutions'}</h2>
            <p>Compare details, read published experiences and make a more informed choice.</p>
          </div>
          {!results.isLoading && results.data && <span className="result-count">{results.data.pagination.total} listed</span>}
        </div>

        {results.isLoading && (
          <div className="state-panel"><LoaderCircle className="spin" size={24} /><strong>Finding institutions</strong><span>Checking verified public profiles…</span></div>
        )}
        {results.isError && (
          <div className="state-panel state-error"><AlertCircle size={25} /><strong>We couldn’t load the directory</strong><span>{results.error instanceof Error ? results.error.message : 'Please check that the EduSetu API is running.'}</span><button className="button button-outline" type="button" onClick={() => results.refetch()}>Try again</button></div>
        )}
        {results.isSuccess && results.data.data.length === 0 && (
          <div className="state-panel state-empty"><span className="empty-illustration"><SearchX size={28} /></span><strong>No verified institutions found yet</strong><span>Try a broader search, remove a filter, or check back as more institutions are verified.</span><button className="button button-outline" type="button" onClick={clearFilters}>Clear filters</button></div>
        )}
        {results.isSuccess && results.data.data.length > 0 && (
          <>
            <div className="institution-grid">
              {results.data.data.map((institution) => <InstitutionCard key={institution.id} institution={institution} />)}
            </div>
            <div className="pagination-row">
              <span>Page {results.data.pagination.page} of {Math.max(1, results.data.pagination.totalPages)}</span>
              <div className="pagination-actions">
                <button type="button" className="pagination-button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ArrowLeft size={15} /> Previous</button>
                <button type="button" className="pagination-button" disabled={page >= results.data.pagination.totalPages} onClick={() => setPage((current) => current + 1)}>Next <ArrowRight size={15} /></button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
