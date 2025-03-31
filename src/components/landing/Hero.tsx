
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sportnexus-blue to-sportnexus-darkBlue py-16 sm:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#000)]"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl animate-fade-in">
              Your All-in-One<br />
              <span className="text-sportnexus-green">Sports Hub</span>
            </h1>
            <p className="mt-4 text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Book. Rent. Learn. Experience sports like never before with SportNexus - connecting you to venues, equipment, and expert tutorials.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" className="bg-sportnexus-green hover:bg-sportnexus-lightGreen button-hover-effect text-white">
                <Link to="/venues" className="flex items-center">
                  Book Venues <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" className="bg-sportnexus-orange hover:bg-sportnexus-lightOrange button-hover-effect text-white">
                <Link to="/equipment" className="flex items-center">
                  Rent Equipment <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 button-hover-effect">
                <Link to="/tutorials" className="flex items-center">
                  Access Tutorials <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:pl-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl transform lg:rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Sports Venue" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="aspect-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sports Equipment" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sports Coach" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="aspect-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Sports Team" 
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
