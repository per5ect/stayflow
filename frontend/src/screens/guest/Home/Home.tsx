import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Navbar } from "../../../components/organisms/Navbar/Navbar";
import { ApartmentCard } from "../../../components/molecules/ApartmentCard/ApartmentCard";
import { useHomeController } from "./useHomeController";

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

export default function Home() {
  const { city, setCity, handleSearch, featured, isLoading } =
    useHomeController();

  return (
    <Box>
      <Navbar />

      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF5A5F 0%, #FF8C00 100%)",
          py: { xs: 8, md: 14 },
          px: 2,
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mb: 1.5, lineHeight: 1.2 }}
          >
            Find your perfect stay,
            <br />
            anywhere in the world
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}
          >
            Thousands of apartments, rooms and villas — book with confidence
          </Typography>

          <Paper
            elevation={4}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              px: 2,
              py: 1,
              gap: 1,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <SearchIcon color="action" />
            <TextField
              fullWidth
              placeholder="Where are you going?"
              variant="standard"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{ disableUnderline: true }}
              sx={{ "& input": { fontSize: 16 } }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ borderRadius: 2, px: 3, flexShrink: 0 }}
            >
              Search
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* How it works */}
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

      {/* Featured apartments */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              Latest listings
            </Typography>
            <Button variant="outlined" href="/renter/search">
              View all
            </Button>
          </Box>

          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{ borderRadius: 2 }}
                    />
                    <Skeleton width="70%" sx={{ mt: 1 }} />
                    <Skeleton width="40%" />
                  </Grid>
                ))
              : featured.map((apt) => (
                  <Grid key={apt.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ApartmentCard apartment={apt} />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      {/* Why StayFlow */}
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

      {/* CTA */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #00A699 0%, #007A73 100%)",
          textAlign: "center",
          color: "white",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>
            Are you a landlord?
          </Typography>
          <Typography variant="body1" mb={4} sx={{ opacity: 0.9 }}>
            List your property on StayFlow and start earning. It takes less than
            5 minutes to get started.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/auth/register"
            sx={{
              bgcolor: "white",
              color: "secondary.main",
              fontWeight: 700,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            List your property
          </Button>
        </Container>
      </Box>

      {/* Footer */}
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
    </Box>
  );
}
