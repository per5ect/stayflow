import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { UserRole } from '../../../../domains/auth.types';

interface UsersFiltersProps {
  draftEmail: string;
  setDraftEmail: (v: string) => void;
  draftRole: UserRole | '';
  setDraftRole: (v: UserRole | '') => void;
  onApply: () => void;
  onReset: () => void;
}

export function UsersFilters({ draftEmail, setDraftEmail, draftRole, setDraftRole, onApply, onReset }: UsersFiltersProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
        <TextField
          label="Email"
          size="small"
          value={draftEmail}
          onChange={(e) => setDraftEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApply()}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={draftRole}
            onChange={(e) => setDraftRole(e.target.value as UserRole | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="RENTER">Renter</MenuItem>
            <MenuItem value="LANDLORD">Landlord</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={onApply}>Search</Button>
          <Button variant="outlined" size="small" onClick={onReset}>Reset</Button>
        </Box>
      </Stack>
    </Paper>
  );
}
