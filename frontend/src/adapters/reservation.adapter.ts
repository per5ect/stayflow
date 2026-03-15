import { api } from '../lib/axios';
import { ReservationResponse, ReservationRequest, ReservationStatus } from '../domains/reservation.types';
import { PageResponse } from '../domains/apartment.types';

interface ListParams {
  status?: ReservationStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const reservationAdapter = {
  create: (data: ReservationRequest) =>
    api.post<ReservationResponse>('/api/reservations', data).then((r) => r.data),

  getMy: (params?: ListParams) =>
    api.get<PageResponse<ReservationResponse>>('/api/reservations/my', { params }).then((r) => r.data),

  cancel: (id: number) =>
    api.delete<string>(`/api/reservations/${id}`).then((r) => r.data),

  getLandlord: (params?: ListParams) =>
    api.get<PageResponse<ReservationResponse>>('/api/reservations/landlord', { params }).then((r) => r.data),

  approve: (id: number, message?: string) =>
    api.put<ReservationResponse>(`/api/reservations/${id}/approve`, null, { params: { message } }).then((r) => r.data),

  decline: (id: number, message?: string) =>
    api.put<ReservationResponse>(`/api/reservations/${id}/decline`, null, { params: { message } }).then((r) => r.data),
};
