import { toast } from '@/hooks/use-toast';
import {
  Venue,
  VenueBooking,
  Equipment,
  EquipmentRental,
  Tutorial,
  TutorialLesson,
  UserTutorialProgress,
  Notification,
  BookingStatus,
  TutorialProgress
} from '@/types/supabase';
import { 
  generateMockBooking, 
  generateMockEquipment, 
  generateMockRental, 
  generateMockVenue,
  generateMockId,
  handleError,
  handleSuccess
} from './api-helper';
import { mockNotifications, mockTutorials, mockTutorialLessons, mockUserProgress } from './mock-data';
import { supabase } from '@/integrations/supabase/client';

// Local storage keys for simulating database tables
const STORAGE_VENUES = 'sport_nexus_venues';
const STORAGE_BOOKINGS = 'sport_nexus_bookings';
const STORAGE_EQUIPMENT = 'sport_nexus_equipment';
const STORAGE_RENTALS = 'sport_nexus_rentals';
const STORAGE_NOTIFICATIONS = 'sport_nexus_notifications';
const STORAGE_TUTORIALS = 'sport_nexus_tutorials';
const STORAGE_TUTORIAL_LESSONS = 'sport_nexus_tutorial_lessons';
const STORAGE_USER_PROGRESS = 'sport_nexus_user_progress';

// Helper functions to get and set mock data
const getMockData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setMockData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize with some mock data if empty
const initMockData = () => {
  // Initialize venues
  if (!localStorage.getItem(STORAGE_VENUES)) {
    const mockVenues = [
      generateMockVenue({ name: 'Downtown Basketball Court', sport_type: 'basketball' }),
      generateMockVenue({ name: 'City Tennis Center', sport_type: 'tennis' }),
      generateMockVenue({ name: 'Riverside Soccer Field', sport_type: 'soccer' })
    ];
    setMockData(STORAGE_VENUES, mockVenues);
  }
  
  // Initialize equipment
  if (!localStorage.getItem(STORAGE_EQUIPMENT)) {
    const mockEquipment = [
      generateMockEquipment({ name: 'Basketball Set', category: 'ball' }),
      generateMockEquipment({ name: 'Tennis Racket', category: 'racket' }),
      generateMockEquipment({ name: 'Soccer Ball', category: 'ball' })
    ];
    setMockData(STORAGE_EQUIPMENT, mockEquipment);
  }

  // Initialize notifications
  if (!localStorage.getItem(STORAGE_NOTIFICATIONS)) {
    setMockData(STORAGE_NOTIFICATIONS, mockNotifications);
  }

  // Initialize tutorials
  if (!localStorage.getItem(STORAGE_TUTORIALS)) {
    setMockData(STORAGE_TUTORIALS, mockTutorials);
  }

  // Initialize tutorial lessons
  if (!localStorage.getItem(STORAGE_TUTORIAL_LESSONS)) {
    setMockData(STORAGE_TUTORIAL_LESSONS, mockTutorialLessons);
  }

  // Initialize user progress
  if (!localStorage.getItem(STORAGE_USER_PROGRESS)) {
    setMockData(STORAGE_USER_PROGRESS, mockUserProgress);
  }
};

// Call initialization on module load
initMockData();

// Venue Management
export const getVenues = async (filters?: any): Promise<Venue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let venues = getMockData<Venue>(STORAGE_VENUES);
  
  // Apply filters
  if (filters) {
    if (filters.sport_type) {
      venues = venues.filter(v => v.sport_type === filters.sport_type);
    }
    if (filters.location) {
      venues = venues.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.minPrice !== undefined) {
      venues = venues.filter(v => v.hourly_price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      venues = venues.filter(v => v.hourly_price <= filters.maxPrice);
    }
  }
  
  return venues;
};

// Venue Bookings
export const getUserBookings = async (userId: string): Promise<VenueBooking[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  return bookings.filter(booking => booking.user_id === userId);
};

