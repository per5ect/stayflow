import { Box, Container, Typography, Grid } from "@mui/material";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search",
    desc: "Browse thousands of verified apartments by city, price, type, and dates.",
  },
  {
    step: "02",
    title: "Book",
    desc: "Pick your dates and send a reservation request — the landlord reviews it.",
  },
  {
    step: "03",
    title: "Stay",
    desc: "Once approved, pay securely and enjoy your stay with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={5}>
          How StayFlow works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {HOW_IT_WORKS.map((item) => (
            <Grid key={item.step} size={{ xs: 12, sm: 4 }}>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ color: "primary.main", lineHeight: 1, mb: 1 }}
                >
                  {item.step}
                </Typography>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
