import { Box, Button } from '@mui/material';
import { ReservationStatus } from '../../../../domains/reservation.types';

interface FilterOption {
  value: ReservationStatus | '';
  label: string;
  color: 'default' | 'warning' | 'success' | 'error' | 'info';
}

const FILTERS: FilterOption[] = [
  { value: '',          label: 'All',       color: 'default' },
  { value: 'PENDING',   label: 'Pending',   color: 'warning' },
  { value: 'APPROVED',  label: 'Approved',  color: 'success' },
  { value: 'DECLINED',  label: 'Declined',  color: 'error'   },
  { value: 'PAID',      label: 'Paid',      color: 'info'    },
  { value: 'CANCELLED', label: 'Cancelled', color: 'default' },
];

interface StatusFilterBarProps {
  active: ReservationStatus | '';
  counts: Record<string, number>;
  allCount: number;
  onChange: (status: ReservationStatus | '') => void;
}

export function StatusFilterBar({ active, counts, allCount, onChange }: StatusFilterBarProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {FILTERS.map((f) => {
        const count = f.value === '' ? allCount : (counts[f.value] ?? 0);
        const isActive = active === f.value;

        return (
          <Button
            key={f.value}
            size="small"
            variant={isActive ? 'contained' : 'outlined'}
            color={isActive ? (f.color === 'default' ? 'primary' : f.color) : 'inherit'}
            onClick={() => onChange(f.value)}
            endIcon={
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                  borderRadius: '9px',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                  bgcolor: isActive ? 'rgba(255,255,255,0.3)' : 'grey.200',
                  color: isActive ? 'inherit' : 'text.secondary',
                }}
              >
                {count}
              </Box>
            }
            sx={{
              borderRadius: 5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: 13,
              ...(!isActive && { borderColor: 'grey.300', color: 'text.secondary' }),
            }}
          >
            {f.label}
          </Button>
        );
      })}
    </Box>
  );
}
