import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAdapter } from '../../../adapters/admin.adapter';
import { ReservationStatus } from '../../../domains/reservation.types';

export function useReservationsController() {
  const [page, setPage] = useState(0);
  const [draftStatus, setDraftStatus] = useState<ReservationStatus | ''>('');
  const [appliedStatus, setAppliedStatus] = useState<ReservationStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reservations', page, appliedStatus],
    queryFn: () =>
      adminAdapter.getReservations({
        page,
        size: 10,
        status: appliedStatus || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
  });

  function applyFilters() {
    setPage(0);
    setAppliedStatus(draftStatus);
  }

  function resetFilters() {
    setDraftStatus('');
    setPage(0);
    setAppliedStatus('');
  }

  return {
    reservations: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    page,
    setPage,
    draftStatus,
    setDraftStatus,
    applyFilters,
    resetFilters,
  };
}
