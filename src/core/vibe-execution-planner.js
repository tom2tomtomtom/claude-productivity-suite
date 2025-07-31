/**
 * Vibe Execution Planner
 * Generates optimized execution plans for vibe processing
 */

class VibeExecutionPlanner {
  constructor(tokenCalculator) {
    this.tokenCalculator = tokenCalculator;
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
      const patternSavings = this.tokenCalculator.calculatePatternSavings(patterns);
      
      plan.steps.push({
        id: 'pattern-application',
        type: 'pattern-reuse',
        action: 'Apply proven patterns',
        patterns: patterns.map(p => p.id),
        tokenSavings: patternSavings,
        estimatedTime: this.estimatePatternApplicationTime(patterns)
      });
      
      plan.optimizations.push({
        type: 'pattern-reuse',
        description: `Reusing ${patterns.length} proven patterns`,
        tokenSavings: patternSavings
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
        estimatedTime: this.estimateContextProcessingTime(compressedContext)
      });
      
      plan.optimizations.push({
        type: 'context-compression',
        description: `${(compressedContext.compressionRatio * 100).toFixed(1)}% context compression`,
        tokenSavings: compressedContext.tokenSavings
      });
    }

    // Step 3: Smart defaults application
    if (defaults.applicableDefaults && defaults.applicableDefaults.length > 0) {
      plan.steps.push({
        id: 'defaults-application',
        type: 'smart-defaults',
        action: 'Apply learned defaults',
        defaults: defaults.applicableDefaults,
        tokenSavings: defaults.tokenSavings,
        estimatedTime: this.estimateDefaultsApplicationTime(defaults)
      });
      
      plan.optimizations.push({
        type: 'smart-defaults',
        description: `Applied ${defaults.applicableDefaults.length} smart defaults`,
        tokenSavings: defaults.tokenSavings
      });
    }

    // Step 4: Optimized agent routing
    const routing = await this.generateOptimalRouting(requirements, patterns);
    plan.steps.push({
      id: 'optimized-routing',
      type: 'efficient-routing',
      action: 'Route to optimal specialists',
      routing: routing,
      tokenSavings: this.estimateRoutingSavings(routing),
      estimatedTime: this.estimateRoutingTime(routing)
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
    const routing = {
      primarySpecialist: this.identifyPrimarySpecialist(requirements),
      supportingSpecialists: this.identifySupporting(requirements),
      parallelExecution: this.canExecuteInParallel(requirements),
      estimatedSteps: this.estimateExecutionSteps(requirements),
      complexity: this.assessRoutingComplexity(requirements, patterns)
    };
    
    return routing;
  }

  /**
   * Create fallback optimization plan when main optimization fails
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @param {number} baseline - Baseline token count
   * @returns {Object} Fallback optimization
   */
  createFallbackPlan(requirements, userContext, baseline) {
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
      tokenSavings: this.tokenCalculator.calculateTokenSavings(baseline, baseline - fallbackSavings),
      processingTime: 0,
      fallback: true
    };
  }

  // Helper methods for specialist identification
  identifyPrimarySpecialist(requirements) {
    if (requirements.technical?.frontend) return 'frontend';
    if (requirements.technical?.backend) return 'backend';
    if (requirements.technical?.database) return 'database';
    if (requirements.domain === 'ecommerce') return 'backend'; // Commerce needs backend first
    if (requirements.domain === 'blog') return 'frontend'; // Blogs are frontend-heavy
    return 'frontend'; // Default to frontend
  }

  identifySupporting(requirements) {
    const supporting = [];
    if (requirements.nonFunctional?.security) supporting.push('backend');
    if (requirements.technical?.deployment) supporting.push('deployment');
    if (requirements.implicit?.includes('testing')) supporting.push('testing');
    if (requirements.explicit?.some(req => req.includes('analytics'))) supporting.push('analytics');
    return supporting;
  }

  canExecuteInParallel(requirements) {
    const totalRequirements = (requirements.explicit?.length || 0) + (requirements.implicit?.length || 0);
    return totalRequirements > 5;
  }

  estimateExecutionSteps(requirements) {
    const baseSteps = 3;
    const requirementComplexity = Math.min(
      ((requirements.explicit?.length || 0) + (requirements.implicit?.length || 0)) / 5, 
      3
    );
    return Math.round(baseSteps + requirementComplexity);
  }

  assessRoutingComplexity(requirements, patterns) {
    let complexity = 'medium';
    
    const totalRequirements = (requirements.explicit?.length || 0) + (requirements.implicit?.length || 0);
    const hasComplexTech = requirements.technical && Object.keys(requirements.technical).length > 3;
    const hasPatterns = patterns.length > 0;
    
    if (totalRequirements > 10 || hasComplexTech) {
      complexity = 'high';
    } else if (totalRequirements < 3 && hasPatterns) {
      complexity = 'low';
    }
    
    return complexity;
  }

  // Time estimation helpers
  estimatePatternApplicationTime(patterns) {
    const baseTime = 30; // seconds
    const additionalTime = patterns.length * 10;
    return `${baseTime + additionalTime}s`;
  }

  estimateContextProcessingTime(compressedContext) {
    const baseTime = 45; // seconds
    const complexityFactor = (1 - compressedContext.compressionRatio) * 20;
    return `${Math.round(baseTime + complexityFactor)}s`;
  }

  estimateDefaultsApplicationTime(defaults) {
    const baseTime = 15; // seconds
    const additionalTime = defaults.applicableDefaults.length * 2;
    return `${baseTime + additionalTime}s`;
  }

  estimateRoutingTime(routing) {
    let baseTime = 60; // seconds
    
    if (routing.parallelExecution) {
      baseTime = Math.round(baseTime * 0.7); // 30% faster with parallel execution
    }
    
    if (routing.complexity === 'high') {
      baseTime = Math.round(baseTime * 1.3); // 30% slower for complex routing
    } else if (routing.complexity === 'low') {
      baseTime = Math.round(baseTime * 0.8); // 20% faster for simple routing
    }
    
    return `${baseTime}s`;
  }

  estimateRoutingSavings(routing) {
    let baseSavings = 150;
    
    if (routing.parallelExecution && routing.supportingSpecialists.length > 1) {
      baseSavings += 50; // Additional savings from parallel execution
    }
    
    if (routing.complexity === 'low') {
      baseSavings += 25; // Simpler routing saves more tokens
    }
    
    return baseSavings;
  }

  /**
   * Get planner statistics
   * @returns {Object} Planning statistics
   */
  getStats() {
    return {
      name: 'VibeExecutionPlanner',
      version: '1.0.0',
      capabilities: [
        'pattern-application',
        'context-compression',
        'smart-defaults',
        'optimized-routing',
        'fallback-planning'
      ]
    };
  }
}

module.exports = { VibeExecutionPlanner };