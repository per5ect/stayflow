import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { apartmentAdapter } from '../../../adapters/apartment.adapter';
import { reservationAdapter } from '../../../adapters/reservation.adapter';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { AvailabilityWindow, BookedRange } from '../../../domains/availability.types';

dayjs.extend(isBetween);

const DISCOUNT_NIGHTS = 7;
const DISCOUNT_RATE = 0.9;

export function useApartmentDetailController() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const checkInParam = typeof router.query.checkIn === 'string' ? router.query.checkIn : null;
  const checkOutParam = typeof router.query.checkOut === 'string' ? router.query.checkOut : null;

  const [checkIn, setCheckIn] = useState<Dayjs | null>(
    checkInParam ? dayjs(checkInParam) : null,
  );
  const [checkOut, setCheckOut] = useState<Dayjs | null>(
    checkOutParam ? dayjs(checkOutParam) : null,
  );

  const { data: apartment, isLoading: aptLoading } = useQuery({
    queryKey: ['apartment', id],
    queryFn: () => apartmentAdapter.getById(id),
    enabled: !!id,
  });

  const { data: availabilityRaw, isLoading: availLoading } = useQuery({
    queryKey: ['apartment', id, 'availability'],
    queryFn: () => apartmentAdapter.getAvailability(id),
    enabled: !!id,
  });
  const availability: AvailabilityWindow[] = Array.isArray(availabilityRaw) ? availabilityRaw : [];

  const { data: bookedRaw } = useQuery({
    queryKey: ['apartment', id, 'booked-dates'],
    queryFn: () => apartmentAdapter.getBookedDates(id),
    enabled: !!id,
  });
  const bookedRanges: BookedRange[] = Array.isArray(bookedRaw) ? bookedRaw : [];

  function isDateAvailable(date: Dayjs): boolean {
    return availability.some((w: AvailabilityWindow) =>
      date.isBetween(w.availableFrom, w.availableTo, 'day', '[]'),
    );
  }

  function isDateBooked(date: Dayjs): boolean {
    return bookedRanges.some((r: BookedRange) =>
      date.isBetween(r.checkIn, r.checkOut, 'day', '[)'),
    );
  }

  function shouldDisableDate(date: Dayjs): boolean {
    return !isDateAvailable(date) || isDateBooked(date);
  }

  const nights =
    checkIn && checkOut && checkOut.isAfter(checkIn)
      ? checkOut.diff(checkIn, 'day')
      : 0;

  const hasDiscount = nights >= DISCOUNT_NIGHTS;
  const pricePerNight = apartment?.pricePerNight ?? 0;
  const subtotal = nights * pricePerNight;
  const totalPrice = hasDiscount ? subtotal * DISCOUNT_RATE : subtotal;

  const { mutate: book, isPending: isBooking } = useMutation({
    mutationFn: () =>
      reservationAdapter.create({
        apartmentId: id,
        checkIn: checkIn!.format('YYYY-MM-DD'),
        checkOut: checkOut!.format('YYYY-MM-DD'),
      }),
    onSuccess: () => {
      showSnackbar('Reservation sent! Waiting for landlord approval.', 'success');
      queryClient.invalidateQueries({ queryKey: ['reservations', 'my'] });
      router.push('/renter/reservations');
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error, 'Could not create reservation.'), 'error');
    },
  });

  function handleBook() {
    if (!checkIn || !checkOut) return;
    book();
  }

  return {
    apartment,
    availability,
    isLoading: aptLoading || availLoading,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    shouldDisableDate,
    nights,
    hasDiscount,
    pricePerNight,
    subtotal,
    totalPrice,
    isBooking,
    handleBook,
  };
}
