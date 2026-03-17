import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { queryClient } from '../src/lib/queryClient';
import { theme } from '../src/lib/mui';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SnackbarProvider } from '../src/contexts/SnackbarContext';
import { RouteGuard } from '../src/components/RouteGuard';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>StayFlow</title>
        <link rel="icon" href="/next.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <CssBaseline />
          <AuthProvider>
            <SnackbarProvider>
              <RouteGuard>
                <Component {...pageProps} />
              </RouteGuard>
            </SnackbarProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </>
  );
}
