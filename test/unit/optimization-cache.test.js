/**
 * Unit Tests for Optimization Cache
 * Tests the extracted caching functionality
 */

const { OptimizationCache } = require('../../src/core/optimization-cache');

describe('OptimizationCache', () => {
  let cache;

  beforeEach(() => {
    cache = new OptimizationCache();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with default configuration', () => {
      expect(cache.maxSize).toBe(1000);
      expect(cache.minSavingsThreshold).toBe(30);
      expect(cache.ttl).toBe(24 * 60 * 60 * 1000); // 24 hours
      expect(cache.hitCount).toBe(0);
      expect(cache.missCount).toBe(0);
      expect(cache.evictionCount).toBe(0);
    });

    test('should accept custom configuration', () => {
      const customCache = new OptimizationCache({
        maxSize: 500,
        minSavingsThreshold: 50,
        ttl: 1000
      });

      expect(customCache.maxSize).toBe(500);
      expect(customCache.minSavingsThreshold).toBe(50);
      expect(customCache.ttl).toBe(1000);
    });

    test('should provide configuration accessor', () => {
      const config = cache.getConfig();

      expect(config).toEqual({
        maxSize: 1000,
        minSavingsThreshold: 30,
        ttl: 24 * 60 * 60 * 1000
      });
    });
  });

  describe('Cache Key Generation', () => {
    test('should generate consistent cache keys', () => {
      const requirements = {
        explicit: ['req1', 'req2'],
        implicit: ['impl1'],
        domain: 'ecommerce',
        complexity: 'medium'
      };
      const userContext = {
        userType: 'entrepreneur',
        technicalLevel: 'intermediate',
        scale: 'medium'
      };

      const key1 = cache.generateCacheKey(requirements, userContext);
      const key2 = cache.generateCacheKey(requirements, userContext);

      expect(key1).toBe(key2);
      expect(key1).toMatch(/^opt-[a-z0-9]+-[a-z0-9]+$/);
    });

    test('should generate different keys for different requirements', () => {
      const requirements1 = { domain: 'ecommerce', explicit: ['req1'] };
      const requirements2 = { domain: 'blog', explicit: ['req1'] };
      const userContext = { userType: 'personal' };

      const key1 = cache.generateCacheKey(requirements1, userContext);
      const key2 = cache.generateCacheKey(requirements2, userContext);

      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different user contexts', () => {
      const requirements = { domain: 'ecommerce' };
      const userContext1 = { userType: 'personal' };
      const userContext2 = { userType: 'business' };

      const key1 = cache.generateCacheKey(requirements, userContext1);
      const key2 = cache.generateCacheKey(requirements, userContext2);

      expect(key1).not.toBe(key2);
    });

    test('should handle missing properties with defaults', () => {
      const requirements = {};
      const userContext = {};

      const key = cache.generateCacheKey(requirements, userContext);

      expect(key).toBeDefined();
      expect(typeof key).toBe('string');
    });
  });

  describe('Cache Operations', () => {
    const mockRequirements = {
      explicit: ['req1', 'req2'],
      domain: 'ecommerce'
    };
    const mockUserContext = {
      userType: 'entrepreneur',
      scale: 'medium'
    };
    const mockResult = {
      plan: { type: 'optimized' },
      tokenSavings: { saved: 500, percentage: 40 },
      processingTime: 100
    };

    test('should store and retrieve cached results', () => {
      const stored = cache.set(mockRequirements, mockUserContext, mockResult);
      expect(stored).toBe(true);

      const retrieved = cache.get(mockRequirements, mockUserContext);
      expect(retrieved).toEqual(mockResult);
    });

    test('should return null for cache miss', () => {
      const result = cache.get(mockRequirements, mockUserContext);
      expect(result).toBeNull();
      expect(cache.missCount).toBe(1);
    });

    test('should track hit count correctly', () => {
      cache.set(mockRequirements, mockUserContext, mockResult);
      
      cache.get(mockRequirements, mockUserContext);
      cache.get(mockRequirements, mockUserContext);
      
      expect(cache.hitCount).toBe(2);
    });

    test('should check existence with has method', () => {
      expect(cache.has(mockRequirements, mockUserContext)).toBe(false);
      
      cache.set(mockRequirements, mockUserContext, mockResult);
      
      expect(cache.has(mockRequirements, mockUserContext)).toBe(true);
    });

    test('should not cache results below savings threshold', () => {
      const lowSavingsResult = {
        ...mockResult,
        tokenSavings: { saved: 50, percentage: 20 } // Below 30% threshold
      };

      const stored = cache.set(mockRequirements, mockUserContext, lowSavingsResult);
      expect(stored).toBe(false);
      
      const retrieved = cache.get(mockRequirements, mockUserContext);
      expect(retrieved).toBeNull();
    });

    test('should not cache results without token savings', () => {
      const noSavingsResult = {
        plan: { type: 'basic' }
        // No tokenSavings property
      };

      const stored = cache.set(mockRequirements, mockUserContext, noSavingsResult);
      expect(stored).toBe(false);
    });
  });

  describe('TTL (Time To Live)', () => {
    test('should respect TTL for cache entries', async () => {
      const shortTtlCache = new OptimizationCache({ ttl: 100 }); // 100ms TTL
      
      const requirements = { domain: 'test' };
      const userContext = { userType: 'test' };
      const result = {
        tokenSavings: { saved: 200, percentage: 50 }
      };

      shortTtlCache.set(requirements, userContext, result);
      expect(shortTtlCache.get(requirements, userContext)).toEqual(result);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(shortTtlCache.get(requirements, userContext)).toBeNull();
    });

    test('should update last accessed time on cache hit', () => {
      const requirements = { domain: 'test' };
      const userContext = { userType: 'test' };
      const result = { tokenSavings: { saved: 200, percentage: 50 } };

      cache.set(requirements, userContext, result);
      
      const initialTime = Date.now();
      cache.get(requirements, userContext);
      
      // Check that lastAccessed was updated (approximately)
      const key = cache.generateCacheKey(requirements, userContext);
      const entry = cache.cache.get(key);
      expect(entry.lastAccessed).toBeGreaterThanOrEqual(initialTime);
    });
  });

  describe('Size Management and LRU Eviction', () => {
    test('should enforce maximum cache size', () => {
      const smallCache = new OptimizationCache({ maxSize: 2 });
      
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      
      // Fill cache to capacity
      smallCache.set({ domain: 'test1' }, { userType: 'user1' }, result);
      smallCache.set({ domain: 'test2' }, { userType: 'user2' }, result);
      expect(smallCache.cache.size).toBe(2);
      
      // Add one more - should evict LRU
      smallCache.set({ domain: 'test3' }, { userType: 'user3' }, result);
      expect(smallCache.cache.size).toBe(2);
      expect(smallCache.evictionCount).toBe(1);
    });

    test('should evict least recently used entries', async () => {
      const smallCache = new OptimizationCache({ maxSize: 2 });
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      
      // Add two entries
      smallCache.set({ domain: 'test1' }, { userType: 'user1' }, result);
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      smallCache.set({ domain: 'test2' }, { userType: 'user2' }, result);
      
      // Access first entry to make it more recently used
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      smallCache.get({ domain: 'test1' }, { userType: 'user1' });
      
      // Add third entry - should evict test2 (LRU)
      smallCache.set({ domain: 'test3' }, { userType: 'user3' }, result);
      
      expect(smallCache.has({ domain: 'test1' }, { userType: 'user1' })).toBe(true);
      expect(smallCache.has({ domain: 'test3' }, { userType: 'user3' })).toBe(true);
      expect(smallCache.cache.size).toBe(2);
    });
  });

  describe('Statistics and Monitoring', () => {
    test('should provide comprehensive statistics', () => {
      const requirements = { domain: 'test' };
      const userContext = { userType: 'test' };
      const result = { tokenSavings: { saved: 200, percentage: 50 } };

      // Perform some operations
      cache.get(requirements, userContext); // Miss
      cache.set(requirements, userContext, result);
      cache.get(requirements, userContext); // Hit
      cache.get(requirements, userContext); // Hit

      const stats = cache.getStats();

      expect(stats.size).toBe(1);
      expect(stats.hitCount).toBe(2);
      expect(stats.missCount).toBe(1);
      expect(stats.totalRequests).toBe(3);
      expect(stats.hitRatio).toBeCloseTo(66.67, 1);
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    test('should estimate memory usage', () => {
      const requirements = { domain: 'test' };
      const userContext = { userType: 'test' };
      const result = {
        plan: { steps: ['step1', 'step2'] },
        tokenSavings: { saved: 200, percentage: 50 }
      };

      cache.set(requirements, userContext, result);
      
      const stats = cache.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
      expect(typeof stats.memoryUsage).toBe('number');
    });
  });

  describe('Cache Management', () => {
    test('should clear all cache entries', () => {
      const requirements = { domain: 'test' };
      const userContext = { userType: 'test' };
      const result = { tokenSavings: { saved: 200, percentage: 50 } };

      cache.set(requirements, userContext, result);
      expect(cache.cache.size).toBe(1);

      cache.clear();

      expect(cache.cache.size).toBe(0);
      expect(cache.hitCount).toBe(0);
      expect(cache.missCount).toBe(0);
      expect(cache.evictionCount).toBe(0);
    });

    test('should update configuration', () => {
      cache.updateConfig({
        maxSize: 500,
        minSavingsThreshold: 40,
        ttl: 1000
      });

      const config = cache.getConfig();
      expect(config.maxSize).toBe(500);
      expect(config.minSavingsThreshold).toBe(40);
      expect(config.ttl).toBe(1000);
    });

    test('should enforce new max size when updated', () => {
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      
      // Add 3 entries
      cache.set({ domain: 'test1' }, { userType: 'user1' }, result);
      cache.set({ domain: 'test2' }, { userType: 'user2' }, result);
      cache.set({ domain: 'test3' }, { userType: 'user3' }, result);
      
      expect(cache.cache.size).toBe(3);
      
      // Reduce max size to 2
      cache.updateConfig({ maxSize: 2 });
      
      expect(cache.cache.size).toBe(2);
      expect(cache.evictionCount).toBeGreaterThan(0);
    });

    test('should cleanup expired entries', async () => {
      const shortTtlCache = new OptimizationCache({ ttl: 50 });
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      
      shortTtlCache.set({ domain: 'test1' }, { userType: 'user1' }, result);
      shortTtlCache.set({ domain: 'test2' }, { userType: 'user2' }, result);
      
      expect(shortTtlCache.cache.size).toBe(2);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const removed = shortTtlCache.cleanupExpired();
      expect(removed).toBe(2);
      expect(shortTtlCache.cache.size).toBe(0);
    });
  });

  describe('Query and Filter Operations', () => {
    test('should get entries by criteria', () => {
      const result1 = { tokenSavings: { saved: 200, percentage: 40 } };
      const result2 = { tokenSavings: { saved: 300, percentage: 60 } };
      
      cache.set({ domain: 'ecommerce' }, { userType: 'business' }, result1);
      cache.set({ domain: 'blog' }, { userType: 'personal' }, result2);
      
      const highSavingsEntries = cache.getEntriesByCriteria({ minSavings: 50 });
      expect(highSavingsEntries).toHaveLength(1);
      expect(highSavingsEntries[0].savingsPercentage).toBe(60);
      
      const allEntries = cache.getEntriesByCriteria({});
      expect(allEntries).toHaveLength(2);
      
      // Should be sorted by savings percentage (descending)
      expect(allEntries[0].savingsPercentage).toBe(60);
      expect(allEntries[1].savingsPercentage).toBe(40);
    });

    test('should filter entries by age', () => {
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      cache.set({ domain: 'test' }, { userType: 'test' }, result);
      
      // Test with large maxAge - should include the entry
      const recentEntries = cache.getEntriesByCriteria({ maxAge: 10000 });
      expect(recentEntries).toHaveLength(1);
      
      // Test that age field is properly calculated
      const entries = cache.getEntriesByCriteria({});
      expect(entries[0]).toHaveProperty('age');
      expect(entries[0].age).toBeGreaterThanOrEqual(0);
      expect(typeof entries[0].age).toBe('number');
    });
  });

  describe('Import/Export Operations', () => {
    test('should export cache data', () => {
      const result = { tokenSavings: { saved: 200, percentage: 50 } };
      cache.set({ domain: 'test' }, { userType: 'test' }, result);
      
      const exported = cache.export();
      
      expect(exported).toHaveLength(1);
      expect(exported[0]).toHaveProperty('key');
      expect(exported[0]).toHaveProperty('result');
      expect(exported[0]).toHaveProperty('timestamp');
      expect(exported[0]).toHaveProperty('savingsPercentage');
    });

    test('should import cache data', () => {
      const exportData = [{
        key: 'opt-test-key',
        result: { tokenSavings: { saved: 200, percentage: 50 } },
        timestamp: Date.now(),
        lastAccessed: Date.now(),
        savingsPercentage: 50
      }];
      
      const imported = cache.import(exportData);
      
      expect(imported).toBe(1);
      expect(cache.cache.size).toBe(1);
      expect(cache.cache.has('opt-test-key')).toBe(true);
    });

    test('should skip expired entries during import', () => {
      const exportData = [{
        key: 'opt-expired-key',
        result: { tokenSavings: { saved: 200, percentage: 50 } },
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago (expired)
        savingsPercentage: 50
      }];
      
      const imported = cache.import(exportData);
      
      expect(imported).toBe(0);
      expect(cache.cache.size).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle hash object errors gracefully', () => {
      const circular = {};
      circular.self = circular;
      
      const hash = cache.hashObject(circular);
      
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    test('should handle memory estimation errors', () => {
      // Create cache with problematic data
      cache.cache.set('test-key', {
        result: { circular: null },
        timestamp: Date.now(),
        lastAccessed: Date.now(),
        savingsPercentage: 50
      });
      
      // Add circular reference
      const entry = cache.cache.get('test-key');
      entry.result.circular = entry.result;
      
      const stats = cache.getStats();
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    test('should handle malformed import data', () => {
      const malformedData = [
        { key: 'test1' }, // Missing required fields
        { result: 'test2' }, // Missing key
        null, // Null entry
        undefined, // Undefined entry
        'invalid' // Wrong type
      ];
      
      const imported = cache.import(malformedData);
      expect(imported).toBe(0);
      expect(cache.cache.size).toBe(0);
    });
  });
});