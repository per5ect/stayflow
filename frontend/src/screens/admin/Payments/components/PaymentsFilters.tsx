import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material';
import { PaymentStatus } from '../../../../domains/payment.types';

interface PaymentsFiltersProps {
  draftStatus: PaymentStatus | '';
  setDraftStatus: (v: PaymentStatus | '') => void;
  onApply: () => void;
  onReset: () => void;
}

export function PaymentsFilters({ draftStatus, setDraftStatus, onApply, onReset }: PaymentsFiltersProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as PaymentStatus | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="REFUNDED">Refunded</MenuItem>
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
