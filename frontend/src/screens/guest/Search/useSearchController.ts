import { useState, useEffect, RefObject } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { apartmentAdapter } from '../../../adapters/apartment.adapter';
import { ApartmentFilters, ApartmentType } from '../../../domains/apartment.types';

const PAGE_SIZE = 12;

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

const SORT_MAP: Record<SortOption, { sortBy: string; sortDir: 'asc' | 'desc' }> = {
  newest:     { sortBy: 'createdAt',     sortDir: 'desc' },
  price_asc:  { sortBy: 'pricePerNight', sortDir: 'asc'  },
  price_desc: { sortBy: 'pricePerNight', sortDir: 'desc' },
};

function parseStr(v: string | string[] | undefined): string {
  return typeof v === 'string' && v.trim() ? v.trim() : '';
}

export interface DraftFilters {
  city: string;
  type: ApartmentType | '';
  minPrice: string;
  maxPrice: string;
  minRooms: string;
  checkIn: string;
  checkOut: string;
}

interface AppliedFilters extends DraftFilters {
  page: number;
}

export const EMPTY_DRAFT: DraftFilters = {
  city: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  minRooms: '',
  checkIn: '',
  checkOut: '',
};

function stateFromQuery(query: Record<string, string | string[] | undefined>): {
  applied: AppliedFilters;
  sort: SortOption;
} {
  const sortRaw = parseStr(query.sort);
  const sort: SortOption = sortRaw in SORT_MAP ? (sortRaw as SortOption) : 'newest';
  return {
    applied: {
      city: parseStr(query.city),
      type: (parseStr(query.type) as ApartmentType | '') ?? '',
      minPrice: parseStr(query.minPrice),
      maxPrice: parseStr(query.maxPrice),
      minRooms: parseStr(query.minRooms),
      checkIn: parseStr(query.checkIn),
      checkOut: parseStr(query.checkOut),
      page: query.page ? Number(query.page) : 1,
    },
    sort,
  };
}

function buildParams(f: AppliedFilters, sort: SortOption): Record<string, string> {
  const p: Record<string, string> = {};
  if (f.city) p.city = f.city;
  if (f.type) p.type = f.type;
  if (f.minPrice) p.minPrice = f.minPrice;
  if (f.maxPrice) p.maxPrice = f.maxPrice;
  if (f.minRooms) p.minRooms = f.minRooms;
  if (f.checkIn) p.checkIn = f.checkIn;
  if (f.checkOut) p.checkOut = f.checkOut;
  if (sort !== 'newest') p.sort = sort;
  return p;
}

export function useSearchController(resultsRef: RefObject<HTMLDivElement | null>) {
  const router = useRouter();
  const { query, isReady } = router;

  const [draft, setDraft] = useState<DraftFilters>(EMPTY_DRAFT);
  const [applied, setApplied] = useState<AppliedFilters>({ ...EMPTY_DRAFT, page: 1 });
  const [sort, setSort] = useState<SortOption>('newest');

  // Restore full state from URL on first load
  useEffect(() => {
    if (!isReady) return;
    const { applied: a, sort: s } = stateFromQuery(query);
    setDraft(a);
    setApplied(a);
    setSort(s);
  }, [isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const apiFilters: ApartmentFilters = {
    city: applied.city || undefined,
    type: applied.type || undefined,
    minPrice: applied.minPrice ? Number(applied.minPrice) : undefined,
    maxPrice: applied.maxPrice ? Number(applied.maxPrice) : undefined,
    minRooms: applied.minRooms ? Number(applied.minRooms) : undefined,
    checkIn: applied.checkIn || undefined,
    checkOut: applied.checkOut || undefined,
    page: applied.page - 1,
    size: PAGE_SIZE,
    ...SORT_MAP[sort],
  };

  const { data, isLoading } = useQuery({
    queryKey: ['apartments', 'search', apiFilters],
    queryFn: () => apartmentAdapter.getAll(apiFilters),
    enabled: isReady,
  });

  function scrollTop() {
    resultsRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applyFilters() {
    const next: AppliedFilters = { ...draft, page: 1 };
    setApplied(next);
    router.push({ pathname: router.pathname, query: buildParams(next, sort) }, undefined, { shallow: true });
    scrollTop();
  }

  function changeSort(value: SortOption) {
    setSort(value);
    const next: AppliedFilters = { ...applied, page: 1 };
    setApplied(next);
    router.push({ pathname: router.pathname, query: buildParams(next, value) }, undefined, { shallow: true });
    scrollTop();
  }

  function resetFilters() {
    setDraft(EMPTY_DRAFT);
    setApplied({ ...EMPTY_DRAFT, page: 1 });
    setSort('newest');
    router.push({ pathname: router.pathname, query: {} }, undefined, { shallow: true });
    scrollTop();
  }

  function handlePageChange(_: React.ChangeEvent<unknown>, value: number) {
    const next: AppliedFilters = { ...applied, page: value };
    setApplied(next);
    router.push({ pathname: router.pathname, query: buildParams(next, sort) }, undefined, { shallow: true });
    scrollTop();
  }

  return {
    draft,
    setDraft,
    applied,
    sort,
    changeSort,
    apartments: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    applyFilters,
    resetFilters,
    handlePageChange,
  };
}
