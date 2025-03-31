import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Play, BookOpen, Video, Clock, Star, Lock } from 'lucide-react';

// Mock data for tutorials
const tutorials = [
  {
    id: 1,
    title: 'Tennis Fundamentals for Beginners',
    image: '/images/tutorials/tennis-fundamentals.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Sarah Williams',
    category: 'Tennis',
    level: 'Beginner',
    format: 'Video',
    duration: '45 min',
    rating: 4.8,
    premium: false,
  },
  {
    id: 2,
    title: 'Advanced Basketball Shooting Techniques',
    image: '/images/tutorials/basketball-shooting.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Michael Jordan',
    category: 'Basketball',
    level: 'Advanced',
    format: 'Video',
    duration: '60 min',
    rating: 4.9,
    premium: true,
  },
  {
    id: 3,
    title: 'Yoga for Athletes: Improving Flexibility',
    image: '/images/tutorials/yoga-flexibility.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Emma Chen',
    category: 'Yoga',
    level: 'Intermediate',
    format: 'Video',
    duration: '35 min',
    rating: 4.7,
    premium: false,
  },
  {
    id: 4,
    title: 'Golf Swing Mastery',
    image: '/images/tutorials/golf-swing.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Tiger Woods',
    category: 'Golf',
    level: 'Intermediate',
    format: 'Video',
    duration: '75 min',
    rating: 4.9,
    premium: true,
  },
  {
    id: 5,
    title: 'Swimming Techniques for Beginners',
    image: '/images/tutorials/swimming-basics.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Michael Phelps',
    category: 'Swimming',
    level: 'Beginner',
    format: 'Video',
    duration: '50 min',
    rating: 4.6,
    premium: false,
  },
  {
    id: 6,
    title: 'Marathon Training Guide',
    image: '/images/tutorials/marathon-training.jpg',
    fallbackImage: '/placeholder.svg',
    instructor: 'Eliud Kipchoge',
    category: 'Running',
    level: 'All Levels',
    format: 'Text & Video',
    duration: '120 min',
    rating: 4.8,
    premium: true,
  },
];

export default function Tutorials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTutorials, setFilteredTutorials] = useState(tutorials);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredTutorials(tutorials);
    } else {
      const filtered = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(term.toLowerCase()) || 
        tutorial.category.toLowerCase().includes(term.toLowerCase()) ||
        tutorial.level.toLowerCase().includes(term.toLowerCase()) ||
        tutorial.instructor.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTutorials(filtered);
    }
  };

  const handleImageError = (tutorialId: number) => {
    setImageErrors(prev => ({ ...prev, [tutorialId]: true }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tutorials</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for tutorials, sports, or instructors" 
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
        {filteredTutorials.map((tutorial) => (
          <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img 
                src={imageErrors[tutorial.id] ? tutorial.fallbackImage : tutorial.image}
                alt={tutorial.title} 
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={() => handleImageError(tutorial.id)}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                <span>{tutorial.rating}</span>
              </div>
              {tutorial.premium && (
                <div className="absolute top-3 left-3 bg-sportnexus-orange/90 text-white backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-1">{tutorial.title}</h3>
                <p className="text-muted-foreground text-sm">
                  By {tutorial.instructor}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                  {tutorial.category}
                </span>
                <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                  {tutorial.level}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  {tutorial.format === 'Video' ? (
                    <Video className="h-3 w-3 mr-1" />
                  ) : (
                    <BookOpen className="h-3 w-3 mr-1" />
                  )}
                  {tutorial.format}
                </span>
                <span className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {tutorial.duration}
                </span>
              </div>
              <Button 
                className="w-full mt-4" 
                variant={tutorial.premium ? "secondary" : "default"}
              >
                {tutorial.premium ? "Unlock Premium" : "Start Learning"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
