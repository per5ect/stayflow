import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { PaymentResponse } from '../../../../domains/payment.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const STATUS_CHIP: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
  COMPLETED: { label: 'Completed', color: 'success' },
  REFUNDED:  { label: 'Refunded',  color: 'warning' },
  FAILED:    { label: 'Failed',    color: 'error'   },
  PENDING:   { label: 'Pending',   color: 'default' },
};

interface PaymentCardProps {
  payment: PaymentResponse;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  const chip = STATUS_CHIP[payment.status] ?? { label: payment.status, color: 'default' as const };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {payment.apartmentTitle}
        </Typography>
        <Chip label={chip.label} color={chip.color} size="small" sx={{ fontWeight: 600, flexShrink: 0 }} />
      </Box>

      <Divider />

      <Box sx={{ px: 2.5, py: 2, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end' }}>
        {/* Card info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Card</Typography>
            <Typography variant="body2" fontWeight={600}>
              {payment.cardBrand} •••• {payment.cardLastFour}
            </Typography>
          </Box>
        </Box>

        {/* Receipt */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Receipt</Typography>
            <Typography variant="body2" fontWeight={600}>#{payment.receiptNumber}</Typography>
          </Box>
        </Box>

        {/* Paid at */}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Paid on</Typography>
          <Typography variant="body2" fontWeight={600}>{formatDate(payment.paidAt)}</Typography>
        </Box>

        {/* Amount */}
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block">Amount</Typography>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {formatPrice(payment.amount)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
