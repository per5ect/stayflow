import {
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { formatDate } from "../../../../utils/formatDate";
import FilterListIcon from "@mui/icons-material/FilterList";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { DraftFilters, SortOption } from "../useSearchController";

interface Props {
  isMobile: boolean;
  onOpenDrawer: () => void;
  applied: DraftFilters & { page: number };
  totalElements: number;
  isLoading: boolean;
  hasActiveFilters: boolean;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  onReset: () => void;
}

export function SearchResultsHeader({
  isMobile,
  onOpenDrawer,
  applied,
  totalElements,
  isLoading,
  hasActiveFilters,
  sort,
  onSortChange,
  onReset,
}: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ApartmentIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Browse apartments
          </Typography>
        </Box>
        {isMobile && (
          <Button
            startIcon={<FilterListIcon />}
            variant="outlined"
            size="small"
            onClick={onOpenDrawer}
          >
            Filters
          </Button>
        )}
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, maxWidth: 600 }}
      >
        Use the filters to narrow down your search — set a city, choose the
        property type, adjust the price range, or pick your travel dates. Click{" "}
        <strong>Apply</strong> to update the results.
      </Typography>

      <Divider sx={{ mt: 2 }} />

      {hasActiveFilters && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
          <Typography>Active Filters:</Typography>
          {applied.city && (
            <Chip label={`City: ${applied.city}`} size="small" onDelete={onReset} />
          )}
          {applied.type && (
            <Chip label={`Type: ${applied.type}`} size="small" />
          )}
          {applied.minPrice && (
            <Chip label={`From $${applied.minPrice}`} size="small" />
          )}
          {applied.maxPrice && (
            <Chip label={`To $${applied.maxPrice}`} size="small" />
          )}
          {applied.minRooms && (
            <Chip label={`${applied.minRooms}+ rooms`} size="small" />
          )}
          {applied.checkIn && (
            <Chip label={`Check-in: ${formatDate(applied.checkIn)}`} size="small" />
          )}
          {applied.checkOut && (
            <Chip label={`Check-out: ${formatDate(applied.checkOut)}`} size="small" />
          )}
        </Stack>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {isLoading
            ? "Searching…"
            : `${totalElements} listing${totalElements !== 1 ? "s" : ""} found`}
        </Typography>

        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_, v) => { if (v) onSortChange(v as SortOption); }}
          size="small"
        >
          <ToggleButton value="newest" sx={{ px: 1.5, fontSize: 12 }}>
            Newest
          </ToggleButton>
          <ToggleButton value="price_asc" sx={{ px: 1.5, fontSize: 12, gap: 0.5 }}>
            <ArrowUpwardIcon sx={{ fontSize: 14 }} /> Price
          </ToggleButton>
          <ToggleButton value="price_desc" sx={{ px: 1.5, fontSize: 12, gap: 0.5 }}>
            <ArrowDownwardIcon sx={{ fontSize: 14 }} /> Price
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
