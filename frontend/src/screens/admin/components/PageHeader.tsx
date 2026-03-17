import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Box mb={4}>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {description}
      </Typography>
    </Box>
  );
}
