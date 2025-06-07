// Enhanced cache with both memory and localStorage support
const memoryCache = new Map();
const CACHE_PREFIX = "real_estate_cache_";
const MAX_CACHE_SIZE = 100; // Maximum number of items in memory cache
const STORAGE_CACHE_KEY = "real_estate_storage_cache";

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  const memorySize = memoryCache.size;
  const storageSize = getStorageCacheSize();
  return {
    memory: memorySize,
    storage: storageSize,
    total: memorySize + storageSize,
  };
};

/**
 * Get storage cache size
 */
const getStorageCacheSize = () => {
  if (typeof window === "undefined") return 0;
  try {
    const storageCache = JSON.parse(
      localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
    );
    return Object.keys(storageCache).length;
  } catch {
    return 0;
  }
};

/**
 * Get a value from the cache (checks memory first, then localStorage)
 * @param {string} key - The cache key
 * @returns {any|null} - The cached value or null if not found or expired
 */
export const getCachedData = (key) => {
  if (!key) return null;

  // Check memory cache first
  const memoryItem = memoryCache.get(key);
  if (memoryItem) {
    // Check if item has expired
    if (memoryItem.expiry && memoryItem.expiry < Date.now()) {
      memoryCache.delete(key);
    } else {
      // Update access time for LRU
      memoryItem.lastAccessed = Date.now();
      return memoryItem.value;
    }
  }

  // Check localStorage cache
  if (typeof window !== "undefined") {
    try {
      const storageCache = JSON.parse(
        localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
      );
      const storageItem = storageCache[key];

      if (storageItem) {
        // Check if item has expired
        if (storageItem.expiry && storageItem.expiry < Date.now()) {
          delete storageCache[key];
          localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(storageCache));
        } else {
          // Move to memory cache for faster access
          memoryCache.set(key, {
            value: storageItem.value,
            expiry: storageItem.expiry,
            lastAccessed: Date.now(),
            persistent: storageItem.persistent,
          });
          return storageItem.value;
        }
      }
    } catch (error) {
      console.warn("Error reading from localStorage cache:", error);
    }
  }

  return null;
};

/**
 * Manage cache size by removing least recently used items
 */
const manageCacheSize = () => {
  if (memoryCache.size <= MAX_CACHE_SIZE) return;

  // Convert to array and sort by lastAccessed
  const entries = Array.from(memoryCache.entries())
    .filter(([, item]) => !item.persistent) // Don't remove persistent items
    .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

  // Remove oldest items until we're under the limit
  const itemsToRemove = entries.slice(0, memoryCache.size - MAX_CACHE_SIZE);
  itemsToRemove.forEach(([key]) => memoryCache.delete(key));
};

/**
 * Set a value in the cache
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {boolean} persistent - Whether to store in localStorage for persistence across sessions
 */
export const setCachedData = (
  key,
  value,
  ttl = 5 * 60 * 1000,
  persistent = false
) => {
  if (!key) return;

  const expiry = ttl > 0 ? Date.now() + ttl : null;
  const cacheItem = {
    value,
    expiry,
    lastAccessed: Date.now(),
    persistent,
  };

  // Always store in memory cache
  memoryCache.set(key, cacheItem);
  manageCacheSize();

  // Store in localStorage if persistent and browser supports it
  if (persistent && typeof window !== "undefined") {
    try {
      const storageCache = JSON.parse(
        localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
      );
      storageCache[key] = cacheItem;
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(storageCache));
    } catch (error) {
      console.warn("Error writing to localStorage cache:", error);
    }
  }
};

/**
 * Remove a value from the cache
 * @param {string} key - The cache key
 */
export const removeCachedData = (key) => {
  if (!key) return;

  // Remove from memory cache
  memoryCache.delete(key);

  // Remove from localStorage cache
  if (typeof window !== "undefined") {
    try {
      const storageCache = JSON.parse(
        localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
      );
      delete storageCache[key];
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(storageCache));
    } catch (error) {
      console.warn("Error removing from localStorage cache:", error);
    }
  }
};

/**
 * Clear all cached data
 * @param {boolean} includeStorage - Whether to clear localStorage cache as well
 */
export const clearCache = (includeStorage = true) => {
  memoryCache.clear();

  if (includeStorage && typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_CACHE_KEY);
    } catch (error) {
      console.warn("Error clearing localStorage cache:", error);
    }
  }
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = () => {
  const now = Date.now();

  // Clear expired memory cache entries
  for (const [key, item] of memoryCache.entries()) {
    if (item.expiry && item.expiry < now) {
      memoryCache.delete(key);
    }
  }

  // Clear expired localStorage cache entries
  if (typeof window !== "undefined") {
    try {
      const storageCache = JSON.parse(
        localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
      );
      let hasChanges = false;

      for (const [key, item] of Object.entries(storageCache)) {
        if (item.expiry && item.expiry < now) {
          delete storageCache[key];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(storageCache));
      }
    } catch (error) {
      console.warn("Error clearing expired localStorage cache:", error);
    }
  }
};

/**
 * Get a cached API response or fetch it if not cached
 * @param {string} key - The cache key
 * @param {Function} fetchFn - The function to fetch data if not cached
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns {Promise<any>} - The cached or fetched data
 */
export const getCachedOrFetch = async (
  key,
  fetchFn,
  ttl = 5 * 60 * 1000,
  persistent = false
) => {
  // Try to get from cache first
  const cachedData = getCachedData(key);
  if (cachedData !== null) {
    return cachedData;
  }

  // If not in cache, fetch it
  try {
    const data = await fetchFn();
    setCachedData(key, data, ttl, persistent);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Invalidate cache entries by pattern
 * @param {string} pattern - Pattern to match cache keys (supports wildcards with *)
 */
export const invalidateCacheByPattern = (pattern) => {
  const regex = new RegExp(pattern.replace(/\*/g, ".*"));

  // Invalidate memory cache
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }

  // Invalidate localStorage cache
  if (typeof window !== "undefined") {
    try {
      const storageCache = JSON.parse(
        localStorage.getItem(STORAGE_CACHE_KEY) || "{}"
      );
      let hasChanges = false;

      for (const key of Object.keys(storageCache)) {
        if (regex.test(key)) {
          delete storageCache[key];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(storageCache));
      }
    } catch (error) {
      console.warn("Error invalidating localStorage cache by pattern:", error);
    }
  }
};

/**
 * Preload data into cache
 * @param {string} key - The cache key
 * @param {Function} fetchFn - The function to fetch data
 * @param {number} ttl - Time to live in milliseconds
 * @param {boolean} persistent - Whether to store in localStorage
 */
export const preloadCache = async (
  key,
  fetchFn,
  ttl = 5 * 60 * 1000,
  persistent = false
) => {
  try {
    const data = await fetchFn();
    setCachedData(key, data, ttl, persistent);
    return data;
  } catch (error) {
    console.warn("Error preloading cache:", error);
    return null;
  }
};

// Initialize cache management
if (typeof window !== "undefined") {
  // Clear expired cache entries on page load
  clearExpiredCache();

  // Set up periodic cleanup (every 5 minutes)
  setInterval(clearExpiredCache, 5 * 60 * 1000);

  // Clear only memory cache when tab is closed (keep localStorage for persistence)
  window.addEventListener("beforeunload", () => {
    clearCache(false); // Don't clear localStorage
  });

  // Clear expired cache when page becomes visible again
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      clearExpiredCache();
    }
  });
}
