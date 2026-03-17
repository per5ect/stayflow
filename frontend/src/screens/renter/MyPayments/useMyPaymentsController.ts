import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentAdapter } from '../../../adapters/payment.adapter';

export function useMyPaymentsController() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['payments', 'my'],
    queryFn: paymentAdapter.getMy,
  });

  const payments = useMemo(
    () => [...data].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()),
    [data],
  );

  return { payments, isLoading };
}
