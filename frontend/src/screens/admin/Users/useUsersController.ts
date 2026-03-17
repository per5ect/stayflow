import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAdapter } from '../../../adapters/admin.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { UserRole } from '../../../domains/auth.types';

export function useUsersController() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftRole, setDraftRole] = useState<UserRole | ''>('');
  const [appliedEmail, setAppliedEmail] = useState('');
  const [appliedRole, setAppliedRole] = useState<UserRole | ''>('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, appliedEmail, appliedRole],
    queryFn: () =>
      adminAdapter.getUsers({
        page,
        size: 10,
        email: appliedEmail || undefined,
        role: appliedRole || undefined,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => adminAdapter.deleteUser(id),
    onSuccess: () => {
      showSnackbar('User deleted successfully.', 'success');
      setDeleteTargetId(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not delete user.'), 'error');
    },
  });

  function applyFilters() {
    setPage(0);
    setAppliedEmail(draftEmail);
    setAppliedRole(draftRole);
  }

  function resetFilters() {
    setDraftEmail('');
    setDraftRole('');
    setPage(0);
    setAppliedEmail('');
    setAppliedRole('');
  }

  function confirmDelete(id: number) {
    setDeleteTargetId(id);
  }

  function cancelDelete() {
    setDeleteTargetId(null);
  }

  function executeDelete() {
    if (deleteTargetId !== null) deleteUser(deleteTargetId);
  }

  return {
    users: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    page,
    setPage,
    draftEmail,
    setDraftEmail,
    draftRole,
    setDraftRole,
    applyFilters,
    resetFilters,
    deleteTargetId,
    confirmDelete,
    cancelDelete,
    executeDelete,
    isDeleting,
  };
}
