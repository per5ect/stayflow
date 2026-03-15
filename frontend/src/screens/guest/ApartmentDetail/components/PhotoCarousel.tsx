import { Box, Typography, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

interface Props {
  urls: string[];
}

export function PhotoCarousel({ urls }: Props) {
  const [index, setIndex] = useState(0);

  if (!urls || urls.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: 240, md: 420 },
          bgcolor: "grey.100",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "grey.400",
          gap: 1,
        }}
      >
        <ImageIcon sx={{ fontSize: 64 }} />
        <Typography variant="body2">No photos</Typography>
      </Box>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? urls.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === urls.length - 1 ? 0 : i + 1));

  return (
    <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
      <Box
        component="img"
        src={urls[index]}
        alt={`photo ${index + 1}`}
        sx={{
          width: "100%",
          height: { xs: 240, md: 420 },
          objectFit: "cover",
          display: "block",
        }}
      />
      {urls.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            size="small"
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "white" },
              boxShadow: 2,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            size="small"
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "white" },
              boxShadow: 2,
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              right: 14,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "white",
              px: 1.5,
              py: 0.25,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {index + 1} / {urls.length}
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.75,
            }}
          >
            {urls.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: i === index ? 20 : 8,
                  height: 8,
                  borderRadius: 10,
                  bgcolor: i === index ? "white" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
