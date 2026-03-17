import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentAdapter } from '../../../adapters/payment.adapter';

export type PeriodFilter = '7d' | '30d' | 'all';

const PERIOD_MS: Record<PeriodFilter, number | null> = {
  '7d':  7  * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  'all': null,
};

export function useLandlordPaymentsController() {
  const [period, setPeriod] = useState<PeriodFilter>('30d');

  const { data = [], isLoading } = useQuery({
    queryKey: ['payments', 'landlord'],
    queryFn: paymentAdapter.getLandlord,
  });

  const payments = useMemo(() => {
    const ms = PERIOD_MS[period];
    const cutoff = ms ? Date.now() - ms : null;

    return [...data]
      .filter((p) => !cutoff || new Date(p.paidAt).getTime() >= cutoff)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  }, [data, period]);

  return { payments, isLoading, period, setPeriod, totalCount: data.length };
}
