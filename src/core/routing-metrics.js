/**
 * Routing Metrics - Tracks and analyzes routing performance and decisions
 * Provides insights for continuous improvement of the intelligent routing system
 */

class RoutingMetrics {
  constructor() {
    this.metrics = {
      routingDecisions: [],
      agentPerformance: new Map(),
      patternMatches: new Map(),
      executionTimes: [],
      successRates: new Map(),
      tokenUsage: [],
      userSatisfaction: []
    };
    
    this.startTime = Date.now();
  }

  /**
   * Record a routing decision
   * @param {Object} decision - Routing decision details
   */
  recordRoutingDecision(decision) {
    const record = {
      timestamp: Date.now(),
      selectedAgent: decision.selectedAgent,
      confidence: decision.confidence,
      alternatives: decision.alternatives || [],
      patternMatches: decision.patternMatches || [],
      executionTime: decision.executionTime,
      success: decision.success,
      userId: decision.userId || 'anonymous'
    };
    
    this.metrics.routingDecisions.push(record);
    
    // Update agent performance tracking
    this.updateAgentPerformance(decision.selectedAgent, decision);
    
    // Update pattern match tracking
    this.updatePatternMatchTracking(decision.patternMatches || []);
    
    // Keep only last 1000 decisions to prevent memory issues
    if (this.metrics.routingDecisions.length > 1000) {
      this.metrics.routingDecisions = this.metrics.routingDecisions.slice(-1000);
    }
  }

  /**
   * Update agent performance metrics
   * @param {string} agentId - Agent identifier
   * @param {Object} decision - Decision details
   */
  updateAgentPerformance(agentId, decision) {
    if (!this.metrics.agentPerformance.has(agentId)) {
      this.metrics.agentPerformance.set(agentId, {
        totalSelections: 0,
        successfulExecutions: 0,
        averageExecutionTime: 0,
        averageConfidence: 0,
        totalTokenUsage: 0,
        averageUserSatisfaction: 0
      });
    }
    
    const metrics = this.metrics.agentPerformance.get(agentId);
    metrics.totalSelections++;
    
    if (decision.success) {
      metrics.successfulExecutions++;
    }
    
    if (decision.executionTime) {
      metrics.averageExecutionTime = 
        (metrics.averageExecutionTime * (metrics.totalSelections - 1) + decision.executionTime) / metrics.totalSelections;
    }
    
    if (decision.confidence) {
      metrics.averageConfidence = 
        (metrics.averageConfidence * (metrics.totalSelections - 1) + decision.confidence) / metrics.totalSelections;
    }
    
    if (decision.tokenUsage) {
      metrics.totalTokenUsage += decision.tokenUsage;
    }
  }

  /**
   * Update pattern match tracking
   * @param {Array} patternMatches - Array of pattern matches
   */
  updatePatternMatchTracking(patternMatches) {
    for (const match of patternMatches) {
      const patternType = match.type;
      
      if (!this.metrics.patternMatches.has(patternType)) {
        this.metrics.patternMatches.set(patternType, {
          totalMatches: 0,
          averageConfidence: 0,
          successfulRouting: 0
        });
      }
      
      const patternMetrics = this.metrics.patternMatches.get(patternType);
      patternMetrics.totalMatches++;
      patternMetrics.averageConfidence = 
        (patternMetrics.averageConfidence * (patternMetrics.totalMatches - 1) + match.confidence) / patternMetrics.totalMatches;
    }
  }

  /**
   * Record execution metrics
   * @param {Object} execution - Execution details
   */
  recordExecution(execution) {
    this.metrics.executionTimes.push({
      timestamp: Date.now(),
      agentId: execution.agentId,
      duration: execution.duration,
      tokenUsage: execution.tokenUsage,
      success: execution.success
    });
    
    // Keep only last 500 execution records
    if (this.metrics.executionTimes.length > 500) {
      this.metrics.executionTimes = this.metrics.executionTimes.slice(-500);
    }
  }

