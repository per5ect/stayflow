import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apartmentAdapter } from '../../../adapters/apartment.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ApartmentStatus } from '../../../domains/apartment.types';

export function useMyApartmentsController() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['apartments', 'my'],
    queryFn: () => apartmentAdapter.getMy({ size: 100, sortBy: 'createdAt', sortDir: 'desc' }),
  });

  const allApartments = data?.content ?? [];

  const apartments = useMemo(
    () => (statusFilter ? allApartments.filter((a) => a.status === statusFilter) : allApartments),
    [allApartments, statusFilter],
  );

  const counts = useMemo(
    () => ({
      ACTIVE: allApartments.filter((a) => a.status === 'ACTIVE').length,
      INACTIVE: allApartments.filter((a) => a.status === 'INACTIVE').length,
    }),
    [allApartments],
  );

  const { mutate: activate, isPending: isActivating } = useMutation({
    mutationFn: (id: number) => apartmentAdapter.activate(id),
    onSuccess: () => {
      showSnackbar('Apartment activated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', 'my'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not activate apartment.'), 'error'),
  });

  const { mutate: deactivate, isPending: isDeactivating } = useMutation({
    mutationFn: (id: number) => apartmentAdapter.deactivate(id),
    onSuccess: () => {
      showSnackbar('Apartment deactivated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', 'my'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not deactivate apartment.'), 'error'),
  });

  return {
    apartments,
    allCount: allApartments.length,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    activate,
    deactivate,
    isToggling: isActivating || isDeactivating,
  };
}
