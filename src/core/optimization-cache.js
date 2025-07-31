/**
 * Optimization Cache
 * Manages caching of optimization results to avoid redundant processing
 */

class OptimizationCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.minSavingsThreshold = options.minSavingsThreshold || 30; // Minimum percentage savings to cache
    this.ttl = options.ttl || 24 * 60 * 60 * 1000; // 24 hours default TTL
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;
  }

  /**
   * Generate cache key for optimization
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {string} Cache key
   */
  generateCacheKey(requirements, userContext) {
    const reqHash = this.hashObject({
      explicit: requirements.explicit?.length || 0,
      implicit: requirements.implicit?.length || 0,
      domain: requirements.domain || 'unknown',
      complexity: requirements.complexity || 'medium'
    });
    
    const contextHash = this.hashObject({
      userType: userContext.userType || 'general',
      technicalLevel: userContext.technicalLevel || 'beginner',
      scale: userContext.scale || 'medium'
    });
    
    return `opt-${reqHash}-${contextHash}`;
  }

  /**
   * Check if optimization result exists in cache
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {Object|null} Cached result or null
   */
  get(requirements, userContext) {
    const key = this.generateCacheKey(requirements, userContext);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }
    
    // Update access time for LRU
    entry.lastAccessed = Date.now();
    this.hitCount++;
    
    console.log('📋 Using cached optimization');
    return entry.result;
  }

  /**
   * Store optimization result in cache
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @param {Object} result - Optimization result
   */
  set(requirements, userContext, result) {
    // Only cache results with significant savings
    if (!result.tokenSavings || result.tokenSavings.percentage < this.minSavingsThreshold) {
      return false;
    }
    
    const key = this.generateCacheKey(requirements, userContext);
    
    // Enforce cache size limit
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
    
    const entry = {
      result: result,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      savingsPercentage: result.tokenSavings.percentage,
      key: key
    };
    
    this.cache.set(key, entry);
    console.log(`💾 Cached optimization (${result.tokenSavings.percentage}% savings)`);
    return true;
  }

  /**
   * Check if cache contains a key
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {boolean} Whether key exists in cache
   */
  has(requirements, userContext) {
    const key = this.generateCacheKey(requirements, userContext);
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Evict least recently used entry
   */
  evictLeastRecentlyUsed() {
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.evictionCount++;
    }
  }

  /**
   * Clear all cached results
   */
  clear() {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;
    console.log('🧹 Optimization cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const totalRequests = this.hitCount + this.missCount;
    const hitRatio = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      evictionCount: this.evictionCount,
      hitRatio: Math.round(hitRatio * 100) / 100,
      totalRequests: totalRequests,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimate memory usage of cache
   * @returns {number} Estimated memory usage in bytes
   */
  estimateMemoryUsage() {
    let totalSize = 0;
    
    for (const [key, entry] of this.cache) {
      try {
        const keySize = key.length * 2; // Rough estimate for string
        const entrySize = JSON.stringify(entry.result).length * 2;
        totalSize += keySize + entrySize + 64; // Extra for metadata
      } catch (error) {
        totalSize += 256; // Fallback estimate
      }
    }
    
    return totalSize;
  }

  /**
   * Get cached entries by criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Array} Matching cache entries
   */
  getEntriesByCriteria(criteria = {}) {
    const entries = [];
    
    for (const [key, entry] of this.cache) {
      let matches = true;
      
      if (criteria.minSavings && entry.savingsPercentage < criteria.minSavings) {
        matches = false;
      }
      
      if (criteria.maxAge && entry.age > criteria.maxAge) {
        matches = false;
      }
      
      if (criteria.domain && !key.includes(criteria.domain)) {
        matches = false;
      }
      
      if (matches) {
        entries.push({
          key,
          timestamp: entry.timestamp,
          lastAccessed: entry.lastAccessed,
          savingsPercentage: entry.savingsPercentage,
          age: Date.now() - entry.timestamp
        });
      }
    }
    
    return entries.sort((a, b) => b.savingsPercentage - a.savingsPercentage);
  }

  /**
   * Remove expired entries
   * @returns {number} Number of entries removed
   */
  cleanupExpired() {
    const beforeSize = this.cache.size;
    const now = Date.now();
    
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
    
    const removed = beforeSize - this.cache.size;
    if (removed > 0) {
      console.log(`🧹 Removed ${removed} expired cache entries`);
    }
    
    return removed;
  }

  /**
   * Update cache configuration
   * @param {Object} config - New configuration options
   */
  updateConfig(config) {
    if (config.maxSize !== undefined) {
      this.maxSize = Math.max(1, config.maxSize);
      
      // Evict entries if over new limit
      while (this.cache.size > this.maxSize) {
        this.evictLeastRecentlyUsed();
      }
    }
    
    if (config.minSavingsThreshold !== undefined) {
      this.minSavingsThreshold = Math.max(0, config.minSavingsThreshold);
    }
    
    if (config.ttl !== undefined) {
      this.ttl = Math.max(0, config.ttl);
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      maxSize: this.maxSize,
      minSavingsThreshold: this.minSavingsThreshold,
      ttl: this.ttl
    };
  }

  /**
   * Export cache data
   * @returns {Array} Cache entries for export
   */
  export() {
    const entries = [];
    
    for (const [key, entry] of this.cache) {
      entries.push({
        key,
        result: entry.result,
        timestamp: entry.timestamp,
        lastAccessed: entry.lastAccessed,
        savingsPercentage: entry.savingsPercentage
      });
    }
    
    return entries;
  }

  /**
   * Import cache data
   * @param {Array} entries - Cache entries to import
   * @returns {number} Number of entries imported
   */
  import(entries) {
    let imported = 0;
    
    for (const entry of entries) {
      if (entry && entry.key && entry.result && entry.timestamp) {
        // Skip expired entries
        if (Date.now() - entry.timestamp <= this.ttl) {
          this.cache.set(entry.key, {
            result: entry.result,
            timestamp: entry.timestamp,
            lastAccessed: entry.lastAccessed || entry.timestamp,
            savingsPercentage: entry.savingsPercentage || 0,
            key: entry.key
          });
          imported++;
        }
      }
    }
    
    console.log(`📥 Imported ${imported} cache entries`);
    return imported;
  }

  /**
   * Hash object to create consistent keys
   * @param {Object} obj - Object to hash
   * @returns {string} Hash string
   */
  hashObject(obj) {
    try {
      const str = JSON.stringify(obj, Object.keys(obj).sort()); // Sort keys for consistency
      let hash = 0;
      
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(36);
    } catch (error) {
      console.warn('Error hashing object:', error);
      return Math.random().toString(36).substring(7);
    }
  }
}

module.exports = { OptimizationCache };