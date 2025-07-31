/**
 * Unit Tests for Vibe Context Compressor
 * Tests the extracted context compression functionality
 */

const { VibeContextCompressor } = require('../../src/core/vibe-context-compressor');

describe('VibeContextCompressor', () => {
  let compressor;

  beforeEach(() => {
    compressor = new VibeContextCompressor();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with empty compression history', () => {
      expect(compressor.compressionHistory).toBeInstanceOf(Array);
      expect(compressor.compressionHistory).toHaveLength(0);
    });

    test('should initialize with default compression limits', () => {
      expect(compressor.maxEssentialExplicit).toBe(5);
      expect(compressor.maxEssentialImplicit).toBe(8);
    });

    test('should provide compression limits accessor', () => {
      const limits = compressor.getCompressionLimits();
      
      expect(limits).toHaveProperty('maxEssentialExplicit', 5);
      expect(limits).toHaveProperty('maxEssentialImplicit', 8);
    });
  });

  describe('Essential Requirements Extraction', () => {
    test('should extract essential requirements within limits', () => {
      const requirements = {
        explicit: ['req1', 'req2', 'req3', 'req4', 'req5', 'req6', 'req7'],
        implicit: ['impl1', 'impl2', 'impl3', 'impl4', 'impl5', 'impl6', 'impl7', 'impl8', 'impl9', 'impl10'],
        domain: 'ecommerce',
        complexity: 'medium'
      };

      const essential = compressor.extractEssential(requirements);

      expect(essential.explicit).toHaveLength(5);
      expect(essential.implicit).toHaveLength(8);
      expect(essential.domain).toBe('ecommerce');
      expect(essential.complexity).toBe('medium');
    });

    test('should handle requirements with fewer items than limits', () => {
      const requirements = {
        explicit: ['req1', 'req2'],
        implicit: ['impl1', 'impl2', 'impl3'],
        domain: 'blog',
        complexity: 'low'
      };

      const essential = compressor.extractEssential(requirements);

      expect(essential.explicit).toHaveLength(2);
      expect(essential.implicit).toHaveLength(3);
      expect(essential.domain).toBe('blog');
      expect(essential.complexity).toBe('low');
    });

    test('should handle empty requirements', () => {
      const requirements = {};

      const essential = compressor.extractEssential(requirements);

      expect(essential.explicit).toHaveLength(0);
      expect(essential.implicit).toHaveLength(0);
      expect(essential.domain).toBeUndefined();
      expect(essential.complexity).toBeUndefined();
    });

    test('should handle null requirements', () => {
      const essential = compressor.extractEssential(null);

      expect(essential).toEqual({});
    });

    test('should preserve first N requirements in order', () => {
      const requirements = {
        explicit: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'],
        implicit: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
      };

      const essential = compressor.extractEssential(requirements);

      expect(essential.explicit).toEqual(['first', 'second', 'third', 'fourth', 'fifth']);
      expect(essential.implicit).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    });
  });

  describe('Pattern Defaults Extraction', () => {
    test('should extract defaults from patterns', () => {
      const patterns = [
        {
          id: 'ecommerce-basic',
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js'
            },
            hosting: 'cloud'
          }
        },
        {
          id: 'blog-basic',
          requirements: {
            technical: {
              framework: 'Next.js'
            },
            hosting: 'static'
          }
        }
      ];

      const defaults = compressor.extractPatternDefaults(patterns);

      expect(defaults).toHaveProperty('technical');
      expect(defaults).toHaveProperty('hosting');
      expect(defaults.hosting).toBe('static'); // Later pattern overwrites
    });

    test('should handle patterns without requirements', () => {
      const patterns = [
        { id: 'pattern-1' },
        { id: 'pattern-2', requirements: null },
        {
          id: 'pattern-3',
          requirements: {
            technical: { frontend: 'React' }
          }
        }
      ];

      const defaults = compressor.extractPatternDefaults(patterns);

      expect(defaults).toHaveProperty('technical');
      expect(defaults.technical.frontend).toBe('React');
    });

    test('should handle empty patterns array', () => {
      const defaults = compressor.extractPatternDefaults([]);

      expect(defaults).toEqual({});
    });

    test('should handle null patterns', () => {
      const defaults = compressor.extractPatternDefaults(null);

      expect(defaults).toEqual({});
    });

    test('should handle patterns with null elements', () => {
      const patterns = [
        {
          requirements: {
            tech: 'React'
          }
        },
        null,
        {
          requirements: {
            hosting: 'AWS'
          }
        }
      ];

      const defaults = compressor.extractPatternDefaults(patterns);

      expect(defaults.tech).toBe('React');
      expect(defaults.hosting).toBe('AWS');
    });
  });

  describe('Context Summarization', () => {
    test('should summarize full user context', () => {
      const userContext = {
        userType: 'entrepreneur',
        technicalLevel: 'intermediate',
        scale: 'medium',
        budget: 'moderate',
        goals: ['growth', 'efficiency', 'scalability'],
        constraints: ['timeline', 'team-size'],
        preferences: { ui: 'modern', tech: 'React' }
      };

      const summary = compressor.summarizeContext(userContext);

      expect(summary).toEqual({
        userType: 'entrepreneur',
        technicalLevel: 'intermediate',
        scale: 'medium',
        budget: 'moderate',
        primaryGoal: 'growth'
      });
    });

    test('should handle context with missing goals', () => {
      const userContext = {
        userType: 'personal',
        technicalLevel: 'beginner',
        scale: 'small'
      };

      const summary = compressor.summarizeContext(userContext);

      expect(summary.primaryGoal).toBe('general-purpose');
    });

    test('should handle empty context', () => {
      const summary = compressor.summarizeContext({});

      expect(summary).toEqual({
        userType: undefined,
        technicalLevel: undefined,
        scale: undefined,
        budget: undefined,
        primaryGoal: 'general-purpose'
      });
    });

    test('should handle null context', () => {
      const summary = compressor.summarizeContext(null);

      expect(summary).toEqual({});
    });
  });

  describe('Context Size Estimation', () => {
    test('should estimate size of simple object', () => {
      const context = {
        name: 'test',
        value: 123
      };

      const size = compressor.estimateContextSize(context);

      expect(size).toBeGreaterThan(0);
      expect(typeof size).toBe('number');
    });

    test('should estimate size of complex object', () => {
      const context = {
        requirements: {
          explicit: ['req1', 'req2', 'req3'],
          implicit: ['impl1', 'impl2']
        },
        userContext: {
          type: 'business',
          goals: ['growth', 'efficiency']
        }
      };

      const size = compressor.estimateContextSize(context);

      expect(size).toBeGreaterThan(10);
    });

    test('should handle null context', () => {
      const size = compressor.estimateContextSize(null);

      expect(size).toBe(0);
    });

    test('should handle circular references gracefully', () => {
      const context = { name: 'test' };
      context.circular = context;

      const size = compressor.estimateContextSize(context);

      expect(size).toBe(0); // Should return 0 due to JSON.stringify error
    });
  });

  describe('Vibe Context Compression', () => {
    test('should compress vibe context successfully', async () => {
      const requirements = {
        explicit: ['user-auth', 'dashboard', 'analytics'],
        implicit: ['responsive', 'secure', 'fast'],
        domain: 'ecommerce',
        complexity: 'medium'
      };

      const patterns = [
        {
          id: 'ecommerce-basic',
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js'
            }
          }
        }
      ];

      const userContext = {
        userType: 'entrepreneur',
        technicalLevel: 'intermediate',
        scale: 'medium',
        goals: ['growth', 'efficiency']
      };

      const compressed = await compressor.compressVibeContext(requirements, patterns, userContext);

      expect(compressed).toHaveProperty('essentialRequirements');
      expect(compressed).toHaveProperty('patternBasedDefaults');
      expect(compressed).toHaveProperty('contextSummary');
      expect(compressed).toHaveProperty('compressionMetadata');
      expect(compressed).toHaveProperty('compressionRatio');
      expect(compressed).toHaveProperty('tokenSavings');

      expect(compressed.compressionRatio).toBeGreaterThanOrEqual(0);
      expect(compressed.compressionRatio).toBeLessThanOrEqual(1);
      expect(compressed.tokenSavings).toBeGreaterThanOrEqual(0);
    });

    test('should handle zero original size', async () => {
      const compressed = await compressor.compressVibeContext({}, [], {});

      expect(compressed.compressionRatio).toBe(0);
      expect(compressed.tokenSavings).toBe(0);
    });

    test('should update compression history', async () => {
      const initialHistoryLength = compressor.compressionHistory.length;

      await compressor.compressVibeContext(
        { explicit: ['req1'] },
        [],
        { userType: 'personal' }
      );

      expect(compressor.compressionHistory).toHaveLength(initialHistoryLength + 1);

      const historyEntry = compressor.compressionHistory[compressor.compressionHistory.length - 1];
      expect(historyEntry).toHaveProperty('originalSize');
      expect(historyEntry).toHaveProperty('compressedSize');
      expect(historyEntry).toHaveProperty('compressionRatio');
      expect(historyEntry).toHaveProperty('timestamp');
    });

    test('should handle null inputs gracefully', async () => {
      const compressed = await compressor.compressVibeContext(null, null, null);

      expect(compressed).toHaveProperty('essentialRequirements');
      expect(compressed).toHaveProperty('patternBasedDefaults');
      expect(compressed).toHaveProperty('contextSummary');
      expect(compressed.compressionRatio).toBe(0);
    });
  });

  describe('Compression Statistics', () => {
    test('should return empty stats for no compressions', () => {
      const stats = compressor.getCompressionStats();

      expect(stats).toEqual({
        totalCompressions: 0,
        averageRatio: 0,
        totalTokensSaved: 0,
        averageOriginalSize: 0,
        averageCompressedSize: 0
      });
    });

    test('should calculate average compression ratio', async () => {
      // Perform multiple compressions
      await compressor.compressVibeContext(
        { explicit: ['req1', 'req2'] },
        [],
        { userType: 'personal' }
      );
      
      await compressor.compressVibeContext(
        { explicit: ['req3', 'req4', 'req5'] },
        [],
        { userType: 'business' }
      );

      const averageRatio = compressor.getAverageCompressionRatio();

      expect(averageRatio).toBeGreaterThanOrEqual(0);
      expect(averageRatio).toBeLessThanOrEqual(1);
    });

    test('should provide comprehensive stats after compressions', async () => {
      await compressor.compressVibeContext(
        { explicit: ['req1'] },
        [],
        { userType: 'personal' }
      );

      const stats = compressor.getCompressionStats();

      expect(stats.totalCompressions).toBe(1);
      expect(stats.averageRatio).toBeGreaterThanOrEqual(0);
      expect(stats.totalTokensSaved).toBeGreaterThanOrEqual(0);
      expect(stats.averageOriginalSize).toBeGreaterThan(0);
      expect(stats.averageCompressedSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration Management', () => {
    test('should allow updating compression limits', () => {
      compressor.setCompressionLimits({
        maxEssentialExplicit: 3,
        maxEssentialImplicit: 6
      });

      const limits = compressor.getCompressionLimits();

      expect(limits.maxEssentialExplicit).toBe(3);
      expect(limits.maxEssentialImplicit).toBe(6);
    });

    test('should enforce minimum limits', () => {
      compressor.setCompressionLimits({
        maxEssentialExplicit: 0,
        maxEssentialImplicit: -5
      });

      const limits = compressor.getCompressionLimits();

      expect(limits.maxEssentialExplicit).toBe(1);
      expect(limits.maxEssentialImplicit).toBe(1);
    });

    test('should handle partial limit updates', () => {
      compressor.setCompressionLimits({
        maxEssentialExplicit: 7
      });

      const limits = compressor.getCompressionLimits();

      expect(limits.maxEssentialExplicit).toBe(7);
      expect(limits.maxEssentialImplicit).toBe(8); // Unchanged
    });

    test('should clear compression history', async () => {
      // Add some history
      await compressor.compressVibeContext(
        { explicit: ['req1'] },
        [],
        { userType: 'personal' }
      );

      expect(compressor.compressionHistory.length).toBeGreaterThan(0);

      compressor.clearHistory();

      expect(compressor.compressionHistory).toHaveLength(0);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle realistic compression workflow', async () => {
      // Realistic requirements
      const requirements = {
        explicit: [
          'user authentication',
          'product catalog',
          'shopping cart',
          'payment processing',
          'order management',
          'admin dashboard',
          'inventory tracking'
        ],
        implicit: [
          'responsive design',
          'mobile-friendly',
          'SEO optimized',
          'fast loading',
          'secure transactions',
          'scalable architecture',
          'user-friendly interface',
          'analytics integration',
          'email notifications',
          'search functionality'
        ],
        domain: 'ecommerce',
        complexity: 'high'
      };

      const patterns = [
        {
          id: 'ecommerce-advanced',
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js',
              database: 'PostgreSQL',
              payments: 'Stripe'
            },
            hosting: 'AWS',
            security: 'SSL + Auth'
          }
        }
      ];

      const userContext = {
        userType: 'entrepreneur',
        technicalLevel: 'intermediate',
        scale: 'medium',
        budget: 'moderate',
        goals: ['revenue-growth', 'customer-acquisition', 'operational-efficiency'],
        constraints: ['6-month-timeline', 'limited-dev-team'],
        preferences: {
          ui: 'modern-minimalist',
          tech: 'React-preferred'
        }
      };

      const compressed = await compressor.compressVibeContext(requirements, patterns, userContext);

      // Verify compression effectiveness
      expect(compressed.essentialRequirements.explicit).toHaveLength(5);
      expect(compressed.essentialRequirements.implicit).toHaveLength(8);
      expect(compressed.compressionRatio).toBeGreaterThan(0);
      expect(compressed.tokenSavings).toBeGreaterThan(0);

      // Verify essential information preserved
      expect(compressed.essentialRequirements.domain).toBe('ecommerce');
      expect(compressed.contextSummary.userType).toBe('entrepreneur');
      expect(compressed.contextSummary.primaryGoal).toBe('revenue-growth');

      // Verify pattern defaults extracted
      expect(compressed.patternBasedDefaults).toHaveProperty('technical');
    });

    test('should handle concurrent compressions', async () => {
      const compressions = [
        { req: { explicit: ['req1'] }, patterns: [], context: { userType: 'personal' } },
        { req: { explicit: ['req2'] }, patterns: [], context: { userType: 'business' } },
        { req: { explicit: ['req3'] }, patterns: [], context: { userType: 'creative' } }
      ];

      const results = await Promise.all(
        compressions.map(({ req, patterns, context }) =>
          compressor.compressVibeContext(req, patterns, context)
        )
      );

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toHaveProperty('compressionRatio');
        expect(result).toHaveProperty('tokenSavings');
      });

      expect(compressor.compressionHistory).toHaveLength(3);
    });
  });
});