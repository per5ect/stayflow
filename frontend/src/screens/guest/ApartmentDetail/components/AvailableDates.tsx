import { Box, Typography, Stack, Divider } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AvailabilityWindow } from "../../../../domains/availability.types";
import { formatDate } from "../../../../utils/formatDate";

interface Props {
  availability: AvailabilityWindow[];
}

export function AvailableDates({ availability }: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.5 }}
      >
        <CalendarMonthIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" fontWeight={700}>
          Available dates
        </Typography>
      </Box>
      {availability.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No availability windows set yet.
        </Typography>
      ) : (
        <Stack spacing={0.75}>
          {availability.map((w) => (
            <Box
              key={w.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CheckCircleOutlineIcon fontSize="small" color="success" />
              <Typography variant="body2">
                {formatDate(w.availableFrom)} — {formatDate(w.availableTo)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
