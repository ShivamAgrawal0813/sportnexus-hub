
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Clock, DollarSign, Star, ShoppingCart } from 'lucide-react';

// Mock data for equipment rentals
const equipments = [
  {
    id: 1,
    name: 'Professional Tennis Racket',
    image: '/lovable-uploads/70b9767d-d307-401c-a7e4-dd76eaf6ae7a.png',
    brand: 'Wilson Pro',
    type: 'Tennis',
    pricePerDay: 15,
    rating: 4.8,
    minDays: 1,
  },
  {
    id: 2,
    name: 'Mountain Bike',
    image: '/lovable-uploads/4bf163ef-3892-4009-a58e-062b7d47a620.png',
    brand: 'Trek',
    type: 'Cycling',
    pricePerDay: 35,
    rating: 4.6,
    minDays: 1,
  },
  {
    id: 3,
    name: 'Golf Club Set',
    image: '/lovable-uploads/26f21fe7-86eb-4714-82c7-1e521d16f858.png',
    brand: 'Callaway',
    type: 'Golf',
    pricePerDay: 45,
    rating: 4.9,
    minDays: 1,
  },
  {
    id: 4,
    name: 'Basketball',
    image: '/lovable-uploads/dd2a46b0-337d-49ad-80de-cb4e8391c328.png',
    brand: 'Spalding',
    type: 'Basketball',
    pricePerDay: 8,
    rating: 4.5,
    minDays: 1,
  },
  {
    id: 5,
    name: 'Yoga Kit',
    image: '/lovable-uploads/cc5d07b4-1356-418e-824a-963f21c3ef53.png',
    brand: 'Lululemon',
    type: 'Yoga',
    pricePerDay: 12,
    rating: 4.7,
    minDays: 1,
  },
  {
    id: 6,
    name: 'Camping Equipment',
    image: '/lovable-uploads/325fc1cb-27c6-400d-8681-64f5c1a207e0.png',
    brand: 'North Face',
    type: 'Outdoor',
    pricePerDay: 65,
    rating: 4.8,
    minDays: 2,
  },
];

export default function EquipmentRental() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState(equipments);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredEquipments(equipments);
    } else {
      const filtered = equipments.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) || 
        item.type.toLowerCase().includes(term.toLowerCase()) ||
        item.brand.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEquipments(filtered);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Equipment Rental</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for equipment, sports, or brands" 
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
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={equipment.image} 
                alt={equipment.name} 
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                <span>{equipment.rating}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-1">{equipment.name}</h3>
                <p className="text-muted-foreground text-sm">{equipment.brand}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                    {equipment.type}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Min {equipment.minDays} day
                  </span>
                </div>
                <div className="flex items-center font-medium">
                  <DollarSign className="h-3 w-3" />
                  <span>{equipment.pricePerDay}/day</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-sportnexus-orange hover:bg-sportnexus-lightOrange">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Rent Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
