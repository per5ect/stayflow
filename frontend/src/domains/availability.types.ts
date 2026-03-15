export interface AvailabilityWindow {
  id: number;
  availableFrom: string;
  availableTo: string;
}

export interface BookedRange {
  checkIn: string;
  checkOut: string;
}
