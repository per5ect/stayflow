import { useQuery } from '@tanstack/react-query';
import { adminAdapter } from '../../../adapters/admin.adapter';

export function useDashboardController() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminAdapter.getStats(),
  });

  return { stats, isLoading };
}
