"use client";

import { useState, useEffect } from 'react';
import { offlineCache, isOnline } from '@/lib/offlineCache';

export function useOfflineCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  maxAge: number = 3600000 // 1 hour default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get from cache first
        const cachedData = offlineCache.get(key);
        const cacheValid = offlineCache.isValid(key, maxAge);

        if (cachedData && cacheValid) {
          setData(cachedData);
          setIsFromCache(true);
          setLoading(false);
        }

        // If online, fetch fresh data
        if (isOnline()) {
          const freshData = await fetcher();
          offlineCache.set(key, freshData);
          offlineCache.updateLastSync();
          setData(freshData);
          setIsFromCache(false);
          setError(null);
        } else if (!cachedData) {
          // Offline and no cache
          throw new Error('No internet connection and no cached data available');
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, maxAge]);

  const refresh = async () => {
    if (!isOnline()) {
      return;
    }

    setLoading(true);
    try {
      const freshData = await fetcher();
      offlineCache.set(key, freshData);
      offlineCache.updateLastSync();
      setData(freshData);
      setIsFromCache(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, isFromCache, refresh };
}
