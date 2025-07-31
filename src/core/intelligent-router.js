/**
 * Intelligent Router - Routes commands to optimal agents for maximum efficiency
 * Implements the smart routing logic from the unified-router.md specification
 */

const { AgentPool } = require('./agent-pool');
const { TokenEfficiencyAnalyzer } = require('./token-efficiency-analyzer');
const { PatternMatcher } = require('./pattern-matcher');
const { RoutingMetrics } = require('./routing-metrics');

class IntelligentRouter {
  constructor() {
    this.agents = new AgentPool();
    this.tokenAnalyzer = new TokenEfficiencyAnalyzer();
    this.patternMatcher = new PatternMatcher();
    this.metrics = new RoutingMetrics();
    
    this.routingRules = this.loadRoutingRules();
    this.routingHistory = new Map();
  }

  loadRoutingRules() {
    return {
      // High confidence routing rules
      highConfidence: [
        {
          priority: 1,
          trigger: ['visual', 'design', 'look', 'color', 'layout', 'pretty', 'beautiful', 'style'],
          agent: 'frontend-specialist',
          confidence: 0.95
        },
        {
          priority: 2,
          trigger: ['data', 'save', 'store', 'database', 'users', 'login', 'register', 'auth'],
          agent: 'backend-specialist',
          confidence: 0.90
        },
        {
          priority: 3,
          trigger: ['live', 'online', 'deploy', 'publish', 'website', 'domain', 'hosting'],
          agent: 'deployment-specialist',
          confidence: 0.95
        },
        {
          priority: 4,
          trigger: ['test', 'bug', 'broken', 'error', 'check', 'works', 'fix'],
          agent: 'testing-specialist',
          confidence: 0.85
        },
        {
          priority: 5,
          trigger: ['plan', 'what next', 'progress', 'roadmap', 'organize', 'coordinate'],
          agent: 'project-manager',
          confidence: 0.80
        }
      ],
      
      // Pattern-based routing
      patterns: [
        {
          pattern: 'REACT_COMPONENT_REQUEST',
          agent: 'frontend-specialist',
          confidence: 0.92,
          tokenSavings: 0.45
        },
        {
          pattern: 'API_ENDPOINT_REQUEST',
          agent: 'backend-specialist', 
          confidence: 0.88,
          tokenSavings: 0.38
        },
        {
          pattern: 'DATABASE_DESIGN_REQUEST',
          agent: 'database-specialist',
          confidence: 0.91,
          tokenSavings: 0.42
        }
      ]
    };
  }

  async determineOptimalRoute(parsedCommand, sessionContext, options = {}) {
    const routingOptions = await this.generateRoutingOptions(parsedCommand, sessionContext);
    
    // Score each routing option
    const scoredOptions = await Promise.all(
      routingOptions.map(option => this.scoreRoutingOption(option, sessionContext, options))
    );
    
    // Select optimal route
    const optimal = this.selectOptimalRoute(scoredOptions, options);
    
    // Record routing decision
    await this.recordRoutingDecision(parsedCommand, optimal, scoredOptions);
    
    return {
      selectedAgent: optimal.agent,
      selectedRoute: optimal,
      confidence: optimal.confidence,
      reasoning: this.generateRoutingReasoning(optimal, scoredOptions),
      expectedTokenSavings: optimal.tokenSavings,
      alternativeRoutes: scoredOptions.filter(opt => opt !== optimal)
    };
  }

  async generateRoutingOptions(parsedCommand, sessionContext) {
    const options = [];
    
    // Rule-based routing options
    const ruleMatches = this.matchRoutingRules(parsedCommand);
    options.push(...ruleMatches);
    
    // Pattern-based routing options
    const patternMatches = await this.matchPatterns(parsedCommand, sessionContext);
    options.push(...patternMatches);
    
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

  async scoreRoutingOption(option, sessionContext, optimizationOptions) {
    const baseScore = option.confidence || 0.5;
    
    // Token efficiency scoring
    const tokenEfficiency = await this.tokenAnalyzer.analyzeRoutingEfficiency(
      option.agent,
      sessionContext
    );
    
    // Agent performance scoring
    const agentPerformance = await this.agents.getAgentPerformance(option.agent);
    
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

  async recordRoutingDecision(command, selectedRoute, allOptions) {
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
      reasoning: selectedRoute.reasoning
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
}

module.exports = { IntelligentRouter };