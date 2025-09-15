import { useState, useEffect, useMemo } from 'react';
import { Notification } from '../types/notification';
import { useAuth } from '../contexts/AuthContext';

const NOTIFICATIONS_STORAGE_KEY = 'notifications_data';

// Mock notifications data
const getInitialNotifications = (): Notification[] => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
  
  return [
  {
    id: '1',
    title: 'Mažos atsargos',
    message: 'Vitaminas C (L-askorbo rūgštis) atsargos žemiau minimalaus lygio',
    type: 'warning',
    category: 'material',
    isRead: false,
    createdAt: '2024-12-02T10:30:00Z',
    userId: '1',
    relatedId: '2',
    actionUrl: '/materials'
  },
  {
    id: '2',
    title: 'Naujas komentaras',
    message: 'Marija Petraitienė paliko komentarą formulėje "Drėkinamasis veido kremas"',
    type: 'info',
    category: 'comment',
    isRead: false,
    createdAt: '2024-12-02T09:15:00Z',
    userId: '1',
    relatedId: '1',
    actionUrl: '/formulas'
  },
  {
    id: '3',
    title: 'Formulė patvirtinta',
    message: 'Formulė "Apsauginis saulės kremas SPF30" sėkmingai patvirtinta',
    type: 'success',
    category: 'formula',
    isRead: true,
    createdAt: '2024-12-01T16:45:00Z',
    userId: '1',
    relatedId: '2',
    actionUrl: '/formulas'
  },
  {
    id: '4',
    title: 'Sistemos atnaujinimas',
    message: 'Sistema bus atnaujinta šį sekmadienį 02:00 val.',
    type: 'info',
    category: 'system',
    isRead: false,
    createdAt: '2024-12-01T14:20:00Z',
    userId: '1'
  },
  {
    id: '5',
    title: 'Saugos įspėjimas',
    message: 'Petras Kazlauskas pažymėjo saugos problemą formulėje',
    type: 'error',
    category: 'comment',
    isRead: false,
    createdAt: '2024-12-01T11:30:00Z',
    userId: '1',
    relatedId: '1',
    actionUrl: '/formulas'
  }
  ];
};

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(getInitialNotifications);
  const [loading, setLoading] = useState(false);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  const userNotifications = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return notifications
      .filter(n => n.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, currentUser?.id]);

  const unreadCount = useMemo(() => {
    return userNotifications.filter(n => !n.isRead).length;
  }, [userNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(notification => 
      notification.userId === currentUser.id
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationsByCategory = (category: Notification['category']) => {
    return userNotifications.filter(n => n.category === category);
  };

  const getUnreadByCategory = (category: Notification['category']) => {
    return userNotifications.filter(n => n.category === category && !n.isRead).length;
  };

  return {
    notifications: userNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationsByCategory,
    getUnreadByCategory
  };
};