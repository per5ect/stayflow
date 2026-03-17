import Head from 'next/head';
import { Box, Typography, Button, Container } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Head><title>404 Not Found | StayFlow</title></Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 80, color: 'grey.400' }} />
        <Typography variant="h2" fontWeight={800} color="grey.300">
          404
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" size="large" sx={{ mt: 1 }}>
            Back to Home
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
