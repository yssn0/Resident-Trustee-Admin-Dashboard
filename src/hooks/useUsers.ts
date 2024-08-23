// src/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppUsers } from '@/redux/slices/appUserSlice';
import { RootState } from '@/redux/store';
import * as Realm from 'realm-web';

export function useUsers() {
  const dispatch = useDispatch();
  const appUsers = useSelector((state: RootState) => state.appUser.appUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/appuser_api');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const userData = await response.json();

      // Convert string IDs to Realm.BSON.ObjectId
      const formattedUsers = userData.map((user: any) => ({
        ...user,
        _id: new Realm.BSON.ObjectId(user._id)
      }));

      dispatch(setAppUsers(formattedUsers));
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { appUsers, loading, error, refetch: fetchUsers };
}