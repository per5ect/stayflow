import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ApartmentResponse } from '../../../domains/apartment.types';
import { formatPrice } from '../../../utils/formatPrice';

interface Props {
  apartment: ApartmentResponse;
}

export function ApartmentCard({ apartment }: Props) {
  return (
    <Link href={`/apartments/${apartment.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
        }}
      >
        <CardMedia
          component="img"
          height={200}
          image={apartment.photoUrls[0] ?? '/placeholder.jpg'}
          alt={apartment.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>
              {apartment.title}
            </Typography>
            <Chip
              label={apartment.apartmentType}
              size="small"
              sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600, fontSize: 11 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="body2" noWrap>
              {apartment.city}, {apartment.country}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatPrice(apartment.pricePerNight)}
            </Typography>
            <Typography variant="body2" color="text.secondary">/ night</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {apartment.roomsCount} {apartment.roomsCount === 1 ? 'room' : 'rooms'} · {apartment.landlordName}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
