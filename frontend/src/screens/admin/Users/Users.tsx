import Head from 'next/head';
import { Box, Pagination, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../components/PageHeader';
import { useUsersController } from './useUsersController';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { DeleteUserDialog } from './components/DeleteUserDialog';

export default function Users() {
  const {
    users,
    totalPages,
    totalElements,
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
  } = useUsersController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>Users | StayFlow Admin</title></Head>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <PageHeader
          title="Users"
          description="Manage registered users, filter by role or email, and remove accounts."
        />

        <UsersFilters
          draftEmail={draftEmail}
          setDraftEmail={setDraftEmail}
          draftRole={draftRole}
          setDraftRole={setDraftRole}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <Typography variant="body2" color="text.secondary" mb={1}>
          {totalElements} user{totalElements !== 1 ? 's' : ''} found
        </Typography>

        <UsersTable users={users} isLoading={isLoading} onDelete={confirmDelete} />

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page + 1} onChange={(_, p) => setPage(p - 1)} color="primary" />
          </Box>
        )}
      </Box>

      <DeleteUserDialog
        open={deleteTargetId !== null}
        isDeleting={isDeleting}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </Box>
  );
}
