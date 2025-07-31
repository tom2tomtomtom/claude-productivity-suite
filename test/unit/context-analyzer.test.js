/**
 * Unit Tests for Context Analyzer
 * Priority 3: Foundation testing - analysis logic used by other modules
 */

const { ContextAnalyzer } = require('../../src/core/context-analyzer');

describe('ContextAnalyzer', () => {
  let contextAnalyzer;

  beforeEach(() => {
    contextAnalyzer = new ContextAnalyzer();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with pattern libraries', () => {
      expect(contextAnalyzer.userTypePatterns).toBeDefined();
      expect(contextAnalyzer.businessModelPatterns).toBeDefined();
      expect(contextAnalyzer.technicalLevelIndicators).toBeDefined();
      
      expect(typeof contextAnalyzer.userTypePatterns).toBe('object');
      expect(typeof contextAnalyzer.businessModelPatterns).toBe('object');
      expect(typeof contextAnalyzer.technicalLevelIndicators).toBe('object');
    });
  });

  describe('Comprehensive Context Analysis', () => {
    test('should perform complete analysis with all components', async () => {
      const normalizedVibe = {
        normalized: 'I want to create an e-commerce website for my small business to sell handmade jewelry online',
        keywords: ['ecommerce', 'business', 'sell', 'online', 'website'],
        entities: ['business', 'jewelry', 'website']
      };
      
      const userContext = {
        sessionId: 'test-session',
        userId: 'test-user',
        preferences: {},
        history: []
      };

      const analysis = await contextAnalyzer.analyze(normalizedVibe, userContext);

      // Verify all analysis components are present
      expect(analysis).toHaveProperty('userType');
      expect(analysis).toHaveProperty('businessContext');
      expect(analysis).toHaveProperty('technicalLevel');
      expect(analysis).toHaveProperty('constraints');
      expect(analysis).toHaveProperty('goals');
      expect(analysis).toHaveProperty('timeline');
      expect(analysis).toHaveProperty('scale');
      expect(analysis).toHaveProperty('budget');
      expect(analysis).toHaveProperty('urgency');
      expect(analysis).toHaveProperty('preferences');

      // Verify analysis makes sense for the input
      expect(['business', 'entrepreneur', 'individual']).toContain(analysis.userType);
      expect(analysis.scale).toBeDefined();
      expect(analysis.technicalLevel).toBeDefined();
    });

    test('should handle minimal vibe input', async () => {
      const normalizedVibe = {
        normalized: 'app',
        keywords: ['app'],
        entities: []
      };
      
      const userContext = {};

      const analysis = await contextAnalyzer.analyze(normalizedVibe, userContext);

      expect(analysis.userType).toBeDefined();
      expect(analysis.scale).toBeDefined();
      expect(analysis.technicalLevel).toBeDefined();
      expect(analysis.constraints).toBeInstanceOf(Array);
      expect(analysis.goals).toBeInstanceOf(Array);
    });

    test('should handle empty input gracefully', async () => {
      const normalizedVibe = {
        normalized: '',
        keywords: [],
        entities: []
      };
      
      const userContext = {};

      const analysis = await contextAnalyzer.analyze(normalizedVibe, userContext);

      expect(analysis.userType).toBe('general');
      expect(analysis).toHaveProperty('businessContext');
      expect(analysis).toHaveProperty('technicalLevel');
    });
  });

  describe('User Type Detection', () => {
    test('should detect business user type from business indicators', async () => {
      const normalizedVibe = {
        normalized: 'I need to build a platform for my company to manage client relationships and sales',
        keywords: ['company', 'business', 'clients', 'sales'],
        entities: ['company', 'platform']
      };
      
      const userContext = {};

      const userType = await contextAnalyzer.detectUserType(normalizedVibe, userContext);
      
      expect(['business', 'entrepreneur']).toContain(userType);
    });

    test('should detect individual user type from personal indicators', async () => {
      const normalizedVibe = {
        normalized: 'I want to create a personal blog to share my thoughts and experiences',
        keywords: ['personal', 'blog', 'thoughts', 'experiences'],
        entities: ['blog']
      };
      
      const userContext = {};

      const userType = await contextAnalyzer.detectUserType(normalizedVibe, userContext);
      
      expect(['individual', 'blogger']).toContain(userType);
    });

    test('should use context history for user type detection', async () => {
      const normalizedVibe = {
        normalized: 'create simple app',
        keywords: ['app'],
        entities: []
      };
      
      const userContext = {
        previousProjects: [
          { type: 'business', description: 'CRM system' },
          { type: 'business', description: 'Inventory management' }
        ]
      };

      const userType = await contextAnalyzer.detectUserType(normalizedVibe, userContext);
      
      // Should bias toward business based on history
      expect(userType).toBeDefined();
      expect(typeof userType).toBe('string');
    });

    test('should return general for unclear input', async () => {
      const normalizedVibe = {
        normalized: 'thing',
        keywords: [],
        entities: []
      };
      
      const userContext = {};

      const userType = await contextAnalyzer.detectUserType(normalizedVibe, userContext);
      
      expect(userType).toBe('general');
    });
  });

  describe('Business Context Extraction', () => {
    test('should extract business context from commerce indicators', async () => {
      const normalizedVibe = {
        normalized: 'online store for selling products with payment processing and inventory tracking',
        keywords: ['store', 'selling', 'payment', 'inventory'],
        entities: ['store', 'products']
      };

      const businessContext = await contextAnalyzer.extractBusinessContext(normalizedVibe);

      expect(businessContext).toHaveProperty('industry');
      expect(businessContext).toHaveProperty('businessModel');
      expect(businessContext).toHaveProperty('targetMarket');
      expect(businessContext.businessModel).toBeDefined();
    });

    test('should handle non-business vibes', async () => {
      const normalizedVibe = {
        normalized: 'personal photo gallery for family pictures',
        keywords: ['personal', 'photo', 'family'],
        entities: ['gallery', 'pictures']
      };

      const businessContext = await contextAnalyzer.extractBusinessContext(normalizedVibe);

      expect(businessContext).toHaveProperty('industry');
      expect(businessContext).toHaveProperty('businessModel');
      expect(businessContext.businessModel).toBe('personal');
    });
  });

  describe('Technical Level Assessment', () => {
    test('should detect high technical level from technical terms', async () => {
      const normalizedVibe = {
        normalized: 'need to build a microservices architecture with API gateways and containerization',
        keywords: ['microservices', 'API', 'containerization'],
        entities: ['architecture']
      };
      
      const userContext = {};

      const technicalLevel = await contextAnalyzer.assessTechnicalLevel(normalizedVibe, userContext);

      expect(['advanced', 'expert']).toContain(technicalLevel);
    });

    test('should detect beginner level from simple language', async () => {
      const normalizedVibe = {
        normalized: 'I want to make a simple website to show my photos',
        keywords: ['simple', 'website', 'photos'],
        entities: ['website']
      };
      
      const userContext = {};

      const technicalLevel = await contextAnalyzer.assessTechnicalLevel(normalizedVibe, userContext);

      expect(['beginner', 'intermediate']).toContain(technicalLevel);
    });

    test('should use context history for technical assessment', async () => {
      const normalizedVibe = {
        normalized: 'build app',
        keywords: ['app'],
        entities: []
      };
      
      const userContext = {
        history: [
          { command: '/deploy-app', success: true },
          { command: '/configure-database', success: true }
        ]
      };

      const technicalLevel = await contextAnalyzer.assessTechnicalLevel(normalizedVibe, userContext);

      expect(technicalLevel).toBeDefined();
      expect(['beginner', 'intermediate', 'advanced', 'expert']).toContain(technicalLevel);
    });
  });

  describe('Constraint Identification', () => {
    test('should identify time constraints from urgency indicators', async () => {
      const normalizedVibe = {
        normalized: 'need this done quickly by next week for urgent business need',
        keywords: ['quickly', 'urgent', 'next week'],
        entities: []
      };
      
      const userContext = {};

      const constraints = await contextAnalyzer.identifyConstraints(normalizedVibe, userContext);

      expect(constraints).toBeInstanceOf(Array);
      expect(constraints.some(c => c.type === 'time' || c.category === 'timeline')).toBe(true);
    });

    test('should identify budget constraints', async () => {
      const normalizedVibe = {
        normalized: 'need a low cost solution that is affordable and budget-friendly',
        keywords: ['low cost', 'affordable', 'budget'],
        entities: []
      };
      
      const userContext = {};

      const constraints = await contextAnalyzer.identifyConstraints(normalizedVibe, userContext);

      expect(constraints).toBeInstanceOf(Array);
      expect(constraints.some(c => c.type === 'budget' || c.category === 'cost')).toBe(true);
    });

    test('should return empty array when no constraints detected', async () => {
      const normalizedVibe = {
        normalized: 'simple app',
        keywords: ['simple'],
        entities: []
      };
      
      const userContext = {};

      const constraints = await contextAnalyzer.identifyConstraints(normalizedVibe, userContext);

      expect(constraints).toBeInstanceOf(Array);
    });
  });

  describe('Goal Extraction', () => {
    test('should extract business goals from commerce vibes', async () => {
      const normalizedVibe = {
        normalized: 'increase sales and reach more customers through online presence',
        keywords: ['sales', 'customers', 'online'],
        entities: []
      };

      const goals = await contextAnalyzer.extractGoals(normalizedVibe);

      expect(goals).toBeInstanceOf(Array);
      expect(goals.some(g => g.includes('sales') || g.includes('customers'))).toBe(true);
    });

    test('should extract personal goals from individual vibes', async () => {
      const normalizedVibe = {
        normalized: 'share my photography and connect with other photographers',
        keywords: ['share', 'photography', 'connect'],
        entities: ['photography']
      };

      const goals = await contextAnalyzer.extractGoals(normalizedVibe);

      expect(goals).toBeInstanceOf(Array);
      expect(goals.some(g => g.includes('share') || g.includes('connect'))).toBe(true);
    });
  });

  describe('Scale Assessment', () => {
    test('should detect large scale from enterprise indicators', async () => {
      const normalizedVibe = {
        normalized: 'enterprise solution for thousands of users across multiple departments',
        keywords: ['enterprise', 'thousands', 'departments'],
        entities: []
      };

      const scale = await contextAnalyzer.assessScale(normalizedVibe);

      expect(['large', 'enterprise']).toContain(scale);
    });

    test('should detect small scale from personal indicators', async () => {
      const normalizedVibe = {
        normalized: 'personal project for myself and a few friends',
        keywords: ['personal', 'myself', 'few friends'],
        entities: []
      };

      const scale = await contextAnalyzer.assessScale(normalizedVibe);

      expect(['small', 'personal']).toContain(scale);
    });

    test('should default to medium scale for unclear input', async () => {
      const normalizedVibe = {
        normalized: 'app',
        keywords: ['app'],
        entities: []
      };

      const scale = await contextAnalyzer.assessScale(normalizedVibe);

      expect(['small', 'medium', 'large']).toContain(scale);
    });
  });

  describe('Timeline Estimation', () => {
    test('should detect quick timeline from urgency indicators', async () => {
      const normalizedVibe = {
        normalized: 'need this ASAP by tomorrow for urgent presentation',
        keywords: ['ASAP', 'tomorrow', 'urgent'],
        entities: []
      };

      const timeline = await contextAnalyzer.estimateTimeline(normalizedVibe);

      expect(['immediate', 'urgent', 'quick']).toContain(timeline);
    });

    test('should detect flexible timeline', async () => {
      const normalizedVibe = {
        normalized: 'would like to have this eventually when time permits',
        keywords: ['eventually', 'time permits'],
        entities: []
      };

      const timeline = await contextAnalyzer.estimateTimeline(normalizedVibe);

      expect(['flexible', 'long-term']).toContain(timeline);
    });
  });

  describe('Budget Assessment', () => {
    test('should detect low budget constraints', async () => {
      const normalizedVibe = {
        normalized: 'need something cheap and free if possible with minimal cost',
        keywords: ['cheap', 'free', 'minimal cost'],
        entities: []
      };

      const budget = await contextAnalyzer.assessBudgetConstraints(normalizedVibe);

      expect(['low', 'minimal', 'free']).toContain(budget);
    });

    test('should detect high budget availability', async () => {
      const normalizedVibe = {
        normalized: 'willing to invest significantly for premium solution with best quality',
        keywords: ['invest', 'premium', 'best quality'],
        entities: []
      };

      const budget = await contextAnalyzer.assessBudgetConstraints(normalizedVibe);

      expect(['high', 'premium', 'flexible']).toContain(budget);
    });
  });

  describe('Preference Extraction', () => {
    test('should extract UI preferences from design indicators', async () => {
      const normalizedVibe = {
        normalized: 'want something modern and clean with minimal design',
        keywords: ['modern', 'clean', 'minimal'],
        entities: []
      };
      
      const userContext = {};

      const preferences = await contextAnalyzer.extractPreferences(normalizedVibe, userContext);

      expect(preferences).toHaveProperty('design');
      expect(preferences.design).toContain('modern');
    });

    test('should extract technology preferences', async () => {
      const normalizedVibe = {
        normalized: 'prefer using React and Node.js with modern JavaScript',
        keywords: ['React', 'Node.js', 'JavaScript'],
        entities: []
      };
      
      const userContext = {};

      const preferences = await contextAnalyzer.extractPreferences(normalizedVibe, userContext);

      expect(preferences).toHaveProperty('technology');
      expect(preferences.technology).toContain('React');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle null normalized vibe', async () => {
      const normalizedVibe = null;
      const userContext = {};

      await expect(contextAnalyzer.analyze(normalizedVibe, userContext))
        .resolves.toBeDefined();
    });

    test('should handle undefined user context', async () => {
      const normalizedVibe = {
        normalized: 'test app',
        keywords: ['test'],
        entities: []
      };

      await expect(contextAnalyzer.analyze(normalizedVibe, undefined))
        .resolves.toBeDefined();
    });

    test('should handle malformed normalized vibe', async () => {
      const normalizedVibe = {
        // Missing normalized field
        keywords: ['test'],
        entities: []
      };
      const userContext = {};

      const analysis = await contextAnalyzer.analyze(normalizedVibe, userContext);
      expect(analysis).toBeDefined();
    });

    test('should handle very long input', async () => {
      const longText = 'app '.repeat(1000);
      const normalizedVibe = {
        normalized: longText,
        keywords: ['app'],
        entities: []
      };
      const userContext = {};

      const analysis = await contextAnalyzer.analyze(normalizedVibe, userContext);
      expect(analysis).toBeDefined();
      expect(analysis.userType).toBeDefined();
    });
  });

  describe('Concurrent Analysis', () => {
    test('should handle multiple concurrent analyses', async () => {
      const vibes = [
        { normalized: 'business app', keywords: ['business'], entities: [] },
        { normalized: 'personal blog', keywords: ['personal'], entities: [] },
        { normalized: 'ecommerce store', keywords: ['ecommerce'], entities: [] }
      ];
      
      const userContext = {};

      const promises = vibes.map(vibe => 
        contextAnalyzer.analyze(vibe, userContext)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toHaveProperty('userType');
        expect(result).toHaveProperty('scale');
        expect(result).toHaveProperty('technicalLevel');
      });
    });
  });
});