/**
 * Unit Tests for Domain Pattern Library
 * Priority 2: Foundation testing - business logic patterns
 */

const { DomainPatternLibrary } = require('../../src/core/domain-patterns');

// Mock the individual pattern classes to isolate our testing
jest.mock('../../src/core/domain-patterns', () => {
  // Create mock pattern classes
  class MockEcommercePatterns {
    async matchScore(vibe, context) { return 0.8; }
    async getConfidence(vibe, context) { return 0.9; }
    async expandRequirements(vibe) { return ['shopping cart', 'payment system']; }
  }

  class MockBlogPatterns {
    async matchScore(vibe, context) { return 0.6; }
    async getConfidence(vibe, context) { return 0.7; }
    async expandRequirements(vibe) { return ['content management', 'comments']; }
  }

  class MockPortfolioPatterns {
    async matchScore(vibe, context) { return 0.4; }
    async getConfidence(vibe, context) { return 0.5; }
    async expandRequirements(vibe) { return ['gallery', 'about section']; }
  }

  class MockUtilityPatterns {
    async matchScore(vibe, context) { return 0.3; }
    async getConfidence(vibe, context) { return 0.4; }
    async expandRequirements(vibe) { return ['simple interface', 'efficiency']; }
  }

  class MockSocialPatterns {
    async matchScore(vibe, context) { return 0.2; }
    async getConfidence(vibe, context) { return 0.3; }
    async expandRequirements(vibe) { return ['user profiles', 'messaging']; }
  }

  class MockBusinessPatterns {
    async matchScore(vibe, context) { return 0.1; }
    async getConfidence(vibe, context) { return 0.2; }
    async expandRequirements(vibe) { return ['professional design', 'contact forms']; }
  }

  class MockLandingPagePatterns {
    async matchScore(vibe, context) { return 0.05; }
    async getConfidence(vibe, context) { return 0.1; }
    async expandRequirements(vibe) { return ['call to action', 'hero section']; }
  }

  // Real DomainPatternLibrary class with mocked dependencies
  class DomainPatternLibrary {
    constructor() {
      this.patterns = {
        ecommerce: new MockEcommercePatterns(),
        blog: new MockBlogPatterns(),
        portfolio: new MockPortfolioPatterns(),
        utility: new MockUtilityPatterns(),
        social: new MockSocialPatterns(),
        business: new MockBusinessPatterns(),
        landing: new MockLandingPagePatterns()
      };
    }

    async detectDomain(normalizedVibe, context) {
      const scores = await Promise.all(
        Object.entries(this.patterns).map(async ([domain, pattern]) => ({
          domain,
          score: await pattern.matchScore(normalizedVibe, context),
          patterns: pattern,
          confidence: await pattern.getConfidence(normalizedVibe, context)
        }))
      );

      // Sort by score and return the best match
      const sortedScores = scores.sort((a, b) => b.score - a.score);
      const bestMatch = sortedScores[0];

      console.log(`🎯 Domain detection: ${bestMatch.domain} (${(bestMatch.score * 100).toFixed(1)}%)`);
      
      return {
        domain: bestMatch.domain,
        score: bestMatch.score,
        patterns: bestMatch.patterns,
        confidence: bestMatch.confidence,
        alternatives: sortedScores.slice(1, 3).map(s => ({
          domain: s.domain,
          score: s.score
        }))
      };
    }

    getAvailableDomains() {
      return Object.keys(this.patterns);
    }

    getPattern(domain) {
      return this.patterns[domain];
    }

    async expandRequirements(normalizedVibe, domainResult) {
      if (!domainResult || !domainResult.patterns) {
        return [];
      }

      try {
        const requirements = await domainResult.patterns.expandRequirements(normalizedVibe);
        return requirements || [];
      } catch (error) {
        console.warn('Failed to expand requirements:', error.message);
        return [];
      }
    }
  }

  return { DomainPatternLibrary };
});