  /**
   * Record user satisfaction feedback
   * @param {Object} feedback - User feedback
   */
  recordUserFeedback(feedback) {
    this.metrics.userSatisfaction.push({
      timestamp: Date.now(),
      agentId: feedback.agentId,
      satisfaction: feedback.satisfaction, // 1-5 scale
      correctAgent: feedback.correctAgent, // boolean
      comments: feedback.comments
    });
    
    // Update agent performance with satisfaction data
    if (this.metrics.agentPerformance.has(feedback.agentId)) {
      const agentMetrics = this.metrics.agentPerformance.get(feedback.agentId);
      const feedbackCount = this.metrics.userSatisfaction.filter(f => f.agentId === feedback.agentId).length;
      
      agentMetrics.averageUserSatisfaction = 
        (agentMetrics.averageUserSatisfaction * (feedbackCount - 1) + feedback.satisfaction) / feedbackCount;
    }
  }

  /**
   * Get routing accuracy metrics
   * @returns {Object} Accuracy metrics
   */
  getRoutingAccuracy() {
    const totalDecisions = this.metrics.routingDecisions.length;
    if (totalDecisions === 0) return { accuracy: 0, totalDecisions: 0 };
    
    const successfulDecisions = this.metrics.routingDecisions.filter(d => d.success).length;
    
    return {
      accuracy: successfulDecisions / totalDecisions,
      totalDecisions,
      successfulDecisions,
      failedDecisions: totalDecisions - successfulDecisions
    };
  }

  /**
   * Get agent performance summary
   * @returns {Object} Agent performance data
   */
  getAgentPerformance() {
    const performance = {};
    
    for (const [agentId, metrics] of this.metrics.agentPerformance) {
      performance[agentId] = {
        successRate: metrics.successfulExecutions / metrics.totalSelections,
        averageExecutionTime: metrics.averageExecutionTime,
        averageConfidence: metrics.averageConfidence,
        totalSelections: metrics.totalSelections,
        averageUserSatisfaction: metrics.averageUserSatisfaction,
        averageTokenUsage: metrics.totalTokenUsage / metrics.totalSelections
      };
    }
    
    return performance;
  }

  /**
   * Get pattern matching effectiveness
   * @returns {Object} Pattern matching metrics
   */
  getPatternEffectiveness() {
    const effectiveness = {};
    
    for (const [patternType, metrics] of this.metrics.patternMatches) {
      effectiveness[patternType] = {
        totalMatches: metrics.totalMatches,
        averageConfidence: metrics.averageConfidence,
        effectivenessScore: this.calculatePatternEffectiveness(patternType)
      };
    }
    
    return effectiveness;
  }

  /**
   * Calculate pattern effectiveness score
   * @param {string} patternType - Pattern type
   * @returns {number} Effectiveness score (0-1)
   */
  calculatePatternEffectiveness(patternType) {
    const decisionsWithPattern = this.metrics.routingDecisions.filter(d => 
      d.patternMatches.some(p => p.type === patternType)
    );
    
    if (decisionsWithPattern.length === 0) return 0;
    
    const successfulDecisions = decisionsWithPattern.filter(d => d.success).length;
    return successfulDecisions / decisionsWithPattern.length;
  }

  /**
   * Get system performance overview
   * @returns {Object} System performance metrics
   */
  getSystemPerformance() {
    const now = Date.now();
    const uptime = now - this.startTime;
    
    const executionTimes = this.metrics.executionTimes.map(e => e.duration).filter(d => d);
    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length 
      : 0;
    
    const routingAccuracy = this.getRoutingAccuracy();
    
    return {
      uptime,
      totalRequests: this.metrics.routingDecisions.length,
      averageExecutionTime,
      routingAccuracy: routingAccuracy.accuracy,
      activeAgents: this.metrics.agentPerformance.size,
      patternTypes: this.metrics.patternMatches.size
    };
  }

