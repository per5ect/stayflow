import { Box, Container, Typography, Grid, Stack } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentsIcon from "@mui/icons-material/Payments";

const FEATURES = [
  {
    icon: <HomeWorkIcon fontSize="large" />,
    title: "Diverse Listings",
    desc: "Rooms, studios, apartments, houses and villas — something for every budget.",
  },
  {
    icon: <VerifiedUserIcon fontSize="large" />,
    title: "Verified Landlords",
    desc: "Every landlord is verified and reviews are real. No surprises at check-in.",
  },
  {
    icon: <PaymentsIcon fontSize="large" />,
    title: "Secure Payments",
    desc: "Pay only after the landlord approves. Money is held safely until check-in.",
  },
  {
    icon: <SupportAgentIcon fontSize="large" />,
    title: "24/7 Support",
    desc: "Our team is available around the clock to resolve any issue you may have.",
  },
];

export function FeaturesSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={5}>
          Why choose StayFlow
        </Typography>
        <Grid container spacing={4}>
          {FEATURES.map((f) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack alignItems="center" textAlign="center" spacing={1.5}>
                <Box sx={{ color: "primary.main" }}>{f.icon}</Box>
                <Typography variant="h6" fontWeight={700}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
