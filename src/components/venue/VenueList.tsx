
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVenues } from '@/services/api';
import { Venue } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, ArrowRight, Dumbbell } from 'lucide-react';

export default function VenueList() {
  const [filters, setFilters] = useState({
    location: '',
    sportType: '',
    priceRange: [0, 200],
  });

  // Fetch venues with react-query
  const { data: venues = [], isLoading, refetch } = useQuery({
    queryKey: ['venues', filters],
    queryFn: () => getVenues({
      location: filters.location || undefined,
      sport_type: filters.sportType || undefined,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
    }),
  });

  // Sport type options
  const sportTypes = [
    'Basketball',
    'Tennis',
    'Football',
    'Swimming',
    'Volleyball',
    'Cricket',
    'Badminton',
    'Table Tennis',
    'Gym',
    'Yoga',
  ];

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const handleSportTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sportType: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      sportType: '',
      priceRange: [0, 200],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Sports Venues</h1>
      
      {/* Filter section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="sport-type">Sport Type</Label>
            <Select value={filters.sportType} onValueChange={handleSportTypeChange}>
              <SelectTrigger id="sport-type">
                <SelectValue placeholder="Any sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any sport</SelectItem>
                {sportTypes.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Price Range ($ per hour)</Label>
            <div className="pt-4">
              <Slider
                value={filters.priceRange}
                min={0}
                max={200}
                step={5}
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" onClick={handleClearFilters} className="mr-2">
              Clear filters
            </Button>
            <Button onClick={() => refetch()}>
              Apply filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Venues grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading venues...</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No venues found matching your criteria.</p>
          <p className="mt-2">Try adjusting your filters or search for a different location.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] relative overflow-hidden">
                {venue.images && venue.images[0] ? (
                  <img 
                    src={venue.images[0]} 
                    alt={venue.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-muted w-full h-full flex items-center justify-center">
                    <Dumbbell className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="line-clamp-1">{venue.name}</span>
                  <span className="text-right text-green-600">${venue.hourly_price}/hr</span>
                </CardTitle>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{venue.location}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {venue.sport_type}
                  </span>
                </p>
                <p className="line-clamp-2 text-sm">{venue.description}</p>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/venues/${venue.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
