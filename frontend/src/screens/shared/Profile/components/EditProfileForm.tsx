import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { UserProfileResponse, UpdateProfileRequest } from '../../../../domains/user.types';

interface EditProfileFormProps {
  open: boolean;
  profile: UserProfileResponse;
  isSaving: boolean;
  onSave: (data: UpdateProfileRequest) => void;
  onClose: () => void;
}

export function EditProfileForm({ open, profile, isSaving, onSave, onClose }: EditProfileFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (open) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhoneNumber(profile.phoneNumber ?? '');
    }
  }, [open, profile]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ firstName, lastName, phoneNumber: phoneNumber || undefined });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Edit Profile</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSaving} loading={isSaving}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
