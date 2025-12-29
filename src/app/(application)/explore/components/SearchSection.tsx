'use client';

import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { SearchIcon, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState, useTransition } from 'react';

function SearchSection() {
  const searchParams = useSearchParams();
  const urlSearchValue = searchParams.get('q') ?? '';
  const [searchValue, setSearchValue] = useState<string>(urlSearchValue);
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    return params.toString();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;
    startTransition(() => {
      replace(pathname + '?' + createQueryString('q', trimmedValue));
    });
  };

  const handleClear = () => {
    setSearchValue('');
    if (urlSearchValue) {
      const params = new URLSearchParams(searchParams);
      params.delete('q');
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    if (!value.trim() && urlSearchValue) {
      const params = new URLSearchParams(searchParams);
      params.delete('q');
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };

  useEffect(() => {
    setSearchValue(urlSearchValue);
  }, [urlSearchValue]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputGroup className="mx-auto h-12 max-w-lg rounded-full inset-shadow-sm">
        <InputGroupInput
          value={searchValue}
          onChange={handleChange}
          placeholder="Search for articles, topics, or authors"
        />
        <InputGroupAddon align="inline-end">
          {searchValue && (
            <Button
              onClick={handleClear}
              variant={'ghost'}
              type="button"
              size={'icon-sm'}
              disabled={isPending}
              aria-label="Clear search"
            >
              <X />
            </Button>
          )}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Button
            disabled={isPending}
            type="submit"
            size={'icon'}
            className="rounded-full"
            aria-label="Search blogs"
            variant={'secondary'}
          >
            {isPending ? <Spinner /> : <SearchIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

export default SearchSection;
