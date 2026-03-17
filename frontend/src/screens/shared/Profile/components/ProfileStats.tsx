import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentsIcon from '@mui/icons-material/Payments';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { UserStatsResponse, RenterStats, LandlordStats } from '../../../../domains/user.types';
import { formatPrice } from '../../../../utils/formatPrice';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}15`,
            color,
            borderRadius: 2,
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', lineHeight: 1 }}
          >
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2} mt={0.25}>
            {value}
          </Typography>
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

function RenterStatsGrid({ stats }: { stats: RenterStats }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <SectionLabel>Reservations</SectionLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatItem icon={<EventNoteIcon />} label="Total" value={stats.totalReservations} color="#1976d2" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HourglassEmptyIcon />} label="Pending" value={stats.pendingReservations} color="#ed6c02" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<CheckCircleOutlineIcon />} label="Approved" value={stats.approvedReservations} color="#2e7d32" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HighlightOffIcon />} label="Declined" value={stats.declinedReservations} color="#c62828" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HighlightOffIcon />} label="Cancelled" value={stats.cancelledReservations} color="#9e9e9e" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<PaymentsIcon />} label="Paid" value={stats.paidReservations} color="#0288d1" />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <SectionLabel>Spending</SectionLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatItem icon={<MonetizationOnIcon />} label="Total Spent" value={formatPrice(stats.totalSpent)} color="#7b1fa2" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function LandlordStatsGrid({ stats }: { stats: LandlordStats }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <SectionLabel>Apartments</SectionLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatItem icon={<ApartmentIcon />} label="Total" value={stats.totalApartments} color="#2e7d32" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<CheckCircleOutlineIcon />} label="Active" value={stats.activeApartments} color="#388e3c" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HighlightOffIcon />} label="Inactive" value={stats.totalApartments - stats.activeApartments} color="#9e9e9e" />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <SectionLabel>Reservations</SectionLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatItem icon={<EventNoteIcon />} label="Total" value={stats.totalReservations} color="#1976d2" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HourglassEmptyIcon />} label="Pending" value={stats.pendingReservations} color="#ed6c02" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<CheckCircleOutlineIcon />} label="Approved" value={stats.approvedReservations} color="#2e7d32" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HighlightOffIcon />} label="Declined" value={stats.declinedReservations} color="#c62828" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<HighlightOffIcon />} label="Cancelled" value={stats.cancelledReservations} color="#9e9e9e" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatItem icon={<PaymentsIcon />} label="Paid" value={stats.paidReservations} color="#0288d1" />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <SectionLabel>Earnings</SectionLabel>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <StatItem icon={<MonetizationOnIcon />} label="Total Earnings" value={formatPrice(stats.totalEarnings)} color="#7b1fa2" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

interface ProfileStatsProps {
  stats: UserStatsResponse;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  if (stats.role === 'RENTER') return <RenterStatsGrid stats={stats} />;
  if (stats.role === 'LANDLORD') return <LandlordStatsGrid stats={stats} />;
  return null;
}

export function ProfileStatsSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rounded" width={44} height={44} sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="60%" height={12} />
                <Skeleton width="40%" height={28} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
