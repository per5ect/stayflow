import { Box, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { Navbar } from "../../../components/organisms/Navbar/Navbar";
import { useSearchController } from "./useSearchController";
import { FilterPanel } from "./components/FilterPanel";
import { SearchResultsHeader } from "./components/SearchResultsHeader";
import { ApartmentResults } from "./components/ApartmentResults";

export default function Search() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    draft,
    setDraft,
    applied,
    sort,
    changeSort,
    apartments,
    totalPages,
    totalElements,
    isLoading,
    applyFilters,
    resetFilters,
    handlePageChange,
  } = useSearchController(resultsRef);

  function handleApply() {
    applyFilters();
    setDrawerOpen(false);
  }

  function handleReset() {
    resetFilters();
    setDrawerOpen(false);
  }

  const hasActiveFilters = !!(
    applied.city ||
    applied.type ||
    applied.minPrice ||
    applied.maxPrice ||
    applied.minRooms ||
    applied.checkIn ||
    applied.checkOut
  );

  const hasDraftContent = !!(
    draft.city ||
    draft.type ||
    draft.minPrice ||
    draft.maxPrice ||
    draft.minRooms ||
    draft.checkIn ||
    draft.checkOut
  );

  const filterPanelProps = {
    draft,
    setDraft,
    onApply: handleApply,
    onReset: handleReset,
    hasActiveFilters,
    hasDraftContent,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar — desktop only */}
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              overflowY: "auto",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 3,
              bgcolor: "background.paper",
            }}
          >
            <FilterPanel {...filterPanelProps} />
          </Box>
        )}

        {/* Main results area */}
        <Box ref={resultsRef} sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 4 } }}>
          <SearchResultsHeader
            isMobile={isMobile}
            onOpenDrawer={() => setDrawerOpen(true)}
            applied={applied}
            totalElements={totalElements}
            isLoading={isLoading}
            hasActiveFilters={hasActiveFilters}
            sort={sort}
            onSortChange={changeSort}
            onReset={handleReset}
          />
          <ApartmentResults
            isLoading={isLoading}
            apartments={apartments}
            totalPages={totalPages}
            page={applied.page}
            hasActiveFilters={hasActiveFilters}
            checkIn={applied.checkIn || undefined}
            checkOut={applied.checkOut || undefined}
            onPageChange={handlePageChange}
            onReset={handleReset}
          />
        </Box>
      </Box>

      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, p: 3 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterPanel {...filterPanelProps} />
      </Drawer>
    </Box>
  );
}
