import { Box, Typography, Button, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from 'next/link';

export default function Forbidden() {
  return (
    <Container maxWidth="sm">
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
        <LockOutlinedIcon sx={{ fontSize: 80, color: 'grey.400' }} />
        <Typography variant="h2" fontWeight={800} color="grey.300">
          403
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          Access denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don&apos;t have permission to view this page.
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
