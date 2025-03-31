
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Clock, Star, Video, Lock } from 'lucide-react';

// Mock data for tutorials
const tutorials = [
  {
    id: 1,
    title: 'Tennis Fundamentals for Beginners',
    image: '/lovable-uploads/70b9767d-d307-401c-a7e4-dd76eaf6ae7a.png',
    instructor: 'Sarah Williams',
    type: 'Tennis',
    level: 'Beginner',
    duration: 45,
    rating: 4.8,
    isPremium: false,
    format: 'Video'
  },
  {
    id: 2,
    title: 'Advanced Basketball Shooting Techniques',
    image: '/lovable-uploads/dd2a46b0-337d-49ad-80de-cb4e8391c328.png',
    instructor: 'Michael Jordan',
    type: 'Basketball',
    level: 'Advanced',
    duration: 60,
    rating: 4.9,
    isPremium: true,
    format: 'Video'
  },
  {
    id: 3,
    title: 'Yoga for Athletes: Improving Flexibility',
    image: '/lovable-uploads/cc5d07b4-1356-418e-824a-963f21c3ef53.png',
    instructor: 'Emma Chen',
    type: 'Yoga',
    level: 'Intermediate',
    duration: 35,
    rating: 4.7,
    isPremium: false,
    format: 'Video'
  },
  {
    id: 4,
    title: 'Golf Swing Mastery',
    image: '/lovable-uploads/26f21fe7-86eb-4714-82c7-1e521d16f858.png',
    instructor: 'Tom Woods',
    type: 'Golf',
    level: 'All Levels',
    duration: 90,
    rating: 4.9,
    isPremium: true,
    format: 'Video'
  },
  {
    id: 5,
    title: 'Swimming Techniques for Triathletes',
    image: '/lovable-uploads/4bf163ef-3892-4009-a58e-062b7d47a620.png',
    instructor: 'James Miller',
    type: 'Swimming',
    level: 'Intermediate',
    duration: 55,
    rating: 4.6,
    isPremium: false,
    format: 'Video'
  },
  {
    id: 6,
    title: 'Group Fitness: Core Workout',
    image: '/lovable-uploads/325fc1cb-27c6-400d-8681-64f5c1a207e0.png',
    instructor: 'Lisa Johnson',
    type: 'Fitness',
    level: 'All Levels',
    duration: 40,
    rating: 4.8,
    isPremium: true,
    format: 'Video'
  },
];

export default function Tutorials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTutorials, setFilteredTutorials] = useState(tutorials);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredTutorials(tutorials);
    } else {
      const filtered = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(term.toLowerCase()) || 
        tutorial.type.toLowerCase().includes(term.toLowerCase()) ||
        tutorial.instructor.toLowerCase().includes(term.toLowerCase()) ||
        tutorial.level.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTutorials(filtered);
    }
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
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={tutorial.image} 
                alt={tutorial.title} 
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-sportnexus-orange text-sportnexus-orange" />
                <span>{tutorial.rating}</span>
              </div>
              {tutorial.isPremium && (
                <div className="absolute top-3 left-3 bg-sportnexus-orange/90 text-white backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-1">{tutorial.title}</h3>
                <p className="text-muted-foreground text-sm">By {tutorial.instructor}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                  {tutorial.type}
                </span>
                <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                  {tutorial.level}
                </span>
                <span className="flex items-center text-sm text-muted-foreground ml-auto">
                  <Video className="h-3 w-3 mr-1" />
                  {tutorial.format}
                </span>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {tutorial.duration} min
                </span>
              </div>
              <Button 
                className={`w-full mt-4 ${
                  tutorial.isPremium 
                    ? 'bg-sportnexus-green hover:bg-sportnexus-lightGreen' 
                    : 'bg-sportnexus-blue hover:bg-sportnexus-darkBlue'
                }`}
              >
                {tutorial.isPremium ? 'Unlock Premium' : 'Start Learning'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
