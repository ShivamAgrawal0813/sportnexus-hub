
import { CalendarRange, ShoppingBag, GraduationCap, Users } from 'lucide-react';

const features = [
  {
    name: 'Venue Booking',
    description:
      'Search and book sports venues by location, sport type, and amenities. View availability in real-time and secure your spot instantly.',
    icon: CalendarRange,
    color: 'bg-sportnexus-blue',
  },
  {
    name: 'Equipment Rental',
    description:
      'Browse and rent quality sports equipment for any activity. From tennis rackets to camping gear, we've got you covered.',
    icon: ShoppingBag,
    color: 'bg-sportnexus-green',
  },
  {
    name: 'Sports Tutorials',
    description:
      'Access expert-led tutorials for all skill levels. Learn new sports, improve your technique, and track your progress.',
    icon: GraduationCap,
    color: 'bg-sportnexus-orange',
  },
  {
    name: 'Community Events',
    description:
      'Join local sports events, tournaments, and meetups. Connect with fellow sports enthusiasts in your area.',
    icon: Users,
    color: 'bg-sportnexus-lightBlue',
  },
];

export default function Features() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-sportnexus-green uppercase tracking-wide">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-sportnexus-blue sm:text-4xl">
            Everything you need for your sports journey
          </p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
            SportNexus brings together all the essential elements for an outstanding sports experience in one platform.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative overflow-hidden rounded-lg border border-gray-200 p-6 shadow-sm transition duration-300 hover:shadow-md animate-fade-in">
                <div>
                  <span className={`inline-flex h-12 w-12 rounded-md ${feature.color} items-center justify-center text-white`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-sportnexus-blue">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
