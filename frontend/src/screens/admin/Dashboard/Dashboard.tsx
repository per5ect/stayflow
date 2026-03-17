import Head from 'next/head';
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { formatPrice } from '../../../utils/formatPrice';
import { useDashboardController } from './useDashboardController';
import { StatCard } from './components/StatCard';
import { PageHeader } from '../components/PageHeader';

function StatCardSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="rounded" width={52} height={52} sx={{ flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="50%" height={13} />
          <Skeleton width="35%" height={38} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
    </Paper>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      fontWeight={700}
      color="text.disabled"
      sx={{ letterSpacing: 1.2, display: 'block', mb: 1.5 }}
    >
      {children}
    </Typography>
  );
}

export default function Dashboard() {
  const { stats, isLoading } = useDashboardController();

  const inactiveApartments = (stats?.totalApartments ?? 0) - (stats?.activeApartments ?? 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Dashboard | StayFlow</title></Head>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

        <PageHeader
          title="Admin Dashboard"
          description="Overview of platform activity — users, listings, reservations and revenue."
        />

        {isLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <StatCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Users */}
            <Box>
              <SectionLabel>Users</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    title="Total Users"
                    value={stats?.totalUsers ?? 0}
                    icon={<PeopleIcon />}
                    color="#1976d2"
                    href="/admin/users"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Landlords"
                    value={stats?.totalLandlords ?? 0}
                    icon={<PeopleIcon />}
                    color="#7b1fa2"
                    href="/admin/users"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Renters"
                    value={stats?.totalRenters ?? 0}
                    icon={<PeopleIcon />}
                    color="#0288d1"
                    href="/admin/users"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Apartments */}
            <Box>
              <SectionLabel>Apartments</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    title="Total Apartments"
                    value={stats?.totalApartments ?? 0}
                    icon={<ApartmentIcon />}
                    color="#2e7d32"
                    href="/admin/apartments"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Active"
                    value={stats?.activeApartments ?? 0}
                    icon={<CheckCircleOutlineIcon />}
                    color="#388e3c"
                    href="/admin/apartments"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Inactive"
                    value={inactiveApartments}
                    icon={<HighlightOffIcon />}
                    color="#9e9e9e"
                    href="/admin/apartments"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Reservations */}
            <Box>
              <SectionLabel>Reservations</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    title="Total Reservations"
                    value={stats?.totalReservations ?? 0}
                    icon={<EventNoteIcon />}
                    color="#f57c00"
                    href="/admin/reservations"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Pending"
                    value={stats?.pendingReservations ?? 0}
                    icon={<HourglassEmptyIcon />}
                    color="#ed6c02"
                    href="/admin/reservations"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Approved"
                    value={stats?.approvedReservations ?? 0}
                    icon={<CheckCircleOutlineIcon />}
                    color="#2e7d32"
                    href="/admin/reservations"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Payments */}
            <Box>
              <SectionLabel>Payments</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatCard
                    title="Total Payments"
                    value={stats?.totalPayments ?? 0}
                    icon={<PaymentsIcon />}
                    color="#c62828"
                    href="/admin/payments"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Total Revenue"
                    value={formatPrice(stats?.totalRevenue ?? 0)}
                    icon={<PaymentsIcon />}
                    color="#d32f2f"
                    href="/admin/payments"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <StatCard
                    title="Commission"
                    value={formatPrice(stats?.totalCommission ?? 0)}
                    icon={<PaymentsIcon />}
                    color="#b71c1c"
                    href="/admin/payments"
                  />
                </Grid>
              </Grid>
            </Box>

          </Box>
        )}
      </Box>
    </Box>
  );
}
