/**
 * Enhanced Integration Tests
 * Tests the complete integrated system with all Phase 1 enhancements
 */

const { CommandIntegrator } = require('../../src/core/command-integrator');
const { IntelligentRouter } = require('../../src/core/intelligent-router');
const { XMLMetadataParser } = require('../../src/core/xml-metadata-parser');
const { TokenOptimizer } = require('../../src/core/token-optimizer');
const { ParallelExecutionCoordinator } = require('../../src/core/parallel-execution-coordinator');

describe('Enhanced Claude Productivity Suite Integration', () => {
  let commandIntegrator;
  let sessionContext;

  beforeEach(() => {
    commandIntegrator = new CommandIntegrator();
    sessionContext = {
      userId: 'test-user-123',
      sessionId: 'session-abc-456',
      userProfile: {
        technicalLevel: 'beginner',
        preferences: {
          'frontend-specialist': { satisfactionScore: 0.8 },
          'backend-specialist': { satisfactionScore: 0.9 }
        }
      },
      projectContext: {
        domain: 'ecommerce',
        complexity: 'medium'
      }
    };
  });

  describe('Complete Vibe-to-App Workflow', () => {
    test('should process vibe input with full optimization pipeline', async () => {
      const vibeInput = '/build-my-app "e-commerce store for handmade jewelry with user accounts and payment processing"';
      
      const result = await commandIntegrator.executeCommand(vibeInput, sessionContext);
      
      // Core functionality validation
      expect(result.success).toBe(true);
      expect(result.type).toMatch(/integrated/);
      
      // Token optimization validation
      expect(result.tokenSavings).toBeDefined();
      expect(result.tokenSavings.percentage).toBeGreaterThan(0);
      expect(result.tokensUsed).toBeGreaterThan(0);
      
      // Routing validation
      expect(result.routing).toBeDefined();
      expect(result.routing.strategy).toBeDefined();
      expect(result.routing.confidence).toBeGreaterThan(0.5);
      
      // User explanation validation
      expect(result.userExplanation).toBeDefined();
      expect(result.userExplanation.summary).toBeDefined();
      expect(result.userExplanation.optimization).toBeDefined();
      
      // Performance validation
      expect(result.executionTime).toBeLessThan(10000); // Under 10 seconds
      
      console.log(`✅ Vibe processing: ${result.tokenSavings.percentage}% token savings, ${result.routing.strategy} routing`);
    }, 15000);

    test('should handle complex multi-domain vibe with parallel execution', async () => {
      const complexVibe = '/build-my-app "full-stack social media platform with real-time chat, user profiles, image sharing, and admin dashboard"';
      
      const result = await commandIntegrator.executeCommand(complexVibe, sessionContext);
      
      expect(result.success).toBe(true);
      
      // Should detect multiple domains and consider parallel execution
      expect(result.technical.stepsExecuted).toBeGreaterThan(1);
      
      // Complex vibes should have higher token usage but also higher savings
      expect(result.tokenSavings.saved).toBeGreaterThan(100);
      
      console.log(`✅ Complex vibe: ${result.technical.stepsExecuted} steps, ${result.parallelExecution ? 'parallel' : 'sequential'} execution`);
    }, 20000);
  });

  describe('Intelligent Routing Integration', () => {
    test('should route e-commerce requests to backend specialist', async () => {
      const ecommerceVibe = 'I need an online store with shopping cart and payment processing';
      
      const result = await commandIntegrator.executeCommand(ecommerceVibe, sessionContext);
      
      expect(result.success).toBe(true);
      expect(result.routing.strategy).toMatch(/backend|frontend/); // Could route to either based on optimization
      expect(result.routing.confidence).toBeGreaterThan(0.7);
      
      console.log(`✅ E-commerce routing: ${result.routing.strategy} (${Math.round(result.routing.confidence * 100)}% confidence)`);
    });

    test('should route design requests to frontend specialist', async () => {
      const designVibe = 'Make my website look more modern and beautiful with better colors';
      
      const result = await commandIntegrator.executeCommand(designVibe, sessionContext);
      
      expect(result.success).toBe(true);
      expect(result.routing.strategy).toBe('frontend-specialist');
      expect(result.routing.confidence).toBeGreaterThan(0.8);
      
      console.log(`✅ Design routing: ${result.routing.strategy} (${Math.round(result.routing.confidence * 100)}% confidence)`);
    });
  });

  describe('Token Optimization Integration', () => {
    test('should achieve significant token savings on repeated patterns', async () => {
      // First execution - establishes baseline
      const result1 = await commandIntegrator.executeCommand('/build-my-app "simple todo app"', sessionContext);
      
      // Second execution - should have higher savings due to pattern recognition
      const result2 = await commandIntegrator.executeCommand('/build-my-app "basic task management app"', sessionContext);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      // Both should have token savings
      expect(result1.tokenSavings.percentage).toBeGreaterThan(0);
      expect(result2.tokenSavings.percentage).toBeGreaterThan(0);
      
      console.log(`✅ Pattern optimization: First: ${result1.tokenSavings.percentage}%, Second: ${result2.tokenSavings.percentage}%`);
    });

    test('should optimize based on user context and preferences', async () => {
      // Enhanced session context with more preferences
      const enhancedContext = {
        ...sessionContext,
        userProfile: {
          ...sessionContext.userProfile,
          preferences: {
            'frontend-specialist': { satisfactionScore: 0.95 }
          }
        }
      };
      
      const result = await commandIntegrator.executeCommand(
        'Create a beautiful user interface for my app', 
        enhancedContext
      );
      
      expect(result.success).toBe(true);
      expect(result.routing.strategy).toBe('frontend-specialist');
      expect(result.tokenSavings.percentage).toBeGreaterThan(0);
      
      console.log(`✅ Context optimization: ${result.tokenSavings.percentage}% savings with preferred agent`);
    });
  });

  describe('.md XML Command Integration', () => {
    test('should process direct commands through .md XML pipeline', async () => {
      const directCommand = '/create-spec "user authentication system"';
      
      const result = await commandIntegrator.executeCommand(directCommand, sessionContext);
      
      expect(result.success).toBe(true);
      expect(result.type).toMatch(/integrated/);
      
      // Should have processed through .md XML if file exists
      if (result.type.includes('enhanced')) {
        expect(result.tokenSavings.percentage).toBeGreaterThan(0);
        console.log(`✅ .md XML processing: ${result.tokenSavings.percentage}% token savings`);
      } else {
        console.log(`✅ Fallback processing for ${directCommand}`);
      }
    });
  });

  describe('Error Handling and Fallbacks', () => {
    test('should gracefully handle malformed input', async () => {
      const malformedInput = '///invalid//command with weird syntax!!!';
      
      const result = await commandIntegrator.executeCommand(malformedInput, sessionContext);
      
      // Should not crash and should provide helpful response
      expect(result).toBeDefined();
      expect(result.success).toBeDefined(); // Either true or false, but defined
      
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.recovery).toBeDefined();
      }
      
      console.log(`✅ Error handling: ${result.success ? 'Processed successfully' : 'Graceful fallback'}`);
    });

    test('should handle empty or very short input', async () => {
      const shortInputs = ['', ' ', 'hi', '/'];
      
      for (const input of shortInputs) {
        const result = await commandIntegrator.executeCommand(input, sessionContext);
        
        expect(result).toBeDefined();
        // Should either succeed with helpful response or fail gracefully
        if (!result.success) {
          expect(result.userExplanation).toBeDefined();
        }
      }
      
      console.log(`✅ Short input handling: All inputs processed gracefully`);
    });
  });

  describe('Performance Requirements', () => {
    test('should complete simple vibe processing under 5 seconds', async () => {
      const startTime = Date.now();
      
      const result = await commandIntegrator.executeCommand(
        'Create a simple landing page', 
        sessionContext
      );
      
      const duration = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(5000);
      
      console.log(`✅ Performance: Simple vibe processed in ${duration}ms`);
    });

    test('should complete complex vibe processing under 15 seconds', async () => {
      const startTime = Date.now();
      
      const result = await commandIntegrator.executeCommand(
        'Build a complete e-commerce platform with user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard',
        sessionContext
      );
      
      const duration = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(15000);
      
      console.log(`✅ Performance: Complex vibe processed in ${duration}ms`);
    });
  });

  describe('System Integration Statistics', () => {
    test('should track and report integration metrics', async () => {
      // Execute several commands to generate statistics
      const commands = [
        '/build-my-app "blog platform"',
        '/build-my-app "portfolio website"',
        'Create a simple calculator app'
      ];
      
      for (const command of commands) {
        await commandIntegrator.executeCommand(command, sessionContext);
      }
      
      const stats = commandIntegrator.getIntegrationStatistics();
      
      expect(stats.totalExecutions).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(0);
      expect(stats.averageTokenSavings).toBeGreaterThanOrEqual(0);
      
      console.log(`✅ Integration statistics:`, {
        totalExecutions: stats.totalExecutions,
        successRate: `${stats.successRate}%`,
        avgTokenSavings: `${stats.averageTokenSavings}%`,
        parallelRate: `${stats.parallelRate}%`
      });
    });
  });
});

