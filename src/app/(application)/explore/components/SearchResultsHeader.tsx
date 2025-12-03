'use client';

import { useSearchParams } from 'next/navigation';

function SearchResultsHeader() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  if (!query) return null;

  return (
    <p className="text-muted-foreground line-clamp-1 text-2xl font-semibold">
      Results for <span className="text-foreground">{query}</span>
    </p>
  );
}

export default SearchResultsHeader;
