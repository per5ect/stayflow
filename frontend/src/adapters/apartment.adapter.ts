import { api } from '../lib/axios';
import {
  ApartmentResponse,
  ApartmentRequest,
  ApartmentFilters,
  PageResponse,
} from '../domains/apartment.types';
import { AvailabilityWindow, BookedRange } from '../domains/availability.types';

export const apartmentAdapter = {
  getAll: (filters?: ApartmentFilters) =>
    api.get<PageResponse<ApartmentResponse>>('/api/apartments', { params: filters }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ApartmentResponse>(`/api/apartments/${id}`).then((r) => r.data),

  create: (data: ApartmentRequest) =>
    api.post<ApartmentResponse>('/api/apartments', data).then((r) => r.data),

  update: (id: number, data: Partial<ApartmentRequest>) =>
    api.put<ApartmentResponse>(`/api/apartments/${id}`, data).then((r) => r.data),

  activate: (id: number) =>
    api.put<ApartmentResponse>(`/api/apartments/${id}/activate`).then((r) => r.data),

  deactivate: (id: number) =>
    api.put<ApartmentResponse>(`/api/apartments/${id}/deactivate`).then((r) => r.data),

  getMy: (params?: { status?: string; page?: number; size?: number }) =>
    api.get<PageResponse<ApartmentResponse>>('/api/apartments/my', { params }).then((r) => r.data),

  getAvailability: (id: number) =>
    api.get<AvailabilityWindow[]>(`/api/apartments/${id}/availability`).then((r) => r.data),

  addAvailability: (id: number, from: string, to: string) =>
    api.post<string>(`/api/apartments/${id}/availability`, null, { params: { from, to } }).then((r) => r.data),

  removeAvailability: (id: number, availabilityId: number) =>
    api.delete<string>(`/api/apartments/${id}/availability/${availabilityId}`).then((r) => r.data),

  getBookedDates: (id: number) =>
    api.get<BookedRange[]>(`/api/apartments/${id}/booked-dates`).then((r) => r.data),

  uploadPhotos: (id: number, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return api.post<ApartmentResponse>(`/api/apartments/${id}/photos`, form).then((r) => r.data);
  },

  deletePhoto: (id: number, photoUrl: string) =>
    api.delete<ApartmentResponse>(`/api/apartments/${id}/photos`, { params: { photoUrl } }).then((r) => r.data),
};
