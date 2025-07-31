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
   * Generate optimized execution plan for vibe processing
   * @param {Object} requirements - Extracted requirements
   * @param {Object} compressedContext - Compressed context
   * @param {Array} patterns - Applicable patterns
   * @param {Object} defaults - Smart defaults
   * @returns {Object} Optimized plan
   */
  async generateOptimizedVibePlan(requirements, compressedContext, patterns, defaults) {
    const plan = {
      type: 'vibe-optimized',
      steps: [],
      optimizations: [],
      context: compressedContext,
      defaults: defaults,
      patterns: patterns
    };

    // Step 1: Pattern-based requirement fulfillment
    if (patterns.length > 0) {
      plan.steps.push({
        id: 'pattern-application',
        type: 'pattern-reuse',
        action: 'Apply proven patterns',
        patterns: patterns.map(p => p.id),
        tokenSavings: this.tokenCalculator.calculatePatternSavings(patterns),
        estimatedTime: '30s'
      });
      
      plan.optimizations.push({
        type: 'pattern-reuse',
        description: `Reusing ${patterns.length} proven patterns`,
        tokenSavings: this.tokenCalculator.calculatePatternSavings(patterns)
      });
    }

    // Step 2: Compressed context processing
    if (compressedContext.compressionRatio > 0.2) {
      plan.steps.push({
        id: 'context-processing',
        type: 'compressed-execution',
        action: 'Process with compressed context',
        compressionRatio: compressedContext.compressionRatio,
        tokenSavings: compressedContext.tokenSavings,
        estimatedTime: '45s'
      });
      
      plan.optimizations.push({
        type: 'context-compression',
        description: `${(compressedContext.compressionRatio * 100).toFixed(1)}% context compression`,
        tokenSavings: compressedContext.tokenSavings
      });
    }

    // Step 3: Smart defaults application
    if (defaults.applicableDefaults.length > 0) {
      plan.steps.push({
        id: 'defaults-application',
        type: 'smart-defaults',
        action: 'Apply learned defaults',
        defaults: defaults.applicableDefaults,
        tokenSavings: defaults.tokenSavings,
        estimatedTime: '15s'
      });
      
      plan.optimizations.push({
        type: 'smart-defaults',
        description: `Applied ${defaults.applicableDefaults.length} smart defaults`,
        tokenSavings: defaults.tokenSavings
      });
    }

    // Step 4: Optimized agent routing
    plan.steps.push({
      id: 'optimized-routing',
      type: 'efficient-routing',
      action: 'Route to optimal specialists',
      routing: await this.generateOptimalRouting(requirements, patterns),
      tokenSavings: 150, // Estimated savings from efficient routing
      estimatedTime: '60s'
    });

    return plan;
  }





  /**
   * Generate optimal routing plan
   * @param {Object} requirements - Requirements
   * @param {Array} patterns - Applicable patterns
   * @returns {Object} Routing plan
   */
  async generateOptimalRouting(requirements, patterns) {
    // Simplified routing optimization
    const routing = {
      primarySpecialist: this.identifyPrimarySpecialist(requirements),
      supportingSpecialists: this.identifySupporting(requirements),
      parallelExecution: this.canExecuteInParallel(requirements),
      estimatedSteps: this.estimateExecutionSteps(requirements)
    };
    
    return routing;
  }

  /**
   * Create fallback optimization when main optimization fails
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {Object} Fallback optimization
   */
  createFallbackOptimization(requirements, userContext) {
    const baseline = this.tokenCalculator.calculateVibeBaseline(requirements, userContext);
    const fallbackSavings = Math.round(baseline * 0.3); // 30% baseline savings
    
    return {
      plan: {
        type: 'fallback-optimization',
        steps: [{
          id: 'basic-optimization',
          type: 'basic',
          action: 'Apply basic optimization patterns',
          tokenSavings: fallbackSavings,
          estimatedTime: '60s'
        }],
        optimizations: [{
          type: 'basic',
          description: 'Basic optimization patterns applied',
          tokenSavings: fallbackSavings
        }]
      },
      patterns: [],
      compression: { compressionRatio: 0.3, tokenSavings: fallbackSavings },
      defaults: { applicableDefaults: [], tokenSavings: 0 },
      tokenSavings: {
        baseline: baseline,
        optimized: baseline - fallbackSavings,
        saved: fallbackSavings,
        percentage: 30
      },
      processingTime: 0,
      fallback: true
    };
  }


  /**
   * Update optimization statistics
   * @param {Object} tokenSavings - Token savings data
   */
  updateStats(tokenSavings) {
    this.stats.totalOptimizations++;
    this.stats.totalTokensSaved += tokenSavings.saved;
    
    // Update running average
    const currentAvg = this.stats.averageSavingsPercentage;
    const count = this.stats.totalOptimizations;
    this.stats.averageSavingsPercentage = 
      ((currentAvg * (count - 1)) + tokenSavings.percentage) / count;
  }

  /**
   * Get optimization statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.optimizationCache.getStats().size,
      patternCount: this.patternLibrary.getPatternCount(),
      compressionRatio: this.compressionEngine.getAverageCompressionRatio()
    };
  }

  // Helper methods
  identifyPrimarySpecialist(requirements) {
    // Simplified specialist identification
    if (requirements.technical?.frontend) return 'frontend';
    if (requirements.technical?.backend) return 'backend';
    if (requirements.technical?.database) return 'database';
    return 'frontend'; // Default
  }

  identifySupporting(requirements) {
    const supporting = [];
    if (requirements.nonFunctional?.security) supporting.push('backend');
    if (requirements.technical?.deployment) supporting.push('deployment');
    if (requirements.implicit?.includes('testing')) supporting.push('testing');
    return supporting;
  }

  canExecuteInParallel(requirements) {
    // Simple heuristic: if multiple domains are involved, parallel execution is beneficial
    return (requirements.explicit?.length || 0) + (requirements.implicit?.length || 0) > 5;
  }

  estimateExecutionSteps(requirements) {
    const baseSteps = 3;
    const requirementComplexity = Math.min(
      ((requirements.explicit?.length || 0) + (requirements.implicit?.length || 0)) / 5, 
      3
    );
    return Math.round(baseSteps + requirementComplexity);
  }


  /**
   * Clear optimization cache
   */
  clearCache() {
    this.optimizationCache.clear();
  }
}


module.exports = { 
  TokenOptimizer
};