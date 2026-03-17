import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { PaymentResponse } from '../../../../domains/payment.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const STATUS_CHIP: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
  COMPLETED: { label: 'Completed', color: 'success' },
  REFUNDED:  { label: 'Refunded',  color: 'warning' },
  FAILED:    { label: 'Failed',    color: 'error'   },
  PENDING:   { label: 'Pending',   color: 'default' },
};

interface LandlordPaymentCardProps {
  payment: PaymentResponse;
}

export function LandlordPaymentCard({ payment }: LandlordPaymentCardProps) {
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

      <Box sx={{ px: 2.5, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          {/* Left: renter + receipt */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, alignItems: 'flex-start', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Renter</Typography>
                <Typography variant="body2" fontWeight={600}>{payment.renterName}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <ReceiptIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" display="block">Receipt</Typography>
                <Typography variant="body2" fontWeight={600} noWrap>#{payment.receiptNumber}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: payout */}
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">Your payout</Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {formatPrice(payment.landlordPayout)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              of {formatPrice(payment.amount)} total
            </Typography>
          </Box>
        </Box>

        {/* Paid on — always on its own line below */}
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">Paid on</Typography>
          <Typography variant="body2" fontWeight={600}>{formatDate(payment.paidAt)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
