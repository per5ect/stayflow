import Head from 'next/head';
import { Box, Pagination, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../components/PageHeader';
import { usePaymentsController } from './usePaymentsController';
import { PaymentsFilters } from './components/PaymentsFilters';
import { PaymentsTable } from './components/PaymentsTable';

export default function Payments() {
  const {
    payments,
    totalPages,
    totalElements,
    isLoading,
    page,
    setPage,
    draftStatus,
    setDraftStatus,
    applyFilters,
    resetFilters,
  } = usePaymentsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Payments | StayFlow Admin</title></Head>
      <Navbar />
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Payments"
          description="Monitor all transactions, revenue and platform commission."
        />

        <PaymentsFilters
          draftStatus={draftStatus}
          setDraftStatus={setDraftStatus}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          {totalElements} payment{totalElements !== 1 ? 's' : ''} found
        </Typography>

        <PaymentsTable payments={payments} isLoading={isLoading} />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
