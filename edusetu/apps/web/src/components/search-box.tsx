'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Search } from 'lucide-react';

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length === 1) {
      setValidationMessage('Enter at least two characters for an institution search.');
      return;
    }
    setValidationMessage('');
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city.trim()) params.set('city', city.trim());
    const serialized = params.toString();
    router.push(`/institutions${serialized ? `?${serialized}` : ''}`);
  }

  return (
    <form className={compact ? 'search-box search-box-compact' : 'search-box'} onSubmit={handleSubmit}>
      <label className="search-field">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Institution name or type</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Institution name, board or type" />
      </label>
      <span className="search-divider" aria-hidden="true" />
      <label className="search-field search-city-field">
        <MapPin size={18} aria-hidden="true" />
        <span className="sr-only">City or locality</span>
        <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City or locality" />
      </label>
      <button type="submit" className="button button-dark search-submit">Explore <ArrowRight size={17} /></button>
      {validationMessage && <span className="search-validation" role="status">{validationMessage}</span>}
    </form>
  );
}
