import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAdapter } from '../../../adapters/admin.adapter';
import { PaymentStatus } from '../../../domains/payment.types';

export function usePaymentsController() {
  const [page, setPage] = useState(0);
  const [draftStatus, setDraftStatus] = useState<PaymentStatus | ''>('');
  const [appliedStatus, setAppliedStatus] = useState<PaymentStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'payments', page, appliedStatus],
    queryFn: () =>
      adminAdapter.getPayments({
        page,
        size: 10,
        status: appliedStatus || undefined,
        sortBy: 'paidAt',
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
    payments: data?.content ?? [],
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
