import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationAdapter } from '../../../adapters/reservation.adapter';
import { paymentAdapter } from '../../../adapters/payment.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export function useCheckoutController(reservationId: number) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: reservationsPage, isLoading } = useQuery({
    queryKey: ['reservations', 'my', 'checkout'],
    queryFn: () => reservationAdapter.getMy({ size: 100 }),
  });

  const reservation = reservationsPage?.content.find((r) => r.id === reservationId) ?? null;

  const { mutate: pay, isPending: isPaying } = useMutation({
    mutationFn: (data: { cardBrand: string; cardLastFour: string }) =>
      paymentAdapter.pay({ reservationId, ...data }),
    onSuccess: () => {
      showSnackbar('Payment successful! Your booking is confirmed.', 'success');
      queryClient.invalidateQueries({ queryKey: ['reservations', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'my'] });
      router.push('/renter/reservations');
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Payment failed. Please try again.'), 'error');
    },
  });

  return { reservation, isLoading, pay, isPaying };
}
