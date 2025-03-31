
import { CalendarRange, ShoppingBag, GraduationCap, Users } from 'lucide-react';

const features = [
  {
    name: 'Venue Booking',
    description:
      'Search and book sports venues by location, sport type, and amenities. View availability in real-time and secure your spot instantly.',
    icon: CalendarRange,
    delay: 0,
  },
  {
    name: 'Equipment Rental',
    description:
      'Browse and rent quality sports equipment for any activity. From tennis rackets to camping gear, we\'ve got you covered.',
    icon: ShoppingBag,
    delay: 0.1,
  },
  {
    name: 'Sports Tutorials',
    description:
      'Access expert-led tutorials for all skill levels. Learn new sports, improve your technique, and track your progress.',
    icon: GraduationCap,
    delay: 0.2,
  },
  {
    name: 'Community Events',
    description:
      'Join local sports events, tournaments, and meetups. Connect with fellow sports enthusiasts in your area.',
    icon: Users,
    delay: 0.3,
  },
];

export default function Features() {
  return (
    <div className="bg-sportnexus-lightGray section-padding">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-sportnexus-green font-medium uppercase tracking-wider mb-2">Features</h3>
          <h2 className="text-sportnexus-darkGray mb-4">
            Everything you need for your sports journey
          </h2>
          <p className="text-gray-600 mb-12">
            SportNexus brings together all the essential elements for an outstanding sports experience in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.name} 
              className="bg-white rounded-lg p-6 shadow-sm card-hover animate-fade-in" 
              style={{ animationDelay: `${feature.delay}s` }}
            >
              <div className="bg-sportnexus-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-sportnexus-green" />
              </div>
              <h3 className="font-medium text-lg text-sportnexus-darkGray mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
