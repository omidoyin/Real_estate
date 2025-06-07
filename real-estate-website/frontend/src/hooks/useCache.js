"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getCachedData, 
  setCachedData, 
  removeCachedData, 
  getCachedOrFetch,
  invalidateCacheByPattern,
  preloadCache,
  getCacheStats
} from '../utils/cache';

/**
 * Hook for managing cached data in components
 * @param {string} key - The cache key
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @param {Object} options - Cache options
 * @returns {Object} - Cache management object
 */
export const useCache = (key, fetchFn, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    persistent = false,
    autoFetch = true,
    dependencies = []
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch data function
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!key || !fetchFn) return;

    try {
      setLoading(true);
      setError(null);

      let result;
      if (forceRefresh) {
        // Remove from cache and fetch fresh
        removeCachedData(key);
        result = await fetchFn();
        setCachedData(key, result, ttl, persistent);
      } else {
        // Use cached or fetch
        result = await getCachedOrFetch(key, fetchFn, ttl, persistent);
      }

      setData(result);
      setLastFetched(Date.now());
    } catch (err) {
      setError(err);
      console.error('Error fetching cached data:', err);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl, persistent]);

  // Check if data exists in cache
  const isInCache = useCallback(() => {
    return getCachedData(key) !== null;
  }, [key]);

  // Invalidate cache for this key
  const invalidate = useCallback(() => {
    removeCachedData(key);
    setData(null);
    setLastFetched(null);
  }, [key]);

  // Preload data into cache
  const preload = useCallback(async () => {
    if (!key || !fetchFn) return;
    
    try {
      const result = await preloadCache(key, fetchFn, ttl, persistent);
      if (result) {
        setData(result);
        setLastFetched(Date.now());
      }
    } catch (err) {
      console.warn('Error preloading cache:', err);
    }
  }, [key, fetchFn, ttl, persistent]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    if (autoFetch) {
      // Check if data is already in cache
      const cachedData = getCachedData(key);
      if (cachedData) {
        setData(cachedData);
        setLastFetched(Date.now());
      } else {
        fetchData();
      }
    }
  }, [key, autoFetch, ...dependencies]);

  return {
    data,
    loading,
    error,
    lastFetched,
    isInCache: isInCache(),
    fetchData,
    refresh: () => fetchData(true),
    invalidate,
    preload
  };
};

/**
 * Hook for managing multiple cache entries
 * @param {Array} cacheConfigs - Array of cache configurations
 * @returns {Object} - Cache management object for multiple entries
 */
export const useMultiCache = (cacheConfigs = []) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all data
  const fetchAll = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setErrors({});

    const promises = cacheConfigs.map(async (config) => {
      const { key, fetchFn, ttl = 5 * 60 * 1000, persistent = false } = config;
      
      try {
        let result;
        if (forceRefresh) {
          removeCachedData(key);
          result = await fetchFn();
          setCachedData(key, result, ttl, persistent);
        } else {
          result = await getCachedOrFetch(key, fetchFn, ttl, persistent);
        }
        return { key, data: result, error: null };
      } catch (error) {
        return { key, data: null, error };
      }
    });

    const results = await Promise.all(promises);
    
    const newErrors = {};
    results.forEach(({ key, error }) => {
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setLoading(false);

    return results;
  }, [cacheConfigs]);

  // Invalidate all caches
  const invalidateAll = useCallback(() => {
    cacheConfigs.forEach(({ key }) => {
      removeCachedData(key);
    });
  }, [cacheConfigs]);

  // Preload all caches
  const preloadAll = useCallback(async () => {
    const promises = cacheConfigs.map(({ key, fetchFn, ttl = 5 * 60 * 1000, persistent = false }) => 
      preloadCache(key, fetchFn, ttl, persistent)
    );
    
    return Promise.all(promises);
  }, [cacheConfigs]);

  return {
    loading,
    errors,
    fetchAll,
    refreshAll: () => fetchAll(true),
    invalidateAll,
    preloadAll
  };
};

/**
 * Hook for cache statistics and management
 * @returns {Object} - Cache statistics and management functions
 */
export const useCacheManager = () => {
  const [stats, setStats] = useState({ memory: 0, storage: 0, total: 0 });

  // Update stats
  const updateStats = useCallback(() => {
    setStats(getCacheStats());
  }, []);

  // Invalidate by pattern
  const invalidateByPattern = useCallback((pattern) => {
    invalidateCacheByPattern(pattern);
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    updateStats();
    
    // Update stats periodically
    const interval = setInterval(updateStats, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [updateStats]);

  return {
    stats,
    updateStats,
    invalidateByPattern
  };
};

/**
 * Hook for prefetching data based on user behavior
 * @param {Array} prefetchConfigs - Array of prefetch configurations
 * @returns {Object} - Prefetch management object
 */
export const usePrefetch = (prefetchConfigs = []) => {
  const [prefetched, setPrefetched] = useState(new Set());

  const prefetch = useCallback(async (configKey) => {
    const config = prefetchConfigs.find(c => c.key === configKey);
    if (!config || prefetched.has(configKey)) return;

    try {
      await preloadCache(
        config.cacheKey, 
        config.fetchFn, 
        config.ttl || 5 * 60 * 1000, 
        config.persistent || false
      );
      setPrefetched(prev => new Set([...prev, configKey]));
    } catch (error) {
      console.warn('Error prefetching data:', error);
    }
  }, [prefetchConfigs, prefetched]);

  const prefetchAll = useCallback(async () => {
    const promises = prefetchConfigs
      .filter(config => !prefetched.has(config.key))
      .map(config => prefetch(config.key));
    
    await Promise.all(promises);
  }, [prefetchConfigs, prefetched, prefetch]);

  return {
    prefetch,
    prefetchAll,
    prefetched: Array.from(prefetched)
  };
};
