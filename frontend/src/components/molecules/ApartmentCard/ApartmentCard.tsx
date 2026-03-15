import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ApartmentResponse } from "../../../domains/apartment.types";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  apartment: ApartmentResponse;
  checkIn?: string;
  checkOut?: string;
}

export function ApartmentCard({ apartment, checkIn, checkOut }: Props) {
  const hasPhoto = apartment.photoUrls && apartment.photoUrls.length > 0;
  const dateQuery =
    checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : "";

  return (
    <Link
      href={`/apartments/${apartment.id}${dateQuery}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
        }}
      >
        {hasPhoto ? (
          <CardMedia
            component="img"
            height={200}
            image={apartment.photoUrls[0]}
            alt={apartment.title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              bgcolor: "grey.100",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "grey.400",
              gap: 1,
            }}
          >
            <ImageIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">No image</Typography>
          </Box>
        )}
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              sx={{ flex: 1, mr: 1 }}
            >
              {apartment.title}
            </Typography>
            <Chip
              label={apartment.apartmentType}
              size="small"
              sx={{
                bgcolor: "primary.50",
                color: "primary.main",
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
              mb: 1,
            }}
          >
            <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="body2" noWrap>
              {apartment.city}, {apartment.country}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatPrice(apartment.pricePerNight)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              / night
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {apartment.roomsCount}{" "}
            {apartment.roomsCount === 1 ? "room" : "rooms"} ·{" "}
            {apartment.landlordName}
          </Typography>

          <Box
            sx={{
              mt: 1.25,
              pt: 1.25,
              mb: 0,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {checkIn && checkOut ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 14, color: "success.main" }}
                />
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={600}
                >
                  Available {formatDate(checkIn)} — {formatDate(checkOut)}
                </Typography>
              </Box>
            ) : apartment.availableDates?.length > 0 ? (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
                <CalendarMonthIcon sx={{ fontSize: 13, color: "text.secondary", mt: "2px", flexShrink: 0 }} />
                <Stack spacing={0.25}>
                  {apartment.availableDates.slice(0, 2).map((w) => (
                    <Typography key={w.id} variant="caption" color="text.secondary" noWrap>
                      {formatDate(w.availableFrom)} — {formatDate(w.availableTo)}
                    </Typography>
                  ))}
                  {apartment.availableDates.length > 2 && (
                    <Typography variant="caption" color="text.disabled">
                      +{apartment.availableDates.length - 2} more
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.disabled",
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption">No availability set</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
