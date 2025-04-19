import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Camera, Mail, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings, getUserRentals, updateUserProfile } from '@/services/api';
import { uploadImage } from '@/services/upload';
import { BUCKET_PROFILES } from '@/services/storage';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { VenueBookingWithDetails, EquipmentRentalWithDetails } from '@/types/supabase';

// Define form validation schema
const profileFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bookings, setBookings] = useState<VenueBookingWithDetails[]>([]);
  const [rentals, setRentals] = useState<EquipmentRentalWithDetails[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  // Update form values when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, form]);

  // Load user's bookings and rentals
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setLoadingBookings(true);
    setLoadingRentals(true);
    
    try {
      const bookingsData = await getUserBookings(user.id);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
    
    try {
      const rentalsData = await getUserRentals(user.id);
      setRentals(rentalsData);
    } catch (error) {
      console.error('Error loading rentals:', error);
    } finally {
      setLoadingRentals(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      });
      
      // Refresh user profile in context
      await refreshProfile();
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) return;
    
    const file = event.target.files[0];
    setIsUploading(true);
    
    try {
      const result = await uploadImage(file, BUCKET_PROFILES, user.id);
      
      if (result.url) {
        // Update form value
        form.setValue('avatar_url', result.url);
        
        // Save to profile
        await updateUserProfile(user.id, {
          avatar_url: result.url,
        });
        
        // Refresh user profile in context
        await refreshProfile();
        
        toast.success('Profile picture updated');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px] rounded-lg" />
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="John Doe" 
                                {...field} 
                                className="pl-10 w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="johndoe" 
                                {...field} 
                                className="pl-10 w-full"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Profile Picture Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative mb-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={profile?.avatar_url || ''} 
                      alt={profile?.full_name || user?.email || 'User'} 
                    />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0">
                    <Label 
                      htmlFor="avatar-upload" 
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <span className="sr-only">Upload picture</span>
                    </Label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">{profile?.full_name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm font-medium">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Venue Bookings</CardTitle>
              <CardDescription>View your booking history</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded" />
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">You don't have any venue bookings yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/venues'}>
                    Book a Venue
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {booking.venue_details?.images?.[0] ? (
                            <img 
                              src={booking.venue_details.images[0]} 
                              alt={booking.venue_details.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.venue_details?.name || 'Venue'}</h4>
                          <p className="text-sm text-muted-foreground">{booking.venue_details?.location || 'Location'}</p>
                          <p className="text-sm">
                            {new Date(booking.booking_date).toLocaleDateString()} • {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <div className="text-right mb-2 md:mb-0">
                          <p className="text-sm font-medium">${booking.total_price}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={booking.status === 'cancelled'}
                          onClick={() => window.open(`/booking/${booking.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>My Equipment Rentals</CardTitle>
              <CardDescription>View your rental history</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRentals ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded" />
                    </div>
                  ))}
                </div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">You don't have any equipment rentals yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/equipment'}>
                    Rent Equipment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rentals.map((rental) => (
                    <div key={rental.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {rental.equipment_details?.images?.[0] ? (
                            <img 
                              src={rental.equipment_details.images[0]} 
                              alt={rental.equipment_details.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{rental.equipment_details?.name || 'Equipment'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rental.equipment_details?.brand || 'Brand'} • {rental.equipment_details?.category || 'Category'}
                          </p>
                          <p className="text-sm">
                            {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-end space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <div className="text-right mb-2 md:mb-0">
                          <p className="text-sm font-medium">${rental.total_price} • Qty: {rental.quantity}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rental.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={rental.status === 'cancelled'}
                          onClick={() => window.open(`/rental/${rental.id}`, '_blank')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
