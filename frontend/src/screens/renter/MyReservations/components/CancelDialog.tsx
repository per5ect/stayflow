import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface CancelDialogProps {
  open: boolean;
  isCancelling: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelDialog({ open, isCancelling, onConfirm, onClose }: CancelDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Cancel reservation?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This action cannot be undone. The reservation will be marked as cancelled.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isCancelling}>Keep it</Button>
        <Button
          variant="contained"
          color="error"
          disabled={isCancelling}
          loading={isCancelling}
          onClick={onConfirm}
        >
          Cancel reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
