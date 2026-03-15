export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentResponse {
  id: number;
  reservationId: number;
  apartmentTitle: string;
  renterName: string;
  amount: number;
  commission: number;
  landlordPayout: number;
  status: PaymentStatus;
  cardBrand: string;
  cardLastFour: string;
  transactionId: string;
  receiptNumber: string;
  paidAt: string;
}

export interface PaymentRequest {
  reservationId: number;
  cardLastFour: string;
  cardBrand: string;
}
