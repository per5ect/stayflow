import { Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ReservationResponse, ReservationStatus } from '../../../../domains/reservation.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const STATUS_COLORS: Record<ReservationStatus, 'warning' | 'success' | 'error' | 'default' | 'info'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  DECLINED: 'error',
  CANCELLED: 'default',
  PAID: 'info',
};

interface ReservationsTableProps {
  reservations: ReservationResponse[];
  isLoading: boolean;
}

export function ReservationsTable({ reservations, isLoading }: ReservationsTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Apartment</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Renter</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Landlord</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Nights</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((__, j) => (
                    <TableCell key={j}><Skeleton height={20} /></TableCell>
                  ))}
                </TableRow>
              ))
            : reservations.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Typography variant="body2" noWrap title={r.apartmentTitle}>{r.apartmentTitle}</Typography>
                  </TableCell>
                  <TableCell>{r.apartmentCity}</TableCell>
                  <TableCell>{r.renterName}</TableCell>
                  <TableCell>{r.landlordName}</TableCell>
                  <TableCell>{formatDate(r.checkIn)}</TableCell>
                  <TableCell>{formatDate(r.checkOut)}</TableCell>
                  <TableCell>{r.nights}</TableCell>
                  <TableCell>{formatPrice(r.totalPrice)}</TableCell>
                  <TableCell>
                    <Chip label={r.status} size="small" color={STATUS_COLORS[r.status]} variant="outlined" />
                  </TableCell>
                  <TableCell>{formatDate(r.createdAt)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
