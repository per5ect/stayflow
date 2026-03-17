import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAdapter } from '../../../adapters/user.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useAuthContext } from '../../../contexts/AuthContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { UpdateProfileRequest, ChangePasswordRequest } from '../../../domains/user.types';

export function useProfileController() {
  const { showSnackbar } = useSnackbar();
  const { updateUser } = useAuthContext();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: userAdapter.getMe,
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['users', 'me', 'stats'],
    queryFn: userAdapter.getStats,
    enabled: profile?.role === 'RENTER' || profile?.role === 'LANDLORD',
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateProfileRequest) => userAdapter.updateMe(data),
    onSuccess: (updated) => {
      showSnackbar('Profile updated successfully.', 'success');
      setIsEditOpen(false);
      updateUser({ firstName: updated.firstName, lastName: updated.lastName, photoUrl: updated.photoUrl });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not update profile.'), 'error');
    },
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: ChangePasswordRequest) => userAdapter.changePassword(data),
    onSuccess: () => {
      showSnackbar('Password changed successfully.', 'success');
      setIsPasswordOpen(false);
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not change password.'), 'error');
    },
  });

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useMutation({
    mutationFn: (file: File) => userAdapter.uploadAvatar(file),
    onSuccess: (updated) => {
      showSnackbar('Avatar updated.', 'success');
      updateUser({ photoUrl: updated.photoUrl });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not upload avatar.'), 'error');
    },
  });

  return {
    profile,
    stats,
    isProfileLoading,
    isStatsLoading,
    isEditOpen,
    setIsEditOpen,
    isPasswordOpen,
    setIsPasswordOpen,
    updateProfile,
    isUpdating,
    changePassword,
    isChangingPassword,
    uploadAvatar,
    isUploadingAvatar,
  };
}
