import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingForm } from '@/components/booking/BookingForm';
import { Venue } from '@/types/supabase';
import { getVenues } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

// Mock data for venues (in case API fails)
const mockVenues: Venue[] = [
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Grand Tennis Court',
    description: 'Professional tennis courts with top-quality surfaces',
    location: 'Downtown Sports Center',
    address: '123 Main St, Downtown',
    amenities: null,
    images: ['/images/venues/tennis-court.jpg'],
    hourly_price: 25,
    half_day_price: 100,
    full_day_price: 180,
    sport_type: 'Tennis',
    capacity: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Olympic Swimming Pool',
    description: 'Olympic-sized swimming pool with 8 lanes',
    location: 'City Sports Complex',
    address: '456 Center Ave, Midtown',
    amenities: null,
    images: ['/images/venues/swimming-pool.jpg'],
    hourly_price: 15,
    half_day_price: 60,
    full_day_price: 110,
    sport_type: 'Swimming',
    capacity: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Premier Basketball Court',
    description: 'Indoor basketball court with professional flooring',
    location: 'Westside Recreation Center',
    address: '789 West Blvd, Westside',
    amenities: null,
    images: ['/images/venues/basketball-court.jpg'],
    hourly_price: 30,
    half_day_price: 120,
    full_day_price: 220,
    sport_type: 'Basketball',
    capacity: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    owner_id: 'owner2',
    name: 'Indoor Soccer Field',
    description: 'Full-sized indoor soccer field with artificial turf',
    location: 'East Valley Sports Hub',
    address: '101 East St, Valley',
    amenities: null,
    images: ['/images/venues/soccer-field.jpg'],
    hourly_price: 40,
    half_day_price: 160,
    full_day_price: 300,
    sport_type: 'Soccer',
    capacity: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    owner_id: 'owner3',
    name: 'Professional Golf Course',
    description: '18-hole professional golf course with amazing views',
    location: 'Green Valley Golf Club',
    address: '202 Green Valley Rd, Hillside',
    amenities: null,
    images: ['/images/venues/golf-course.jpg'],
    hourly_price: 50,
    half_day_price: 200,
    full_day_price: 380,
    sport_type: 'Golf',
    capacity: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    owner_id: 'owner3',
    name: 'Yoga & Fitness Studio',
    description: 'Peaceful studio for yoga and fitness classes',
    location: 'Mindful Movement Center',
    address: '303 Zen St, Peaceful Heights',
    amenities: null,
    images: ['/images/venues/yoga-studio.jpg'],
    hourly_price: 20,
    half_day_price: 80,
    full_day_price: 150,
    sport_type: 'Yoga',
    capacity: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sport types for filtering
const sportTypes = [
  'All Sports',
  'Basketball',
  'Tennis',
  'Soccer',
  'Swimming',
  'Golf',
  'Yoga',
  'Volleyball',
  'Badminton',
  'Table Tennis'
];

export default function VenueBooking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sportType, setSportType] = useState('All Sports');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async (filters?: any) => {
    setIsLoading(true);
    try {
      const venuesData = await getVenues(filters);
      
      // If the API returned venues, use them
      if (venuesData && venuesData.length > 0) {
        setVenues(venuesData);
        setFilteredVenues(venuesData);
      } else {
        // Otherwise, use mock data
        console.log('Using mock venue data');
        setVenues(mockVenues);
        setFilteredVenues(mockVenues);
        setUsingMockData(true);
        toast.info('Using demo venue data for display purposes');
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Use mock data on error
      setVenues(mockVenues);
      setFilteredVenues(mockVenues);
      setUsingMockData(true);
      toast.info('Using demo venue data for display purposes');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter venues when search term or sport type changes
  useEffect(() => {
    let filtered = venues;
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(term) || 
        venue.location.toLowerCase().includes(term)
      );
    }
    
    if (sportType !== 'All Sports') {
      filtered = filtered.filter(venue => 
        venue.sport_type.toLowerCase() === sportType.toLowerCase()
      );
    }
    
    setFilteredVenues(filtered);
  }, [searchTerm, sportType, venues]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSportTypeChange = (value: string) => {
    setSportType(value);
  };

  const handleImageError = (venueId: string) => {
    setImageErrors(prev => ({ ...prev, [venueId]: true }));
  };

  const openBookingForm = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsBookingFormOpen(true);
  };

  const closeBookingForm = () => {
    setIsBookingFormOpen(false);
    setSelectedVenue(null);
  };

  const handleBookingSuccess = () => {
    // Could refresh venues data or show a success message
    toast.success('Booking was successful!');
  };

  // Render loading skeletons while fetching data
  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Venue Booking</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Venue Booking</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for venues or locations" 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select value={sportType} onValueChange={handleSportTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            {sportTypes.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No venues found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setSportType('All Sports');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img 
                  src={imageErrors[venue.id] ? '/placeholder.svg' : (venue.images && venue.images.length > 0 ? venue.images[0] : '/placeholder.svg')}
                  alt={venue.name} 
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  onError={() => handleImageError(venue.id)}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                  <span>4.8</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold mb-1">{venue.name}</h3>
                  <p className="text-muted-foreground text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {venue.location}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      {venue.sport_type}
                    </span>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      2h slots
                    </span>
                  </div>
                  <div className="flex items-center font-medium">
                    <DollarSign className="h-3 w-3" />
                    <span>${venue.hourly_price}/hr</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-sportnexus-blue hover:bg-sportnexus-darkBlue"
                  onClick={() => openBookingForm(venue)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedVenue && (
        <BookingForm 
          venue={selectedVenue}
          isOpen={isBookingFormOpen}
          onClose={closeBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
