import { Box, Button, Divider, IconButton, Paper, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AvailabilityWindow } from '../../../../domains/availability.types';
import { formatDate } from '../../../../utils/formatDate';

interface AvailabilitySectionProps {
  availability: AvailabilityWindow[];
  isLoading: boolean;
  availFrom: string;
  availTo: string;
  setAvailFrom: (v: string) => void;
  setAvailTo: (v: string) => void;
  onAdd: () => void;
  isAdding: boolean;
  onRemove: (id: number) => void;
}

export function AvailabilitySection({
  availability,
  isLoading,
  availFrom,
  availTo,
  setAvailFrom,
  setAvailTo,
  onAdd,
  isAdding,
  onRemove,
}: AvailabilitySectionProps) {
  const canAdd = availFrom && availTo && availFrom < availTo;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
      <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" fontWeight={700}>Availability Windows</Typography>
        <Typography variant="body2" color="text.secondary">
          Define the date ranges when this apartment is available to book.
        </Typography>
      </Box>

      <Divider />

      {/* Add form */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <DatePicker
          label="From"
          value={availFrom ? dayjs(availFrom) : null}
          onChange={(v: Dayjs | null) => setAvailFrom(v ? v.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ textField: { size: 'small' } }}
        />
        <DatePicker
          label="To"
          value={availTo ? dayjs(availTo) : null}
          onChange={(v: Dayjs | null) => setAvailTo(v ? v.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          minDate={availFrom ? dayjs(availFrom).add(1, 'day') : undefined}
          slotProps={{ textField: { size: 'small' } }}
        />
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          disabled={!canAdd || isAdding}
          loading={isAdding}
          onClick={() => onAdd()}
        >
          Add
        </Button>
      </Box>

      <Divider />

      {/* List */}
      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={36} sx={{ borderRadius: 1 }} />)
        ) : availability.length === 0 ? (
          <Typography variant="body2" color="text.secondary" py={1}>
            No availability windows set.
          </Typography>
        ) : (
          availability.map((w) => (
            <Box
              key={w.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 1,
                borderRadius: 1,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {formatDate(w.availableFrom)} — {formatDate(w.availableTo)}
              </Typography>
              <IconButton size="small" color="error" onClick={() => onRemove(w.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
