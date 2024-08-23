// src/hooks/useSponsorships.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSponsorships } from '../redux/slices/sponsorshipSlice';
import { RootState } from '../redux/store';
import * as Realm from 'realm-web';

export function useSponsorships() {
  const dispatch = useDispatch();
  const sponsorships = useSelector((state: RootState) => state.sponsorship.sponsorships);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsorships = useCallback(async () => {
    try {
      const response = await fetch('/api/sponsorship_api');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsorships');
      }
      const sponsorshipData = await response.json();

      // Convert string IDs to Realm.BSON.ObjectId and dates to Date objects
      const formattedSponsorships = sponsorshipData.map((sponsorship: any) => ({
        ...sponsorship,
        _id: new Realm.BSON.ObjectId(sponsorship._id),
        userId: new Realm.BSON.ObjectId(sponsorship.userId),
        createdAt: new Date(sponsorship.createdAt)
      }));

      dispatch(setSponsorships(formattedSponsorships));
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch sponsorships", err);
      setError("Failed to fetch sponsorships");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSponsorships();
  }, [fetchSponsorships]);

  return { sponsorships, loading, error, refetch: fetchSponsorships };
}