export const createBooking = async (booking: Omit<VenueBooking, 'id' | 'created_at' | 'updated_at'>): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venues = getMockData<Venue>(STORAGE_VENUES);
  const venue = venues.find(v => v.id === booking.venue_id);
  
  if (!venue) {
    toast.error('Venue not found');
    return null;
  }
  
  const newBooking: VenueBooking = {
    id: generateMockId(),
    ...booking,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    venue_details: {
      name: venue.name,
      location: venue.location,
      sport_type: venue.sport_type,
      images: venue.images || []
    }
  };
  
  // Store to "database"
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  bookings.push(newBooking);
  setMockData(STORAGE_BOOKINGS, bookings);
  
  toast.success('Booking created successfully');
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<VenueBooking | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const bookings = getMockData<VenueBooking>(STORAGE_BOOKINGS);
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    toast.error('Booking not found');
    return null;
  }
  
  const updatedBooking = {
    ...bookings[bookingIndex],
    status,
    updated_at: new Date().toISOString()
  };
  
  // Update in "database"
  bookings[bookingIndex] = updatedBooking;
  setMockData(STORAGE_BOOKINGS, bookings);
  
  toast.success(`Booking ${status} successfully`);
  return updatedBooking;
};

// Equipment Rentals
export const createRental = async (rental: Omit<EquipmentRental, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentRental | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const equipment = getMockData<Equipment>(STORAGE_EQUIPMENT);
  const equipmentItem = equipment.find(e => e.id === rental.equipment_id);
  
  if (!equipmentItem) {
    toast.error('Equipment not found');
    return null;
  }
  
  if (equipmentItem.available_quantity < rental.quantity) {
    toast.error('Not enough equipment available');
    return null;
  }
  
  const newRental: EquipmentRental = {
    id: generateMockId(),
    ...rental,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Update equipment availability
  equipmentItem.available_quantity -= rental.quantity;
  const equipmentIndex = equipment.findIndex(e => e.id === rental.equipment_id);
  equipment[equipmentIndex] = equipmentItem;
  setMockData(STORAGE_EQUIPMENT, equipment);
  
  // Store rental
  const rentals = getMockData<EquipmentRental>(STORAGE_RENTALS);
  rentals.push(newRental);
  setMockData(STORAGE_RENTALS, rentals);
  
  toast.success('Equipment rental created successfully');
  return newRental;
};

export const getUserRentals = async (userId: string): Promise<EquipmentRental[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const rentals = getMockData<EquipmentRental>(STORAGE_RENTALS);
  return rentals.filter(rental => rental.user_id === userId);
};

// Tutorial Management
export const getTutorialById = async (tutorialId: string): Promise<{ tutorial: Tutorial; lessons: TutorialLesson[] } | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get tutorial from mock data or local storage
  const tutorials = getMockData<Tutorial>(STORAGE_TUTORIALS) || mockTutorials;
  const tutorial = tutorials.find(t => t.id === tutorialId);
  
  if (!tutorial) {
    return handleError(null, 'Tutorial not found');
  }
  
  // Get lessons for this tutorial
  const lessons = (getMockData<TutorialLesson>(STORAGE_TUTORIAL_LESSONS) || mockTutorialLessons)
    .filter(l => l.tutorial_id === tutorialId)
    .sort((a, b) => a.sequence_order - b.sequence_order);
  
  return { tutorial, lessons };
};

export const getUserTutorialProgress = async (userId: string, tutorialId: string): Promise<UserTutorialProgress | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const userProgress = getMockData<UserTutorialProgress>(STORAGE_USER_PROGRESS) || mockUserProgress;
  const progress = userProgress.find(p => p.user_id === userId && p.tutorial_id === tutorialId);
  
  if (!progress) {
    return null; // No progress found, but not an error
  }
  
  return progress;
};

