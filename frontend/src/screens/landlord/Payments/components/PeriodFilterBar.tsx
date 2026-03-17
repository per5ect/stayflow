import { Box, Button } from '@mui/material';
import { PeriodFilter } from '../useLandlordPaymentsController';

interface Option {
  value: PeriodFilter;
  label: string;
}

const OPTIONS: Option[] = [
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
];

interface PeriodFilterBarProps {
  active: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
}

export function PeriodFilterBar({ active, onChange }: PeriodFilterBarProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {OPTIONS.map((o) => (
        <Button
          key={o.value}
          size="small"
          variant={active === o.value ? 'contained' : 'outlined'}
          color={active === o.value ? 'primary' : 'inherit'}
          onClick={() => onChange(o.value)}
          sx={{
            borderRadius: 5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: 13,
            ...(active !== o.value && { borderColor: 'grey.300', color: 'text.secondary' }),
          }}
        >
          {o.label}
        </Button>
      ))}
    </Box>
  );
}
