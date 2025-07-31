/**
 * Unit Tests for Optimization Pattern Library
 * Tests the extracted pattern management functionality
 */

const { OptimizationPatternLibrary } = require('../../src/core/optimization-pattern-library');

describe('OptimizationPatternLibrary', () => {
  let patternLibrary;

  beforeEach(() => {
    patternLibrary = new OptimizationPatternLibrary();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with base patterns', () => {
      expect(patternLibrary.patterns).toBeInstanceOf(Map);
      expect(patternLibrary.getPatternCount()).toBeGreaterThan(0);
      expect(patternLibrary.getPatternCount()).toBe(4); // todo, ecommerce, blog, portfolio
    });

    test('should have all expected base patterns', () => {
      const expectedPatterns = ['todo-app-basic', 'ecommerce-basic', 'blog-basic', 'portfolio-basic'];
      
      expectedPatterns.forEach(patternId => {
        expect(patternLibrary.patterns.has(patternId)).toBe(true);
      });
    });

    test('should initialize patterns with correct structure', () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      
      expect(pattern).toHaveProperty('id', 'ecommerce-basic');
      expect(pattern).toHaveProperty('name');
      expect(pattern).toHaveProperty('domains');
      expect(pattern).toHaveProperty('userTypes');
      expect(pattern).toHaveProperty('complexity');
      expect(pattern).toHaveProperty('scale');
      expect(pattern).toHaveProperty('averageTokenSavings');
      expect(pattern).toHaveProperty('requirements');
      expect(pattern.requirements).toHaveProperty('implicit');
      expect(pattern.requirements).toHaveProperty('technical');
    });
  });

  describe('Pattern Applicability Assessment', () => {
    test('should score domain matches correctly', async () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      const requirements = { domain: 'ecommerce' };
      const userContext = {};

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(0.4); // Domain match worth 0.4
      expect(result.reasoning).toContain('Domain match');
    });

    test('should score user type matches correctly', async () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      const requirements = {};
      const userContext = { userType: 'business' };

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(0.3); // User type match worth 0.3
      expect(result.reasoning).toContain('User type match');
    });

    test('should score complexity matches correctly', async () => {
      const pattern = patternLibrary.patterns.get('todo-app-basic');
      const requirements = { complexity: 'low' };
      const userContext = {};

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(0.2); // Complexity match worth 0.2
      expect(result.reasoning).toContain('Complexity match');
    });

    test('should score scale matches correctly', async () => {
      const pattern = patternLibrary.patterns.get('portfolio-basic');
      const requirements = {};
      const userContext = { scale: 'small' };

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(0.1); // Scale match worth 0.1
      expect(result.reasoning).toContain('Scale match');
    });

    test('should combine multiple match scores', async () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      const requirements = { domain: 'ecommerce', complexity: 'medium' };
      const userContext = { userType: 'entrepreneur', scale: 'medium' };

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(1.0); // 0.4 + 0.3 + 0.2 + 0.1 = 1.0 (capped at 1.0)
      expect(result.reasoning).toContain('Domain match');
      expect(result.reasoning).toContain('User type match');
      expect(result.reasoning).toContain('Complexity match');
      expect(result.reasoning).toContain('Scale match');
    });

    test('should return zero score for no matches', async () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      const requirements = { domain: 'blog' }; // Doesn't match ecommerce
      const userContext = { userType: 'student' }; // Doesn't match business types

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBe(0);
      expect(result.reasoning).toBe('');
    });

    test('should cap score at 1.0', async () => {
      // This shouldn't happen with current scoring, but test the cap
      const pattern = {
        domains: ['test'],
        userTypes: ['test'],
        complexity: 'test',
        scale: 'test'
      };
      const requirements = { domain: 'test', complexity: 'test' };
      const userContext = { userType: 'test', scale: 'test' };

      const result = await patternLibrary.assessPatternApplicability(pattern, requirements, userContext);

      expect(result.score).toBeLessThanOrEqual(1.0);
    });
  });

  describe('Pattern Finding for Vibes', () => {
    test('should find applicable patterns above threshold', async () => {
      const requirements = { domain: 'ecommerce', complexity: 'medium' };
      const userContext = { userType: 'business', scale: 'medium' };

      const patterns = await patternLibrary.findPatternsForVibe(requirements, userContext);

      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns[0]).toHaveProperty('id');
      expect(patterns[0]).toHaveProperty('applicabilityScore');
      expect(patterns[0]).toHaveProperty('reasoning');
      expect(patterns[0].applicabilityScore).toBeGreaterThan(0.6);
    });

    test('should return patterns sorted by applicability score', async () => {
      const requirements = { domain: 'ecommerce' };
      const userContext = { userType: 'entrepreneur' };

      const patterns = await patternLibrary.findPatternsForVibe(requirements, userContext);

      if (patterns.length > 1) {
        for (let i = 0; i < patterns.length - 1; i++) {
          expect(patterns[i].applicabilityScore).toBeGreaterThanOrEqual(patterns[i + 1].applicabilityScore);
        }
      }
    });

    test('should filter out patterns below threshold', async () => {
      const requirements = { domain: 'nonexistent' };
      const userContext = { userType: 'nonexistent' };

      const patterns = await patternLibrary.findPatternsForVibe(requirements, userContext);

      expect(patterns).toHaveLength(0);
    });

    test('should handle empty requirements and context', async () => {
      const patterns = await patternLibrary.findPatternsForVibe({}, {});

      expect(patterns).toBeInstanceOf(Array);
      // Should return empty array since no matches above threshold
      expect(patterns).toHaveLength(0);
    });

    test('should handle null/undefined inputs gracefully', async () => {
      const patterns1 = await patternLibrary.findPatternsForVibe(null, {});
      const patterns2 = await patternLibrary.findPatternsForVibe({}, null);

      expect(patterns1).toBeInstanceOf(Array);
      expect(patterns2).toBeInstanceOf(Array);
    });
  });

  describe('Pattern Content Validation', () => {
    test('should have valid todo app pattern', () => {
      const pattern = patternLibrary.patterns.get('todo-app-basic');
      
      expect(pattern.domains).toContain('utility');
      expect(pattern.userTypes).toContain('personal');
      expect(pattern.averageTokenSavings).toBe(200);
      expect(pattern.requirements.implicit).toContain('responsive-design');
      expect(pattern.requirements.technical.frontend).toContain('React');
    });

    test('should have valid ecommerce pattern', () => {
      const pattern = patternLibrary.patterns.get('ecommerce-basic');
      
      expect(pattern.domains).toContain('ecommerce');
      expect(pattern.userTypes).toContain('business');
      expect(pattern.averageTokenSavings).toBe(300);
      expect(pattern.requirements.implicit).toContain('payment-processing');
      expect(pattern.requirements.technical.database).toBe('PostgreSQL');
    });

    test('should have valid blog pattern', () => {
      const pattern = patternLibrary.patterns.get('blog-basic');
      
      expect(pattern.domains).toContain('blog');
      expect(pattern.userTypes).toContain('blogger');
      expect(pattern.averageTokenSavings).toBe(180);
      expect(pattern.requirements.implicit).toContain('content-management');
    });

    test('should have valid portfolio pattern', () => {
      const pattern = patternLibrary.patterns.get('portfolio-basic');
      
      expect(pattern.domains).toContain('portfolio');
      expect(pattern.userTypes).toContain('creative');
      expect(pattern.averageTokenSavings).toBe(150);
      expect(pattern.requirements.implicit).toContain('image-optimization');
    });
  });

  describe('Integration Scenarios', () => {
    test('should provide complete pattern matching workflow', async () => {
      const requirements = {
        domain: 'ecommerce',
        complexity: 'medium'
      };
      const userContext = {
        userType: 'entrepreneur',
        scale: 'medium'
      };

      // Step 1: Find applicable patterns
      const patterns = await patternLibrary.findPatternsForVibe(requirements, userContext);
      expect(patterns.length).toBeGreaterThan(0);

      // Step 2: Verify pattern quality
      const bestPattern = patterns[0];
      expect(bestPattern.id).toBe('ecommerce-basic');
      expect(bestPattern.applicabilityScore).toBeGreaterThan(0.6);

      // Step 3: Verify pattern contains useful information
      expect(bestPattern.averageTokenSavings).toBeGreaterThan(0);
      expect(bestPattern.requirements.implicit.length).toBeGreaterThan(0);
      expect(bestPattern.requirements.technical).toHaveProperty('frontend');
    });

    test('should handle concurrent pattern searches', async () => {
      const searches = [
        { requirements: { domain: 'blog' }, userContext: { userType: 'blogger' } },
        { requirements: { domain: 'portfolio' }, userContext: { userType: 'creative' } },
        { requirements: { domain: 'utility' }, userContext: { userType: 'personal' } }
      ];

      const promises = searches.map(({ requirements, userContext }) =>
        patternLibrary.findPatternsForVibe(requirements, userContext)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(patterns => {
        expect(patterns).toBeInstanceOf(Array);
      });
    });
  });
});