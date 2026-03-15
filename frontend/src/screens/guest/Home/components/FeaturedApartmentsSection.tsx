import { Box, Container, Typography, Button, Grid, Skeleton } from "@mui/material";
import { ApartmentCard } from "../../../../components/molecules/ApartmentCard/ApartmentCard";
import { ApartmentResponse } from "../../../../domains/apartment.types";

interface Props {
  featured: ApartmentResponse[];
  isLoading: boolean;
}

export function FeaturedApartmentsSection({ featured, isLoading }: Props) {
  return (
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

        {!isLoading && featured.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            <Typography variant="h6">No listings yet</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Check back soon — new apartments are added regularly.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => (
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
              : featured.slice(0, 9).map((apt) => (
                  <Grid key={apt.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ApartmentCard apartment={apt} />
                  </Grid>
                ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
