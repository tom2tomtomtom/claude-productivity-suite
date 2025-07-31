/**
 * Optimization Stats Manager
 * Tracks and manages optimization statistics across all components
 */

class OptimizationStatsManager {
  constructor() {
    this.stats = {
      totalOptimizations: 0,
      totalTokensSaved: 0,
      averageSavingsPercentage: 0,
      sessionStartTime: Date.now(),
      bestOptimization: null,
      worstOptimization: null
    };
    this.optimizationHistory = [];
  }

  /**
   * Update optimization statistics
   * @param {Object} tokenSavings - Token savings data
   * @param {Object} metadata - Optional metadata about the optimization
   */
  updateStats(tokenSavings, metadata = {}) {
    this.stats.totalOptimizations++;
    this.stats.totalTokensSaved += tokenSavings.saved;
    
    // Update running average
    const currentAvg = this.stats.averageSavingsPercentage;
    const count = this.stats.totalOptimizations;
    this.stats.averageSavingsPercentage = 
      ((currentAvg * (count - 1)) + tokenSavings.percentage) / count;

    // Track best and worst optimizations
    const optimizationRecord = {
      ...tokenSavings,
      timestamp: Date.now(),
      ...metadata
    };

    this.optimizationHistory.push(optimizationRecord);

    if (!this.stats.bestOptimization || tokenSavings.percentage > this.stats.bestOptimization.percentage) {
      this.stats.bestOptimization = optimizationRecord;
    }

    if (!this.stats.worstOptimization || tokenSavings.percentage < this.stats.worstOptimization.percentage) {
      this.stats.worstOptimization = optimizationRecord;
    }

    // Limit history size to prevent memory bloat
    if (this.optimizationHistory.length > 1000) {
      this.optimizationHistory = this.optimizationHistory.slice(-500);
    }
  }

  /**
   * Get comprehensive optimization statistics
   * @param {Object} components - Component references for additional stats
   * @returns {Object} Complete statistics
   */
  getStats(components = {}) {
    const sessionDuration = Date.now() - this.stats.sessionStartTime;
    
    const baseStats = {
      ...this.stats,
      sessionDuration: this.formatDuration(sessionDuration),
      optimizationsPerHour: this.calculateOptimizationsPerHour(sessionDuration),
      tokensPerHour: this.calculateTokensPerHour(sessionDuration)
    };

    // Add component-specific stats if available
    if (components.cache) {
      baseStats.cache = components.cache.getStats();
    }

    if (components.patternLibrary) {
      baseStats.patternCount = components.patternLibrary.getPatternCount();
    }

    if (components.compressionEngine) {
      baseStats.compressionRatio = components.compressionEngine.getAverageCompressionRatio();
    }

    if (components.executionPlanner) {
      baseStats.planner = components.executionPlanner.getStats();
    }

    return baseStats;
  }

  /**
   * Get recent optimization trends
   * @param {number} hours - Number of hours to look back (default: 24)
   * @returns {Object} Trend analysis
   */
  getTrends(hours = 24) {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    const recentOptimizations = this.optimizationHistory.filter(
      opt => opt.timestamp >= cutoffTime
    );

    if (recentOptimizations.length === 0) {
      return {
        period: `${hours}h`,
        count: 0,
        averageSavings: 0,
        trend: 'no-data'
      };
    }

    const averageSavings = recentOptimizations.reduce((sum, opt) => 
      sum + opt.percentage, 0) / recentOptimizations.length;

    // Simple trend analysis - compare first half vs second half
    const midpoint = Math.floor(recentOptimizations.length / 2);
    const firstHalf = recentOptimizations.slice(0, midpoint);
    const secondHalf = recentOptimizations.slice(midpoint);

    let trend = 'stable';
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum, opt) => sum + opt.percentage, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, opt) => sum + opt.percentage, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) {
        trend = 'improving';
      } else if (secondAvg < firstAvg - 5) {
        trend = 'declining';
      }
    }

    return {
      period: `${hours}h`,
      count: recentOptimizations.length,
      averageSavings: Math.round(averageSavings * 100) / 100,
      trend
    };
  }

  /**
   * Get optimization breakdown by type
   * @returns {Object} Breakdown of optimizations by type
   */
  getOptimizationBreakdown() {
    const breakdown = {};
    
    this.optimizationHistory.forEach(opt => {
      const type = opt.type || 'general';
      if (!breakdown[type]) {
        breakdown[type] = {
          count: 0,
          totalSaved: 0,
          averageSavings: 0
        };
      }
      
      breakdown[type].count++;
      breakdown[type].totalSaved += opt.saved;
      breakdown[type].averageSavings = breakdown[type].totalSaved / breakdown[type].count;
    });

    return breakdown;
  }

  /**
   * Export statistics for analysis
   * @returns {Object} Exportable statistics
   */
  exportStats() {
    return {
      summary: this.stats,
      history: this.optimizationHistory,
      trends: {
        last24h: this.getTrends(24),
        last7d: this.getTrends(24 * 7),
        last30d: this.getTrends(24 * 30)
      },
      breakdown: this.getOptimizationBreakdown(),
      exportedAt: Date.now()
    };
  }

  /**
   * Reset statistics
   * @param {boolean} keepHistory - Whether to keep optimization history
   */
  reset(keepHistory = false) {
    this.stats = {
      totalOptimizations: 0,
      totalTokensSaved: 0,
      averageSavingsPercentage: 0,
      sessionStartTime: Date.now(),
      bestOptimization: null,
      worstOptimization: null
    };

    if (!keepHistory) {
      this.optimizationHistory = [];
    }

    console.log('📊 Optimization statistics reset');
  }

  // Helper methods
  calculateOptimizationsPerHour(sessionDuration) {
    const hours = sessionDuration / (1000 * 60 * 60);
    return hours > 0 ? Math.round((this.stats.totalOptimizations / hours) * 100) / 100 : 0;
  }

  calculateTokensPerHour(sessionDuration) {
    const hours = sessionDuration / (1000 * 60 * 60);
    return hours > 0 ? Math.round((this.stats.totalTokensSaved / hours) * 100) / 100 : 0;
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Get statistics summary for console output
   * @returns {string} Formatted statistics summary
   */
  getSummary() {
    const stats = this.stats;
    
    return [
      `📊 Optimization Statistics:`,
      `   Total optimizations: ${stats.totalOptimizations}`,
      `   Total tokens saved: ${stats.totalTokensSaved.toLocaleString()}`,
      `   Average savings: ${stats.averageSavingsPercentage.toFixed(1)}%`,
      `   Best optimization: ${stats.bestOptimization?.percentage.toFixed(1)}%`,
      `   Session duration: ${this.formatDuration(Date.now() - stats.sessionStartTime)}`
    ].join('\n');
  }
}

module.exports = { OptimizationStatsManager };