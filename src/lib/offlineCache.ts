// Offline caching utility for AgriVision
export const CACHE_KEYS = {
  NEWS: 'agrivision_news',
  MARKET_PRICES: 'agrivision_market',
  FARMER_DATA: 'agrivision_farmer',
  SOIL_RESULTS: 'agrivision_soil_results',
  CROP_ANALYSIS: 'agrivision_crop_analysis',
  LAST_SYNC: 'agrivision_last_sync',
};

export const offlineCache = {
  // Save data to localStorage
  set: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      return true;
    } catch (error) {
      console.error('Error saving to cache:', error);
      return false;
    }
  },

  // Get data from localStorage
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  // Check if cache is still valid (default 1 hour)
  isValid: (key: string, maxAge: number = 3600000) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return false;
      
      const parsed = JSON.parse(item);
      const age = Date.now() - parsed.timestamp;
      return age < maxAge;
    } catch (error) {
      return false;
    }
  },

  // Remove specific cache
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing cache:', error);
      return false;
    }
  },

  // Clear all app cache
  clearAll: () => {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  },

  // Get last sync time
  getLastSync: () => {
    const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return lastSync ? new Date(parseInt(lastSync)) : null;
  },

  // Update last sync time
  updateLastSync: () => {
    localStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
  },
};

// Check if user is online
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Network status hook helper
export const getNetworkStatus = () => {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
};
