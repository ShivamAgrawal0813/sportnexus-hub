
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, subscribeToUserNotifications } from '@/services/api';
import { Notification } from '@/types/supabase';

export function useNotifications(limit = 10) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getUserNotifications(user.id, limit);
      setNotifications(data);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true } 
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    const success = await markAllNotificationsAsRead(user.id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to real-time notifications
      const unsubscribe = subscribeToUserNotifications(
        user.id,
        (payload) => {
          // Handle the new notification
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev].slice(0, limit));
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [user, limit]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
