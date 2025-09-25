
import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAsyncStorage } from './useAsyncStorage';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Someone liked your artwork "Cosmic Dreams"',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    userId: 'user1',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    type: 'purchase',
    title: 'NFT Sold!',
    message: 'Your NFT "Digital Sunset" was purchased for 2.5 ETH',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'user1',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    type: 'bid',
    title: 'New Bid',
    message: 'You received a bid of 1.8 ETH on "Abstract Vision"',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    userId: 'user1',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
  },
];

export function useNotifications() {
  const { storedValue: notifications, setValue: setStoredNotifications } = useAsyncStorage<Notification[]>('notifications', mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
    console.log('Unread notifications count:', count);
  }, [notifications]);

  const markAsRead = async (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    await setStoredNotifications(updatedNotifications);
    console.log('Notification marked as read:', notificationId);
  };

  const markAllAsRead = async () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    await setStoredNotifications(updatedNotifications);
    console.log('All notifications marked as read');
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedNotifications = [newNotification, ...notifications];
    await setStoredNotifications(updatedNotifications);
    console.log('New notification added:', newNotification);
  };

  const removeNotification = async (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    await setStoredNotifications(updatedNotifications);
    console.log('Notification removed:', notificationId);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };
}
