
import { useEffect } from 'react';
import { useVenueBooking } from '@/hooks/use-venue-booking';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookingStatus } from '@/types/supabase';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function UserBookingList() {
  const { userBookings, loading, loadUserBookings, cancelBooking } = useVenueBooking();
  
  useEffect(() => {
    loadUserBookings();
  }, []);
  
  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getFormattedDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getFormattedTime = (timeString: string) => {
    // Convert "14:30:00" to "2:30 PM"
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading your bookings...</div>;
  }
  
  if (userBookings.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium mb-2">No bookings found</h3>
        <p className="text-muted-foreground">You haven't made any venue bookings yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {userBookings.map((booking) => {
        // Fix: Access venue_details instead of venues
        const venueDetails = booking.venue_details || { 
          name: 'Venue', 
          location: 'Location not available',
          sport_type: '',
          images: [] 
        };
        
        return (
          <div 
            key={booking.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Venue image */}
              <div className="w-full md:w-1/4">
                {venueDetails.images && venueDetails.images[0] ? (
                  <img 
                    src={venueDetails.images[0]} 
                    alt={venueDetails.name} 
                    className="h-full w-full object-cover aspect-[4/3] md:aspect-auto"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center aspect-[4/3] md:aspect-auto">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Booking details */}
              <div className="p-4 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <h3 className="text-lg font-semibold">{venueDetails.name}</h3>
                  <Badge className={`${getStatusColor(booking.status)} self-start`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{venueDetails.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{getFormattedDate(booking.booking_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{getFormattedTime(booking.start_time)} - {getFormattedTime(booking.end_time)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="text-lg font-medium text-green-600">${booking.total_price.toFixed(2)}</div>
                  
                  <div className="mt-2 md:mt-0">
                    {booking.status === 'pending' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          Get Directions
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    {booking.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
