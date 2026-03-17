import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import Link from 'next/link';
import { ApartmentResponse } from '../../../../domains/apartment.types';
import { formatPrice } from '../../../../utils/formatPrice';

interface ApartmentCardProps {
  apartment: ApartmentResponse;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  isToggling: boolean;
}

export function ApartmentCard({ apartment, onActivate, onDeactivate, isToggling }: ApartmentCardProps) {
  const isActive = apartment.status === 'ACTIVE';
  const photo = apartment.photoUrls?.[0];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'white', display: 'flex' }}>
      {/* Photo */}
      <Box
        sx={{
          width: 140,
          flexShrink: 0,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {photo ? (
          <Box
            component="img"
            src={photo}
            alt={apartment.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, color: 'grey.400' }}>
            <ImageNotSupportedIcon sx={{ fontSize: 32 }} />
            <Typography variant="caption" color="grey.400">No photo</Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: 'grey.50',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {apartment.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {apartment.street}, {apartment.city}, {apartment.country}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, flexShrink: 0, mt: 0.25 }}
          />
        </Box>

        <Divider />

        {/* Details */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, flex: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Type</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HomeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600}>{apartment.apartmentType}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Rooms</Typography>
            <Typography variant="body2" fontWeight={600}>{apartment.roomsCount}</Typography>
          </Box>

          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">Price / night</Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatPrice(apartment.pricePerNight)}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Actions */}
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Link href={`/landlord/apartments/${apartment.id}/edit`} style={{ textDecoration: 'none' }}>
            <Button size="small" variant="outlined" startIcon={<EditIcon />}>
              Edit
            </Button>
          </Link>
          {isActive ? (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              disabled={isToggling}
              onClick={() => onDeactivate(apartment.id)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={isToggling}
              onClick={() => onActivate(apartment.id)}
            >
              Activate
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
