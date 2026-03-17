import Head from 'next/head';
import { Box, Button, Skeleton, Typography } from '@mui/material'; // Typography used for empty state
import { PageHeader } from '../../admin/components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { useMyApartmentsController } from './useMyApartmentsController';
import { ApartmentCard } from './components/ApartmentCard';
import { ApartmentStatusFilterBar } from './components/ApartmentStatusFilterBar';

export default function MyApartments() {
  const {
    apartments,
    allCount,
    counts,
    isLoading,
    statusFilter,
    setStatusFilter,
    activate,
    deactivate,
    isToggling,
  } = useMyApartmentsController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>My Apartments | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <PageHeader
            title="My Apartments"
            description="Manage your listings, availability, and status."
          />
          <Link href="/landlord/apartments/new" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ flexShrink: 0, mt: 0.5 }}>
              New Apartment
            </Button>
          </Link>
        </Box>

        <Box mb={3}>
          <ApartmentStatusFilterBar
            active={statusFilter}
            counts={counts}
            allCount={allCount}
            onChange={setStatusFilter}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : apartments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" mt={8}>
            No apartments found.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {apartments.map((a) => (
              <ApartmentCard
                key={a.id}
                apartment={a}
                onActivate={activate}
                onDeactivate={deactivate}
                isToggling={isToggling}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
