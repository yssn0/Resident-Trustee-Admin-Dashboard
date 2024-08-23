import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '@/redux/slices/notificationSlice';
import { RootState } from '@/redux/store';

export function useNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notification_api');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const notificationData = await response.json();
      dispatch(setNotifications(notificationData));
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setError("Failed to fetch notifications");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications };
}