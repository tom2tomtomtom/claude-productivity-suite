/**
 * Unit Tests for RoutingDecisionEngine
 * Tests the enhanced decision-making logic for agent routing
 */

const { RoutingDecisionEngine } = require('../../src/core/routing-decision-engine');

describe('RoutingDecisionEngine', () => {
  let decisionEngine;
  let mockScoredOptions;
  let mockTokenOptimizedPlan;

  beforeEach(() => {
    decisionEngine = new RoutingDecisionEngine();
    
    mockScoredOptions = [
      {
        agent: 'frontend-specialist',
        confidence: 0.9,
        compositeScore: 0.85,
        tokenEfficiency: { efficiency: 0.7, score: 0.8 },
        agentPerformance: { successRate: 0.9 },
        reasoning: 'Strong frontend match'
      },
      {
        agent: 'backend-specialist',
        confidence: 0.8,
        compositeScore: 0.82,
        tokenEfficiency: { efficiency: 0.8, score: 0.85 },
        agentPerformance: { successRate: 0.85 },
        reasoning: 'Good backend match'
      },
      {
        agent: 'project-manager',
        confidence: 0.6,
        compositeScore: 0.60,
        tokenEfficiency: { efficiency: 0.5, score: 0.5 },
        agentPerformance: { successRate: 0.75 },
        reasoning: 'Fallback option'
      }
    ];

    mockTokenOptimizedPlan = {
      tokenSavings: {
        baseline: 1000,
        optimized: 650,
        saved: 350,
        percentage: 35
      }
    };
  });

  describe('Basic Route Selection', () => {
    test('should select highest scoring option by default', async () => {
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions);
      
      expect(result.agent).toBe('frontend-specialist');
      expect(result.compositeScore).toBe(0.85);
      expect(result.selectionReason).toContain('frontend-specialist');
      expect(result.decisionMetadata).toBeDefined();
      expect(result.decisionMetadata.totalOptionsConsidered).toBe(3);
    });

    test('should include selection reasoning', async () => {
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions);
      
      expect(result.selectionReason).toBeDefined();
      expect(result.selectionReason).toContain('85% confidence');
      expect(result.selectionReason).toContain('compared 3 viable options');
    });
  });

  describe('Decision Criteria Application', () => {
    test('should filter by minimum confidence threshold', async () => {
      const options = { minConfidence: 0.85 };
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions, options);
      
      // Only frontend-specialist should meet 0.85 threshold
      expect(result.agent).toBe('frontend-specialist');
    });

    test('should prioritize token efficiency when requested', async () => {
      const options = { optimizeForTokens: true };
      const result = await decisionEngine.selectOptimalRoute(
        mockScoredOptions, 
        options, 
        mockTokenOptimizedPlan
      );
      
      expect(result.tokenOptimized).toBe(true);
      expect(result.selectionReason).toContain('optimized for token efficiency');
    });

    test('should respect user preferences', async () => {
      const userPreferences = {
        'backend-specialist': 1.5, // Strong preference for backend
        'frontend-specialist': 0.8
      };
      
      const options = { 
        respectUserPreferences: true, 
        userPreferences 
      };
      
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions, options);
      
      // Backend should be boosted by user preference
      expect(result.agent).toBe('backend-specialist');
      expect(result.userPreferenceApplied).toBe(1.5);
    });
  });

  describe('Fallback Handling', () => {
    test('should create fallback when no options meet criteria', async () => {
      const options = { minConfidence: 0.95 }; // Too high for any option
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions, options);
      
      expect(result.fallback).toBe(true);
      expect(result.agent).toBe('project-manager');
      expect(result.confidence).toBe(0.6);
      expect(result.selectionReason).toContain('Fallback route');
    });

    test('should create fallback for empty options array', async () => {
      const result = await decisionEngine.selectOptimalRoute([]);
      
      expect(result.fallback).toBe(true);
      expect(result.agent).toBe('project-manager');
      expect(result.decisionMetadata.fallbackTrigger).toBe('no_options');
    });

    test('should create fallback for low confidence scores', async () => {
      const lowConfidenceOptions = mockScoredOptions.map(opt => ({
        ...opt,
        compositeScore: 0.3,
        confidence: 0.3
      }));
      
      const result = await decisionEngine.selectOptimalRoute(lowConfidenceOptions);
      
      expect(result.fallback).toBe(true);
      expect(result.decisionMetadata.fallbackTrigger).toBe('low_confidence');
    });
  });

  describe('Performance History Integration', () => {
    test('should adjust scoring based on agent performance', async () => {
      // Update performance metrics
      decisionEngine.updateAgentPerformance('frontend-specialist', true, 500);
      decisionEngine.updateAgentPerformance('frontend-specialist', true, 600);
      decisionEngine.updateAgentPerformance('frontend-specialist', false, 800); // One failure
      
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions);
      
      // Should still select frontend due to high base score, but with performance adjustment
      expect(result.agent).toBe('frontend-specialist');
      expect(result.performanceAdjustment).toBeDefined();
      expect(result.historicalSuccessRate).toBeCloseTo(0.67, 1); // 2/3 success rate
    });

    test('should track agent performance metrics correctly', () => {
      decisionEngine.updateAgentPerformance('test-agent', true, 100);
      decisionEngine.updateAgentPerformance('test-agent', true, 200);
      decisionEngine.updateAgentPerformance('test-agent', false, 300);
      
      const metrics = decisionEngine.performanceMetrics.get('test-agent');
      
      expect(metrics.totalRequests).toBe(3);
      expect(metrics.successfulRequests).toBe(2);
      expect(metrics.successRate).toBeCloseTo(0.67, 2);
      expect(metrics.averageTokenUsage).toBeCloseTo(200, 0);
    });
  });

  describe('Decision Recording and Statistics', () => {
    test('should record decision for learning', async () => {
      const result = await decisionEngine.selectOptimalRoute(mockScoredOptions);
      
      // Decision should be recorded
      const stats = decisionEngine.getDecisionStatistics();
      expect(stats.totalDecisions).toBeGreaterThan(0);
      expect(stats.recentDecisions).toBeGreaterThan(0);
    });

    test('should calculate decision statistics correctly', async () => {
      // Make several decisions
      await decisionEngine.selectOptimalRoute(mockScoredOptions);
      await decisionEngine.selectOptimalRoute(mockScoredOptions, { minConfidence: 0.95 }); // Fallback
      await decisionEngine.selectOptimalRoute(mockScoredOptions);
      
      const stats = decisionEngine.getDecisionStatistics();
      
      expect(stats.totalDecisions).toBe(3);
      expect(stats.fallbackRate).toBeCloseTo(0.33, 1); // 1 out of 3 was fallback
      expect(stats.averageConfidence).toBeGreaterThan(0);
      expect(stats.agentDistribution).toBeDefined();
      expect(stats.agentDistribution['frontend-specialist']).toBe(2);
      expect(stats.agentDistribution['project-manager']).toBe(1);
    });

    test('should track criteria usage in statistics', async () => {
      await decisionEngine.selectOptimalRoute(mockScoredOptions, { 
        optimizeForTokens: true, 
        minConfidence: 0.8 
      });
      
      const stats = decisionEngine.getDecisionStatistics();
      
      expect(stats.criteriaUsage['token_optimization']).toBe(1);
      expect(stats.criteriaUsage['min_confidence_0.8']).toBe(1);
    });
  });

  describe('Token Optimization Integration', () => {
    test('should apply token efficiency boosting', () => {
      const options = mockScoredOptions.map(opt => ({ ...opt }));
      const result = decisionEngine.prioritizeTokenEfficiency(options, mockTokenOptimizedPlan);
      
      // All options should have tokenOptimized flag and boosted scores
      expect(result.every(opt => opt.tokenOptimized)).toBe(true);
      expect(result[0].compositeScore).toBeGreaterThan(mockScoredOptions[0].compositeScore);
    });

    test('should maintain score ordering after token optimization', () => {
      const options = mockScoredOptions.map(opt => ({ ...opt }));
      const result = decisionEngine.prioritizeTokenEfficiency(options, mockTokenOptimizedPlan);
      
      // Frontend should still be first (highest efficiency + highest base score)
      expect(result[0].agent).toBe('frontend-specialist');
    });
  });

  describe('Agent Availability Checking', () => {
    test('should check agent availability when requested', () => {
      const options = { checkAgentAvailability: true };
      
      // Mock agent availability (implementation detail)
      const available = decisionEngine.isAgentAvailable('frontend-specialist');
      expect(typeof available).toBe('boolean');
    });

    test('should handle workload limits correctly', () => {
      // Test workload calculation (simplified implementation)
      const workload = decisionEngine.getCurrentAgentWorkload('frontend-specialist');
      expect(typeof workload).toBe('number');
      expect(workload).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle undefined or null options gracefully', async () => {
      const result1 = await decisionEngine.selectOptimalRoute(null);
      const result2 = await decisionEngine.selectOptimalRoute(undefined);
      
      expect(result1.fallback).toBe(true);
      expect(result2.fallback).toBe(true);
    });

    test('should handle options with missing properties', async () => {
      const incompleteOptions = [
        { agent: 'test-agent' }, // Missing scores
        { compositeScore: 0.8 }, // Missing agent
        {} // Empty object
      ];
      
      const result = await decisionEngine.selectOptimalRoute(incompleteOptions);
      
      // Should still return a result (likely fallback)
      expect(result).toBeDefined();
      expect(result.agent).toBeDefined();
    });

    test('should handle very large numbers of options', async () => {
      const manyOptions = [];
      for (let i = 0; i < 100; i++) {
        manyOptions.push({
          agent: `agent-${i}`,
          confidence: Math.random(),
          compositeScore: Math.random(),
          reasoning: `Generated option ${i}`
        });
      }
      
      const startTime = Date.now();
      const result = await decisionEngine.selectOptimalRoute(manyOptions);
      const duration = Date.now() - startTime;
      
      expect(result).toBeDefined();
      expect(result.agent).toBeDefined();
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});