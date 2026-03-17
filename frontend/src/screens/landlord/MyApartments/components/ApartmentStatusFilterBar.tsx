import { Box, Button } from '@mui/material';
import { ApartmentStatus } from '../../../../domains/apartment.types';

interface FilterOption {
  value: ApartmentStatus | '';
  label: string;
  color: 'default' | 'success' | 'error';
}

const FILTERS: FilterOption[] = [
  { value: '',         label: 'All',      color: 'default' },
  { value: 'ACTIVE',   label: 'Active',   color: 'success' },
  { value: 'INACTIVE', label: 'Inactive', color: 'default' },
];

interface ApartmentStatusFilterBarProps {
  active: ApartmentStatus | '';
  counts: Record<string, number>;
  allCount: number;
  onChange: (status: ApartmentStatus | '') => void;
}

export function ApartmentStatusFilterBar({ active, counts, allCount, onChange }: ApartmentStatusFilterBarProps) {
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
