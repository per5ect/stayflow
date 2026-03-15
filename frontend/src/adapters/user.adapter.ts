import { api } from '../lib/axios';
import {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserStatsResponse,
} from '../domains/user.types';

export const userAdapter = {
  getMe: () =>
    api.get<UserProfileResponse>('/api/users/me').then((r) => r.data),

  updateMe: (data: UpdateProfileRequest) =>
    api.put<UserProfileResponse>('/api/users/me', data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.put<string>('/api/users/me/password', data).then((r) => r.data),

  getStats: () =>
    api.get<UserStatsResponse>('/api/users/me/stats').then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<UserProfileResponse>('/api/users/avatar', form).then((r) => r.data);
  },
};
