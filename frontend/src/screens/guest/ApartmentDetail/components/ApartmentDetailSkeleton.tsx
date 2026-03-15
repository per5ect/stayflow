import { Grid, Skeleton } from "@mui/material";

export function ApartmentDetailSkeleton() {
  return (
    <Grid container spacing={4} sx={{ mb: 5 }}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Skeleton height={44} width="80%" sx={{ mb: 1 }} />
        <Skeleton height={24} width="55%" sx={{ mb: 2 }} />
        <Skeleton height={64} width="50%" sx={{ mb: 2 }} />
        <Skeleton height={24} width="40%" />
      </Grid>
    </Grid>
  );
}
