import Head from 'next/head';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { Navbar } from '../../../components/organisms/Navbar/Navbar';
import { PageHeader } from '../../admin/components/PageHeader';
import { useApartmentFormController } from './useApartmentFormController';
import { ApartmentDetailsSection } from './components/ApartmentDetailsSection';
import { AvailabilitySection } from './components/AvailabilitySection';
import { PhotosSection } from './components/PhotosSection';

export default function ApartmentForm() {
  const ctrl = useApartmentFormController();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head><title>{ctrl.isEdit ? 'Edit Apartment' : 'New Apartment'} | StayFlow</title></Head>
      <Navbar />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box mb={1}>
          <Link href="/landlord/apartments" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBackIcon />} size="small" color="inherit" sx={{ color: 'text.secondary', mb: 1 }}>
              My Apartments
            </Button>
          </Link>
          <PageHeader
            title={ctrl.isEdit ? 'Edit Apartment' : 'New Apartment'}
            description={
              ctrl.isEdit
                ? 'Update your listing details, manage availability windows and photos.'
                : 'Fill in the details below to create a new listing.'
            }
          />
        </Box>

        <ApartmentDetailsSection
          isEdit={ctrl.isEdit}
          form={ctrl.form}
          onField={ctrl.handleField}
          isLoadingApartment={ctrl.isLoadingApartment}
        />

        {ctrl.isEdit && (
          <>
            <Box mt={3}>
              <AvailabilitySection
                availability={ctrl.availability}
                isLoading={ctrl.isLoadingAvailability}
                availFrom={ctrl.availFrom}
                availTo={ctrl.availTo}
                setAvailFrom={ctrl.setAvailFrom}
                setAvailTo={ctrl.setAvailTo}
                onAdd={ctrl.addAvailability}
                isAdding={ctrl.isAddingAvailability}
                onRemove={ctrl.removeAvailability}
              />
            </Box>

            <Box mt={3}>
              <PhotosSection
                photoUrls={ctrl.photoUrls}
                isUploading={ctrl.isUploadingPhotos}
                onUpload={ctrl.uploadPhotos}
                onDelete={ctrl.deletePhoto}
              />
            </Box>
          </>
        )}

        {/* Save footer */}
        <Paper variant="outlined" sx={{ mt: 4, borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
          <Divider />
          <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {ctrl.isEdit
                ? 'All changes are saved immediately and visible to renters right away.'
                : 'After creating, you can add availability windows and photos to your listing.'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              disabled={ctrl.isSaving}
              loading={ctrl.isSaving}
              onClick={() => ctrl.save()}
              sx={{ minWidth: 220, py: 1.5, fontSize: 16, fontWeight: 700 }}
            >
              {ctrl.isEdit ? 'Save changes' : 'Create apartment'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
