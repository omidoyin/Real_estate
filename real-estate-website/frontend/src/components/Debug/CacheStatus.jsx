"use client";

import { useState, useEffect } from 'react';
import { useCacheManager } from '../../hooks/useCache';
import { clearCache, clearExpiredCache } from '../../utils/cache';

/**
 * Debug component to show cache status and management controls
 * Only shows in development mode
 */
export default function CacheStatus() {
  const { stats, updateStats, invalidateByPattern } = useCacheManager();
  const [isVisible, setIsVisible] = useState(false);
  const [pattern, setPattern] = useState('');

  // Only show in development
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development');
  }, []);

  if (!isVisible) return null;

  const handleClearAll = () => {
    clearCache(true);
    updateStats();
  };

  const handleClearExpired = () => {
    clearExpiredCache();
    updateStats();
  };

  const handleInvalidatePattern = () => {
    if (pattern.trim()) {
      invalidateByPattern(pattern.trim());
      setPattern('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Cache Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="text-xs space-y-1 mb-3">
        <div>Memory: {stats.memory} items</div>
        <div>Storage: {stats.storage} items</div>
        <div>Total: {stats.total} items</div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-1">
          <button
            onClick={updateStats}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
          >
            Refresh
          </button>
          <button
            onClick={handleClearExpired}
            className="text-xs bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
          >
            Clear Expired
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
          >
            Clear All
          </button>
        </div>

        <div className="flex gap-1">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Pattern (e.g., land-*)"
            className="text-xs bg-gray-700 text-white px-2 py-1 rounded flex-1"
          />
          <button
            onClick={handleInvalidatePattern}
            disabled={!pattern.trim()}
            className="text-xs bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Toggle button to show/hide cache status
 */
export function CacheStatusToggle() {
  const [showStatus, setShowStatus] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {!showStatus && (
        <button
          onClick={() => setShowStatus(true)}
          className="fixed bottom-4 right-4 bg-gray-600 text-white p-2 rounded-full shadow-lg z-40 text-xs"
          title="Show Cache Status"
        >
          📊
        </button>
      )}
      {showStatus && <CacheStatus />}
    </>
  );
}
