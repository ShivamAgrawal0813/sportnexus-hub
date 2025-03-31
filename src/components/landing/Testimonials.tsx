
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: 'SportNexus has completely changed how I access sports facilities. Booking courts used to be such a hassle, but now it\'s just a few clicks away!',
    name: 'Sarah Johnson',
    role: 'Tennis Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
    delay: 0,
  },
  {
    id: 2,
    quote: 'The equipment rental saved our camping trip! We got quality gear delivered right to our doorstep, and returning it was just as simple.',
    name: 'Michael Chang',
    role: 'Outdoor Adventurer',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4,
    delay: 0.1,
  },
  {
    id: 3,
    quote: 'As a beginner, the tutorial section has been invaluable. The step-by-step videos helped me improve my basketball skills dramatically in just a few weeks.',
    name: 'Amanda Rodriguez',
    role: 'Basketball Player',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5,
    delay: 0.2,
  },
];

export default function Testimonials() {
  return (
    <div className="bg-sportnexus-lightGray section-padding">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-sportnexus-green font-medium uppercase tracking-wider mb-2">Testimonials</h3>
          <h2 className="text-sportnexus-darkGray mb-4">
            What our users say
          </h2>
          <p className="text-gray-600">
            Don't just take our word for it — hear from some of our satisfied users who have transformed their sports experience with SportNexus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-sm card-hover animate-fade-in"
              style={{ animationDelay: `${testimonial.delay}s` }}
            >
              <div className="mb-6">
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-sportnexus-green"
                  src={testimonial.avatar}
                  alt={testimonial.name}
                />
                <div>
                  <h4 className="text-sportnexus-darkGray font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-sportnexus-green fill-sportnexus-green' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
