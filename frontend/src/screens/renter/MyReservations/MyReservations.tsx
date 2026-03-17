import Head from 'next/head';
import { Box, Skeleton, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { useMyReservationsController } from './useMyReservationsController';
import { ReservationCard } from './components/ReservationCard';
import { CancelDialog } from './components/CancelDialog';
import { StatusFilterBar } from './components/StatusFilterBar';

export default function MyReservations() {
  const {
    reservations,
    allCount,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    cancelTargetId,
    confirmCancel,
    dismissCancel,
    executeCancel,
    isCancelling,
  } = useMyReservationsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>My Reservations | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

        <Box mb={3}>
          <Typography variant="h5" fontWeight={700}>My Reservations</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Track your bookings and manage payments.
          </Typography>
        </Box>

        <Box mb={3}>
          <StatusFilterBar
            active={statusFilter}
            counts={counts}
            allCount={allCount}
            onChange={setStatusFilter}
          />
        </Box>

        {/* List */}
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={180} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : reservations.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={8}>
            No reservations found.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reservations.map((r) => (
              <ReservationCard key={r.id} reservation={r} onCancel={confirmCancel} />
            ))}
          </Box>
        )}

      </Box>

      <CancelDialog
        open={cancelTargetId !== null}
        isCancelling={isCancelling}
        onConfirm={executeCancel}
        onClose={dismissCancel}
      />
    </Box>
  );
}
