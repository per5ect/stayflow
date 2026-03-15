export type ReservationStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'CANCELLED' | 'PAID';

export interface ReservationResponse {
  id: number;
  apartmentId: number;
  apartmentTitle: string;
  apartmentCity: string;
  renterName: string;
  landlordName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: ReservationStatus;
  landlordMessage: string | null;
  createdAt: string;
}

export interface ReservationRequest {
  apartmentId: number;
  checkIn: string;
  checkOut: string;
}
