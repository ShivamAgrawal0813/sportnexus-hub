import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ShoppingCart, Tag, Clock, Star } from 'lucide-react';

// Mock data for equipment
const equipment = [
  {
    id: 1,
    name: 'Professional Tennis Racket',
    image: '/images/equipment/tennis-racket.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'Wilson Pro',
    category: 'Tennis',
    pricePerDay: 15,
    rating: 4.8,
    available: true,
  },
  {
    id: 2,
    name: 'Mountain Bike',
    image: '/images/equipment/mountain-bike.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'Trek',
    category: 'Cycling',
    pricePerDay: 35,
    rating: 4.6,
    available: true,
  },
  {
    id: 3,
    name: 'Golf Club Set',
    image: '/images/equipment/golf-set.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'Callaway',
    category: 'Golf',
    pricePerDay: 45,
    rating: 4.9,
    available: true,
  },
  {
    id: 4,
    name: 'Basketball',
    image: '/images/equipment/basketball.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'Spalding',
    category: 'Basketball',
    pricePerDay: 8,
    rating: 4.5,
    available: false,
  },
  {
    id: 5,
    name: 'Yoga Mat & Set',
    image: '/images/equipment/yoga-set.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'Lululemon',
    category: 'Yoga',
    pricePerDay: 10,
    rating: 4.7,
    available: true,
  },
  {
    id: 6,
    name: 'Camping Equipment Set',
    image: '/images/equipment/camping-set.jpg',
    fallbackImage: '/placeholder.svg',
    brand: 'North Face',
    category: 'Camping',
    pricePerDay: 55,
    rating: 4.8,
    available: true,
  },
];

export default function EquipmentRental() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState(equipment);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredEquipment(equipment);
    } else {
      const filtered = equipment.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) || 
        item.category.toLowerCase().includes(term.toLowerCase()) ||
        item.brand.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEquipment(filtered);
    }
  };

  const handleImageError = (itemId: number) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
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
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img 
                src={imageErrors[item.id] ? item.fallbackImage : item.image} 
                alt={item.name} 
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={() => handleImageError(item.id)}
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                <span>{item.rating}</span>
              </div>
              {!item.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-white/90 text-sportnexus-blue px-4 py-2 rounded-full font-bold">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {item.brand}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Min 1 day
                  </span>
                </div>
                <div className="flex items-center font-medium">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>${item.pricePerDay}/day</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                disabled={!item.available}
                variant={item.available ? "default" : "outline"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {item.available ? "Rent Now" : "Not Available"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
