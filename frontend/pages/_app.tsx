import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { queryClient } from '../src/lib/queryClient';
import { theme } from '../src/lib/mui';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SnackbarProvider } from '../src/contexts/SnackbarContext';
import { RouteGuard } from '../src/components/RouteGuard';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SnackbarProvider>
            <RouteGuard>
              <Component {...pageProps} />
            </RouteGuard>
          </SnackbarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
