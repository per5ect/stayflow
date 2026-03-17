import Head from 'next/head';
import { Box, Pagination, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../components/PageHeader';
import { useApartmentsController } from './useApartmentsController';
import { ApartmentsFilters } from './components/ApartmentsFilters';
import { ApartmentsTable } from './components/ApartmentsTable';

export default function Apartments() {
  const {
    apartments,
    totalPages,
    totalElements,
    isLoading,
    page,
    setPage,
    draftCity,
    setDraftCity,
    draftStatus,
    setDraftStatus,
    applyFilters,
    resetFilters,
  } = useApartmentsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Apartments | StayFlow Admin</title></Head>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Apartments"
          description="Browse all listed apartments across the platform, filter by city or status."
        />

        <ApartmentsFilters
          draftCity={draftCity}
          setDraftCity={setDraftCity}
          draftStatus={draftStatus}
          setDraftStatus={setDraftStatus}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          {totalElements} apartment{totalElements !== 1 ? 's' : ''} found
        </Typography>

        <ApartmentsTable apartments={apartments} isLoading={isLoading} />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
