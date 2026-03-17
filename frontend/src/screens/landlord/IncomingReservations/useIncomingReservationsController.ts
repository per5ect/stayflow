import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationAdapter } from '../../../adapters/reservation.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ReservationStatus } from '../../../domains/reservation.types';

type ActionType = 'approve' | 'decline';

interface ActionTarget {
  id: number;
  action: ActionType;
}

export function useIncomingReservationsController() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [actionTarget, setActionTarget] = useState<ActionTarget | null>(null);
  const [message, setMessage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', 'landlord'],
    queryFn: () => reservationAdapter.getLandlord({ size: 100, sortBy: 'createdAt', sortDir: 'desc' }),
  });

  const allReservations = data?.content ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of allReservations) {
      map[r.status] = (map[r.status] ?? 0) + 1;
    }
    return map;
  }, [allReservations]);

  const reservations = useMemo(
    () => (statusFilter ? allReservations.filter((r) => r.status === statusFilter) : allReservations),
    [allReservations, statusFilter],
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['reservations', 'landlord'] });

  const { mutate: approveReservation, isPending: isApproving } = useMutation({
    mutationFn: ({ id, msg }: { id: number; msg?: string }) => reservationAdapter.approve(id, msg),
    onSuccess: () => {
      showSnackbar('Reservation approved.', 'success');
      closeDialog();
      invalidate();
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not approve reservation.'), 'error'),
  });

  const { mutate: declineReservation, isPending: isDeclining } = useMutation({
    mutationFn: ({ id, msg }: { id: number; msg?: string }) => reservationAdapter.decline(id, msg),
    onSuccess: () => {
      showSnackbar('Reservation declined.', 'success');
      closeDialog();
      invalidate();
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not decline reservation.'), 'error'),
  });

  function openDialog(id: number, action: ActionType) {
    setActionTarget({ id, action });
    setMessage('');
  }

  function closeDialog() {
    setActionTarget(null);
    setMessage('');
  }

  function executeAction() {
    if (!actionTarget) return;
    const params = { id: actionTarget.id, msg: message || undefined };
    if (actionTarget.action === 'approve') approveReservation(params);
    else declineReservation(params);
  }

  return {
    reservations,
    allCount: allReservations.length,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    actionTarget,
    message,
    setMessage,
    openDialog,
    closeDialog,
    executeAction,
    isActioning: isApproving || isDeclining,
  };
}
