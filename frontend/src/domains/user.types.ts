import { UserRole } from './auth.types';

export interface UserProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  photoUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface RenterStats {
  role: 'RENTER';
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  declinedReservations: number;
  cancelledReservations: number;
  paidReservations: number;
  totalSpent: number;
}

export interface LandlordStats {
  role: 'LANDLORD';
  totalApartments: number;
  activeApartments: number;
  totalEarnings: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  declinedReservations: number;
  cancelledReservations: number;
  paidReservations: number;
}

export type UserStatsResponse = RenterStats | LandlordStats;
