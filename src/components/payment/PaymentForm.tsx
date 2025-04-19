
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Calendar, Lock, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { updateBookingPayment, updateRentalPayment } from '@/services/api';

const paymentFormSchema = z.object({
  cardName: z.string().min(3, 'Name on card is required'),
  cardNumber: z.string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number must not exceed 19 digits')
    .regex(/^[0-9\s-]+$/, 'Card number can only contain digits, spaces, or hyphens'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string()
    .length(3, 'CVV must be 3 digits')
    .regex(/^[0-9]+$/, 'CVV can only contain digits'),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  amount: number;
  itemId: string;
  itemType: 'booking' | 'rental';
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ amount, itemId, itemType, onSuccess, onCancel }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const groups = [];
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ').trim();
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
  };

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, this is where you would call your payment gateway
      // For demo purposes, we'll simulate a payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock payment ID
      const paymentId = `pay_${Date.now()}`;
      
      // Update the booking or rental with the payment ID
      if (itemType === 'booking') {
        await updateBookingPayment(itemId, paymentId, 'paid');
      } else {
        await updateRentalPayment(itemId, paymentId, 'paid');
      }
      
      toast.success('Payment successful!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment to confirm your {itemType}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-xl font-bold">${amount.toFixed(2)}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="4242 4242 4242 4242" 
                        className="pl-10" 
                        {...field} 
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={19}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="MM/YY" 
                          className="pl-10" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={5}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="123" 
                          className="pl-10" 
                          {...field}
                          type="password" 
                          maxLength={3}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              <p>For testing, use these card details:</p>
              <p>Card Number: 4242 4242 4242 4242</p>
              <p>Expiry Date: Any future date (MM/YY)</p>
              <p>CVV: Any 3 digits</p>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${amount.toFixed(2)}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
