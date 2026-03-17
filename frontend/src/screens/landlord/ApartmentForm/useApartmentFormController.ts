import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apartmentAdapter } from '../../../adapters/apartment.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ApartmentRequest } from '../../../domains/apartment.types';

const INITIAL_FORM: ApartmentRequest = {
  title: '',
  description: '',
  pricePerNight: 0,
  street: '',
  city: '',
  country: '',
  roomsCount: 1,
  apartmentType: 'APARTMENT',
};

export function useApartmentFormController() {
  const router = useRouter();
  const id = router.query.id ? Number(router.query.id) : null;
  const isEdit = id !== null;

  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ApartmentRequest>(INITIAL_FORM);
  const [availFrom, setAvailFrom] = useState('');
  const [availTo, setAvailTo] = useState('');

  const { data: apartment, isLoading: isLoadingApartment } = useQuery({
    queryKey: ['apartments', id],
    queryFn: () => apartmentAdapter.getById(id!),
    enabled: isEdit,
  });

  const { data: availability = [], isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['apartments', id, 'availability'],
    queryFn: () => apartmentAdapter.getAvailability(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (apartment) {
      setForm({
        title: apartment.title,
        description: apartment.description ?? '',
        pricePerNight: apartment.pricePerNight,
        street: apartment.street,
        city: apartment.city,
        country: apartment.country,
        roomsCount: apartment.roomsCount,
        apartmentType: apartment.apartmentType,
      });
    }
  }, [apartment]);

  function handleField<K extends keyof ApartmentRequest>(key: K, value: ApartmentRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: () => (isEdit ? apartmentAdapter.update(id!, form) : apartmentAdapter.create(form)),
    onSuccess: (saved) => {
      showSnackbar(isEdit ? 'Apartment updated.' : 'Apartment created.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', 'my'] });
      if (!isEdit) router.push(`/landlord/apartments/${saved.id}/edit`);
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not save apartment.'), 'error'),
  });

  const { mutate: addAvailability, isPending: isAddingAvailability } = useMutation({
    mutationFn: () => apartmentAdapter.addAvailability(id!, availFrom, availTo),
    onSuccess: () => {
      showSnackbar('Availability added.', 'success');
      setAvailFrom('');
      setAvailTo('');
      queryClient.invalidateQueries({ queryKey: ['apartments', id, 'availability'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not add availability.'), 'error'),
  });

  const { mutate: removeAvailability } = useMutation({
    mutationFn: (availabilityId: number) => apartmentAdapter.removeAvailability(id!, availabilityId),
    onSuccess: () => {
      showSnackbar('Availability removed.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', id, 'availability'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not remove availability.'), 'error'),
  });

  const { mutate: uploadPhotos, isPending: isUploadingPhotos } = useMutation({
    mutationFn: (files: File[]) => apartmentAdapter.uploadPhotos(id!, files),
    onSuccess: () => {
      showSnackbar('Photos uploaded.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', id] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not upload photos.'), 'error'),
  });

  const { mutate: deletePhoto } = useMutation({
    mutationFn: (photoUrl: string) => apartmentAdapter.deletePhoto(id!, photoUrl),
    onSuccess: () => {
      showSnackbar('Photo deleted.', 'success');
      queryClient.invalidateQueries({ queryKey: ['apartments', id] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Could not delete photo.'), 'error'),
  });

  return {
    isEdit,
    form,
    handleField,
    isSaving,
    save,
    isLoadingApartment,
    photoUrls: apartment?.photoUrls ?? [],
    availability,
    isLoadingAvailability,
    availFrom,
    setAvailFrom,
    availTo,
    setAvailTo,
    addAvailability,
    isAddingAvailability,
    removeAvailability,
    uploadPhotos,
    isUploadingPhotos,
    deletePhoto,
  };
}
