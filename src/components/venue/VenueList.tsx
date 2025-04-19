
import React from 'react';
import { getVenues } from '@/services/api';
import { Venue } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';

interface VenueListProps {
  onSelect?: (venue: Venue) => void;
  selectedVenue?: Venue | null;
}

const VenueList: React.FC<VenueListProps> = ({ onSelect, selectedVenue }) => {
  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues
  });

  if (isLoading) {
    return <div>Loading venues...</div>;
  }

  if (error) {
    return <div>Error loading venues. Please try again later.</div>;
  }

  if (!venues || venues.length === 0) {
    return <div>No venues available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {venues.map((venue) => (
        <div
          key={venue.id}
          className={`border rounded-lg p-4 cursor-pointer transition ${
            selectedVenue?.id === venue.id ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onClick={() => onSelect && onSelect(venue)}
        >
          <div className="aspect-video bg-muted rounded-md mb-2 overflow-hidden">
            {venue.images && venue.images.length > 0 ? (
              <img
                src={venue.images[0]}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <h3 className="font-semibold">{venue.name}</h3>
          <p className="text-sm text-muted-foreground">{venue.location}</p>
          <div className="mt-1 flex justify-between items-center">
            <span className="text-sm px-2 py-1 bg-muted rounded-full">
              {venue.sport_type}
            </span>
            <span className="font-medium">${venue.hourly_price}/hr</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VenueList;
