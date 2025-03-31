
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: 'SportNexus has completely changed how I access sports facilities. Booking courts used to be such a hassle, but now it's just a few clicks away!',
    name: 'Sarah Johnson',
    role: 'Tennis Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
  {
    id: 2,
    quote: 'The equipment rental saved our camping trip! We got quality gear delivered right to our doorstep, and returning it was just as simple.',
    name: 'Michael Chang',
    role: 'Outdoor Adventurer',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4,
  },
  {
    id: 3,
    quote: 'As a beginner, the tutorial section has been invaluable. The step-by-step videos helped me improve my basketball skills dramatically in just a few weeks.',
    name: 'Amanda Rodriguez',
    role: 'Basketball Player',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-sportnexus-green uppercase tracking-wide">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-sportnexus-blue sm:text-4xl">
            What our users say
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            Don't just take our word for it — hear from some of our satisfied users who have transformed their sports experience with SportNexus.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg bg-gray-50 border border-gray-100 p-8 shadow-sm hover:shadow-md transition duration-300 animate-fade-in"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-sportnexus-blue">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="mt-6">
                <p className="text-base text-gray-700">"{testimonial.quote}"</p>
              </blockquote>
              <div className="mt-6 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-sportnexus-orange fill-sportnexus-orange' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">{testimonial.rating} out of 5</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
