// src/hooks/useReclamations.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReclamations } from '@/redux/slices/reclamationSlice';
import { RootState } from '@/redux/store';
import { Reclamation } from '@/types/reclamation';
import { AppUser } from '@/types/appUser';
import * as Realm from 'realm-web';

export function useReclamations() {
  const dispatch = useDispatch();
  const reclamations = useSelector((state: RootState) => state.reclamation.reclamations);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [reclamationResponse, userResponse] = await Promise.all([
        fetch('/api/reclamation_api'),
        fetch('/api/appuser_api')
      ]);

      if (!reclamationResponse.ok || !userResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const reclamationData = await reclamationResponse.json();
      const userData = await userResponse.json();

      // Convert string IDs to Realm.BSON.ObjectId
      const formattedReclamations = reclamationData.map((rec: any) => ({
        ...rec,
        _id: new Realm.BSON.ObjectId(rec._id),
        userId: rec.userId ? new Realm.BSON.ObjectId(rec.userId) : undefined,
        syndicId: rec.syndicId ? new Realm.BSON.ObjectId(rec.syndicId) : undefined,
        date: rec.date ? new Date(rec.date) : undefined
      }));

      const formattedUsers = userData.map((user: any) => ({
        ...user,
        _id: new Realm.BSON.ObjectId(user._id)
      }));

      dispatch(setReclamations(formattedReclamations));
      setAppUsers(formattedUsers);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetchReclamations = () => {
    setLoading(true);
    fetchData();
  };

  return { reclamations, appUsers, loading, error, refetchReclamations };
}