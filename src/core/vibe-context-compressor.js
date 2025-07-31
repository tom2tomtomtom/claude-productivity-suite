/**
 * Vibe Context Compressor
 * Compresses vibe context for token efficiency while preserving essential information
 */

class VibeContextCompressor {
  constructor() {
    this.compressionHistory = [];
    this.maxEssentialExplicit = 5;
    this.maxEssentialImplicit = 8;
  }

  /**
   * Compress vibe context for token efficiency
   * @param {Object} requirements - Requirements
   * @param {Array} patterns - Applicable patterns
   * @param {Object} userContext - User context
   * @returns {Object} Compressed context
   */
  async compressVibeContext(requirements, patterns, userContext) {
    const originalSize = this.estimateContextSize({ requirements, patterns, userContext });
    
    const compressed = {
      essentialRequirements: this.extractEssential(requirements),
      patternBasedDefaults: this.extractPatternDefaults(patterns),
      contextSummary: this.summarizeContext(userContext),
      compressionMetadata: {
        originalSize: originalSize,
        timestamp: Date.now()
      }
    };
    
    const compressedSize = this.estimateContextSize(compressed);
    const compressionRatio = originalSize > 0 ? Math.max(0, (originalSize - compressedSize) / originalSize) : 0;
    
    compressed.compressionRatio = compressionRatio;
    compressed.tokenSavings = Math.max(0, Math.round(originalSize * compressionRatio));
    
    this.compressionHistory.push({
      originalSize,
      compressedSize,
      compressionRatio,
      timestamp: Date.now()
    });
    
    console.log(`🗜️ Context compressed: ${(compressionRatio * 100).toFixed(1)}% reduction`);
    
    return compressed;
  }

  /**
   * Extract essential requirements, keeping only the most important
   * @param {Object} requirements - Full requirements object
   * @returns {Object} Essential requirements only
   */
  extractEssential(requirements) {
    if (!requirements) return {};
    
    return {
      explicit: (requirements.explicit || []).slice(0, this.maxEssentialExplicit),
      implicit: (requirements.implicit || []).slice(0, this.maxEssentialImplicit),
      domain: requirements.domain,
      complexity: requirements.complexity
    };
  }

  /**
   * Extract defaults from patterns to avoid re-explaining
   * @param {Array} patterns - Applicable patterns
   * @returns {Object} Pattern-based defaults
   */
  extractPatternDefaults(patterns) {
    const defaults = {};
    
    if (!patterns || !Array.isArray(patterns)) return defaults;
    
    patterns.forEach(pattern => {
      if (pattern && pattern.requirements) {
        Object.keys(pattern.requirements).forEach(key => {
          defaults[key] = pattern.requirements[key];
        });
      }
    });
    
    return defaults;
  }

  /**
   * Compress context to essential information only
   * @param {Object} userContext - Full user context
   * @returns {Object} Summarized context
   */
  summarizeContext(userContext) {
    if (!userContext) return {};
    
    return {
      userType: userContext.userType,
      technicalLevel: userContext.technicalLevel,
      scale: userContext.scale,
      budget: userContext.budget,
      primaryGoal: userContext.goals?.[0] || 'general-purpose'
    };
  }

  /**
   * Estimate context size in tokens
   * @param {Object} context - Context to estimate
   * @returns {number} Estimated token count
   */
  estimateContextSize(context) {
    if (!context) return 0;
    
    try {
      const str = JSON.stringify(context);
      return Math.round(str.length / 4); // Rough token estimation (1 token per 4 characters)
    } catch (error) {
      console.warn('Error estimating context size:', error);
      return 0;
    }
  }

  /**
   * Get average compression ratio from history
   * @returns {number} Average compression ratio
   */
  getAverageCompressionRatio() {
    if (this.compressionHistory.length === 0) return 0;
    
    const totalRatio = this.compressionHistory.reduce((sum, record) => 
      sum + record.compressionRatio, 0
    );
    
    return totalRatio / this.compressionHistory.length;
  }

  /**
   * Get compression statistics
   * @returns {Object} Compression statistics
   */
  getCompressionStats() {
    const history = this.compressionHistory;
    if (history.length === 0) {
      return {
        totalCompressions: 0,
        averageRatio: 0,
        totalTokensSaved: 0,
        averageOriginalSize: 0,
        averageCompressedSize: 0
      };
    }

    const totalTokensSaved = history.reduce((sum, record) => 
      sum + Math.max(0, record.originalSize - record.compressedSize), 0
    );
    
    const averageOriginalSize = history.reduce((sum, record) => 
      sum + record.originalSize, 0) / history.length;
    
    const averageCompressedSize = history.reduce((sum, record) => 
      sum + record.compressedSize, 0) / history.length;

    return {
      totalCompressions: history.length,
      averageRatio: this.getAverageCompressionRatio(),
      totalTokensSaved,
      averageOriginalSize: Math.round(averageOriginalSize),
      averageCompressedSize: Math.round(averageCompressedSize)
    };
  }

  /**
   * Clear compression history
   */
  clearHistory() {
    this.compressionHistory = [];
    console.log('🧹 Compression history cleared');
  }

  /**
   * Configure compression limits
   * @param {Object} limits - New limits for compression
   */
  setCompressionLimits(limits) {
    if (limits.maxEssentialExplicit !== undefined) {
      this.maxEssentialExplicit = Math.max(1, limits.maxEssentialExplicit);
    }
    if (limits.maxEssentialImplicit !== undefined) {
      this.maxEssentialImplicit = Math.max(1, limits.maxEssentialImplicit);
    }
  }

  /**
   * Get current compression limits
   * @returns {Object} Current compression limits
   */
  getCompressionLimits() {
    return {
      maxEssentialExplicit: this.maxEssentialExplicit,
      maxEssentialImplicit: this.maxEssentialImplicit
    };
  }
}

module.exports = { VibeContextCompressor };