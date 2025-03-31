
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Sign Up & Create Profile',
    description: 'Create your account and set up your sports preferences to get personalized recommendations.',
    delay: 0,
  },
  {
    id: '02',
    title: 'Explore Available Options',
    description: 'Browse venues, equipment, and tutorials filtered according to your interests and location.',
    delay: 0.1,
  },
  {
    id: '03',
    title: 'Book & Pay Securely',
    description: 'Select your preferred option, choose a time slot, and complete payment through our secure gateway.',
    delay: 0.2,
  },
  {
    id: '04',
    title: 'Enjoy & Share Feedback',
    description: 'Enjoy your sports experience and leave reviews to help other users make informed decisions.',
    delay: 0.3,
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-white section-padding">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-sportnexus-green font-medium uppercase tracking-wider mb-2">How It Works</h3>
          <h2 className="text-sportnexus-darkGray mb-4">
            Simple steps to get started
          </h2>
          <p className="text-gray-600">
            Getting started with SportNexus is easy. Follow these simple steps to begin your sports journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm relative card-hover animate-fade-in"
              style={{ animationDelay: `${step.delay}s` }}
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sportnexus-green text-white text-sm font-medium mb-4">
                {step.id}
              </div>
              <h3 className="font-medium text-lg text-sportnexus-darkGray mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <div className="flex items-center text-sportnexus-green">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Easy to follow</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
