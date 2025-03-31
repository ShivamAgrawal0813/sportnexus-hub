import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-white section-padding w-full overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-12 lg:items-center">
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <h1 className="text-sportnexus-darkGray font-bold tracking-tight animate-fade-in">
              Your All-in-One<br />
              <span className="text-sportnexus-green">Sports Hub</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Book venues, rent equipment, and access expert tutorials — experience sports like never before with SportNexus.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" className="bg-sportnexus-green hover:bg-sportnexus-darkGreen button-hover-effect text-white">
                <Link to="/venues" className="flex items-center">
                  Book Venues <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-sportnexus-green text-sportnexus-green hover:bg-sportnexus-green/10 button-hover-effect">
                <Link to="/equipment" className="flex items-center">
                  Rent Equipment <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:pl-8 animate-fade-in w-full" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Sports Coach" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Tennis Court" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sports Equipment" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sports Training" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
