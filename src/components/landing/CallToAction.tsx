
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <div className="bg-white section-padding">
      <div className="container mx-auto">
        <div className="bg-sportnexus-green/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMEI5NjQiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-center"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-sportnexus-darkGray mb-4">
              Ready to transform your sports experience?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join thousands of sports enthusiasts who use SportNexus to discover venues, rent equipment, and improve their skills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Button size="lg" className="bg-sportnexus-green hover:bg-sportnexus-darkGreen button-hover-effect text-white">
                <Link to="/register" className="flex items-center">
                  Sign up now <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-sportnexus-green text-sportnexus-green hover:bg-sportnexus-green/10 button-hover-effect">
                <Link to="/venues" className="flex items-center">
                  Browse venues <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required. Start for free and upgrade anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
