
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <div className="py-16 sm:py-24 bg-gradient-to-br from-sportnexus-blue to-sportnexus-darkBlue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your sports experience?
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-300">
            Join thousands of sports enthusiasts who use SportNexus to discover venues, rent equipment, and improve their skills.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
            <Button size="lg" className="bg-sportnexus-green hover:bg-sportnexus-lightGreen button-hover-effect text-white">
              <Link to="/register" className="flex items-center">
                Sign up now <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 button-hover-effect">
              <Link to="/venues" className="flex items-center">
                Browse venues <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-base text-gray-300">
            No credit card required. Start for free and upgrade anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
