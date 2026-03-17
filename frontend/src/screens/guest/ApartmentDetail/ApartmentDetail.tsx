import Head from 'next/head';
import { Box, Container, Typography, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "next/link";
import { Navbar } from "../../../components/organisms/Navbar/Navbar";
import { useApartmentDetailController } from "./useApartmentDetailController";
import { PhotoCarousel } from "./components/PhotoCarousel";
import { InfoCard } from "./components/InfoCard";
import { AboutSection } from "./components/AboutSection";
import { ApartmentDetailSkeleton } from "./components/ApartmentDetailSkeleton";

export default function ApartmentDetail() {
  const { apartment, availability, isLoading } = useApartmentDetailController();

  return (
    <Box>
      <Head><title>{apartment ? `${apartment.title} | StayFlow` : 'StayFlow'}</title></Head>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {isLoading ? (
          <ApartmentDetailSkeleton />
        ) : !apartment ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" color="text.secondary">
              Apartment not found.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              component={Link}
              href="/renter/search"
            >
              Back to search
            </Button>
          </Box>
        ) : (
          <>
            <Button
              component={Link}
              href="/renter/search"
              startIcon={<ChevronLeftIcon />}
              sx={{ mb: 3, textTransform: "none", fontWeight: 600, pl: 0 }}
            >
              Back to search
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                mb: 6,
                alignItems: "stretch",
              }}
            >
              {/* Carousel — 70% */}
              <Box sx={{ flex: "0 0 70%", minWidth: 0 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
                >
                  <ImageIcon fontSize="small" color="action" />
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Photos · {apartment.photoUrls?.length ?? 0}
                  </Typography>
                </Box>
                <PhotoCarousel urls={apartment.photoUrls} />
              </Box>

              {/* Info card — 30% */}
              <Box sx={{ flex: "0 0 calc(30% - 32px)", minWidth: 0 }}>
                <InfoCard apartment={apartment} availability={availability} />
              </Box>
            </Box>

            {apartment.description && (
              <AboutSection description={apartment.description} />
            )}

            <Box sx={{ pb: 6 }} />
          </>
        )}
      </Container>
    </Box>
  );
}
