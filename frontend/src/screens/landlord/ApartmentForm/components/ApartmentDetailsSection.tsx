import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
} from '@mui/material';
import { ApartmentRequest, ApartmentType } from '../../../../domains/apartment.types';

const APARTMENT_TYPES: ApartmentType[] = ['ROOM', 'APARTMENT', 'STUDIO', 'HOUSE', 'VILLA'];

interface ApartmentDetailsSectionProps {
  isEdit: boolean;
  form: ApartmentRequest;
  onField: <K extends keyof ApartmentRequest>(key: K, value: ApartmentRequest[K]) => void;
  isLoadingApartment: boolean;
}

export function ApartmentDetailsSection({
  isEdit,
  form,
  onField,
  isLoadingApartment,
}: ApartmentDetailsSectionProps) {
  if (isEdit && isLoadingApartment) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
        <Skeleton height={40} sx={{ mb: 2 }} />
        <Skeleton height={40} sx={{ mb: 2 }} />
        <Skeleton height={80} />
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, bgcolor: 'white' }}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => onField('title', e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={form.description ?? ''}
          onChange={(e) => onField('description', e.target.value)}
          fullWidth
          multiline
          rows={3}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 160 }} required>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={form.apartmentType}
              onChange={(e) => onField('apartmentType', e.target.value as ApartmentType)}
            >
              {APARTMENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Rooms"
            type="number"
            value={form.roomsCount}
            onChange={(e) => onField('roomsCount', Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ width: 120 }}
            required
          />

          <TextField
            label="Price per night"
            type="number"
            value={form.pricePerNight}
            onChange={(e) => onField('pricePerNight', Number(e.target.value))}
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            sx={{ width: 180 }}
            required
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Street"
            value={form.street}
            onChange={(e) => onField('street', e.target.value)}
            sx={{ flex: 2, minWidth: 200 }}
            required
          />
          <TextField
            label="City"
            value={form.city}
            onChange={(e) => onField('city', e.target.value)}
            sx={{ flex: 1, minWidth: 140 }}
            required
          />
          <TextField
            label="Country"
            value={form.country}
            onChange={(e) => onField('country', e.target.value)}
            sx={{ flex: 1, minWidth: 140 }}
            required
          />
        </Box>
      </Box>
    </Paper>
  );
}
