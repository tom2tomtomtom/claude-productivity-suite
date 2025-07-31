/**
 * Unit Tests for Smart Defaults Engine
 * Tests the extracted intelligent defaults functionality
 */

const { SmartDefaultsEngine } = require('../../src/core/smart-defaults-engine');

describe('SmartDefaultsEngine', () => {
  let defaultsEngine;

  beforeEach(() => {
    defaultsEngine = new SmartDefaultsEngine();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with defaults library', () => {
      expect(defaultsEngine.defaultsLibrary).toBeDefined();
      expect(defaultsEngine.defaultsLibrary).toHaveProperty('userType');
      expect(defaultsEngine.defaultsLibrary).toHaveProperty('scale');
    });

    test('should have user type defaults', () => {
      const userTypes = Object.keys(defaultsEngine.defaultsLibrary.userType);
      expect(userTypes).toContain('personal');
      expect(userTypes).toContain('entrepreneur');
      expect(userTypes).toContain('creative');
    });

    test('should have scale defaults', () => {
      const scales = Object.keys(defaultsEngine.defaultsLibrary.scale);
      expect(scales).toContain('small');
      expect(scales).toContain('medium');
      expect(scales).toContain('large');
    });

    test('should have properly structured defaults', () => {
      const personalDefaults = defaultsEngine.defaultsLibrary.userType.personal;
      expect(personalDefaults).toBeInstanceOf(Array);
      expect(personalDefaults[0]).toHaveProperty('category');
      expect(personalDefaults[0]).toHaveProperty('key');
      expect(personalDefaults[0]).toHaveProperty('value');
      expect(personalDefaults[0]).toHaveProperty('confidence');
    });
  });

  describe('Technology Defaults Extraction', () => {
    test('should extract tech defaults from patterns', () => {
      const patterns = [
        {
          id: 'ecommerce-basic',
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js',
              database: 'PostgreSQL'
            }
          },
          applicabilityScore: 0.9
        }
      ];

      const techDefaults = defaultsEngine.extractTechDefaults(patterns);

      expect(techDefaults).toHaveLength(3);
      expect(techDefaults[0]).toHaveProperty('category', 'technology');
      expect(techDefaults[0]).toHaveProperty('key', 'frontend');
      expect(techDefaults[0]).toHaveProperty('value', 'React');
      expect(techDefaults[0]).toHaveProperty('confidence', 0.9);
    });

    test('should handle patterns without technical requirements', () => {
      const patterns = [
        { id: 'basic-pattern', requirements: {} },
        { id: 'no-requirements' }
      ];

      const techDefaults = defaultsEngine.extractTechDefaults(patterns);

      expect(techDefaults).toHaveLength(0);
    });

    test('should use default confidence when applicabilityScore missing', () => {
      const patterns = [
        {
          id: 'pattern-no-score',
          requirements: {
            technical: {
              framework: 'Vue.js'
            }
          }
          // No applicabilityScore
        }
      ];

      const techDefaults = defaultsEngine.extractTechDefaults(patterns);

      expect(techDefaults).toHaveLength(1);
      expect(techDefaults[0].confidence).toBe(0.8);
    });

    test('should handle multiple patterns', () => {
      const patterns = [
        {
          id: 'pattern1',
          requirements: {
            technical: {
              frontend: 'React'
            }
          }
        },
        {
          id: 'pattern2',
          requirements: {
            technical: {
              backend: 'Express'
            }
          }
        }
      ];

      const techDefaults = defaultsEngine.extractTechDefaults(patterns);

      expect(techDefaults).toHaveLength(2);
      expect(techDefaults.map(d => d.value)).toContain('React');
      expect(techDefaults.map(d => d.value)).toContain('Express');
    });
  });

  describe('Defaults Reasoning Generation', () => {
    test('should generate reasoning from defaults categories', () => {
      const defaults = [
        { category: 'technology', key: 'frontend', value: 'React' },
        { category: 'technology', key: 'backend', value: 'Node.js' },
        { category: 'hosting', key: 'type', value: 'static' }
      ];

      const reasoning = defaultsEngine.generateDefaultsReasoning(defaults);

      expect(reasoning).toContain('2 technology defaults applied');
      expect(reasoning).toContain('1 hosting defaults applied');
    });

    test('should handle empty defaults', () => {
      const reasoning = defaultsEngine.generateDefaultsReasoning([]);

      expect(reasoning).toBe('');
    });

    test('should handle single category', () => {
      const defaults = [
        { category: 'design', key: 'style', value: 'modern' }
      ];

      const reasoning = defaultsEngine.generateDefaultsReasoning(defaults);

      expect(reasoning).toBe('1 design defaults applied');
    });
  });

  describe('Defaults Generation for Vibes', () => {
    test('should generate defaults with tech patterns', async () => {
      const requirements = {};
      const patterns = [
        {
          id: 'ecommerce-basic',
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js'
            }
          },
          applicabilityScore: 0.9
        }
      ];
      const userContext = {};

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result).toHaveProperty('applicableDefaults');
      expect(result).toHaveProperty('tokenSavings');
      expect(result).toHaveProperty('reasoning');
      expect(result.applicableDefaults).toHaveLength(2);
      expect(result.tokenSavings).toBe(50); // 2 * 25 tokens per tech default
      expect(result.reasoning).toContain('technology defaults applied');
    });

    test('should generate defaults for user type', async () => {
      const requirements = {};
      const patterns = [];
      const userContext = { userType: 'personal' };

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result.applicableDefaults.length).toBeGreaterThan(0);
      expect(result.tokenSavings).toBeGreaterThan(0);
      expect(result.reasoning).toContain('hosting defaults applied');

      // Check that personal defaults are applied
      const categories = result.applicableDefaults.map(d => d.category);
      expect(categories).toContain('hosting');
      expect(categories).toContain('complexity');
    });

    test('should generate defaults for scale', async () => {
      const requirements = {};
      const patterns = [];
      const userContext = { scale: 'small' };

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result.applicableDefaults.length).toBeGreaterThan(0);
      expect(result.tokenSavings).toBeGreaterThan(0);

      // Check that scale defaults are applied
      const values = result.applicableDefaults.map(d => d.value);
      expect(values).toContain('static');
      expect(values).toContain('file-based');
    });

    test('should combine all types of defaults', async () => {
      const requirements = {};
      const patterns = [
        {
          id: 'portfolio-basic',
          requirements: {
            technical: {
              frontend: 'React'
            }
          }
        }
      ];
      const userContext = { userType: 'creative', scale: 'small' };

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result.applicableDefaults.length).toBeGreaterThan(3); // Tech + user + scale defaults
      expect(result.tokenSavings).toBeGreaterThan(0);
      expect(result.reasoning).toContain('technology');
      expect(result.reasoning).toContain('design');
      expect(result.reasoning).toContain('hosting');
    });

    test('should handle empty inputs gracefully', async () => {
      const result = await defaultsEngine.generateDefaultsForVibe({}, [], {});

      expect(result).toHaveProperty('applicableDefaults');
      expect(result).toHaveProperty('tokenSavings');
      expect(result).toHaveProperty('reasoning');
      expect(result.applicableDefaults).toHaveLength(0);
      expect(result.tokenSavings).toBe(0);
      expect(result.reasoning).toBe('');
    });

    test('should handle unknown user types gracefully', async () => {
      const requirements = {};
      const patterns = [];
      const userContext = { userType: 'unknown-type' };

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result.applicableDefaults).toHaveLength(0);
      expect(result.tokenSavings).toBe(0);
    });

    test('should handle unknown scales gracefully', async () => {
      const requirements = {};
      const patterns = [];
      const userContext = { scale: 'unknown-scale' };

      const result = await defaultsEngine.generateDefaultsForVibe(requirements, patterns, userContext);

      expect(result.applicableDefaults).toHaveLength(0);
      expect(result.tokenSavings).toBe(0);
    });
  });

  describe('Token Savings Calculation', () => {
    test('should calculate correct token savings for tech defaults', async () => {
      const patterns = [
        {
          requirements: {
            technical: {
              frontend: 'React',
              backend: 'Node.js',
              database: 'PostgreSQL'
            }
          }
        }
      ];

      const result = await defaultsEngine.generateDefaultsForVibe({}, patterns, {});

      expect(result.tokenSavings).toBe(75); // 3 * 25 tokens per tech default
    });

    test('should calculate correct token savings for user type defaults', async () => {
      const userContext = { userType: 'entrepreneur' };

      const result = await defaultsEngine.generateDefaultsForVibe({}, [], userContext);

      // Entrepreneur has 2 defaults, each worth 20 tokens
      expect(result.tokenSavings).toBe(40);
    });

    test('should calculate correct token savings for scale defaults', async () => {
      const userContext = { scale: 'large' };

      const result = await defaultsEngine.generateDefaultsForVibe({}, [], userContext);

      // Large scale has 2 defaults, each worth 15 tokens
      expect(result.tokenSavings).toBe(30);
    });
  });

  describe('Defaults Library Content Validation', () => {
    test('should have valid personal user defaults', () => {
      const personalDefaults = defaultsEngine.defaultsLibrary.userType.personal;
      
      expect(personalDefaults).toHaveLength(2);
      expect(personalDefaults[0]).toMatchObject({
        category: 'hosting',
        key: 'tier',
        value: 'free',
        confidence: 0.9
      });
      expect(personalDefaults[1]).toMatchObject({
        category: 'complexity',
        key: 'level',
        value: 'simple',
        confidence: 0.8
      });
    });

    test('should have valid entrepreneur defaults', () => {
      const entrepreneurDefaults = defaultsEngine.defaultsLibrary.userType.entrepreneur;
      
      expect(entrepreneurDefaults).toHaveLength(2);
      expect(entrepreneurDefaults.map(d => d.category)).toContain('features');
      expect(entrepreneurDefaults.map(d => d.category)).toContain('security');
    });

    test('should have valid creative defaults', () => {
      const creativeDefaults = defaultsEngine.defaultsLibrary.userType.creative;
      
      expect(creativeDefaults).toHaveLength(2);
      expect(creativeDefaults.map(d => d.category)).toContain('design');
      expect(creativeDefaults.map(d => d.category)).toContain('features');
    });

    test('should have valid scale defaults for all scales', () => {
      ['small', 'medium', 'large'].forEach(scale => {
        const scaleDefaults = defaultsEngine.defaultsLibrary.scale[scale];
        expect(scaleDefaults).toBeInstanceOf(Array);
        expect(scaleDefaults.length).toBeGreaterThan(0);
        expect(scaleDefaults[0]).toHaveProperty('category');
        expect(scaleDefaults[0]).toHaveProperty('confidence');
      });
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle multiple concurrent defaults generations', async () => {
      const testCases = [
        { patterns: [], userContext: { userType: 'personal' } },
        { patterns: [], userContext: { userType: 'entrepreneur' } },
        { patterns: [], userContext: { scale: 'small' } }
      ];

      const promises = testCases.map(({ patterns, userContext }) =>
        defaultsEngine.generateDefaultsForVibe({}, patterns, userContext)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toHaveProperty('applicableDefaults');
        expect(result).toHaveProperty('tokenSavings');
        expect(result).toHaveProperty('reasoning');
      });
    });
  });
});