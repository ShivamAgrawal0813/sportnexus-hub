import { Link } from 'react-router-dom';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm w-full">
        <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold mr-2">
              SN
            </div>
            <h1 className="text-xl font-bold text-sportnexus-darkGray">SportNexus</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-sportnexus-darkGray hover:text-sportnexus-green transition-colors">Home</Link>
            <Link to="/venues" className="text-sportnexus-darkGray hover:text-sportnexus-green transition-colors">Venues</Link>
            <Link to="/equipment" className="text-sportnexus-darkGray hover:text-sportnexus-green transition-colors">Equipment</Link>
            <Link to="/tutorials" className="text-sportnexus-darkGray hover:text-sportnexus-green transition-colors">Tutorials</Link>
            <Link to="/about" className="text-sportnexus-darkGray hover:text-sportnexus-green transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-sportnexus-darkGray hover:text-sportnexus-green hidden md:inline-flex">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-sportnexus-green hover:bg-sportnexus-darkGreen text-white hidden md:inline-flex">
                Sign Up
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-sportnexus-darkGray md:hidden">
              <Menu />
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Sticky floating home button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link to="/">
          <Button variant="default" size="icon" className="rounded-full h-12 w-12 shadow-lg bg-sportnexus-green hover:bg-sportnexus-darkGreen">
            <ChevronRight className="h-6 w-6 text-white" />
          </Button>
        </Link>
      </div>

      {/* Landing page content */}
      <div className="flex-1 w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </div>

      <Footer />
    </div>
  );
}
