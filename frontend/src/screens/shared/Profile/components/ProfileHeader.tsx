import { useRef } from 'react';
import { Avatar, Box, Button, Chip, CircularProgress, Paper, Skeleton, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import { UserProfileResponse } from '../../../../domains/user.types';

const ROLE_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  RENTER: 'primary',
  LANDLORD: 'secondary',
  ADMIN: 'default',
};

interface ProfileHeaderProps {
  profile: UserProfileResponse;
  isUploadingAvatar: boolean;
  onUploadAvatar: (file: File) => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export function ProfileHeader({
  profile,
  isUploadingAvatar,
  onUploadAvatar,
  onEditProfile,
  onChangePassword,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUploadAvatar(file);
    e.target.value = '';
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3, flexWrap: 'wrap' }}>

        {/* Avatar */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            src={profile.photoUrl ?? undefined}
            sx={{ width: 88, height: 88, fontSize: 28, bgcolor: 'primary.main' }}
          >
            {!profile.photoUrl && initials}
          </Avatar>

          <Box
            onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '2px solid',
              borderColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUploadingAvatar ? 'default' : 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            {isUploadingAvatar
              ? <CircularProgress size={14} />
              : <CameraAltIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            }
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>

        {/* Name + meta */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight={700} noWrap>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Chip
              label={profile.role}
              color={ROLE_COLORS[profile.role] ?? 'default'}
              size="small"
              sx={{ fontWeight: 600, fontSize: 11 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {profile.email}
          </Typography>
          {profile.phoneNumber && (
            <Typography variant="body2" color="text.secondary">
              {profile.phoneNumber}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEditProfile}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LockIcon />}
            onClick={onChangePassword}
          >
            Password
          </Button>
        </Box>

      </Box>
    </Paper>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Skeleton variant="circular" width={88} height={88} sx={{ flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width={200} height={28} />
          <Skeleton width={160} height={20} sx={{ mt: 0.5 }} />
          <Skeleton width={120} height={20} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
    </Paper>
  );
}
