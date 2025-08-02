/**
 * Intelligent Router - Routes commands to Claude Code specialist agents for maximum efficiency
 * Implements the smart routing logic with Claude Code subagent integration
 */

const { AgentRouter } = require('../agents/agent-router');
const { TokenOptimizer } = require('./token-optimizer');
const { PatternMatcher } = require('./pattern-matcher');
const { RoutingMetrics } = require('./routing-metrics');
const { ParallelExecutionCoordinator } = require('./parallel-execution-coordinator');
const { RoutingDecisionEngine } = require('./routing-decision-engine');

class IntelligentRouter {
  constructor() {
    this.agentRouter = new AgentRouter(); // Use Claude Code agent router
    this.tokenOptimizer = new TokenOptimizer();
    this.patternMatcher = new PatternMatcher();
    this.metrics = new RoutingMetrics();
    this.parallelCoordinator = new ParallelExecutionCoordinator();
    this.routingDecisionEngine = new RoutingDecisionEngine();
    
    this.routingRules = this.loadRoutingRules();
    this.routingHistory = new Map();
  }

  loadRoutingRules() {
    return {
      // High confidence routing rules for Claude Code specialists
      highConfidence: [
        {
          priority: 1,
          trigger: ['visual', 'design', 'look', 'color', 'layout', 'pretty', 'beautiful', 'style', 'ui', 'interface'],
          agent: 'frontend-specialist',
          confidence: 0.95
        },
        {
          priority: 2,
          trigger: ['data', 'save', 'store', 'database', 'users', 'login', 'register', 'auth', 'server', 'backend'],
          agent: 'backend-specialist',
          confidence: 0.90
        },
        {
          priority: 3,
          trigger: ['live', 'online', 'deploy', 'publish', 'website', 'domain', 'hosting', 'production'],
          agent: 'deployment-specialist',
          confidence: 0.95
        },
        {
          priority: 4,
          trigger: ['test', 'bug', 'broken', 'error', 'check', 'works', 'fix', 'quality'],
          agent: 'testing-specialist',
          confidence: 0.85
        },
        {
          priority: 5,
          trigger: ['secure', 'security', 'auth', 'login', 'password', 'encrypt', 'vulnerability', 'permission'],
          agent: 'security-specialist',
          confidence: 0.90
        },
        {
          priority: 6,
          trigger: ['performance', 'speed', 'slow', 'optimize', 'fast', 'cache', 'profile'],
          agent: 'performance-specialist',
          confidence: 0.88
        },
        {
          priority: 7,
          trigger: ['api', 'endpoint', 'rest', 'graphql', 'integration', 'webhook'],
          agent: 'api-specialist',
          confidence: 0.92
        },
        {
          priority: 8,
          trigger: ['mobile', 'phone', 'responsive', 'react native', 'app store'],
          agent: 'mobile-specialist',
          confidence: 0.90
        },
        {
          priority: 9,
          trigger: ['documentation', 'docs', 'readme', 'guide', 'manual', 'help'],
          agent: 'documentation-specialist',
          confidence: 0.85
        },
        {
          priority: 10,
          trigger: ['monitoring', 'logs', 'logging', 'alerts', 'tracking', 'metrics'],
          agent: 'monitoring-specialist',
          confidence: 0.87
        },
        {
          priority: 11,
          trigger: ['devops', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'infrastructure'],
          agent: 'devops-specialist',
          confidence: 0.93
        },
        {
          priority: 12,
          trigger: ['analytics', 'reporting', 'data analysis', 'dashboard', 'charts'],
          agent: 'data-specialist',
          confidence: 0.89
        }
      ],
      
      // Pattern-based routing for Claude Code specialists
      patterns: [
        {
          pattern: 'REACT_COMPONENT_REQUEST',
          agent: 'frontend-specialist',
          confidence: 0.92,
          tokenSavings: 0.45
        },
        {
          pattern: 'API_ENDPOINT_REQUEST',
          agent: 'api-specialist', 
          confidence: 0.90,
          tokenSavings: 0.42
        },
        {
          pattern: 'DATABASE_DESIGN_REQUEST',
          agent: 'database-specialist',
          confidence: 0.91,
          tokenSavings: 0.42
        },
        {
          pattern: 'SECURITY_AUDIT_REQUEST',
          agent: 'security-specialist',
          confidence: 0.93,
          tokenSavings: 0.48
        },
        {
          pattern: 'PERFORMANCE_OPTIMIZATION_REQUEST',
          agent: 'performance-specialist',
          confidence: 0.95,
          tokenSavings: 0.52
        },
        {
          pattern: 'DEPLOYMENT_CONFIGURATION_REQUEST',
          agent: 'devops-specialist',
          confidence: 0.89,
          tokenSavings: 0.46
        },
        {
          pattern: 'MOBILE_UI_REQUEST',
          agent: 'mobile-specialist',
          confidence: 0.88,
          tokenSavings: 0.40
        },
        {
          pattern: 'DOCUMENTATION_REQUEST',
          agent: 'documentation-specialist',
          confidence: 0.85,
          tokenSavings: 0.35
        }
      ]
    };
  }

