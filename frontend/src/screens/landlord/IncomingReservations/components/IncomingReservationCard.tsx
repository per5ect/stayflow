import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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

interface IncomingReservationCardProps {
  reservation: ReservationResponse;
  onAction: (id: number, action: 'approve' | 'decline') => void;
}

export function IncomingReservationCard({ reservation, onAction }: IncomingReservationCardProps) {
  const chip = STATUS_CHIP[reservation.status];
  const isPending = reservation.status === 'PENDING';
  const isFaded = reservation.status === 'CANCELLED' || reservation.status === 'DECLINED';

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white',
        ...(isPending && { borderColor: 'warning.main', borderWidth: 2, boxShadow: '0 0 0 3px rgba(237,108,2,0.08)' }),
        ...(isFaded && { opacity: 0.7 }),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor: isPending ? 'warning.50' : 'grey.50',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {reservation.apartmentTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {reservation.apartmentCity}
          </Typography>
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
          icon={<PersonIcon sx={{ fontSize: 20 }} />}
          label="Renter"
          value={reservation.renterName}
        />
        <DetailItem
          icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
          label="Check-in"
          value={formatDate(reservation.checkIn)}
        />
        <DetailItem
          icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
          label="Check-out"
          value={formatDate(reservation.checkOut)}
        />
        <DetailItem
          icon={<NightsStayIcon sx={{ fontSize: 20 }} />}
          label="Nights"
          value={reservation.nights}
        />
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
            Total
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatPrice(reservation.totalPrice)}
          </Typography>
        </Box>
      </Box>

      {/* Actions (only for PENDING) */}
      {isPending && (
        <>
          <Divider />
          <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => onAction(reservation.id, 'decline')}
            >
              Decline
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onAction(reservation.id, 'approve')}
            >
              Approve
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}
