/**
 * Routing Decision Engine
 * Enhanced decision-making for agent routing with token optimization
 */

class RoutingDecisionEngine {
  constructor() {
    this.decisionHistory = [];
    this.performanceMetrics = new Map();
  }

  /**
   * Select optimal route using enhanced decision logic
   * @param {Array} scoredOptions - Array of scored routing options
   * @param {Object} options - Routing preferences and constraints
   * @param {Object} tokenOptimizedPlan - Token optimization plan
   * @returns {Object} Selected optimal route
   */
  async selectOptimalRoute(scoredOptions, options = {}, tokenOptimizedPlan = null) {
    // Handle null/undefined options
    if (!scoredOptions || !Array.isArray(scoredOptions)) {
      console.log('🧠 No valid routing options provided, using fallback');
      return this.createFallbackRoute(options);
    }
    
    console.log(`🧠 Analyzing ${scoredOptions.length} routing options for optimal selection...`);
    
    // Sort by composite score
    const sorted = scoredOptions.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Apply decision criteria
    const filtered = this.applyDecisionCriteria(sorted, options, tokenOptimizedPlan);
    
    // Select best option with confidence validation
    const optimal = this.validateAndSelectOptimal(filtered, options);
    
    // Record decision for learning
    await this.recordDecision(optimal, scoredOptions, options, tokenOptimizedPlan);
    
    return optimal;
  }

  /**
   * Apply various decision criteria to filter and rank options
   */
  applyDecisionCriteria(sortedOptions, options, tokenOptimizedPlan) {
    let filtered = [...sortedOptions];
    
    // 1. Minimum confidence threshold
    filtered = filtered.filter(option => option.compositeScore >= (options.minConfidence || 0.5));
    
    // 2. Token optimization preference
    if (options.optimizeForTokens && tokenOptimizedPlan) {
      filtered = this.prioritizeTokenEfficiency(filtered, tokenOptimizedPlan);
    }
    
    // 3. Agent availability check
    if (options.checkAgentAvailability) {
      filtered = filtered.filter(option => this.isAgentAvailable(option.agent));
    }
    
    // 4. User preference weighting
    if (options.respectUserPreferences) {
      filtered = this.applyUserPreferenceWeighting(filtered, options.userPreferences);
    }
    
    // 5. Performance history consideration
    filtered = this.adjustForPerformanceHistory(filtered);
    
    return filtered;
  }