  async determineOptimalRoute(parsedCommand, sessionContext, options = {}) {
    console.log('🎯 Starting intelligent routing with Claude Code specialists...');
    
    try {
      // First, get token-optimized analysis
      const tokenOptimizedPlan = await this.tokenOptimizer.optimizeVibeProcessing(
        parsedCommand, sessionContext
      );
      
      // Use the AgentRouter to handle Claude Code specialist routing
      const routingResult = await this.agentRouter.routeCommand(
        parsedCommand, sessionContext, {
          onProgress: (step, message, data) => {
            console.log(`📊 Routing step ${step}: ${message}`, data);
          }
        }
      );
      
      // Enhance with token optimization data
      const enhancedResult = {
        selectedAgent: routingResult.agent,
        selectedRoute: {
          agent: routingResult.agent,
          confidence: routingResult.confidence,
          reasoning: routingResult.routing.reasoning
        },
        confidence: routingResult.confidence,
        reasoning: routingResult.routing.reasoning,
        expectedTokenSavings: tokenOptimizedPlan?.tokenSavings,
        tokenOptimization: tokenOptimizedPlan,
        routingTime: routingResult.routingTime,
        executionTime: routingResult.executionTime,
        alternativeRoutes: routingResult.routing.alternatives || [],
        agentCapabilities: this.agentRouter.getSpecialist(routingResult.agent)
      };
      
      // Record routing decision for learning
      await this.recordRoutingDecision(parsedCommand, enhancedResult.selectedRoute, [], tokenOptimizedPlan);
      
      console.log(`✅ Claude Code routing complete: ${routingResult.agent} (${Math.round(routingResult.confidence * 100)}% confidence)`);
      
      return enhancedResult;
      
    } catch (error) {
      console.error('🚨 Intelligent routing error:', error);
      
      // Fallback to simple routing
      return {
        selectedAgent: 'frontend-specialist',
        confidence: 0.5,
        reasoning: 'Fallback routing due to error',
        error: error.message,
        expectedTokenSavings: { percentage: 0, saved: 0 }
      };
    }
  }

  async generateRoutingOptions(parsedCommand, sessionContext, tokenOptimizedPlan = null) {
    const options = [];
    
    // Rule-based routing options
    const ruleMatches = this.matchRoutingRules(parsedCommand);
    options.push(...ruleMatches);
    
    // Pattern-based routing options with token optimization
    const patternMatches = await this.matchPatterns(parsedCommand, sessionContext, tokenOptimizedPlan);
    options.push(...patternMatches);
    
    // Token optimizer suggested routing
    if (tokenOptimizedPlan && tokenOptimizedPlan.plan && tokenOptimizedPlan.plan.steps) {
      const optimizerSuggestions = this.extractRoutingFromOptimizedPlan(tokenOptimizedPlan);
      options.push(...optimizerSuggestions);
    }
    
    // Historical routing options
    const historicalMatches = await this.findSimilarHistoricalRoutes(parsedCommand, sessionContext);
    options.push(...historicalMatches);
    
    // Fallback options
    if (options.length === 0) {
      options.push({
        agent: 'project-manager',
        confidence: 0.6,
        reasoning: 'Fallback to project manager for analysis and sub-routing'
      });
    }
    
    return this.deduplicateOptions(options);
  }

