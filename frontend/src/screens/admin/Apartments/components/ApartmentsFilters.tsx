import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { ApartmentStatus } from '../../../../domains/apartment.types';

interface ApartmentsFiltersProps {
  draftCity: string;
  setDraftCity: (v: string) => void;
  draftStatus: ApartmentStatus | '';
  setDraftStatus: (v: ApartmentStatus | '') => void;
  onApply: () => void;
  onReset: () => void;
}

export function ApartmentsFilters({ draftCity, setDraftCity, draftStatus, setDraftStatus, onApply, onReset }: ApartmentsFiltersProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
        <TextField
          label="City"
          size="small"
          value={draftCity}
          onChange={(e) => setDraftCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApply()}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as ApartmentStatus | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
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
