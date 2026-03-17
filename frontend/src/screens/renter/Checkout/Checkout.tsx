import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, Box, Skeleton, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { useCheckoutController } from './useCheckoutController';
import { CheckoutForm } from './components/CheckoutForm';

export default function Checkout() {
  const router = useRouter();
  const reservationId = Number(router.query.id);

  const { reservation, isLoading, pay, isPaying } = useCheckoutController(reservationId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Checkout | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

        <Box mb={4}>
          <Typography variant="h5" fontWeight={700}>Complete Payment</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Review your booking and enter your payment details.
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 2 }} />
          </Box>
        ) : !reservation ? (
          <Alert severity="error">
            Reservation not found or you don&apos;t have permission to pay for it.
          </Alert>
        ) : reservation.status !== 'APPROVED' ? (
          <Alert severity="warning">
            This reservation cannot be paid — current status is <strong>{reservation.status}</strong>.
          </Alert>
        ) : (
          <CheckoutForm reservation={reservation} isPaying={isPaying} onPay={pay} />
        )}

      </Box>
    </Box>
  );
}
