/**
 * Enhanced Token Optimizer
 * Optimizes token usage through pattern reuse, context compression, and smart defaults
 * Now enhanced for vibe processing optimization
 */

const { OptimizationPatternLibrary } = require('./optimization-pattern-library');
const { SmartDefaultsEngine } = require('./smart-defaults-engine');
const { TokenCalculator } = require('./token-calculator');
const { VibeContextCompressor } = require('./vibe-context-compressor');
const { OptimizationCache } = require('./optimization-cache');
const { VibeExecutionPlanner } = require('./vibe-execution-planner');
const { OptimizationStatsManager } = require('./optimization-stats-manager');

class TokenOptimizer {
  constructor() {
    this.patternLibrary = new OptimizationPatternLibrary();
    this.compressionEngine = new VibeContextCompressor();
    this.smartDefaults = new SmartDefaultsEngine();
    this.tokenCalculator = new TokenCalculator();
    this.optimizationCache = new OptimizationCache();
    this.executionPlanner = new VibeExecutionPlanner(this.tokenCalculator);
    this.statsManager = new OptimizationStatsManager();
  }

  /**
   * Optimize vibe processing for token efficiency
   * @param {Object} requirements - Extracted requirements
   * @param {Object} userContext - User context
   * @returns {Object} Optimized processing plan
   */
  async optimizeVibeProcessing(requirements, userContext) {
    const startTime = Date.now();
    
    try {
      console.log('🎯 Optimizing vibe processing for token efficiency...');
      
      // 1. Check cache for similar optimization
      const cachedResult = this.optimizationCache.get(requirements, userContext);
      if (cachedResult) {
        return cachedResult;
      }

      // 2. Find applicable patterns from previous similar vibes
      const applicablePatterns = await this.patternLibrary.findPatternsForVibe(
        requirements, userContext
      );

      // 3. Compress context using learned patterns
      const compressedContext = await this.compressionEngine.compressVibeContext(
        requirements, applicablePatterns, userContext
      );

      // 4. Apply smart defaults to reduce explanation overhead
      const smartDefaults = await this.smartDefaults.generateDefaultsForVibe(
        requirements, applicablePatterns, userContext
      );

      // 5. Generate token-efficient execution plan
      const optimizedPlan = await this.executionPlanner.generateOptimizedVibePlan(
        requirements, compressedContext, applicablePatterns, smartDefaults
      );

      // 6. Calculate token savings
      const baseline = this.tokenCalculator.calculateVibeBaseline(requirements, userContext);
      const optimized = this.tokenCalculator.calculateOptimizedTokens(optimizedPlan);
      
      const tokenSavings = this.tokenCalculator.calculateTokenSavings(baseline, optimized);

      const result = {
        plan: optimizedPlan,
        patterns: applicablePatterns,
        compression: compressedContext,
        defaults: smartDefaults,
        tokenSavings: tokenSavings,
        processingTime: Date.now() - startTime,
        cacheKey: this.optimizationCache.generateCacheKey(requirements, userContext)
      };

      // Cache successful optimizations
      this.optimizationCache.set(requirements, userContext, result);

      // Update statistics
      this.statsManager.updateStats(tokenSavings, {
        type: 'vibe-processing',
        patterns: applicablePatterns.length,
        compressionRatio: compressedContext.compressionRatio,
        defaults: smartDefaults.applicableDefaults?.length || 0
      });

      console.log(`✅ Vibe optimization complete: ${tokenSavings.percentage}% token savings`);
      
      return result;

    } catch (error) {
      console.error('Vibe optimization error:', error);
      return this.createFallbackOptimization(requirements, userContext);
    }
  }

  /**
   * Legacy optimization method for general requirements
   * @param {Object} requirements - Requirements to optimize
   * @param {Object} userContext - User context
   * @returns {Object} Optimization result
   */
  async optimize(requirements, userContext) {
    // Delegate to vibe processing optimization for now
    return this.optimizeVibeProcessing(requirements, userContext);
  }

  /**
   * Create fallback optimization when main optimization fails
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {Object} Fallback optimization
   */
  createFallbackOptimization(requirements, userContext) {
    const baseline = this.tokenCalculator.calculateVibeBaseline(requirements, userContext);
    const fallbackResult = this.executionPlanner.createFallbackPlan(requirements, userContext, baseline);
    
    // Update stats for fallback
    this.statsManager.updateStats(fallbackResult.tokenSavings, {
      type: 'fallback',
      reason: 'optimization-error'
    });
    
    return fallbackResult;
  }

  /**
   * Get comprehensive optimization statistics
   * @returns {Object} Complete statistics from all components
   */
  getStats() {
    return this.statsManager.getStats({
      cache: this.optimizationCache,
      patternLibrary: this.patternLibrary,
      compressionEngine: this.compressionEngine,
      executionPlanner: this.executionPlanner
    });
  }

  /**
   * Get optimization trends and analysis
   * @param {number} hours - Hours to analyze (default: 24)
   * @returns {Object} Trend analysis
   */
  getTrends(hours = 24) {
    return this.statsManager.getTrends(hours);
  }

  /**
   * Get statistics breakdown by optimization type
   * @returns {Object} Breakdown analysis
   */
  getOptimizationBreakdown() {
    return this.statsManager.getOptimizationBreakdown();
  }

  /**
   * Export all optimization data for analysis
   * @returns {Object} Complete optimization data
   */
  exportOptimizationData() {
    return {
      stats: this.statsManager.exportStats(),
      cache: this.optimizationCache.export(),
      patterns: this.patternLibrary.getPatternCount(),
      compression: this.compressionEngine.getCompressionStats()
    };
  }

  /**
   * Reset all optimization statistics
   * @param {boolean} keepHistory - Whether to preserve historical data
   */
  resetStats(keepHistory = false) {
    this.statsManager.reset(keepHistory);
    if (!keepHistory) {
      this.compressionEngine.clearHistory();
    }
  }

  /**
   * Clear optimization cache
   */
  clearCache() {
    this.optimizationCache.clear();
  }

  /**
   * Get a summary of current optimization status
   * @returns {string} Formatted summary
   */
  getSummary() {
    return this.statsManager.getSummary();
  }
}

module.exports = { 
  TokenOptimizer
};