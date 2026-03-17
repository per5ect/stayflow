import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

interface ActionDialogProps {
  open: boolean;
  action: 'approve' | 'decline' | null;
  message: string;
  setMessage: (v: string) => void;
  isActioning: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ActionDialog({ open, action, message, setMessage, isActioning, onConfirm, onClose }: ActionDialogProps) {
  const isApprove = action === 'approve';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>
        {isApprove ? 'Approve reservation?' : 'Decline reservation?'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
        <Typography variant="body2" color="text.secondary">
          {isApprove
            ? 'The renter will be notified and can proceed to payment.'
            : 'The renter will be notified that their request was declined.'}
        </Typography>
        <TextField
          label="Message to renter (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={2}
          fullWidth
          size="small"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isActioning}>Cancel</Button>
        <Button
          variant="contained"
          color={isApprove ? 'success' : 'error'}
          disabled={isActioning}
          loading={isActioning}
          onClick={onConfirm}
        >
          {isApprove ? 'Approve' : 'Decline'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
