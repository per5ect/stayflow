import { Chip, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { PaymentResponse, PaymentStatus } from '../../../../domains/payment.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const STATUS_COLORS: Record<PaymentStatus, 'warning' | 'success' | 'error' | 'default'> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error',
  REFUNDED: 'default',
};

interface PaymentsTableProps {
  payments: PaymentResponse[];
  isLoading: boolean;
}

export function PaymentsTable({ payments, isLoading }: PaymentsTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reservation</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Apartment</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Renter</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Commission</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Payout</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Card</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Paid At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((__, j) => (
                    <TableCell key={j}><Skeleton height={20} /></TableCell>
                  ))}
                </TableRow>
              ))
            : payments.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>#{p.reservationId}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Typography variant="body2" noWrap title={p.apartmentTitle}>{p.apartmentTitle}</Typography>
                  </TableCell>
                  <TableCell>{p.renterName}</TableCell>
                  <TableCell>{formatPrice(p.amount)}</TableCell>
                  <TableCell>{formatPrice(p.commission)}</TableCell>
                  <TableCell>{formatPrice(p.landlordPayout)}</TableCell>
                  <TableCell>
                    <Chip label={p.status} size="small" color={STATUS_COLORS[p.status]} variant="outlined" />
                  </TableCell>
                  <TableCell>{p.cardBrand} ···{p.cardLastFour}</TableCell>
                  <TableCell>{formatDate(p.paidAt)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
