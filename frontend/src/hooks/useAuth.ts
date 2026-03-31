import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const { user, token, login, logout, isAuthenticated, hydrated } = useAuthContext();

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    hydrated,
    role: user?.role ?? null,
    isRenter: user?.role === 'RENTER',
    isLandlord: user?.role === 'LANDLORD',
    isAdmin: user?.role === 'ADMIN',
  };
}