  matchRoutingRules(parsedCommand) {
    const matches = [];
    const commandText = `${parsedCommand.type} ${parsedCommand.description || ''}`.toLowerCase();
    
    for (const rule of this.routingRules.highConfidence) {
      const matchCount = rule.trigger.filter(keyword => 
        commandText.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        const confidence = rule.confidence * (matchCount / rule.trigger.length);
        matches.push({
          agent: rule.agent,
          confidence: Math.min(confidence, 0.98),
          reasoning: `Matched ${matchCount} keywords: ${rule.trigger.join(', ')}`,
          source: 'rules'
        });
      }
    }
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  async matchPatterns(parsedCommand, sessionContext) {
    const patterns = await this.patternMatcher.findMatchingPatterns(parsedCommand, sessionContext);
    
    return patterns.map(pattern => ({
      agent: this.routingRules.patterns.find(p => p.pattern === pattern.id)?.agent || 'project-manager',
      confidence: pattern.confidence,
      reasoning: `Pattern match: ${pattern.id} (${Math.round(pattern.confidence * 100)}% confidence)`,
      tokenSavings: pattern.estimatedTokenSavings,
      source: 'patterns'
    }));
  }

  async findSimilarHistoricalRoutes(parsedCommand, sessionContext) {
    const userId = sessionContext.userId;
    const userHistory = this.routingHistory.get(userId) || [];
    
    const similarCommands = userHistory.filter(historical => 
      this.calculateCommandSimilarity(parsedCommand, historical.command) > 0.7
    );
    
    return similarCommands.map(historical => ({
      agent: historical.selectedAgent,
      confidence: historical.successRate * 0.85, // Slightly lower confidence for historical
      reasoning: `Similar to previous successful command (${Math.round(historical.successRate * 100)}% success rate)`,
      tokenSavings: historical.averageTokenSavings,
      source: 'history'
    }));
  }

  async scoreRoutingOption(option, sessionContext, optimizationOptions = {}, tokenOptimizedPlan = null) {
    const baseScore = option.confidence || 0.5;
    
    // Token efficiency scoring using our completed TokenOptimizer
    const tokenEfficiency = tokenOptimizedPlan 
      ? this.calculateTokenEfficiencyFromPlan(option.agent, tokenOptimizedPlan)
      : await this.estimateTokenEfficiency(option.agent, sessionContext);
    
    // Claude Code agent performance scoring (simplified since agents are external)
    const agentPerformance = this.estimateClaudeAgentPerformance(option.agent);
    
    // User preference scoring
    const userPreference = await this.getUserPreferenceScore(option.agent, sessionContext);
    
    // Calculate composite score
    const weights = {
      confidence: 0.35,
      tokenEfficiency: optimizationOptions.optimizeForTokens ? 0.30 : 0.15,
      agentPerformance: 0.20,
      userPreference: 0.15
    };
    
    const compositeScore = 
      baseScore * weights.confidence +
      tokenEfficiency.score * weights.tokenEfficiency +
      agentPerformance.successRate * weights.agentPerformance +
      userPreference * weights.userPreference;
    
    return {
      ...option,
      compositeScore,
      tokenEfficiency,
      agentPerformance,
      userPreference,
      scoring: {
        base: baseScore,
        composite: compositeScore,
        breakdown: weights
      }
    };
  }

  /**
   * Estimate Claude Code agent performance (since they're external)
   * @param {string} agentType - Type of Claude Code agent
   * @returns {Object} Estimated performance metrics
   */
  estimateClaudeAgentPerformance(agentType) {
    const performanceEstimates = {
      'frontend-specialist': { successRate: 0.92, avgResponseTime: 3000, specialization: 0.95 },
      'backend-specialist': { successRate: 0.89, avgResponseTime: 4000, specialization: 0.93 },
      'database-specialist': { successRate: 0.91, avgResponseTime: 3500, specialization: 0.94 },
      'deployment-specialist': { successRate: 0.87, avgResponseTime: 5000, specialization: 0.90 },
      'testing-specialist': { successRate: 0.85, avgResponseTime: 4500, specialization: 0.88 },
      'security-specialist': { successRate: 0.93, avgResponseTime: 4200, specialization: 0.96 },
      'performance-specialist': { successRate: 0.90, avgResponseTime: 4800, specialization: 0.95 },
      'devops-specialist': { successRate: 0.88, avgResponseTime: 5500, specialization: 0.92 },
      'api-specialist': { successRate: 0.91, avgResponseTime: 3800, specialization: 0.94 },
      'data-specialist': { successRate: 0.89, avgResponseTime: 4200, specialization: 0.91 },
      'mobile-specialist': { successRate: 0.87, avgResponseTime: 4100, specialization: 0.89 },
      'documentation-specialist': { successRate: 0.95, avgResponseTime: 2800, specialization: 0.97 },
      'monitoring-specialist': { successRate: 0.86, avgResponseTime: 3900, specialization: 0.88 }
    };

    return performanceEstimates[agentType] || { successRate: 0.80, avgResponseTime: 4000, specialization: 0.85 };
  }

  selectOptimalRoute(scoredOptions, options) {
    // Sort by composite score
    const sorted = scoredOptions.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Apply selection criteria
    const optimal = sorted[0];
    
    // Ensure minimum confidence threshold
    if (optimal.compositeScore < 0.5) {
      return {
        agent: 'project-manager',
        confidence: 0.6,
        reasoning: 'Low confidence scores - routing to project manager for analysis',
        fallback: true
      };
    }
    
    return optimal;
  }

  generateRoutingReasoning(optimal, allOptions) {
    const reasoning = [`Selected ${optimal.agent} with ${Math.round(optimal.compositeScore * 100)}% confidence`];
    
    if (optimal.tokenSavings) {
      reasoning.push(`Expected ${Math.round(optimal.tokenSavings * 100)}% token savings`);
    }
    
    if (optimal.source) {
      reasoning.push(`Based on ${optimal.source} analysis`);
    }
    
    if (allOptions.length > 1) {
      reasoning.push(`Compared ${allOptions.length} routing options`);
    }
    
    return reasoning.join('. ');
  }

  async recordRoutingDecision(command, selectedRoute, allOptions, tokenOptimizedPlan = null) {
    const record = {
      timestamp: new Date(),
      command,
      selectedAgent: selectedRoute.agent,
      confidence: selectedRoute.confidence,
      allOptions: allOptions.map(opt => ({
        agent: opt.agent,
        score: opt.compositeScore,
        source: opt.source
      })),
      reasoning: selectedRoute.reasoning,
      tokenOptimization: tokenOptimizedPlan ? {
        baseline: tokenOptimizedPlan.tokenSavings.baseline,
        optimized: tokenOptimizedPlan.tokenSavings.optimized, 
        saved: tokenOptimizedPlan.tokenSavings.saved,
        percentage: tokenOptimizedPlan.tokenSavings.percentage
      } : null
    };
    
    // Store for learning
    await this.metrics.recordRoutingDecision(record);
    
    // Update routing history
    const userId = command.userId;
    if (!this.routingHistory.has(userId)) {
      this.routingHistory.set(userId, []);
    }
    this.routingHistory.get(userId).push(record);
  }

  calculateCommandSimilarity(command1, command2) {
    // Simple similarity calculation based on command type and keywords
    if (command1.type !== command2.type) {
      return 0;
    }
    
    const text1 = (command1.description || '').toLowerCase();
    const text2 = (command2.description || '').toLowerCase();
    
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  async getUserPreferenceScore(agentType, sessionContext) {
    const userProfile = sessionContext.userProfile;
    if (!userProfile || !userProfile.agentPreferences) {
      return 0.5; // Neutral preference
    }
    
    const preference = userProfile.agentPreferences[agentType];
    return preference ? preference.satisfactionScore : 0.5;
  }

  deduplicateOptions(options) {
    const seen = new Set();
    return options.filter(option => {
      const key = `${option.agent}-${option.source}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Performance monitoring and optimization
  async optimizeRouting() {
    const performanceData = await this.metrics.getRoutingPerformance();
    
    // Identify underperforming routing rules
    const underperforming = performanceData.rules.filter(rule => 
      rule.successRate < 0.7 || rule.averageTokenUsage > rule.expectedTokenUsage * 1.2
    );
    
    // Adjust routing rules based on performance
    for (const rule of underperforming) {
      await this.adjustRoutingRule(rule);
    }
    
    // Update pattern-based routing
    await this.updatePatternRouting(performanceData.patterns);
    
    return {
      adjustedRules: underperforming.length,
      updatedPatterns: performanceData.patterns.length,
      overallImprovement: this.calculateRoutingImprovement()
    };
  }

  async adjustRoutingRule(rule) {
    // Lower confidence for underperforming rules
    if (rule.successRate < 0.7) {
      rule.confidence *= 0.9;
    }
    
    // Adjust trigger keywords based on false positives
    if (rule.falsePositiveRate > 0.3) {
      rule.trigger = rule.trigger.filter(keyword => 
        rule.keywordPerformance[keyword].accuracy > 0.6
      );
    }
  }

  calculateRoutingImprovement() {
    // Calculate improvement metrics over time
    const recent = this.metrics.getRecentPerformance(30); // Last 30 days
    const baseline = this.metrics.getBaselinePerformance();
    
    return {
      successRateImprovement: recent.successRate - baseline.successRate,
      tokenEfficiencyImprovement: recent.tokenEfficiency - baseline.tokenEfficiency,
      userSatisfactionImprovement: recent.userSatisfaction - baseline.userSatisfaction
    };
  }

  // New helper methods for token optimization integration

  extractRoutingFromOptimizedPlan(tokenOptimizedPlan) {
    const suggestions = [];
    
    if (tokenOptimizedPlan.plan && tokenOptimizedPlan.plan.steps) {
      tokenOptimizedPlan.plan.steps.forEach(step => {
        if (step.type === 'efficient-routing' && step.routing) {
          suggestions.push({
            agent: step.routing.primarySpecialist,
            confidence: 0.85,
            reasoning: `Token optimizer suggests ${step.routing.primarySpecialist} for optimal efficiency`,
            tokenSavings: step.tokenSavings / 1000, // Convert to percentage
            source: 'token-optimizer',
            supportingAgents: step.routing.supportingSpecialists || []
          });
        }
      });
    }
    
    return suggestions;
  }

  calculateTokenEfficiencyFromPlan(agentType, tokenOptimizedPlan) {
    const baseline = tokenOptimizedPlan.tokenSavings.baseline;
    const optimized = tokenOptimizedPlan.tokenSavings.optimized;
    
    return {
      score: (baseline - optimized) / baseline,
      estimatedSavings: tokenOptimizedPlan.tokenSavings.saved,
      efficiency: tokenOptimizedPlan.tokenSavings.percentage / 100,
      source: 'token-optimizer'
    };
  }

  async estimateTokenEfficiency(agentType, sessionContext) {
    // Claude Code agent token efficiency estimation
    const agentEfficiencyMap = {
      'frontend-specialist': 0.65,
      'backend-specialist': 0.70,
      'database-specialist': 0.75,
      'deployment-specialist': 0.60,
      'testing-specialist': 0.55,
      'security-specialist': 0.72,
      'performance-specialist': 0.78,
      'devops-specialist': 0.68,
      'api-specialist': 0.73,
      'data-specialist': 0.76,
      'mobile-specialist': 0.63,
      'documentation-specialist': 0.58,
      'monitoring-specialist': 0.61
    };
    
    const baseEfficiency = agentEfficiencyMap[agentType] || 0.50;
    
    return {
      score: baseEfficiency,
      estimatedSavings: Math.round(baseEfficiency * 1000), // Rough token estimate
      efficiency: baseEfficiency,
      source: 'claude-agent-estimated'
    };
  }

  async matchPatterns(parsedCommand, sessionContext, tokenOptimizedPlan = null) {
    let patterns = await this.patternMatcher.findMatchingPatterns(parsedCommand, sessionContext);
    
    // If we have token optimization data, enhance pattern matching
    if (tokenOptimizedPlan && tokenOptimizedPlan.patterns) {
      const optimizedPatterns = tokenOptimizedPlan.patterns.map(pattern => ({
        id: pattern.id || 'token-optimized-pattern',
        confidence: 0.90,
        estimatedTokenSavings: pattern.tokenSavings || 0.30
      }));
      patterns = [...patterns, ...optimizedPatterns];
    }
    
    return patterns.map(pattern => ({
      agent: this.routingRules.patterns.find(p => p.pattern === pattern.id)?.agent || 'project-manager',
      confidence: pattern.confidence,
      reasoning: `Enhanced pattern match: ${pattern.id} (${Math.round(pattern.confidence * 100)}% confidence)`,
      tokenSavings: pattern.estimatedTokenSavings,
      source: 'enhanced-patterns'
    }));
  }
}

module.exports = { IntelligentRouter };