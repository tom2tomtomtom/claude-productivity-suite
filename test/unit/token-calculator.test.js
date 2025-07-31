/**
 * Unit Tests for Token Calculator
 * Tests the extracted token calculation functionality
 */

const { TokenCalculator } = require('../../src/core/token-calculator');

describe('TokenCalculator', () => {
  let tokenCalculator;

  beforeEach(() => {
    tokenCalculator = new TokenCalculator();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with default base values', () => {
      expect(tokenCalculator.baseProcessingTokens).toBe(500);
      expect(tokenCalculator.baseOptimizedTokens).toBe(200);
      expect(tokenCalculator.baseContextTokens).toBe(100);
    });

    test('should have calculation weights configured', () => {
      const weights = tokenCalculator.getCalculationWeights();
      
      expect(weights).toHaveProperty('explicitRequirement', 50);
      expect(weights).toHaveProperty('implicitRequirement', 30);
      expect(weights).toHaveProperty('functionalRequirement', 40);
      expect(weights).toHaveProperty('nonFunctionalRequirement', 60);
      expect(weights).toHaveProperty('technicalRequirement', 70);
    });
  });

  describe('Vibe Baseline Calculation', () => {
    test('should calculate baseline with no requirements', () => {
      const requirements = {};
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(600); // 500 base + 100 context
    });

    test('should add tokens for explicit requirements', () => {
      const requirements = {
        explicit: ['req1', 'req2', 'req3']
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(750); // 500 + 100 + (3 * 50)
    });

    test('should add tokens for implicit requirements', () => {
      const requirements = {
        implicit: ['impl1', 'impl2', 'impl3', 'impl4']
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(720); // 500 + 100 + (4 * 30)
    });

    test('should add tokens for functional requirements', () => {
      const requirements = {
        functional: ['func1', 'func2']
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(680); // 500 + 100 + (2 * 40)
    });

    test('should add tokens for non-functional requirements', () => {
      const requirements = {
        nonFunctional: {
          performance: 'high',
          security: 'strict',
          scalability: 'medium'
        }
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(780); // 500 + 100 + (3 * 60)
    });

    test('should add tokens for technical requirements', () => {
      const requirements = {
        technical: {
          frontend: 'React',
          backend: 'Node.js',
          database: 'PostgreSQL',
          deployment: 'AWS'
        }
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(880); // 500 + 100 + (4 * 70)
    });

    test('should combine all requirement types', () => {
      const requirements = {
        explicit: ['req1', 'req2'],
        implicit: ['impl1'],
        functional: ['func1'],
        nonFunctional: {
          performance: 'high'
        },
        technical: {
          frontend: 'React'
        }
      };
      const userContext = {};

      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);

      expect(baseline).toBe(900); // 500 + 100 + (2*50) + (1*30) + (1*40) + (1*60) + (1*70) + extra context
    });
  });

  describe('Context Token Estimation', () => {
    test('should calculate base context tokens', () => {
      const userContext = {};

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(100);
    });

    test('should add tokens for business context', () => {
      const userContext = {
        businessContext: 'ecommerce startup'
      };

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(250); // 100 + 150
    });

    test('should add tokens for technical level', () => {
      const userContext = {
        technicalLevel: 'beginner'
      };

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(150); // 100 + 50
    });

    test('should add tokens for constraints', () => {
      const userContext = {
        constraints: ['budget', 'timeline', 'team-size']
      };

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(190); // 100 + (3 * 30)
    });

    test('should add tokens for goals', () => {
      const userContext = {
        goals: ['growth', 'efficiency', 'user-satisfaction', 'cost-reduction']
      };

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(200); // 100 + (4 * 25)
    });

    test('should combine all context factors', () => {
      const userContext = {
        businessContext: 'startup',
        technicalLevel: 'intermediate',
        constraints: ['budget', 'timeline'],
        goals: ['growth', 'efficiency']
      };

      const tokens = tokenCalculator.estimateContextTokens(userContext);

      expect(tokens).toBe(410); // 100 + 150 + 50 + (2*30) + (2*25)
    });
  });

  describe('Optimized Token Calculation', () => {
    test('should calculate base optimized tokens', () => {
      const plan = {
        optimizations: [],
        context: {}
      };

      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      expect(optimized).toBe(200);
    });

    test('should apply optimization savings', () => {
      const plan = {
        optimizations: [
          { tokenSavings: 50 },
          { tokenSavings: 30 },
          { tokenSavings: 80 }
        ],
        context: {}
      };

      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      expect(optimized).toBe(340); // 200 + (100-50) + (100-30) + (100-80)
    });

    test('should handle high savings that exceed 100', () => {
      const plan = {
        optimizations: [
          { tokenSavings: 120 }, // Should result in 0 additional tokens
          { tokenSavings: 150 }  // Should result in 0 additional tokens
        ],
        context: {}
      };

      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      expect(optimized).toBe(200); // 200 + 0 + 0
    });

    test('should add tokens for compressed context', () => {
      const plan = {
        optimizations: [],
        context: {
          originalSize: 1000,
          compressionRatio: 0.4 // 40% compression
        }
      };

      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      expect(optimized).toBe(800); // 200 + (1000 * (1 - 0.4))
    });

    test('should combine optimizations and context compression', () => {
      const plan = {
        optimizations: [
          { tokenSavings: 25 },
          { tokenSavings: 35 }
        ],
        context: {
          originalSize: 500,
          compressionRatio: 0.3
        }
      };

      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      expect(optimized).toBe(690); // 200 + (100-25) + (100-35) + (500 * 0.7)
    });
  });

  describe('Pattern Savings Calculation', () => {
    test('should calculate savings from patterns', () => {
      const patterns = [
        { averageTokenSavings: 150 },
        { averageTokenSavings: 200 },
        { averageTokenSavings: 75 }
      ];

      const savings = tokenCalculator.calculatePatternSavings(patterns);

      expect(savings).toBe(425);
    });

    test('should use default savings for patterns without specified savings', () => {
      const patterns = [
        { averageTokenSavings: 150 },
        { name: 'pattern-without-savings' }, // No averageTokenSavings
        { averageTokenSavings: 75 }
      ];

      const savings = tokenCalculator.calculatePatternSavings(patterns);

      expect(savings).toBe(325); // 150 + 100 + 75
    });

    test('should handle empty patterns array', () => {
      const patterns = [];

      const savings = tokenCalculator.calculatePatternSavings(patterns);

      expect(savings).toBe(0);
    });

    test('should handle null patterns gracefully', () => {
      const patterns = [
        { averageTokenSavings: 100 },
        null,
        { averageTokenSavings: 50 }
      ];

      const savings = tokenCalculator.calculatePatternSavings(patterns);

      expect(savings).toBe(150); // 100 + 0 (null skipped) + 50
    });
  });

  describe('Token Savings Summary', () => {
    test('should calculate savings summary correctly', () => {
      const baseline = 1000;
      const optimized = 600;

      const summary = tokenCalculator.calculateTokenSavings(baseline, optimized);

      expect(summary).toEqual({
        baseline: 1000,
        optimized: 600,
        saved: 400,
        percentage: 40
      });
    });

    test('should handle zero baseline', () => {
      const baseline = 0;
      const optimized = 100;

      const summary = tokenCalculator.calculateTokenSavings(baseline, optimized);

      expect(summary.percentage).toBe(0);
      expect(summary.saved).toBe(-100);
    });

    test('should handle case where optimized is higher than baseline', () => {
      const baseline = 500;
      const optimized = 800;

      const summary = tokenCalculator.calculateTokenSavings(baseline, optimized);

      expect(summary.saved).toBe(-300);
      expect(summary.percentage).toBe(-60);
    });
  });

  describe('Text and Object Token Estimation', () => {
    test('should estimate tokens from text', () => {
      const text = 'This is a test string with twenty characters'; // 44 characters

      const tokens = tokenCalculator.estimateTokensFromText(text);

      expect(tokens).toBe(11); // 44 / 4 = 11
    });

    test('should handle empty text', () => {
      const tokens1 = tokenCalculator.estimateTokensFromText('');
      const tokens2 = tokenCalculator.estimateTokensFromText(null);
      const tokens3 = tokenCalculator.estimateTokensFromText(undefined);

      expect(tokens1).toBe(0);
      expect(tokens2).toBe(0);
      expect(tokens3).toBe(0);
    });

    test('should estimate tokens from object', () => {
      const obj = {
        name: 'test',
        value: 123,
        nested: {
          property: 'value'
        }
      };

      const tokens = tokenCalculator.estimateTokensFromObject(obj);

      expect(tokens).toBeGreaterThan(0);
      expect(typeof tokens).toBe('number');
    });

    test('should handle null/undefined objects', () => {
      const tokens1 = tokenCalculator.estimateTokensFromObject(null);
      const tokens2 = tokenCalculator.estimateTokensFromObject(undefined);
      const tokens3 = tokenCalculator.estimateTokensFromObject('not an object');

      expect(tokens1).toBe(0);
      expect(tokens2).toBe(0);
      expect(tokens3).toBe(0);
    });
  });

  describe('Configuration Management', () => {
    test('should allow updating calculation weights', () => {
      const newWeights = {
        explicitRequirement: 60,
        implicitRequirement: 35
      };

      tokenCalculator.updateCalculationWeights(newWeights);
      const weights = tokenCalculator.getCalculationWeights();

      expect(weights.explicitRequirement).toBe(60);
      expect(weights.implicitRequirement).toBe(35);
      // Other weights should remain unchanged
      expect(weights.functionalRequirement).toBe(40);
    });
  });

  describe('Integration Scenarios', () => {
    test('should provide complete token calculation workflow', () => {
      const requirements = {
        explicit: ['user auth', 'dashboard'],
        implicit: ['responsive', 'secure'],
        technical: {
          frontend: 'React',
          backend: 'Node.js'
        }
      };
      const userContext = {
        businessContext: 'startup',
        technicalLevel: 'intermediate',
        constraints: ['budget'],
        goals: ['growth']
      };

      // Step 1: Calculate baseline
      const baseline = tokenCalculator.calculateVibeBaseline(requirements, userContext);
      expect(baseline).toBeGreaterThan(500);

      // Step 2: Create optimized plan
      const plan = {
        optimizations: [
          { tokenSavings: 50 },
          { tokenSavings: 30 }
        ],
        context: {
          originalSize: 300,
          compressionRatio: 0.2
        }
      };

      // Step 3: Calculate optimized tokens
      const optimized = tokenCalculator.calculateOptimizedTokens(plan);

      // Step 4: Calculate savings summary
      const summary = tokenCalculator.calculateTokenSavings(baseline, optimized);

      expect(summary.baseline).toBe(baseline);
      expect(summary.optimized).toBe(optimized);
      expect(summary.saved).toBe(baseline - optimized);
      expect(summary.percentage).toBeGreaterThan(0);
    });

    test('should handle edge cases gracefully', () => {
      // Test with minimal data
      const baseline = tokenCalculator.calculateVibeBaseline({}, {});
      const optimized = tokenCalculator.calculateOptimizedTokens({ optimizations: [], context: {} });
      const summary = tokenCalculator.calculateTokenSavings(baseline, optimized);

      expect(baseline).toBeGreaterThan(0);
      expect(optimized).toBeGreaterThan(0);
      expect(summary).toHaveProperty('percentage');
    });
  });
});