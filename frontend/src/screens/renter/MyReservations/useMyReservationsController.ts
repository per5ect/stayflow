import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationAdapter } from '../../../adapters/reservation.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ReservationStatus } from '../../../domains/reservation.types';

export function useMyReservationsController() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: () =>
      reservationAdapter.getMy({ size: 100, sortBy: 'createdAt', sortDir: 'desc' }),
  });

  const allReservations = data?.content ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of allReservations) {
      map[r.status] = (map[r.status] ?? 0) + 1;
    }
    return map;
  }, [allReservations]);

  const reservations = useMemo(() => {
    const filtered = statusFilter
      ? allReservations.filter((r) => r.status === statusFilter)
      : allReservations;
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [allReservations, statusFilter]);

  const { mutate: cancelReservation, isPending: isCancelling } = useMutation({
    mutationFn: (id: number) => reservationAdapter.cancel(id),
    onSuccess: () => {
      showSnackbar('Reservation cancelled.', 'success');
      setCancelTargetId(null);
      queryClient.invalidateQueries({ queryKey: ['reservations', 'my'] });
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not cancel reservation.'), 'error');
    },
  });

  function confirmCancel(id: number) { setCancelTargetId(id); }
  function dismissCancel() { setCancelTargetId(null); }
  function executeCancel() { if (cancelTargetId !== null) cancelReservation(cancelTargetId); }

  return {
    reservations,
    allCount: allReservations.length,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    cancelTargetId,
    confirmCancel,
    dismissCancel,
    executeCancel,
    isCancelling,
  };
}
