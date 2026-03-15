import { api } from '../lib/axios';
import { AuthResponse, LoginRequest, RegisterRequest, VerifyEmailRequest } from '../domains/auth.types';

export const authAdapter = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<string>('/api/auth/register', data).then((r) => r.data),

  verify: (data: VerifyEmailRequest) =>
    api.post<string>('/api/auth/verify', data).then((r) => r.data),
};
