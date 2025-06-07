import { invalidateCacheByPattern, removeCachedData } from './cache';

/**
 * Cache invalidation strategies for different data types
 */

/**
 * Invalidate land-related cache entries
 * @param {string} landId - Optional specific land ID
 */
export const invalidateLandCache = (landId = null) => {
  if (landId) {
    // Invalidate specific land
    removeCachedData(`land-details-${landId}`);
  }
  
  // Invalidate all land listings
  invalidateCacheByPattern('available-lands-*');
  invalidateCacheByPattern('land-search-*');
  invalidateCacheByPattern('land-filter-*');
  
  // Invalidate user-specific land data
  removeCachedData('my-lands');
  removeCachedData('favorite-lands');
  
  // Invalidate portfolio data that includes lands
  invalidateCacheByPattern('portfolio-*');
};

/**
 * Invalidate house-related cache entries
 * @param {string} houseId - Optional specific house ID
 */
export const invalidateHouseCache = (houseId = null) => {
  if (houseId) {
    // Invalidate specific house
    removeCachedData(`house-details-${houseId}`);
  }
  
  // Invalidate all house listings
  invalidateCacheByPattern('available-houses-*');
  invalidateCacheByPattern('house-search-*');
  invalidateCacheByPattern('house-filter-*');
  
  // Invalidate user-specific house data
  removeCachedData('my-houses');
  removeCachedData('favorite-houses');
  
  // Invalidate portfolio data that includes houses
  invalidateCacheByPattern('portfolio-*');
};

/**
 * Invalidate apartment-related cache entries
 * @param {string} apartmentId - Optional specific apartment ID
 */
export const invalidateApartmentCache = (apartmentId = null) => {
  if (apartmentId) {
    // Invalidate specific apartment
    removeCachedData(`apartment-details-${apartmentId}`);
  }
  
  // Invalidate all apartment listings
  invalidateCacheByPattern('available-apartments-*');
  invalidateCacheByPattern('apartment-search-*');
  invalidateCacheByPattern('apartment-filter-*');
  
  // Invalidate user-specific apartment data
  removeCachedData('my-apartments');
  removeCachedData('favorite-apartments');
  
  // Invalidate portfolio data that includes apartments
  invalidateCacheByPattern('portfolio-*');
};

/**
 * Invalidate service-related cache entries
 * @param {string} serviceId - Optional specific service ID
 */
export const invalidateServiceCache = (serviceId = null) => {
  if (serviceId) {
    // Invalidate specific service
    removeCachedData(`service-details-${serviceId}`);
  }
  
  // Invalidate all service listings
  invalidateCacheByPattern('all-services-*');
  invalidateCacheByPattern('*-services-*');
  
  // Invalidate user-specific service data
  removeCachedData('my-services');
  
  // Invalidate portfolio data that includes services
  invalidateCacheByPattern('portfolio-*');
};

/**
 * Invalidate user-specific cache entries
 */
export const invalidateUserCache = () => {
  // User's properties
  removeCachedData('my-lands');
  removeCachedData('my-houses');
  removeCachedData('my-apartments');
  
  // User's favorites
  removeCachedData('favorite-lands');
  removeCachedData('favorite-houses');
  removeCachedData('favorite-apartments');
  
  // User's services
  removeCachedData('my-services');
  
  // User's portfolio
  invalidateCacheByPattern('portfolio-*');
  
  // Payment history
  removeCachedData('payment-history');
};

/**
 * Invalidate all property-related cache entries
 */
export const invalidateAllPropertyCache = () => {
  invalidateLandCache();
  invalidateHouseCache();
  invalidateApartmentCache();
};

/**
 * Invalidate cache when favorites are updated
 * @param {string} type - Type of property (land, house, apartment)
 * @param {string} id - Property ID
 */
export const invalidateFavoriteCache = (type, id) => {
  // Invalidate favorites list
  removeCachedData(`favorite-${type}s`);
  
  // Invalidate specific property details (might include favorite status)
  removeCachedData(`${type}-details-${id}`);
  
  // Invalidate portfolio data
  invalidateCacheByPattern('portfolio-*');
};

/**
 * Invalidate cache when purchases are made
 * @param {string} type - Type of property (land, house, apartment)
 * @param {string} id - Property ID
 */
export const invalidatePurchaseCache = (type, id) => {
  // Invalidate user's properties list
  removeCachedData(`my-${type}s`);
  
  // Invalidate specific property details (status might change)
  removeCachedData(`${type}-details-${id}`);
  
  // Invalidate property listings (availability might change)
  invalidateCacheByPattern(`available-${type}s-*`);
  
  // Invalidate portfolio data
  invalidateCacheByPattern('portfolio-*');
  
  // Invalidate payment history
  removeCachedData('payment-history');
};

/**
 * Smart cache invalidation based on action type
 * @param {string} action - Action type (add, edit, delete, favorite, purchase)
 * @param {string} type - Data type (land, house, apartment, service)
 * @param {string} id - Optional item ID
 */
export const smartCacheInvalidation = (action, type, id = null) => {
  switch (action) {
    case 'add':
    case 'edit':
    case 'delete':
      // Invalidate all cache for this type
      switch (type) {
        case 'land':
          invalidateLandCache(id);
          break;
        case 'house':
          invalidateHouseCache(id);
          break;
        case 'apartment':
          invalidateApartmentCache(id);
          break;
        case 'service':
          invalidateServiceCache(id);
          break;
      }
      break;
      
    case 'favorite':
      invalidateFavoriteCache(type, id);
      break;
      
    case 'purchase':
      invalidatePurchaseCache(type, id);
      break;
      
    case 'logout':
      invalidateUserCache();
      break;
      
    case 'login':
      // Clear user-specific cache to force fresh data
      invalidateUserCache();
      break;
      
    default:
      console.warn(`Unknown cache invalidation action: ${action}`);
  }
};

/**
 * Batch cache invalidation for multiple operations
 * @param {Array} operations - Array of {action, type, id} objects
 */
export const batchCacheInvalidation = (operations) => {
  operations.forEach(({ action, type, id }) => {
    smartCacheInvalidation(action, type, id);
  });
};

/**
 * Schedule cache invalidation for later
 * @param {Function} invalidationFn - Function to call for invalidation
 * @param {number} delay - Delay in milliseconds
 */
export const scheduleCacheInvalidation = (invalidationFn, delay = 1000) => {
  setTimeout(invalidationFn, delay);
};

/**
 * Cache warming strategies
 */
export const warmCache = {
  /**
   * Warm up property listings cache
   */
  async properties() {
    // This would be called with actual API functions
    // Example implementation would go here
    console.log('Warming property cache...');
  },
  
  /**
   * Warm up user-specific cache after login
   */
  async userData() {
    // This would be called with actual API functions
    // Example implementation would go here
    console.log('Warming user cache...');
  },
  
  /**
   * Warm up frequently accessed data
   */
  async popular() {
    // This would be called with actual API functions
    // Example implementation would go here
    console.log('Warming popular content cache...');
  }
};
