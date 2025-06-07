/**
 * Utility functions for safely handling and rendering data
 */

/**
 * Safely extract text from a feature object or string
 * @param {string|object} feature - Feature data
 * @returns {string} - Safe text representation
 */
export const safeFeatureText = (feature) => {
  if (typeof feature === 'string') {
    return feature;
  }
  
  if (typeof feature === 'object' && feature !== null) {
    return feature.name || feature.title || feature.text || 'Feature';
  }
  
  return 'Feature';
};

/**
 * Safely extract landmark information
 * @param {string|object} landmark - Landmark data
 * @returns {object} - Safe landmark object with name and distance
 */
export const safeLandmarkData = (landmark) => {
  if (typeof landmark === 'string') {
    return {
      name: landmark,
      distance: '',
      id: null
    };
  }
  
  if (typeof landmark === 'object' && landmark !== null) {
    return {
      name: landmark.name || 'Unknown Location',
      distance: landmark.distance || '',
      id: landmark._id || landmark.id || null
    };
  }
  
  return {
    name: 'Unknown Location',
    distance: '',
    id: null
  };
};

/**
 * Safely format price with currency
 * @param {number|string} price - Price value
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price string
 */
export const safeFormatPrice = (price, currency = '$') => {
  if (price === null || price === undefined || price === '') {
    return `${currency}0`;
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return `${currency}0`;
  }
  
  return `${currency}${numPrice.toLocaleString()}`;
};

/**
 * Safely get property status display text
 * @param {string} status - Property status
 * @returns {string} - Display-friendly status
 */
export const safePropertyStatus = (status) => {
  if (!status || typeof status !== 'string') {
    return 'Available';
  }
  
  const statusMap = {
    'available': 'Available',
    'Available': 'Available',
    'sold': 'Sold',
    'Sold': 'Sold',
    'reserved': 'Reserved',
    'Reserved': 'Reserved',
    'for-rent': 'For Rent',
    'For Rent': 'For Rent',
    'for_rent': 'For Rent',
    'rented': 'Rented',
    'Rented': 'Rented'
  };
  
  return statusMap[status] || status;
};

/**
 * Safely extract image URL
 * @param {string|array} images - Image data
 * @param {number} index - Index of image to get (default: 0)
 * @param {string} fallback - Fallback image URL
 * @returns {string} - Safe image URL
 */
export const safeImageUrl = (images, index = 0, fallback = '/placeholder.jpg') => {
  if (!images) {
    return fallback;
  }
  
  if (typeof images === 'string') {
    return images || fallback;
  }
  
  if (Array.isArray(images) && images.length > index) {
    return images[index] || fallback;
  }
  
  return fallback;
};

/**
 * Safely get property ID (handles both _id and id)
 * @param {object} property - Property object
 * @returns {string|null} - Property ID
 */
export const safePropertyId = (property) => {
  if (!property || typeof property !== 'object') {
    return null;
  }
  
  return property._id || property.id || null;
};

/**
 * Safely render array items with error boundaries
 * @param {array} items - Array of items to render
 * @param {function} renderFn - Function to render each item
 * @param {string} emptyMessage - Message when array is empty
 * @returns {JSX.Element|string} - Rendered content or empty message
 */
export const safeRenderArray = (items, renderFn, emptyMessage = 'No items available') => {
  if (!Array.isArray(items) || items.length === 0) {
    return emptyMessage;
  }
  
  try {
    return items.map((item, index) => {
      try {
        return renderFn(item, index);
      } catch (error) {
        console.warn(`Error rendering item at index ${index}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null items
  } catch (error) {
    console.error('Error rendering array:', error);
    return emptyMessage;
  }
};

/**
 * Safely get nested object property
 * @param {object} obj - Object to get property from
 * @param {string} path - Dot-separated path (e.g., 'user.profile.name')
 * @param {any} defaultValue - Default value if property doesn't exist
 * @returns {any} - Property value or default
 */
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
};

/**
 * Validate and sanitize property data
 * @param {object} property - Property object
 * @returns {object} - Sanitized property object
 */
export const sanitizePropertyData = (property) => {
  if (!property || typeof property !== 'object') {
    return {};
  }
  
  return {
    id: safePropertyId(property),
    title: property.title || 'Untitled Property',
    description: property.description || 'No description available',
    price: property.price || 0,
    location: property.location || 'Location not specified',
    size: property.size || 'Size not specified',
    status: safePropertyStatus(property.status),
    images: Array.isArray(property.images) ? property.images : [],
    features: Array.isArray(property.features) ? property.features : [],
    landmarks: Array.isArray(property.landmarks) ? property.landmarks : [],
    // Preserve other properties
    ...property
  };
};

/**
 * Format date safely
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const safeFormatDate = (date, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  if (!date) {
    return 'Date not available';
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Date not available';
  }
};

/**
 * Truncate text safely
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} - Truncated text
 */
export const safeTruncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};