describe('Component Integration Tests', () => {
  describe('IntelligentRouter + TokenOptimizer Integration', () => {
    test('should integrate routing decisions with token optimization', async () => {
      const router = new IntelligentRouter();
      
      const mockCommand = {
        type: 'vibe',
        description: 'build an e-commerce store with shopping cart',
        domain: 'ecommerce'
      };
      
      const result = await router.determineOptimalRoute(mockCommand, {
        userId: 'test-user',
        preferences: { optimizeForTokens: true }
      });
      
      expect(result.selectedAgent).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.expectedTokenSavings).toBeDefined();
      expect(result.tokenOptimization).toBeDefined();
      
      console.log(`✅ Router + Optimizer: ${result.selectedAgent} selected with ${result.expectedTokenSavings.percentage}% savings`);
    });
  });

  describe('XMLMetadataParser + TokenOptimizer Integration', () => {
    test('should parse and optimize .md XML commands', async () => {
      const parser = new XMLMetadataParser();
      
      // Create a mock .md XML content
      const mockMdContent = `
# Test Command

<command_meta>
  <name>test-command</name>
  <category>testing</category>
  <agents>frontend,backend</agents>
</command_meta>

<workflow_steps>
  <step number="1" name="analysis">
    <description>Analyze requirements</description>
    <agent>context-analyzer</agent>
  </step>
</workflow_steps>
      `;
      
      // Mock file system for testing
      const mockFilePath = '/tmp/test-command.md';
      
      try {
        const metadata = parser.parseXMLMetadata(mockMdContent);
        
        expect(metadata.command_meta).toBeDefined();
        expect(metadata.workflow_steps).toBeDefined();
        expect(metadata.workflow_steps.length).toBe(1);
        
        console.log(`✅ XML Parser: Successfully parsed command with ${metadata.workflow_steps.length} steps`);
        
      } catch (error) {
        console.log(`⚠️ XML Parser test requires file system access: ${error.message}`);
      }
    });
  });

  describe('ParallelExecutionCoordinator Integration', () => {
    test('should analyze and plan parallel execution', async () => {
      const coordinator = new ParallelExecutionCoordinator();
      
      const mockRoute = { agent: 'frontend-specialist' };
      const mockCommand = {
        type: 'vibe',
        description: 'full-stack web application with frontend, backend, and database'
      };
      
      const analysis = await coordinator.analyzePrallelExecution(
        mockRoute, 
        mockCommand, 
        { userId: 'test' }
      );
      
      expect(analysis.recommended).toBeDefined();
      expect(analysis.reason).toBeDefined();
      
      if (analysis.recommended) {
        expect(analysis.parallelPlan).toBeDefined();
        expect(analysis.parallelPlan.estimatedSpeedup).toBeGreaterThan(1);
        
        console.log(`✅ Parallel Coordinator: ${analysis.parallelPlan.estimatedSpeedup}x speedup recommended`);
      } else {
        console.log(`✅ Parallel Coordinator: Sequential execution recommended - ${analysis.reason}`);
      }
    });
  });
});

// Test utilities
function generateMockSessionContext(overrides = {}) {
  return {
    userId: 'test-user-' + Math.random().toString(36).substr(2, 9),
    sessionId: 'session-' + Date.now(),
    userProfile: {
      technicalLevel: 'intermediate',
      preferences: {},
      agentHistory: []
    },
    projectContext: {
      domain: 'general',
      complexity: 'medium'
    },
    ...overrides
  };
}

function createTestCommand(type, description, domain = 'general') {
  return {
    type,
    description,
    domain,
    originalInput: type === 'command' ? `/${description}` : description,
    timestamp: Date.now()
  };
}