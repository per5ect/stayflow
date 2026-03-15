import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isLandlord, isRenter, logout } = useAuth();
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  function handleLogout() {
    logout();
    setAnchor(null);
    router.push('/');
  }

  function getNavLinks() {
    if (isRenter) {
      return [
        { label: 'Search', href: '/renter/search' },
        { label: 'My Reservations', href: '/renter/reservations' },
        { label: 'My Payments', href: '/renter/payments' },
      ];
    }
    if (isLandlord) {
      return [
        { label: 'My Apartments', href: '/landlord/apartments' },
        { label: 'Reservations', href: '/landlord/reservations' },
        { label: 'Earnings', href: '/landlord/payments' },
      ];
    }
    if (isAdmin) {
      return [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Apartments', href: '/admin/apartments' },
      ];
    }
    return [];
  }

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: 'primary.main', letterSpacing: -0.5 }}
          >
            StayFlow
          </Typography>
        </Link>

        <Box sx={{ flex: 1 }} />

        {getNavLinks().map((link) => (
          <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
            <Button sx={{ color: 'text.secondary', fontWeight: 500 }}>{link.label}</Button>
          </Link>
        ))}

        {isAuthenticated ? (
          <>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>
                {user?.firstName[0]}{user?.lastName[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              <MenuItem disabled sx={{ fontWeight: 600, opacity: 1 }}>
                {user?.firstName} {user?.lastName}
              </MenuItem>
              <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem onClick={() => setAnchor(null)}>Profile</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" color="primary" size="small">Log in</Button>
            </Link>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" size="small">Sign up</Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
