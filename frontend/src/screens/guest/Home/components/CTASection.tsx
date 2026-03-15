import { Box, Container, Typography, Button } from "@mui/material";

export function CTASection() {
  return (
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
          List your property on StayFlow and start earning. It takes less than 5
          minutes to get started.
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
  );
}