export const updateTutorialProgress = async (
  userId: string,
  tutorialId: string,
  currentLessonId: string,
  progress: TutorialProgress,
  completedLessons: number
): Promise<UserTutorialProgress | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userProgress = getMockData<UserTutorialProgress>(STORAGE_USER_PROGRESS) || mockUserProgress;
  const tutorialLessons = getMockData<TutorialLesson>(STORAGE_TUTORIAL_LESSONS) || mockTutorialLessons;
  const totalLessons = tutorialLessons.filter(l => l.tutorial_id === tutorialId).length;
  
  let existingProgress = userProgress.find(p => p.user_id === userId && p.tutorial_id === tutorialId);
  
  if (!existingProgress) {
    // Create new progress entry
    existingProgress = {
      id: generateMockId(),
      user_id: userId,
      tutorial_id: tutorialId,
      current_lesson_id: currentLessonId,
      progress,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      last_accessed: new Date().toISOString(),
      completion_date: progress === 'completed' ? new Date().toISOString() : null,
      certificate_issued: progress === 'completed'
    };
    
    userProgress.push(existingProgress);
  } else {
    // Update existing progress
    const index = userProgress.findIndex(p => p.id === existingProgress?.id);
    
    userProgress[index] = {
      ...existingProgress,
      current_lesson_id: currentLessonId,
      progress,
      completed_lessons: completedLessons,
      last_accessed: new Date().toISOString(),
      completion_date: progress === 'completed' ? new Date().toISOString() : existingProgress.completion_date,
      certificate_issued: progress === 'completed' ? true : existingProgress.certificate_issued
    };
  }
  
  // Save updated progress
  setMockData(STORAGE_USER_PROGRESS, userProgress);
  
  const updatedProgress = userProgress.find(p => p.user_id === userId && p.tutorial_id === tutorialId);
  return handleSuccess(updatedProgress!, 'Progress updated successfully');
};

// Notification Management
export const getUserNotifications = async (userId: string, limit: number = 10): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notifications = getMockData<Notification>(STORAGE_NOTIFICATIONS) || mockNotifications;
  
  return notifications
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const notifications = getMockData<Notification>(STORAGE_NOTIFICATIONS) || mockNotifications;
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index === -1) {
    return handleError(false, 'Notification not found');
  }
  
  notifications[index] = {
    ...notifications[index],
    is_read: true
  };
  
  setMockData(STORAGE_NOTIFICATIONS, notifications);
  return handleSuccess(true, 'Notification marked as read');
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notifications = getMockData<Notification>(STORAGE_NOTIFICATIONS) || mockNotifications;
  const updatedNotifications = notifications.map(n => 
    n.user_id === userId ? { ...n, is_read: true } : n
  );
  
  setMockData(STORAGE_NOTIFICATIONS, updatedNotifications);
  return handleSuccess(true, 'All notifications marked as read');
};

// Real-time subscription simulation
const subscriptionCallbacks: Record<string, ((payload: any) => void)[]> = {};

export const subscribeToUserNotifications = (
  userId: string,
  callback: (payload: { new: Notification }) => void
): (() => void) => {
  // Create a unique channel key for this subscription
  const channelKey = `notifications:${userId}`;
  
  if (!subscriptionCallbacks[channelKey]) {
    subscriptionCallbacks[channelKey] = [];
  }
  
  // Add the callback to our list
  subscriptionCallbacks[channelKey].push(callback);
  
  // Return unsubscribe function
  return () => {
    if (subscriptionCallbacks[channelKey]) {
      subscriptionCallbacks[channelKey] = subscriptionCallbacks[channelKey]
        .filter(cb => cb !== callback);
    }
  };
};

// Helper function to trigger notification callbacks (for testing)
export const simulateNewNotification = (userId: string, notification: Notification): void => {
  const channelKey = `notifications:${userId}`;
  
  if (subscriptionCallbacks[channelKey]) {
    // Add to local storage
    const notifications = getMockData<Notification>(STORAGE_NOTIFICATIONS) || [];
    notifications.push(notification);
    setMockData(STORAGE_NOTIFICATIONS, notifications);
    
    // Notify all callbacks
    subscriptionCallbacks[channelKey].forEach(callback => {
      callback({ new: notification });
    });
  }
};
