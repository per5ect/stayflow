import Head from 'next/head';
import { Box, Skeleton, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { useMyPaymentsController } from './useMyPaymentsController';
import { PaymentCard } from './components/PaymentCard';

export default function MyPayments() {
  const { payments, isLoading } = useMyPaymentsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>My Payments | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

        <Box mb={4}>
          <Typography variant="h5" fontWeight={700}>My Payments</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            History of all your completed payments.
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : payments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={8}>
            No payments yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {payments.map((p) => (
              <PaymentCard key={p.id} payment={p} />
            ))}
          </Box>
        )}

      </Box>
    </Box>
  );
}
