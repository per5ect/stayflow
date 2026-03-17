import { Box, Paper, Typography } from '@mui/material';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

export function StatCard({ title, value, icon, color, href }: StatCardProps) {
  const content = (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'white',
        transition: 'box-shadow 0.15s',
        ...(href && {
          cursor: 'pointer',
          '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.10)' },
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: `${color}15`,
            color,
            borderRadius: 2,
            width: 52,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.6, lineHeight: 1, display: 'block' }}
          >
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2} mt={0.25}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {content}
      </Link>
    );
  }

  return content;
}
