import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdminUserResponse } from '../../../../domains/admin.types';
import { formatDate } from '../../../../utils/formatDate';

const ROLE_COLORS = {
  RENTER: 'primary',
  LANDLORD: 'secondary',
  ADMIN: 'error',
} as const;

interface UsersTableProps {
  users: AdminUserResponse[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function UsersTable({ users, isLoading, onDelete }: UsersTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 48 }}>Avatar</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}><Skeleton height={20} /></TableCell>
                  ))}
                </TableRow>
              ))
            : users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>
                    <Avatar
                      src={u.photoUrl ?? undefined}
                      sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.main' }}
                    >
                      {!u.photoUrl && `${u.firstName[0]}${u.lastName[0]}`}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {u.firstName} {u.lastName}
                    </Box>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phoneNumber || '—'}</TableCell>
                  <TableCell>
                    <Chip label={u.role} size="small" color={ROLE_COLORS[u.role] ?? 'default'} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.enabled ? 'Active' : 'Disabled'}
                      size="small"
                      color={u.enabled ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete user">
                      <IconButton size="small" color="error" onClick={() => onDelete(u.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
