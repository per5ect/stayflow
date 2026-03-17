import Head from 'next/head';
import { Box, Skeleton, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../../admin/components/PageHeader';
import { useIncomingReservationsController } from './useIncomingReservationsController';
import { IncomingReservationCard } from './components/IncomingReservationCard';
import { ReservationStatusFilterBar } from './components/ReservationStatusFilterBar';
import { ActionDialog } from './components/ActionDialog';

export default function IncomingReservations() {
  const {
    reservations,
    allCount,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    actionTarget,
    message,
    setMessage,
    openDialog,
    closeDialog,
    executeAction,
    isActioning,
  } = useIncomingReservationsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Incoming Reservations | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Incoming Reservations"
          description="Review and respond to booking requests from renters."
        />

        <Box mb={3}>
          <ReservationStatusFilterBar
            active={statusFilter}
            counts={counts}
            allCount={allCount}
            onChange={setStatusFilter}
          />
        </Box>

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
              <IncomingReservationCard key={r.id} reservation={r} onAction={openDialog} />
            ))}
          </Box>
        )}
      </Box>

      <ActionDialog
        open={actionTarget !== null}
        action={actionTarget?.action ?? null}
        message={message}
        setMessage={setMessage}
        isActioning={isActioning}
        onConfirm={executeAction}
        onClose={closeDialog}
      />
    </Box>
  );
}
