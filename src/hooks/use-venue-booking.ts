
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createBooking, getUserBookings, updateBookingStatus } from '@/services/api';
import { VenueBooking, BookingStatus } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

export function useVenueBooking() {
  const { user } = useAuth();
  const [userBookings, setUserBookings] = useState<VenueBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadUserBookings = async () => {
    if (!user) {
      toast.error("You must be logged in to view bookings");
      return [];
    }

    setLoading(true);
    try {
      const bookings = await getUserBookings(user.id);
      setUserBookings(bookings);
      return bookings;
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load your bookings");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const bookVenue = async (
    venueId: string,
    bookingDate: string,
    startTime: string,
    endTime: string,
    totalPrice: number,
    notes?: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to book a venue");
      return null;
    }

    setBookingLoading(true);
    try {
      const booking = {
        venue_id: venueId,
        user_id: user.id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_price: totalPrice,
        status: 'pending' as BookingStatus,
        payment_status: 'pending' as const,
        payment_id: null, // Add the missing payment_id property
        notes: notes || null
      };

      const result = await createBooking(booking);
      if (result) {
        // Update the local list of bookings
        setUserBookings(prev => [...prev, result]);
        toast.success("Booking request submitted successfully");
      }
      return result;
    } catch (error) {
      console.error("Error booking venue:", error);
      toast.error("Failed to book venue");
      return null;
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const updatedBooking = await updateBookingStatus(bookingId, 'cancelled');
      if (updatedBooking) {
        // Update the local list
        setUserBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? updatedBooking : booking
          )
        );
        toast.success("Booking cancelled successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    userBookings,
    loading,
    bookingLoading,
    loadUserBookings,
    bookVenue,
    cancelBooking
  };
}
