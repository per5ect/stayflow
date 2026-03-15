import { api } from '../lib/axios';
import { AdminStatsResponse, AdminUserResponse, AdminUserFilters } from '../domains/admin.types';
import { ApartmentResponse, PageResponse } from '../domains/apartment.types';
import { ReservationResponse, ReservationStatus } from '../domains/reservation.types';
import { PaymentResponse, PaymentStatus } from '../domains/payment.types';

interface PageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const adminAdapter = {
  getStats: () =>
    api.get<AdminStatsResponse>('/api/admin/stats').then((r) => r.data),

  getUsers: (params?: AdminUserFilters) =>
    api.get<PageResponse<AdminUserResponse>>('/api/admin/users', { params }).then((r) => r.data),

  deleteUser: (id: number) =>
    api.delete<string>(`/api/admin/users/${id}`).then((r) => r.data),

  getApartments: (params?: PageParams & { status?: string; city?: string }) =>
    api.get<PageResponse<ApartmentResponse>>('/api/admin/apartments', { params }).then((r) => r.data),

  getReservations: (params?: PageParams & { status?: ReservationStatus }) =>
    api.get<PageResponse<ReservationResponse>>('/api/admin/reservations', { params }).then((r) => r.data),

  getPayments: (params?: PageParams & { status?: PaymentStatus }) =>
    api.get<PageResponse<PaymentResponse>>('/api/admin/payments', { params }).then((r) => r.data),
};
