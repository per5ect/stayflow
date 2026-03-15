export type ApartmentType = 'ROOM' | 'APARTMENT' | 'STUDIO' | 'HOUSE' | 'VILLA';
export type ApartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface ApartmentAvailableDate {
  id: number;
  availableFrom: string;
  availableTo: string;
}

export interface ApartmentResponse {
  id: number;
  title: string;
  description: string | null;
  pricePerNight: number;
  street: string;
  city: string;
  country: string;
  roomsCount: number;
  photoUrls: string[];
  apartmentType: ApartmentType;
  status: ApartmentStatus;
  landlordName: string;
  createdAt: string;
  availableDates: ApartmentAvailableDate[];
}

export interface ApartmentRequest {
  title: string;
  description?: string;
  pricePerNight: number;
  street: string;
  city: string;
  country: string;
  roomsCount: number;
  apartmentType: ApartmentType;
}

export interface ApartmentFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  type?: ApartmentType;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
