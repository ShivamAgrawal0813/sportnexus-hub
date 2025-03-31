
import { Check } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Sign Up & Create Profile',
    description: 'Create your account and set up your sports preferences to get personalized recommendations.',
  },
  {
    id: '02',
    title: 'Explore Available Options',
    description: 'Browse venues, equipment, and tutorials filtered according to your interests and location.',
  },
  {
    id: '03',
    title: 'Book & Pay Securely',
    description: 'Select your preferred option, choose a time slot, and complete payment through our secure gateway.',
  },
  {
    id: '04',
    title: 'Enjoy & Share Feedback',
    description: 'Enjoy your sports experience and leave reviews to help other users make informed decisions.',
  },
];

export default function HowItWorks() {
  return (
    <div className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-sportnexus-orange uppercase tracking-wide">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-sportnexus-blue sm:text-4xl">
            Simple steps to get started
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Getting started with SportNexus is easy. Follow these simple steps to begin your sports journey today.
          </p>
        </div>

        <div className="mt-12 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {steps.map((step, stepIdx) => (
                <div
                  key={step.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative animate-fade-in"
                  style={{ animationDelay: `${stepIdx * 0.1}s` }}
                >
                  <div className="absolute -top-3 left-6 bg-sportnexus-blue text-white text-sm font-bold py-1 px-3 rounded-full">
                    {step.id}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-sportnexus-blue">{step.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  <div className="mt-4 flex items-center text-sportnexus-green">
                    <Check className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Easy to follow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
