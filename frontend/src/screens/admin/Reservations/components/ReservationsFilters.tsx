import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material';
import { ReservationStatus } from '../../../../domains/reservation.types';

interface ReservationsFiltersProps {
  draftStatus: ReservationStatus | '';
  setDraftStatus: (v: ReservationStatus | '') => void;
  onApply: () => void;
  onReset: () => void;
}

export function ReservationsFilters({ draftStatus, setDraftStatus, onApply, onReset }: ReservationsFiltersProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as ReservationStatus | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="DECLINED">Declined</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
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
