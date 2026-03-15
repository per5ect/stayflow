import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ApartmentType } from "../../../../domains/apartment.types";
import { DraftFilters } from "../useSearchController";

const APARTMENT_TYPES: { value: ApartmentType | ""; label: string }[] = [
  { value: "", label: "Any type" },
  { value: "ROOM", label: "Room" },
  { value: "STUDIO", label: "Studio" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
];

const ROOMS_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

interface Props {
  draft: DraftFilters;
  setDraft: React.Dispatch<React.SetStateAction<DraftFilters>>;
  onApply: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  hasDraftContent: boolean;
}

export function FilterPanel({
  draft,
  setDraft,
  onApply,
  onReset,
  hasActiveFilters,
  hasDraftContent,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onApply();
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TuneIcon fontSize="small" color="primary" />
        <Typography variant="h6" fontWeight={700}>
          Filters
        </Typography>
      </Box>
      <Divider />

      <TextField
        label="City"
        placeholder="e.g. Paris"
        value={draft.city}
        onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
        onKeyDown={handleKeyDown}
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        label="Property type"
        value={draft.type}
        onChange={(e) =>
          setDraft((d) => ({ ...d, type: e.target.value as ApartmentType | "" }))
        }
        size="small"
        fullWidth
      >
        {APARTMENT_TYPES.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Price per night ($)
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Min"
            value={draft.minPrice}
            onChange={(e) => setDraft((d) => ({ ...d, minPrice: e.target.value }))}
            onKeyDown={handleKeyDown}
            size="small"
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            placeholder="Max"
            value={draft.maxPrice}
            onChange={(e) => setDraft((d) => ({ ...d, maxPrice: e.target.value }))}
            onKeyDown={handleKeyDown}
            size="small"
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Box>
      </Box>

      <TextField
        select
        label="Min rooms"
        value={draft.minRooms}
        onChange={(e) => setDraft((d) => ({ ...d, minRooms: e.target.value }))}
        size="small"
        fullWidth
      >
        {ROOMS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Availability
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <DatePicker
            label="Check-in"
            value={draft.checkIn ? dayjs(draft.checkIn) : null}
            onChange={(v: Dayjs | null) =>
              setDraft((d) => ({ ...d, checkIn: v ? v.format("YYYY-MM-DD") : "" }))
            }
            format="MM/DD/YYYY"
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <DatePicker
            label="Check-out"
            value={draft.checkOut ? dayjs(draft.checkOut) : null}
            onChange={(v: Dayjs | null) =>
              setDraft((d) => ({ ...d, checkOut: v ? v.format("YYYY-MM-DD") : "" }))
            }
            format="MM/DD/YYYY"
            minDate={draft.checkIn ? dayjs(draft.checkIn).add(1, "day") : undefined}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Box>
      </Box>

      <Divider />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" fullWidth onClick={onApply}>
          Apply
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onReset}
          disabled={!hasActiveFilters && !hasDraftContent}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
