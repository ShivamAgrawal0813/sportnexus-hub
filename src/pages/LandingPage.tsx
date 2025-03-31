
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-sportnexus-blue py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-sportnexus-green flex items-center justify-center text-white font-bold mr-2">
              SN
            </div>
            <h1 className="text-xl font-bold text-white">SportNexus</h1>
          </div>
          <div className="hidden md:flex gap-6">
            <Link to="/" className="text-white hover:text-sportnexus-green">Home</Link>
            <Link to="/venues" className="text-white hover:text-sportnexus-green">Venues</Link>
            <Link to="/equipment" className="text-white hover:text-sportnexus-green">Equipment</Link>
            <Link to="/tutorials" className="text-white hover:text-sportnexus-green">Tutorials</Link>
            <Link to="/about" className="text-white hover:text-sportnexus-green">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-sportnexus-green hidden md:inline-flex">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-sportnexus-green hover:bg-sportnexus-lightGreen hidden md:inline-flex text-white">
                Sign Up
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sportnexus-blue border-t border-sportnexus-darkBlue mt-4">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-white hover:text-sportnexus-green py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/venues" 
                className="text-white hover:text-sportnexus-green py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Venues
              </Link>
              <Link 
                to="/equipment" 
                className="text-white hover:text-sportnexus-green py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Equipment
              </Link>
              <Link 
                to="/tutorials" 
                className="text-white hover:text-sportnexus-green py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tutorials
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-sportnexus-green py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="w-1/2" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-white border-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="w-1/2" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-sportnexus-green text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Sticky floating home button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link to="/">
          <Button variant="default" size="icon" className="rounded-full h-12 w-12 shadow-lg bg-sportnexus-green hover:bg-sportnexus-lightGreen">
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
