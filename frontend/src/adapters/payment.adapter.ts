import { api } from '../lib/axios';
import { PaymentResponse, PaymentRequest } from '../domains/payment.types';

export const paymentAdapter = {
  pay: (data: PaymentRequest) =>
    api.post<PaymentResponse>('/api/payments', data).then((r) => r.data),

  getMy: () =>
    api.get<PaymentResponse[]>('/api/payments/my').then((r) => r.data),

  getLandlord: () =>
    api.get<PaymentResponse[]>('/api/payments/landlord').then((r) => r.data),
};