  /**
   * Get user satisfaction metrics
   * @returns {Object} User satisfaction data
   */
  getUserSatisfaction() {
    if (this.metrics.userSatisfaction.length === 0) {
      return { averageSatisfaction: 0, totalFeedback: 0 };
    }
    
    const totalSatisfaction = this.metrics.userSatisfaction.reduce((sum, f) => sum + f.satisfaction, 0);
    const correctAgentCount = this.metrics.userSatisfaction.filter(f => f.correctAgent).length;
    
    return {
      averageSatisfaction: totalSatisfaction / this.metrics.userSatisfaction.length,
      totalFeedback: this.metrics.userSatisfaction.length,
      correctAgentPercentage: correctAgentCount / this.metrics.userSatisfaction.length,
      recentFeedback: this.metrics.userSatisfaction.slice(-10)
    };
  }

  /**
   * Get trending patterns
   * @param {number} timeWindow - Time window in milliseconds (default: 24 hours)
   * @returns {Array} Trending patterns
   */
  getTrendingPatterns(timeWindow = 24 * 60 * 60 * 1000) {
    const cutoffTime = Date.now() - timeWindow;
    const recentDecisions = this.metrics.routingDecisions.filter(d => d.timestamp > cutoffTime);
    
    const patternCounts = {};
    
    for (const decision of recentDecisions) {
      for (const pattern of decision.patternMatches) {
        patternCounts[pattern.type] = (patternCounts[pattern.type] || 0) + 1;
      }
    }
    
    return Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([pattern, count]) => ({ pattern, count }));
  }

  /**
   * Export metrics data
   * @returns {Object} Complete metrics data
   */
  exportMetrics() {
    return {
      systemPerformance: this.getSystemPerformance(),
      routingAccuracy: this.getRoutingAccuracy(),
      agentPerformance: this.getAgentPerformance(),
      patternEffectiveness: this.getPatternEffectiveness(),
      userSatisfaction: this.getUserSatisfaction(),
      trendingPatterns: this.getTrendingPatterns(),
      exportTimestamp: Date.now()
    };
  }

  /**
   * Reset all metrics (useful for testing)
   */
  reset() {
    this.metrics = {
      routingDecisions: [],
      agentPerformance: new Map(),
      patternMatches: new Map(),
      executionTimes: [],
      successRates: new Map(),
      tokenUsage: [],
      userSatisfaction: []
    };
    
    this.startTime = Date.now();
  }

  /**
   * Get health status of the metrics system
   * @returns {Object} Health status
   */
  getHealthStatus() {
    const memoryUsage = this.calculateMemoryUsage();
    const dataIntegrity = this.checkDataIntegrity();
    
    return {
      status: memoryUsage.healthy && dataIntegrity.healthy ? 'healthy' : 'warning',
      memoryUsage,
      dataIntegrity,
      lastUpdated: Date.now()
    };
  }

  calculateMemoryUsage() {
    const totalRecords = 
      this.metrics.routingDecisions.length +
      this.metrics.executionTimes.length +
      this.metrics.userSatisfaction.length;
    
    return {
      totalRecords,
      healthy: totalRecords < 2000, // Alert if too many records
      recommendation: totalRecords > 1500 ? 'Consider archiving old data' : 'Memory usage normal'
    };
  }

  checkDataIntegrity() {
    const issues = [];
    
    // Check for data consistency
    if (this.metrics.agentPerformance.size === 0 && this.metrics.routingDecisions.length > 0) {
      issues.push('Missing agent performance data');
    }
    
    if (this.metrics.patternMatches.size === 0 && this.metrics.routingDecisions.length > 0) {
      issues.push('Missing pattern match data');
    }
    
    return {
      healthy: issues.length === 0,
      issues
    };
  }
}

module.exports = { RoutingMetrics };