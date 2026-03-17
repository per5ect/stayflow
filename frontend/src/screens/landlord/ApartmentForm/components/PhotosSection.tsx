import { Box, Button, Divider, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from 'react';

interface PhotosSectionProps {
  photoUrls: string[];
  isUploading: boolean;
  onUpload: (files: File[]) => void;
  onDelete: (photoUrl: string) => void;
}

export function PhotosSection({ photoUrls, isUploading, onUpload, onDelete }: PhotosSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onUpload(files);
    e.target.value = '';
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
      <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>Photos</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload photos to showcase your apartment.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
          loading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </Box>

      <Divider />

      <Box sx={{ p: 2.5 }}>
        {photoUrls.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No photos uploaded yet.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {photoUrls.map((url) => (
              <Box
                key={url}
                sx={{ position: 'relative', width: 120, height: 90, borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'grey.200' }}
              >
                <Box
                  component="img"
                  src={url}
                  alt="apartment photo"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Tooltip title="Delete photo">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(url)}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      '&:hover': { bgcolor: 'white' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
