import { Box, Grid, Typography, Button, Skeleton, Pagination } from "@mui/material";
import { ApartmentCard } from "../../../../components/molecules/ApartmentCard/ApartmentCard";
import { ApartmentResponse } from "../../../../domains/apartment.types";

interface Props {
  isLoading: boolean;
  apartments: ApartmentResponse[];
  totalPages: number;
  page: number;
  hasActiveFilters: boolean;
  checkIn?: string;
  checkOut?: string;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onReset: () => void;
}

export function ApartmentResults({
  isLoading,
  apartments,
  totalPages,
  page,
  hasActiveFilters,
  checkIn,
  checkOut,
  onPageChange,
  onReset,
}: Props) {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, xl: 4 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            <Skeleton width="70%" sx={{ mt: 1 }} />
            <Skeleton width="40%" />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (apartments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
        <Typography variant="h6">No apartments found</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Try adjusting your filters or search for a different city.
        </Typography>
        {hasActiveFilters && (
          <Button variant="outlined" sx={{ mt: 3 }} onClick={onReset}>
            Clear filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {apartments.map((apt) => (
          <Grid key={apt.id} size={{ xs: 12, sm: 6, xl: 4 }}>
            <ApartmentCard apartment={apt} checkIn={checkIn} checkOut={checkOut} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5, pb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </>
  );
}
