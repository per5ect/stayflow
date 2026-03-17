import Head from 'next/head';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useVerifyEmailController } from './useVerifyEmailController';

export default function VerifyEmail() {
  const { form, onSubmit, isSubmitting, email } = useVerifyEmailController();
  const { register, formState: { errors } } = form;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', py: 4 }}>
      <Head><title>Verify Email | StayFlow</title></Head>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h5" fontWeight={800} color="primary">
              StayFlow
            </Typography>
          </Link>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
          <Box sx={{ color: 'primary.main', mb: 2 }}>
            <MarkEmailReadIcon sx={{ fontSize: 56 }} />
          </Box>

          <Typography variant="h6" fontWeight={700} mb={1}>
            Check your email
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={0.5}>
            We sent a 6-digit verification code to
          </Typography>
          <Typography variant="body2" fontWeight={600} mb={3}>
            {email ?? '—'}
          </Typography>

          <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Verification code"
              fullWidth
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: 8, fontSize: 22, fontWeight: 700 } }}
              {...register('code', {
                required: 'Verification code is required',
                minLength: { value: 6, message: 'Code must be 6 digits' },
                maxLength: { value: 6, message: 'Code must be 6 digits' },
                pattern: { value: /^\d{6}$/, message: 'Code must contain only digits' },
              })}
              error={!!errors.code}
              helperText={errors.code?.message}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting || !email}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              {isSubmitting ? 'Verifying...' : 'Verify email'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            Already verified?{' '}
            <Link href="/auth/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
