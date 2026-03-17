import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Link from 'next/link';
import { ReservationResponse } from '../../../../domains/reservation.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const STATUS_CHIP: Record<string, { label: string; color: 'warning' | 'success' | 'error' | 'default' | 'info' }> = {
  PENDING:   { label: 'Pending',   color: 'warning' },
  APPROVED:  { label: 'Approved',  color: 'success' },
  DECLINED:  { label: 'Declined',  color: 'error'   },
  CANCELLED: { label: 'Cancelled', color: 'default' },
  PAID:      { label: 'Paid',      color: 'info'    },
};

function canCancel(reservation: ReservationResponse): boolean {
  if (reservation.status !== 'PENDING' && reservation.status !== 'APPROVED') return false;
  return new Date(reservation.checkIn).getTime() - Date.now() > 24 * 60 * 60 * 1000;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
      <Box sx={{ color: 'text.secondary', mt: '1px', lineHeight: 0, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600} lineHeight={1.4}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

interface ReservationCardProps {
  reservation: ReservationResponse;
  onCancel: (id: number) => void;
}

export function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const chip = STATUS_CHIP[reservation.status];
  const awaitingPayment = reservation.status === 'APPROVED';

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white',
        ...(awaitingPayment && {
          borderColor: 'warning.main',
          borderWidth: 2,
          boxShadow: '0 0 0 3px rgba(237,108,2,0.08)',
        }),
        ...(reservation.status === 'CANCELLED' || reservation.status === 'DECLINED'
          ? { opacity: 0.7 }
          : {}),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          bgcolor: awaitingPayment ? 'warning.50' : 'grey.50',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Link
            href={`/apartments/${reservation.apartmentId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
            >
              {reservation.apartmentTitle}
            </Typography>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {reservation.apartmentCity}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={chip.label}
          color={chip.color}
          size="small"
          sx={{ fontWeight: 600, flexShrink: 0, mt: 0.25 }}
        />
      </Box>

      <Divider />

      {/* Details */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
        <DetailItem
          icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
          label="Check-in"
          value={formatDate(reservation.checkIn)}
        />
        <DetailItem
          icon={<CalendarMonthIcon sx={{ fontSize: 28 }} />}
          label="Check-out"
          value={formatDate(reservation.checkOut)}
        />
        <DetailItem
          icon={<NightsStayIcon sx={{ fontSize: 28 }} />}
          label="Nights"
          value={reservation.nights}
        />
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
            Total
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.4} color={awaitingPayment ? 'warning.dark' : 'text.primary'}>
            {formatPrice(reservation.totalPrice)}
          </Typography>
        </Box>
      </Box>

      {/* Status banners + landlord message */}
      <Box sx={{ px: 2.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {reservation.status === 'PENDING' && (
          <Alert severity="info">
            Your reservation is awaiting landlord review. You'll be notified once it's approved or declined.
          </Alert>
        )}

        {reservation.status === 'APPROVED' && (
          <Alert
            severity="warning"
            action={
              <Link href={`/renter/checkout/${reservation.id}`} style={{ textDecoration: 'none' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<CreditCardIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Pay now
                </Button>
              </Link>
            }
          >
            <strong>Approved!</strong> Complete your booking by paying before the check-in date.
          </Alert>
        )}

        {reservation.status === 'DECLINED' && (
          <Alert severity="error">
            <strong>Declined.</strong>{' '}
            {reservation.landlordMessage
              ? `Landlord's message: "${reservation.landlordMessage}"`
              : 'The landlord has declined your reservation.'}
          </Alert>
        )}

        {reservation.status === 'PAID' && (
          <Alert severity="success">
            Booking confirmed and paid. Enjoy your stay!
          </Alert>
        )}

        {/* Landlord message for non-declined statuses */}
        {reservation.landlordMessage && reservation.status !== 'DECLINED' && (
          <Alert severity="info" icon={false}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              Message from landlord
            </Typography>
            "{reservation.landlordMessage}"
          </Alert>
        )}

        {canCancel(reservation) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" color="error" variant="text" onClick={() => onCancel(reservation.id)}>
              Cancel reservation
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
