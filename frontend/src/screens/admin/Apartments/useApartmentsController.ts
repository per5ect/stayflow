import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAdapter } from '../../../adapters/admin.adapter';
import { ApartmentStatus } from '../../../domains/apartment.types';

export function useApartmentsController() {
  const [page, setPage] = useState(0);
  const [draftCity, setDraftCity] = useState('');
  const [draftStatus, setDraftStatus] = useState<ApartmentStatus | ''>('');
  const [appliedCity, setAppliedCity] = useState('');
  const [appliedStatus, setAppliedStatus] = useState<ApartmentStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'apartments', page, appliedCity, appliedStatus],
    queryFn: () =>
      adminAdapter.getApartments({
        page,
        size: 10,
        city: appliedCity || undefined,
        status: appliedStatus || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
  });

  function applyFilters() {
    setPage(0);
    setAppliedCity(draftCity);
    setAppliedStatus(draftStatus);
  }

  function resetFilters() {
    setDraftCity('');
    setDraftStatus('');
    setPage(0);
    setAppliedCity('');
    setAppliedStatus('');
  }

  return {
    apartments: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    page,
    setPage,
    draftCity,
    setDraftCity,
    draftStatus,
    setDraftStatus,
    applyFilters,
    resetFilters,
  };
}
