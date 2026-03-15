import { Box, Typography } from "@mui/material";

export function HomeFooter() {
  return (
    <Box
      sx={{
        py: 4,
        bgcolor: "#1A1A2E",
        color: "grey.400",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} StayFlow. All rights reserved.
      </Typography>
    </Box>
  );
}