  /**
   * Prioritize options based on token efficiency
   */
  prioritizeTokenEfficiency(options, tokenOptimizedPlan) {
    return options.map(option => {
      const tokenBonus = (option.tokenEfficiency?.efficiency || 0) * 0.2;
      return {
        ...option,
        compositeScore: option.compositeScore + tokenBonus,
        tokenOptimized: true
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }

  /**
   * Check if agent is currently available for routing
   */
  isAgentAvailable(agentType) {
    // Simple availability check - can be enhanced with real agent status
    const workloadLimit = {
      'frontend-specialist': 5,
      'backend-specialist': 4,
      'database-specialist': 3,
      'deployment-specialist': 2,
      'testing-specialist': 6,
      'project-manager': 10
    };
    
    const currentWorkload = this.getCurrentAgentWorkload(agentType);
    return currentWorkload < (workloadLimit[agentType] || 3);
  }

  /**
   * Apply user preference weighting to routing options
   */
  applyUserPreferenceWeighting(options, userPreferences = {}) {
    if (!userPreferences || Object.keys(userPreferences).length === 0) {
      return options;
    }
    
    return options.map(option => {
      const preferenceMultiplier = userPreferences[option.agent] || 1.0;
      return {
        ...option,
        compositeScore: option.compositeScore * preferenceMultiplier,
        userPreferenceApplied: preferenceMultiplier
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }

  /**
   * Adjust scoring based on historical performance
   */
  adjustForPerformanceHistory(options) {
    return options.map(option => {
      const performanceData = this.performanceMetrics.get(option.agent);
      
      if (performanceData) {
        const performanceMultiplier = Math.min(performanceData.successRate + 0.1, 1.2);
        const adjustedScore = option.compositeScore * performanceMultiplier;
        
        return {
          ...option,
          compositeScore: adjustedScore,
          performanceAdjustment: performanceMultiplier,
          historicalSuccessRate: performanceData.successRate
        };
      }
      
      return option;
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }

  /**
   * Validate and select the optimal option with fallback logic
   */
  validateAndSelectOptimal(filteredOptions, options) {
    if (filteredOptions.length === 0) {
      console.warn('⚠️ No routing options passed criteria - using fallback');
      return this.createFallbackRoute(options);
    }
    
    const optimal = filteredOptions[0];
    
    // Final confidence validation
    if (optimal.compositeScore < 0.5) {
      console.warn(`⚠️ Low confidence route (${Math.round(optimal.compositeScore * 100)}%) - using fallback`);
      return this.createFallbackRoute(options, optimal);
    }
    
    // Enhance optimal route with decision metadata
    return {
      ...optimal,
      selectionReason: this.generateSelectionReason(optimal, filteredOptions),
      decisionMetadata: {
        totalOptionsConsidered: filteredOptions.length,
        confidenceScore: optimal.compositeScore,
        selectionCriteria: this.getAppliedCriteria(options),
        timestamp: Date.now()
      }
    };
  }

  /**
   * Create fallback route when no good options available
   */
  createFallbackRoute(options, rejectedOptimal = null) {
    return {
      agent: 'project-manager',
      confidence: 0.6,
      compositeScore: 0.6,
      reasoning: rejectedOptimal 
        ? `Low confidence in ${rejectedOptimal.agent} (${Math.round(rejectedOptimal.compositeScore * 100)}%) - routing to project manager for analysis`
        : 'No suitable routing options found - routing to project manager for analysis',
      fallback: true,
      selectionReason: 'Fallback route due to insufficient confidence',
      decisionMetadata: {
        totalOptionsConsidered: rejectedOptimal ? 1 : 0,
        confidenceScore: 0.6,
        fallbackTrigger: rejectedOptimal ? 'low_confidence' : 'no_options',
        timestamp: Date.now()
      }
    };
  }

  /**
   * Generate human-readable selection reasoning
   */
  generateSelectionReason(optimal, allOptions) {
    const reasons = [];
    
    reasons.push(`Selected ${optimal.agent} with ${Math.round(optimal.compositeScore * 100)}% confidence`);
    
    if (optimal.tokenOptimized) {
      reasons.push('optimized for token efficiency');
    }
    
    if (optimal.performanceAdjustment) {
      reasons.push(`${Math.round((optimal.performanceAdjustment - 1) * 100)}% performance adjustment applied`);
    }
    
    if (optimal.userPreferenceApplied && optimal.userPreferenceApplied !== 1.0) {
      reasons.push(`user preference factor: ${optimal.userPreferenceApplied.toFixed(2)}`);
    }
    
    if (allOptions.length > 1) {
      reasons.push(`compared ${allOptions.length} viable options`);
    }
    
    return reasons.join(', ');
  }

  /**
   * Record decision for learning and improvement
   */
  async recordDecision(selectedRoute, allOptions, options, tokenOptimizedPlan) {
    const decision = {
      timestamp: Date.now(),
      selectedAgent: selectedRoute.agent,
      selectedScore: selectedRoute.compositeScore,
      confidence: selectedRoute.confidence,
      fallback: selectedRoute.fallback || false,
      optionsConsidered: allOptions.length,
      decisionCriteria: this.getAppliedCriteria(options),
      tokenOptimization: tokenOptimizedPlan ? {
        baseline: tokenOptimizedPlan.tokenSavings.baseline,
        optimized: tokenOptimizedPlan.tokenSavings.optimized,
        percentage: tokenOptimizedPlan.tokenSavings.percentage
      } : null
    };
    
    this.decisionHistory.push(decision);
    
    // Limit history size
    if (this.decisionHistory.length > 1000) {
      this.decisionHistory = this.decisionHistory.slice(-500);
    }
  }

  /**
   * Get list of applied decision criteria
   */
  getAppliedCriteria(options) {
    const criteria = [];
    
    if (options.optimizeForTokens) criteria.push('token_optimization');
    if (options.checkAgentAvailability) criteria.push('agent_availability');
    if (options.respectUserPreferences) criteria.push('user_preferences');
    if (options.minConfidence) criteria.push(`min_confidence_${options.minConfidence}`);
    
    return criteria;
  }

  /**
   * Get current workload for an agent (simplified)
   */
  getCurrentAgentWorkload(agentType) {
    // In a real implementation, this would check actual agent status
    // For now, return random workload for demonstration
    return Math.floor(Math.random() * 3);
  }

  /**
   * Update performance metrics for an agent
   */
  updateAgentPerformance(agentType, success, tokenUsage = null) {
    if (!this.performanceMetrics.has(agentType)) {
      this.performanceMetrics.set(agentType, {
        totalRequests: 0,
        successfulRequests: 0,
        successRate: 0,
        averageTokenUsage: 0,
        totalTokenUsage: 0
      });
    }
    
    const metrics = this.performanceMetrics.get(agentType);
    metrics.totalRequests++;
    
    if (success) {
      metrics.successfulRequests++;
    }
    
    if (tokenUsage) {
      metrics.totalTokenUsage += tokenUsage;
      metrics.averageTokenUsage = metrics.totalTokenUsage / metrics.totalRequests;
    }
    
    metrics.successRate = metrics.successfulRequests / metrics.totalRequests;
    
    this.performanceMetrics.set(agentType, metrics);
  }

  /**
   * Get decision statistics
   */
  getDecisionStatistics() {
    const recent = this.decisionHistory.slice(-100); // Last 100 decisions
    
    const stats = {
      totalDecisions: this.decisionHistory.length,
      recentDecisions: recent.length,
      fallbackRate: recent.filter(d => d.fallback).length / recent.length,
      averageConfidence: recent.reduce((sum, d) => sum + d.confidence, 0) / recent.length,
      agentDistribution: {},
      criteriaUsage: {}
    };
    
    // Agent distribution
    recent.forEach(decision => {
      stats.agentDistribution[decision.selectedAgent] = 
        (stats.agentDistribution[decision.selectedAgent] || 0) + 1;
    });
    
    // Criteria usage
    recent.forEach(decision => {
      decision.decisionCriteria.forEach(criteria => {
        stats.criteriaUsage[criteria] = (stats.criteriaUsage[criteria] || 0) + 1;
      });
    });
    
    return stats;
  }
}

module.exports = { RoutingDecisionEngine };