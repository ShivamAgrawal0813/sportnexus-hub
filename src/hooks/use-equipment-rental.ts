
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createRental, getUserRentals } from '@/services/api';
import { EquipmentRental, BookingStatus, PaymentStatus } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

export function useEquipmentRental() {
  const { user } = useAuth();
  const [userRentals, setUserRentals] = useState<EquipmentRental[]>([]);
  const [loading, setLoading] = useState(false);
  const [rentalLoading, setRentalLoading] = useState(false);

  const loadUserRentals = async () => {
    if (!user) {
      toast.error("You must be logged in to view rentals");
      return [];
    }

    setLoading(true);
    try {
      const rentals = await getUserRentals(user.id);
      setUserRentals(rentals);
      return rentals;
    } catch (error) {
      console.error("Error loading rentals:", error);
      toast.error("Failed to load your rentals");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const rentEquipment = async (
    equipmentId: string,
    startDate: string,
    endDate: string,
    quantity: number,
    totalPrice: number,
    notes?: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to rent equipment");
      return null;
    }

    setRentalLoading(true);
    try {
      const rental = {
        equipment_id: equipmentId,
        user_id: user.id,
        start_date: startDate,
        end_date: endDate,
        quantity,
        total_price: totalPrice,
        status: 'pending' as BookingStatus,
        payment_status: 'pending' as PaymentStatus,
        payment_id: null, // Add the missing payment_id property
        notes: notes || null
      };

      const result = await createRental(rental);
      if (result) {
        // Update the local list of rentals
        setUserRentals(prev => [...prev, result]);
        toast.success("Equipment rental request submitted successfully");
      }
      return result;
    } catch (error) {
      console.error("Error renting equipment:", error);
      toast.error("Failed to rent equipment");
      return null;
    } finally {
      setRentalLoading(false);
    }
  };

  return {
    userRentals,
    loading,
    rentalLoading,
    loadUserRentals,
    rentEquipment
  };
}
