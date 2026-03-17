import Head from 'next/head';
import { Box, Typography } from '@mui/material';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { useProfileController } from './useProfileController';
import { ProfileHeader, ProfileHeaderSkeleton } from './components/ProfileHeader';
import { ProfileStats, ProfileStatsSkeleton } from './components/ProfileStats';
import { EditProfileForm } from './components/EditProfileForm';
import { ChangePasswordForm } from './components/ChangePasswordForm';

export default function Profile() {
  const {
    profile,
    stats,
    isProfileLoading,
    isStatsLoading,
    isEditOpen,
    setIsEditOpen,
    isPasswordOpen,
    setIsPasswordOpen,
    updateProfile,
    isUpdating,
    changePassword,
    isChangingPassword,
    uploadAvatar,
    isUploadingAvatar,
  } = useProfileController();

  const showStats = profile?.role === 'RENTER' || profile?.role === 'LANDLORD';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>My Profile | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

        <Box mb={4}>
          <Typography variant="h5" fontWeight={700}>My Profile</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage your personal information and account settings.
          </Typography>
        </Box>

        {isProfileLoading ? (
          <ProfileHeaderSkeleton />
        ) : profile ? (
          <ProfileHeader
            profile={profile}
            isUploadingAvatar={isUploadingAvatar}
            onUploadAvatar={uploadAvatar}
            onEditProfile={() => setIsEditOpen(true)}
            onChangePassword={() => setIsPasswordOpen(true)}
          />
        ) : null}

        {showStats && (
          <Box mt={4}>
            {isStatsLoading ? (
              <ProfileStatsSkeleton />
            ) : stats ? (
              <ProfileStats stats={stats} />
            ) : null}
          </Box>
        )}

      </Box>

      {profile && (
        <>
          <EditProfileForm
            open={isEditOpen}
            profile={profile}
            isSaving={isUpdating}
            onSave={updateProfile}
            onClose={() => setIsEditOpen(false)}
          />
          <ChangePasswordForm
            open={isPasswordOpen}
            isSaving={isChangingPassword}
            onSave={changePassword}
            onClose={() => setIsPasswordOpen(false)}
          />
        </>
      )}
    </Box>
  );
}
