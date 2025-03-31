
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, ShoppingBag, Layers, Users, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Rentals
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Due in 5 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tutorial Progress
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <p className="text-xs text-muted-foreground">Basketball fundamentals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Community Events
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">In your area</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent bookings and rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4">
                  <div className="bg-muted p-2 rounded-full">
                    {i % 2 === 0 ? (
                      <Calendar className="h-4 w-4" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {i % 2 === 0 ? 'Booked Tennis Court' : 'Rented Tennis Racket'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${i === 1 ? '45.00' : i === 2 ? '25.00' : '35.00'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your next sessions and returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4">
                  <div className="bg-muted p-2 rounded-full">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {i === 1 ? 'Tennis Court Session' : i === 2 ? 'Equipment Return Due' : 'Basketball Tutorial'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString()}, 
                      {' '}{i === 1 ? '10:00 AM' : i === 2 ? '5:00 PM' : '2:30 PM'}
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    i === 1 ? 'bg-sportnexus-green/20 text-sportnexus-green' : 
                    i === 2 ? 'bg-sportnexus-orange/20 text-sportnexus-orange' :
                    'bg-sportnexus-blue/20 text-sportnexus-blue'
                  }`}>
                    {i === 1 ? 'Upcoming' : i === 2 ? 'Due Soon' : 'Scheduled'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
