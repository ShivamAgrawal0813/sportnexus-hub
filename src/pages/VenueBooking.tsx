import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Clock, DollarSign, Star } from 'lucide-react';

// Mock data for venues
const venues = [
  {
    id: 1,
    name: 'Grand Tennis Court',
    image: '/images/venues/tennis-court.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'Downtown Sports Center',
    type: 'Tennis',
    pricePerHour: 25,
    rating: 4.8,
    availableToday: true,
  },
  {
    id: 2,
    name: 'Olympic Swimming Pool',
    image: '/images/venues/swimming-pool.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'City Sports Complex',
    type: 'Swimming',
    pricePerHour: 15,
    rating: 4.5,
    availableToday: true,
  },
  {
    id: 3,
    name: 'Premier Basketball Court',
    image: '/images/venues/basketball-court.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'Westside Recreation Center',
    type: 'Basketball',
    pricePerHour: 30,
    rating: 4.7,
    availableToday: false,
  },
  {
    id: 4,
    name: 'Indoor Soccer Field',
    image: '/images/venues/soccer-field.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'East Valley Sports Hub',
    type: 'Soccer',
    pricePerHour: 40,
    rating: 4.6,
    availableToday: true,
  },
  {
    id: 5,
    name: 'Professional Golf Course',
    image: '/images/venues/golf-course.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'Green Valley Golf Club',
    type: 'Golf',
    pricePerHour: 50,
    rating: 4.9,
    availableToday: true,
  },
  {
    id: 6,
    name: 'Yoga & Fitness Studio',
    image: '/images/venues/yoga-studio.jpg',
    fallbackImage: '/placeholder.svg',
    location: 'Mindful Movement Center',
    type: 'Yoga',
    pricePerHour: 20,
    rating: 4.4,
    availableToday: false,
  },
];

export default function VenueBooking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVenues, setFilteredVenues] = useState(venues);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(venue => 
        venue.name.toLowerCase().includes(term.toLowerCase()) || 
        venue.type.toLowerCase().includes(term.toLowerCase()) ||
        venue.location.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  };

  const handleImageError = (venueId: number) => {
    setImageErrors(prev => ({ ...prev, [venueId]: true }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Venue Booking</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for venues, sports, or locations" 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img 
                src={imageErrors[venue.id] ? venue.fallbackImage : venue.image}
                alt={venue.name} 
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={() => handleImageError(venue.id)}
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                <span>{venue.rating}</span>
              </div>
              {venue.availableToday && (
                <div className="absolute top-3 left-3 bg-sportnexus-green/90 text-white backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                  Available Today
                </div>
              )}
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
                    {venue.type}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    2h slots
                  </span>
                </div>
                <div className="flex items-center font-medium">
                  <DollarSign className="h-3 w-3" />
                  <span>{venue.pricePerHour}/hr</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-sportnexus-blue hover:bg-sportnexus-darkBlue">
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
