/**
 * Smart Defaults Engine
 * Applies intelligent defaults to reduce specification overhead and token usage
 */

class SmartDefaultsEngine {
  constructor() {
    this.defaultsLibrary = this.initializeDefaults();
  }

  /**
   * Generate smart defaults for vibe processing
   * @param {Object} requirements - Requirements
   * @param {Array} patterns - Applicable patterns
   * @param {Object} userContext - User context
   * @returns {Object} Smart defaults
   */
  async generateDefaultsForVibe(requirements, patterns, userContext) {
    const applicableDefaults = [];
    let tokenSavings = 0;
    
    // Technology defaults based on patterns
    if (patterns.length > 0) {
      const techDefaults = this.extractTechDefaults(patterns);
      applicableDefaults.push(...techDefaults);
      tokenSavings += techDefaults.length * 25; // 25 tokens saved per default
    }
    
    // User type defaults
    if (userContext.userType && this.defaultsLibrary.userType[userContext.userType]) {
      const userDefaults = this.defaultsLibrary.userType[userContext.userType];
      applicableDefaults.push(...userDefaults);
      tokenSavings += userDefaults.length * 20;
    }
    
    // Scale-based defaults
    if (userContext.scale && this.defaultsLibrary.scale[userContext.scale]) {
      const scaleDefaults = this.defaultsLibrary.scale[userContext.scale];
      applicableDefaults.push(...scaleDefaults);
      tokenSavings += scaleDefaults.length * 15;
    }
    
    return {
      applicableDefaults: applicableDefaults,
      tokenSavings: tokenSavings,
      reasoning: this.generateDefaultsReasoning(applicableDefaults)
    };
  }

  extractTechDefaults(patterns) {
    const defaults = [];
    
    patterns.forEach(pattern => {
      if (pattern.requirements?.technical) {
        Object.entries(pattern.requirements.technical).forEach(([key, value]) => {
          defaults.push({
            category: 'technology',
            key: key,
            value: value,
            confidence: pattern.applicabilityScore || 0.8
          });
        });
      }
    });
    
    return defaults;
  }

  generateDefaultsReasoning(defaults) {
    const categories = {};
    defaults.forEach(def => {
      categories[def.category] = (categories[def.category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([category, count]) => 
      `${count} ${category} defaults applied`
    ).join(', ');
  }

  initializeDefaults() {
    return {
      userType: {
        'personal': [
          { category: 'hosting', key: 'tier', value: 'free', confidence: 0.9 },
          { category: 'complexity', key: 'level', value: 'simple', confidence: 0.8 }
        ],
        'entrepreneur': [
          { category: 'features', key: 'analytics', value: 'enabled', confidence: 0.8 },
          { category: 'security', key: 'ssl', value: 'enabled', confidence: 0.9 }
        ],
        'creative': [
          { category: 'design', key: 'style', value: 'visual-focused', confidence: 0.8 },
          { category: 'features', key: 'image-optimization', value: 'enabled', confidence: 0.9 }
        ]
      },
      scale: {
        'small': [
          { category: 'hosting', key: 'type', value: 'static', confidence: 0.8 },
          { category: 'database', key: 'type', value: 'file-based', confidence: 0.7 }
        ],
        'medium': [
          { category: 'hosting', key: 'type', value: 'serverless', confidence: 0.7 },
          { category: 'database', key: 'type', value: 'cloud-database', confidence: 0.8 }
        ],
        'large': [
          { category: 'hosting', key: 'type', value: 'scalable-cloud', confidence: 0.9 },
          { category: 'monitoring', key: 'enabled', value: true, confidence: 0.9 }
        ]
      }
    };
  }
}

module.exports = { SmartDefaultsEngine };