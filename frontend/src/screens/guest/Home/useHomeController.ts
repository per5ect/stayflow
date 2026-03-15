import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { apartmentAdapter } from '../../../adapters/apartment.adapter';

export function useHomeController() {
  const router = useRouter();
  const [city, setCity] = useState('');

  const { data: featured, isLoading } = useQuery({
    queryKey: ['apartments', 'featured'],
    queryFn: () => apartmentAdapter.getAll({ size: 10, sortBy: 'createdAt', sortDir: 'desc' }),
  });

  function handleSearch() {
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    router.push(`/renter/search?${params.toString()}`);
  }

  return { city, setCity, handleSearch, featured: featured?.content ?? [], isLoading };
}
