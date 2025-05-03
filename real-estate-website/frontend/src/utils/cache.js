// Simple in-memory cache with expiration
const cache = new Map();

/**
 * Get a value from the cache
 * @param {string} key - The cache key
 * @returns {any|null} - The cached value or null if not found or expired
 */
export const getCachedData = (key) => {
  if (!key) return null;
  
  const item = cache.get(key);
  if (!item) return null;
  
  // Check if item has expired
  if (item.expiry && item.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }
  
  return item.value;
};

/**
 * Set a value in the cache
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export const setCachedData = (key, value, ttl = 5 * 60 * 1000) => {
  if (!key) return;
  
  const expiry = ttl > 0 ? Date.now() + ttl : null;
  cache.set(key, { value, expiry });
};

/**
 * Remove a value from the cache
 * @param {string} key - The cache key
 */
export const removeCachedData = (key) => {
  if (!key) return;
  cache.delete(key);
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Get a cached API response or fetch it if not cached
 * @param {string} key - The cache key
 * @param {Function} fetchFn - The function to fetch data if not cached
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} - The cached or fetched data
 */
export const getCachedOrFetch = async (key, fetchFn, ttl = 5 * 60 * 1000) => {
  // Try to get from cache first
  const cachedData = getCachedData(key);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // If not in cache, fetch it
  try {
    const data = await fetchFn();
    setCachedData(key, data, ttl);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Add event listener to clear cache when tab is closed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearCache();
  });
}
