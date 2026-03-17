import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ReservationResponse } from '../../../../domains/reservation.types';
import { formatDate } from '../../../../utils/formatDate';
import { formatPrice } from '../../../../utils/formatPrice';

const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover'];

interface CheckoutFormProps {
  reservation: ReservationResponse;
  isPaying: boolean;
  onPay: (data: { cardBrand: string; cardLastFour: string }) => void;
}

export function CheckoutForm({ reservation, isPaying, onPay }: CheckoutFormProps) {
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardLastFour, setCardLastFour] = useState('');
  const [cardLastFourError, setCardLastFourError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4}$/.test(cardLastFour)) {
      setCardLastFourError('Enter exactly 4 digits.');
      return;
    }
    setCardLastFourError('');
    onPay({ cardBrand, cardLastFour });
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      {/* Reservation summary */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle1" fontWeight={700}>Booking Summary</Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body1" fontWeight={700}>{reservation.apartmentTitle}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{reservation.apartmentCity}</Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Check-in</Typography>
                <Typography variant="body2" fontWeight={600}>{formatDate(reservation.checkIn)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Check-out</Typography>
                <Typography variant="body2" fontWeight={600}>{formatDate(reservation.checkOut)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NightsStayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Nights</Typography>
                <Typography variant="body2" fontWeight={600}>{reservation.nights}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight={700}>Total</Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatPrice(reservation.totalPrice)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Payment form */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
        <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="subtitle1" fontWeight={700}>Payment Details</Typography>
        </Box>
        <Divider />
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            select
            label="Card Brand"
            value={cardBrand}
            onChange={(e) => setCardBrand(e.target.value)}
            size="small"
            fullWidth
          >
            {CARD_BRANDS.map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Last 4 digits"
            value={cardLastFour}
            onChange={(e) => {
              setCardLastFour(e.target.value.replace(/\D/g, '').slice(0, 4));
              setCardLastFourError('');
            }}
            inputProps={{ inputMode: 'numeric', maxLength: 4 }}
            placeholder="e.g. 4242"
            size="small"
            fullWidth
            error={!!cardLastFourError}
            helperText={cardLastFourError || 'Enter the last 4 digits of your card'}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled' }}>
            <LockIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">Payments are secure and encrypted.</Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isPaying}
            loading={isPaying}
            startIcon={<CreditCardIcon />}
          >
            Pay {formatPrice(reservation.totalPrice)}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
