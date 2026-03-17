import { UserRole } from './auth.types';

export interface AdminStatsResponse {
  totalUsers: number;
  totalLandlords: number;
  totalRenters: number;
  totalApartments: number;
  activeApartments: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  totalPayments: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface AdminUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  role: UserRole;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminUserFilters {
  role?: UserRole;
  email?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
