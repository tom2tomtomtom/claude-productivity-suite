/**
 * Token Calculator
 * Handles all token usage calculations and estimations for optimization
 */

class TokenCalculator {
  constructor() {
    this.baseProcessingTokens = 500;
    this.baseOptimizedTokens = 200;
    this.baseContextTokens = 100;
  }

  /**
   * Calculate baseline token usage for vibe processing
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {number} Baseline token count
   */
  calculateVibeBaseline(requirements, userContext) {
    let baseline = this.baseProcessingTokens;
    
    // Add tokens for explicit requirements
    baseline += (requirements.explicit?.length || 0) * 50;
    
    // Add tokens for implicit requirements
    baseline += (requirements.implicit?.length || 0) * 30;
    
    // Add tokens for functional requirements
    baseline += (requirements.functional?.length || 0) * 40;
    
    // Add tokens for non-functional requirements
    if (requirements.nonFunctional) {
      baseline += Object.keys(requirements.nonFunctional).length * 60;
    }
    
    // Add tokens for technical requirements
    if (requirements.technical) {
      baseline += Object.keys(requirements.technical).length * 70;
    }
    
    // Add tokens for context processing
    baseline += this.estimateContextTokens(userContext);
    
    return baseline;
  }

  /**
   * Calculate optimized token usage
   * @param {Object} plan - Optimized plan
   * @returns {number} Optimized token count
   */
  calculateOptimizedTokens(plan) {
    let optimized = this.baseOptimizedTokens;
    
    // Add remaining tokens after optimizations
    plan.optimizations.forEach(opt => {
      optimized += Math.max(0, 100 - opt.tokenSavings); // Reduced tokens per optimization
    });
    
    // Add tokens for compressed context
    if (plan.context?.originalSize) {
      optimized += Math.round(plan.context.originalSize * (1 - plan.context.compressionRatio));
    }
    
    return optimized;
  }

  /**
   * Calculate pattern-based savings
   * @param {Array} patterns - Applicable patterns
   * @returns {number} Token savings from patterns
   */
  calculatePatternSavings(patterns) {
    return patterns.reduce((total, pattern) => {
      if (!pattern) return total;
      return total + (pattern.averageTokenSavings || 100);
    }, 0);
  }

  /**
   * Estimate context processing tokens
   * @param {Object} userContext - User context
   * @returns {number} Estimated tokens
   */
  estimateContextTokens(userContext) {
    let tokens = this.baseContextTokens;
    
    if (userContext.businessContext) tokens += 150;
    if (userContext.technicalLevel) tokens += 50;
    if (userContext.constraints?.length) tokens += userContext.constraints.length * 30;
    if (userContext.goals?.length) tokens += userContext.goals.length * 25;
    
    return tokens;
  }

  /**
   * Calculate token savings summary
   * @param {number} baseline - Baseline token count
   * @param {number} optimized - Optimized token count
   * @returns {Object} Token savings summary
   */
  calculateTokenSavings(baseline, optimized) {
    const saved = baseline - optimized;
    const percentage = baseline > 0 ? Math.round((saved / baseline) * 100) : 0;
    
    return {
      baseline,
      optimized,
      saved,
      percentage
    };
  }

  /**
   * Estimate tokens from text length
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokensFromText(text) {
    if (!text || typeof text !== 'string') return 0;
    
    // Rough estimation: 1 token per 4 characters
    return Math.round(text.length / 4);
  }

  /**
   * Calculate tokens for object structure
   * @param {Object} obj - Object to estimate
   * @returns {number} Estimated token count
   */
  estimateTokensFromObject(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    
    const jsonString = JSON.stringify(obj);
    return this.estimateTokensFromText(jsonString);
  }

  /**
   * Get configuration for token calculation weights
   * @returns {Object} Token calculation weights
   */
  getCalculationWeights() {
    if (!this.calculationWeights) {
      this.calculationWeights = {
        explicitRequirement: 50,
        implicitRequirement: 30,
        functionalRequirement: 40,
        nonFunctionalRequirement: 60,
        technicalRequirement: 70,
        businessContext: 150,
        technicalLevel: 50,
        constraint: 30,
        goal: 25
      };
    }
    return this.calculationWeights;
  }

  /**
   * Update calculation weights
   * @param {Object} newWeights - New weight values
   */
  updateCalculationWeights(newWeights) {
    const weights = this.getCalculationWeights();
    Object.assign(weights, newWeights);
  }
}

module.exports = { TokenCalculator };