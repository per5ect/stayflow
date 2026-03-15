import { Box, Container, Typography, TextField, Button, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  city: string;
  setCity: (v: string) => void;
  handleSearch: () => void;
}

export function HeroSection({ city, setCity, handleSearch }: Props) {
  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/preview.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
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
  );
}
