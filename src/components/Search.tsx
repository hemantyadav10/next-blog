'use client';

import {
  addToSearchHistory,
  removeFromSearchHistory,
} from '@/app/actions/searchActions';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchSearchHistory } from '@/lib/api/search-history';
import { fetchSearchResults } from '@/lib/api/search.api';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { History, SearchIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export default function Search({ userId }: { userId?: string }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query.trim(), 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    data: searchHistory,
    isLoading: isLoadingSearchHistory,
    isError: isSearchHistoryError,
  } = useQuery({
    queryKey: ['searchHistory', userId],
    queryFn: fetchSearchHistory,
    enabled: !!userId && open,
  });

  const {
    data: searchResults,
    isFetching: isLoadingSearchResults,
    isError: isSearchResultsError,
  } = useQuery({
    queryKey: ['searchResults', debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: !!debouncedQuery && debouncedQuery.length >= 1,
    placeholderData: keepPreviousData,
  });

  const displayResults = debouncedQuery ? searchResults : [];

  const filteredHistory = debouncedQuery
    ? searchHistory?.filter((item) =>
        item.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : searchHistory;

  function reset() {
    setOpen(false);
    setQuery('');
  }

  async function handleResultSelect() {
    reset();

    if (userId) {
      const response = await addToSearchHistory(debouncedQuery);
      queryClient.setQueryData<string[]>(['searchHistory', userId], (old) => {
        return old ? (response.success ? response.data : old) : [];
      });
    }
  }

  async function handleRemoveHistory(item: string) {
    queryClient.setQueryData<string[]>(['searchHistory', userId], (old) =>
      old ? old.filter((q) => q !== item) : [],
    );

    const response = await removeFromSearchHistory(item);

    if (!response.success) {
      // rollback on failure
      queryClient.setQueryData<string[]>(['searchHistory', userId], (old) =>
        old ? [item, ...old].slice(0, 5) : [item],
      );
      toast.error(response.error);
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <Command
        shouldFilter={false}
        className="dark:bg-background border-input focus-within:border-ring focus-within:ring-ring/50 hidden h-9 border bg-transparent focus-within:ring-[2px] lg:flex lg:min-w-md"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
          }

          const selectedItem = e.currentTarget.querySelector(
            '[cmdk-item][aria-selected="true"]:not([data-value="-"])',
          );

          if (
            debouncedQuery.trim() !== '' &&
            !selectedItem &&
            e.key === 'Enter'
          ) {
            e.preventDefault();
            router.push(`/explore?q=${encodeURIComponent(debouncedQuery)}`);
            handleResultSelect();
          }
        }}
        onClick={() => !open && setOpen(true)}
        onFocus={() => setOpen(true)}
        loop
      >
        <CommandInput
          placeholder="Search..."
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            if (!open) setOpen(true);
          }}
          loading={isLoadingSearchResults}
          showClearButton={!!query}
        />

        {open && (
          <div className="bg-card absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md">
            <CommandList className="p-2">
              <CommandItem value="-" className="hidden" />
              {isLoadingSearchHistory ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <CommandItem key={i} disabled className="p-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-full" />
                  </CommandItem>
                ))
              ) : isSearchHistoryError ? (
                <div className="text-muted-foreground p-4 text-center text-sm">
                  Failed to load recent searches
                </div>
              ) : filteredHistory && filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <CommandItem
                    key={`${idx}${item}`}
                    onSelect={() => {
                      reset();
                      router.push(`/explore?q=${encodeURIComponent(item)}`);
                    }}
                    className="h-11 p-2"
                  >
                    <History className="text-inherit" />
                    <span className="line-clamp-1">{item}</span>
                    <Button
                      aria-label={`Remove ${item} from search history`}
                      className="ml-auto h-auto w-fit"
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveHistory(item);
                      }}
                    >
                      <XIcon />
                    </Button>
                  </CommandItem>
                ))
              ) : (
                !debouncedQuery &&
                (userId ? (
                  <div className="text-muted-foreground p-4 text-center text-sm">
                    No recent searches
                  </div>
                ) : (
                  <div className="text-muted-foreground p-4 text-center text-sm">
                    Sign in to see recent searches
                  </div>
                ))
              )}
              {displayResults?.length
                ? displayResults.map((blog) => (
                    <CommandItem
                      key={blog._id}
                      onSelect={() => {
                        router.push(`/${blog.authorId.username}/${blog.slug}`);
                        handleResultSelect();
                      }}
                      className="p-2"
                    >
                      <SearchIcon className="text-inherit" />
                      <span className="line-clamp-1">{blog.title}</span>
                      <Image
                        width={42}
                        height={28}
                        src={blog.banner}
                        alt={blog.title}
                        placeholder="blur"
                        blurDataURL={blog.blurDataUrl}
                        className="rounded-xs"
                      />
                    </CommandItem>
                  ))
                : debouncedQuery && (
                    <div className="text-muted-foreground p-4 text-center text-sm">
                      {isSearchResultsError
                        ? 'Something went wrong. Please try again'
                        : 'No results found'}
                    </div>
                  )}
            </CommandList>
            <div className="text-muted-foreground bg-muted/50 border-t px-4 py-3 text-xs">
              Submit search for advanced filtering.
            </div>
          </div>
        )}
      </Command>
    </div>
  );
}
