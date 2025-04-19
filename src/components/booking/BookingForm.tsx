import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, ClockIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Venue } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { createBooking } from '@/services';
import { toast } from '@/hooks/use-toast';

const timeSlots = [
  '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00',
  '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00',
  '18:00:00', '19:00:00', '20:00:00'
];

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  notes: z.string().optional(),
}).refine(data => data.startTime < data.endTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

interface BookingFormProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BookingForm({ venue, isOpen, onClose, onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to book a venue");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Calculate hours difference for pricing
      const startHour = parseInt(values.startTime.split(':')[0]);
      const endHour = parseInt(values.endTime.split(':')[0]);
      const hoursDifference = endHour - startHour;
      
      // Calculate total price
      const totalPrice = venue.hourly_price * hoursDifference;
      
      const bookingData = {
        venue_id: venue.id,
        user_id: user.id,
        booking_date: format(values.date, 'yyyy-MM-dd'),
        start_time: values.startTime,
        end_time: values.endTime,
        total_price: totalPrice,
        notes: values.notes || null
      };
      
      const result = await createBooking(bookingData);
      
      if (result) {
        toast.success("Venue booked successfully!");
        form.reset();
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book venue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Book {venue.name}
          </DialogTitle>
          <DialogDescription>
            Select your preferred date and time slot to book this venue.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMMM d, yyyy")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time Selection */}
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value.substring(0, 5) : "Start time"}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="max-h-60 overflow-y-auto p-2">
                          {timeSlots.map((time, i) => (
                            <div 
                              key={i}
                              className={cn(
                                "cursor-pointer rounded px-4 py-2 hover:bg-accent",
                                field.value === time && "bg-accent"
                              )}
                              onClick={() => {
                                field.onChange(time);
                                // If end time is not set or is before start time, auto-select end time
                                const currentEndTime = form.getValues("endTime");
                                if (!currentEndTime || currentEndTime <= time) {
                                  const timeIndex = timeSlots.indexOf(time);
                                  if (timeIndex < timeSlots.length - 1) {
                                    form.setValue("endTime", timeSlots[timeIndex + 1]);
                                  }
                                }
                              }}
                            >
                              {time.substring(0, 5)}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? field.value.substring(0, 5) : "End time"}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="max-h-60 overflow-y-auto p-2">
                          {timeSlots.map((time, i) => {
                            const startTime = form.getValues("startTime");
                            const isDisabled = startTime && time <= startTime;
                            return (
                              <div 
                                key={i}
                                className={cn(
                                  "cursor-pointer rounded px-4 py-2 hover:bg-accent",
                                  field.value === time && "bg-accent",
                                  isDisabled && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => {
                                  if (!isDisabled) {
                                    field.onChange(time);
                                  }
                                }}
                              >
                                {time.substring(0, 5)}
                              </div>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Price Display */}
            {form.watch("startTime") && form.watch("endTime") && (
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Hourly rate:</span>
                    <span>${venue.hourly_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Hours:</span>
                    <span>
                      {parseInt(form.watch("endTime").split(':')[0]) - parseInt(form.watch("startTime").split(':')[0])}
                    </span>
                  </div>
                  <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                    <span>Total:</span>
                    <span>
                      ${(venue.hourly_price * (parseInt(form.watch("endTime").split(':')[0]) - parseInt(form.watch("startTime").split(':')[0]))).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field}
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Any special requests or information..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Book Now"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 