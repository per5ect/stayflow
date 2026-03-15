import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../domains/auth.types';

const ROLE_ROUTES: Record<string, UserRole[]> = {
  '/renter': ['RENTER'],
  '/landlord': ['LANDLORD'],
  '/admin': ['ADMIN'],
  '/profile': ['RENTER', 'LANDLORD', 'ADMIN'],
};

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/verify'];

function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const prefix of Object.keys(ROLE_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return ROLE_ROUTES[prefix];
    }
  }
  return null;
}

interface Props {
  children: ReactNode;
}

export function RouteGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, role } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for auth to hydrate from localStorage
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const pathname = router.pathname;
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const requiredRoles = getRequiredRoles(pathname);

    // Logged-in user tries to access auth pages → redirect by role
    if (isAuthenticated && isAuthRoute) {
      if (role === 'RENTER') router.replace('/renter/search');
      else if (role === 'LANDLORD') router.replace('/landlord/apartments');
      else if (role === 'ADMIN') router.replace('/admin/dashboard');
      else router.replace('/');
      return;
    }

    // Protected route: not authenticated → login
    if (requiredRoles && !isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Protected route: wrong role → 403
    if (requiredRoles && role && !requiredRoles.includes(role)) {
      router.replace('/403');
      return;
    }
  }, [ready, router.pathname, isAuthenticated, role]);

  // Show spinner while auth hydrates from localStorage
  if (!ready) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
