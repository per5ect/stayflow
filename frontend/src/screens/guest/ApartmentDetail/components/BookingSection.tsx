import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useAuth } from "../../../../hooks/useAuth";
import { useApartmentDetailController } from "../useApartmentDetailController";
import { formatPrice } from "../../../../utils/formatPrice";

export function BookingSection() {
  const { isAuthenticated, isRenter } = useAuth();
  const {
    availability,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    shouldDisableDate,
    nights,
    hasDiscount,
    pricePerNight,
    subtotal,
    totalPrice,
    isBooking,
    handleBook,
  } = useApartmentDetailController();

  if (!isAuthenticated) {
    return (
      <Box>
        <Divider sx={{ mb: 1.5 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 1.5, lineHeight: 1.4 }}
        >
          Sign in to book this apartment.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          component={Link}
          href="/auth/login"
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Sign in or create account
        </Button>
      </Box>
    );
  }

  if (!isRenter) {
    return (
      <Box>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning">Only renters can book apartments.</Alert>
      </Box>
    );
  }

  const canBook = !!checkIn && !!checkOut && nights > 0;

  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      {availability.length === 0 ? (
        <Alert severity="warning">
          No availability windows set by the landlord yet.
        </Alert>
      ) : (
        <>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <DatePicker
              label="Check-in"
              value={checkIn}
              onChange={(v) => {
                setCheckIn(v);
                if (checkOut && v && checkOut.isBefore(v.add(1, "day")))
                  setCheckOut(null);
              }}
              shouldDisableDate={shouldDisableDate}
              minDate={dayjs()}
              format="MM/DD/YYYY"
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <DatePicker
              label="Check-out"
              value={checkOut}
              onChange={(v) => setCheckOut(v)}
              shouldDisableDate={shouldDisableDate}
              minDate={checkIn ? checkIn.add(1, "day") : dayjs().add(1, "day")}
              format="MM/DD/YYYY"
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Stack>

          {canBook && (
            <Stack spacing={0.5} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(pricePerNight)} × {nights} night
                  {nights !== 1 ? "s" : ""}
                </Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>
              {hasDiscount && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="success.main">
                    Weekly discount (10%)
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    −{formatPrice(subtotal - totalPrice)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {formatPrice(totalPrice)}
                </Typography>
              </Box>
            </Stack>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!canBook || isBooking}
            onClick={handleBook}
            startIcon={
              isBooking ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {isBooking ? "Sending request…" : "Request to book"}
          </Button>
        </>
      )}
    </Box>
  );
}
