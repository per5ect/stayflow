import Head from 'next/head';
import { Box, Skeleton, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../../admin/components/PageHeader';
import { useLandlordPaymentsController } from './useLandlordPaymentsController';
import { LandlordPaymentCard } from './components/LandlordPaymentCard';
import { PeriodFilterBar } from './components/PeriodFilterBar';

export default function Payments() {
  const { payments, isLoading, period, setPeriod } = useLandlordPaymentsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Payments | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Payments"
          description="History of payouts received from renters."
        />

        <Box mb={3}>
          <PeriodFilterBar active={period} onChange={setPeriod} />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : payments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={8}>
            No payments for this period.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {payments.map((p) => (
              <LandlordPaymentCard key={p.id} payment={p} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