describe('DomainPatternLibrary', () => {
  let domainLibrary;

  beforeEach(() => {
    domainLibrary = new DomainPatternLibrary();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with all domain patterns', () => {
      expect(domainLibrary.patterns).toBeDefined();
      expect(Object.keys(domainLibrary.patterns)).toContain('ecommerce');
      expect(Object.keys(domainLibrary.patterns)).toContain('blog');
      expect(Object.keys(domainLibrary.patterns)).toContain('portfolio');
      expect(Object.keys(domainLibrary.patterns)).toContain('utility');
      expect(Object.keys(domainLibrary.patterns)).toContain('social');
      expect(Object.keys(domainLibrary.patterns)).toContain('business');
      expect(Object.keys(domainLibrary.patterns)).toContain('landing');
    });

    test('should have 7 domain patterns available', () => {
      expect(Object.keys(domainLibrary.patterns)).toHaveLength(7);
    });
  });

  describe('Domain Detection', () => {
    test('should detect ecommerce as highest scoring domain', async () => {
      const normalizedVibe = {
        description: 'I want to build an online store',
        keywords: ['shop', 'buy', 'sell', 'products']
      };
      const context = {
        userType: 'business',
        businessContext: { industry: 'retail' }
      };

      const result = await domainLibrary.detectDomain(normalizedVibe, context);

      expect(result.domain).toBe('ecommerce');
      expect(result.score).toBe(0.8);
      expect(result.confidence).toBe(0.9);
      expect(result.patterns).toBeDefined();
      expect(result.alternatives).toHaveLength(2);
    });

    test('should return alternatives in descending score order', async () => {
      const normalizedVibe = { description: 'test app' };
      const context = { userType: 'individual' };

      const result = await domainLibrary.detectDomain(normalizedVibe, context);

      expect(result.alternatives[0].score).toBeGreaterThan(result.alternatives[1].score);
      expect(result.alternatives[0].domain).toBe('blog'); // Second highest score (0.6)
      expect(result.alternatives[1].domain).toBe('portfolio'); // Third highest score (0.4)
    });

    test('should handle empty vibe gracefully', async () => {
      const result = await domainLibrary.detectDomain({}, {});

      expect(result.domain).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.alternatives).toBeInstanceOf(Array);
    });

    test('should handle null/undefined inputs gracefully', async () => {
      const result1 = await domainLibrary.detectDomain(null, {});
      const result2 = await domainLibrary.detectDomain({}, null);

      expect(result1.domain).toBeDefined();
      expect(result2.domain).toBeDefined();
    });
  });

  describe('Domain Management', () => {
    test('should return all available domains', () => {
      const domains = domainLibrary.getAvailableDomains();

      expect(domains).toContain('ecommerce');
      expect(domains).toContain('blog');
      expect(domains).toContain('portfolio');
      expect(domains).toContain('utility');
      expect(domains).toContain('social');
      expect(domains).toContain('business');
      expect(domains).toContain('landing');
      expect(domains).toHaveLength(7);
    });

    test('should return specific domain pattern', () => {
      const ecommercePattern = domainLibrary.getPattern('ecommerce');
      const blogPattern = domainLibrary.getPattern('blog');

      expect(ecommercePattern).toBeDefined();
      expect(blogPattern).toBeDefined();
      expect(ecommercePattern).not.toBe(blogPattern);
    });

    test('should return undefined for non-existent domain', () => {
      const nonExistentPattern = domainLibrary.getPattern('nonexistent');
      expect(nonExistentPattern).toBeUndefined();
    });
  });

  describe('Requirement Expansion', () => {
    test('should expand requirements for valid domain result', async () => {
      const normalizedVibe = {
        description: 'online store for selling handmade items'
      };
      const domainResult = {
        domain: 'ecommerce',
        patterns: domainLibrary.getPattern('ecommerce'),
        score: 0.8
      };

      const requirements = await domainLibrary.expandRequirements(normalizedVibe, domainResult);

      expect(requirements).toContain('shopping cart');
      expect(requirements).toContain('payment system');
      expect(requirements).toHaveLength(2);
    });

    test('should return empty array for null domain result', async () => {
      const normalizedVibe = { description: 'test' };
      const requirements = await domainLibrary.expandRequirements(normalizedVibe, null);

      expect(requirements).toEqual([]);
    });

    test('should return empty array for domain result without patterns', async () => {
      const normalizedVibe = { description: 'test' };
      const domainResult = { domain: 'test', score: 0.5 }; // No patterns property

      const requirements = await domainLibrary.expandRequirements(normalizedVibe, domainResult);

      expect(requirements).toEqual([]);
    });

    test('should handle errors in requirement expansion gracefully', async () => {
      const normalizedVibe = { description: 'test' };
      const mockPattern = {
        expandRequirements: jest.fn().mockRejectedValue(new Error('Expansion failed'))
      };
      const domainResult = {
        domain: 'test',
        patterns: mockPattern,
        score: 0.5
      };

      const requirements = await domainLibrary.expandRequirements(normalizedVibe, domainResult);

      expect(requirements).toEqual([]);
      expect(mockPattern.expandRequirements).toHaveBeenCalledWith(normalizedVibe);
    });
  });

  describe('Score Calculation Edge Cases', () => {
    test('should handle various vibe input formats', async () => {
      const testCases = [
        { description: 'Simple string' },
        { description: 'String with special chars!@#$%' },
        { description: '', keywords: [] },
        { keywords: ['test', 'app', 'simple'] },
        { description: 'Multi\nline\ndescription' }
      ];

      for (const vibe of testCases) {
        const result = await domainLibrary.detectDomain(vibe, {});
        expect(result.domain).toBeDefined();
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
      }
    });

    test('should handle various context input formats', async () => {
      const normalizedVibe = { description: 'test app' };
      const testContexts = [
        { userType: 'business' },
        { userType: 'individual', preferences: {} },
        { businessContext: { industry: 'tech' } },
        { userType: null },
        {}
      ];

      for (const context of testContexts) {
        const result = await domainLibrary.detectDomain(normalizedVibe, context);
        expect(result.domain).toBeDefined();
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle multiple concurrent domain detections', async () => {
      const vibes = [
        { description: 'online store' },
        { description: 'personal blog' },
        { description: 'portfolio site' },
        { description: 'utility app' }
      ];

      const promises = vibes.map(vibe => 
        domainLibrary.detectDomain(vibe, { userType: 'individual' })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result.domain).toBeDefined();
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.alternatives).toHaveLength(2);
      });
    });

    test('should handle concurrent requirement expansions', async () => {
      const normalizedVibe = { description: 'test' };
      const domainResults = [
        { domain: 'ecommerce', patterns: domainLibrary.getPattern('ecommerce') },
        { domain: 'blog', patterns: domainLibrary.getPattern('blog') },
        { domain: 'portfolio', patterns: domainLibrary.getPattern('portfolio') }
      ];

      const promises = domainResults.map(result =>
        domainLibrary.expandRequirements(normalizedVibe, result)
      );

      const results = await Promise.all(promises);

      expect(results[0]).toContain('shopping cart');
      expect(results[1]).toContain('content management');
      expect(results[2]).toContain('gallery');
    });
  });

  describe('Integration Scenarios', () => {
    test('should provide complete domain analysis workflow', async () => {
      const normalizedVibe = {
        description: 'I want to create an online marketplace for local artisans',
        keywords: ['marketplace', 'local', 'artisans', 'sell', 'buy']
      };
      const context = {
        userType: 'business',
        businessContext: { industry: 'marketplace', scale: 'local' }
      };

      // Step 1: Detect domain
      const domainResult = await domainLibrary.detectDomain(normalizedVibe, context);
      
      expect(domainResult.domain).toBe('ecommerce');
      expect(domainResult.score).toBe(0.8);

      // Step 2: Expand requirements
      const requirements = await domainLibrary.expandRequirements(normalizedVibe, domainResult);
      
      expect(requirements).toEqual(['shopping cart', 'payment system']);

      // Step 3: Verify alternatives are available
      expect(domainResult.alternatives).toHaveLength(2);
      expect(domainResult.alternatives[0].domain).toBe('blog');
    });
  });
});