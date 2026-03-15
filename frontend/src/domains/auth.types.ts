export type UserRole = 'RENTER' | 'LANDLORD' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'RENTER' | 'LANDLORD';
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}
