import Head from 'next/head';
import { Box, Pagination, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../components/PageHeader';
import { useReservationsController } from './useReservationsController';
import { ReservationsFilters } from './components/ReservationsFilters';
import { ReservationsTable } from './components/ReservationsTable';

export default function Reservations() {
  const {
    reservations,
    totalPages,
    totalElements,
    isLoading,
    page,
    setPage,
    draftStatus,
    setDraftStatus,
    applyFilters,
    resetFilters,
  } = useReservationsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Reservations | StayFlow Admin</title></Head>
      <Navbar />
      <Box sx={{ maxWidth: 1300, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Reservations"
          description="View and filter all reservations across the platform by status."
        />

        <ReservationsFilters
          draftStatus={draftStatus}
          setDraftStatus={setDraftStatus}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          {totalElements} reservation{totalElements !== 1 ? 's' : ''} found
        </Typography>

        <ReservationsTable reservations={reservations} isLoading={isLoading} />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
