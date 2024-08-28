// src/hooks/useAccessRequests.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessRequests } from '../redux/slices/accessRequestSlice';
import { RootState } from '../redux/store';
import * as Realm from 'realm-web';

export function useAccessRequests() {
  const dispatch = useDispatch();
  const accessRequests = useSelector((state: RootState) => state.accessRequest.accessRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/access_request_api');
      if (!response.ok) {
        throw new Error('Failed to fetch access requests');
      }
      const accessRequestData = await response.json();

      // Convert string IDs to Realm.BSON.ObjectId and dates to Date objects
      const formattedAccessRequests = accessRequestData.map((request: any) => ({
        ...request,
        _id: new Realm.BSON.ObjectId(request._id),
        createdAt: new Date(request.createdAt)
      }));

      dispatch(setAccessRequests(formattedAccessRequests));
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch access requests", err);
      setError("Failed to fetch access requests");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAccessRequests();
  }, [fetchAccessRequests]);

  return { accessRequests, loading, error, refetch: fetchAccessRequests };
}