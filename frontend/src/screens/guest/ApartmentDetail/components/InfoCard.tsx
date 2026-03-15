import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { ApartmentResponse } from "../../../../domains/apartment.types";
import { AvailabilityWindow } from "../../../../domains/availability.types";
import { formatPrice } from "../../../../utils/formatPrice";
import { AvailableDates } from "./AvailableDates";
import { BookingSection } from "./BookingSection";

interface Props {
  apartment: ApartmentResponse;
  availability: AvailabilityWindow[];
}

export function InfoCard({ apartment, availability }: Props) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ flex: 1, lineHeight: 1.2 }}
        >
          {apartment.title}
        </Typography>
        <Chip
          label={apartment.apartmentType}
          color="primary"
          size="small"
          sx={{ fontWeight: 700, flexShrink: 0, mt: 0.5 }}
        />
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.secondary",
          gap: 0.5,
          mb: 2,
        }}
      >
        <LocationOnIcon fontSize="small" />
        <Typography variant="body2">
          {apartment.street}, {apartment.city}, {apartment.country}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          sx={{ lineHeight: 1 }}
        >
          {formatPrice(apartment.pricePerNight)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          per night
        </Typography>
      </Box>

      <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <BedIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            {apartment.roomsCount}{" "}
            {apartment.roomsCount === 1 ? "room" : "rooms"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <HomeWorkIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>
            {apartment.apartmentType}
          </Typography>
        </Box>
      </Stack>

      <AvailableDates availability={availability} />

      <Box sx={{ mt: "auto" }}>
        <BookingSection />
      </Box>
    </Paper>
  );
}
