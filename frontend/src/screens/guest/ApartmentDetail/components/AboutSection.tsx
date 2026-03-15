import { Box, Typography } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

interface Props {
  description: string;
}

export function AboutSection({ description }: Props) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <HomeWorkIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          About this place
        </Typography>
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ whiteSpace: "pre-line", mb: 5 }}
      >
        {description}
      </Typography>
    </>
  );
}
