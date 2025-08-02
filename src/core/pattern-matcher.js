/**
 * Pattern Matcher - Identifies patterns in user commands and contexts
 * Supports intelligent routing and optimization decisions
 */

class PatternMatcher {
  constructor() {
    this.patterns = new Map();
    this.initializePatterns();
  }

  initializePatterns() {
    // Frontend patterns
    this.patterns.set('frontend', {
      keywords: ['ui', 'interface', 'design', 'visual', 'style', 'component', 'react', 'vue', 'angular'],
      phrases: ['make it look better', 'improve design', 'fix styling', 'responsive design'],
      confidence: 0.9
    });

    // Backend patterns
    this.patterns.set('backend', {
      keywords: ['api', 'server', 'endpoint', 'database', 'auth', 'authentication', 'logic', 'service'],
      phrases: ['create api', 'backend logic', 'server side', 'data processing'],
      confidence: 0.9
    });

    // Database patterns
    this.patterns.set('database', {
      keywords: ['database', 'data', 'sql', 'nosql', 'schema', 'query', 'model', 'table'],
      phrases: ['database design', 'data model', 'store data', 'query data'],
      confidence: 0.85
    });

    // Testing patterns
    this.patterns.set('testing', {
      keywords: ['test', 'testing', 'spec', 'unit', 'integration', 'e2e', 'coverage', 'quality'],
      phrases: ['write tests', 'test coverage', 'quality assurance', 'run tests'],
      confidence: 0.8
    });

    // Deployment patterns
    this.patterns.set('deployment', {
      keywords: ['deploy', 'deployment', 'production', 'hosting', 'cloud', 'aws', 'heroku', 'vercel'],
      phrases: ['deploy app', 'go live', 'production ready', 'host application'],
      confidence: 0.85
    });

    // Optimization patterns
    this.patterns.set('optimization', {
      keywords: ['optimize', 'performance', 'speed', 'efficiency', 'token', 'cost', 'improve'],
      phrases: ['make faster', 'optimize performance', 'reduce cost', 'improve efficiency'],
      confidence: 0.75
    });

    // Planning patterns
    this.patterns.set('planning', {
      keywords: ['plan', 'planning', 'strategy', 'roadmap', 'organize', 'structure', 'architecture'],
      phrases: ['create plan', 'project planning', 'organize project', 'strategy development'],
      confidence: 0.7
    });
  }

  /**
   * Match user input against known patterns
   * @param {string} input - User input to analyze
   * @param {Object} context - Additional context
   * @returns {Array} Array of pattern matches with confidence scores
   */
  matchPatterns(input, context = {}) {
    const normalizedInput = input.toLowerCase();
    const matches = [];

    for (const [patternType, pattern] of this.patterns) {
      const score = this.calculatePatternScore(normalizedInput, pattern, context);
      
      if (score > 0.3) { // Minimum threshold for considering a match
        matches.push({
          type: patternType,
          confidence: score,
          pattern: pattern,
          reasoning: this.generateReasoning(normalizedInput, pattern)
        });
      }
    }

    // Sort by confidence score (highest first)
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate confidence score for a pattern match
   * @param {string} input - Normalized user input
   * @param {Object} pattern - Pattern to match against
   * @param {Object} context - Additional context
   * @returns {number} Confidence score (0-1)
   */
  calculatePatternScore(input, pattern, context) {
    let score = 0;
    let matchCount = 0;
    let totalWords = input.split(/\s+/).length;

    // Check keyword matches
    for (const keyword of pattern.keywords) {
      if (input.includes(keyword)) {
        score += 0.8; // High weight for keyword matches
        matchCount++;
      }
    }

    // Check phrase matches (higher weight)
    for (const phrase of pattern.phrases) {
      if (input.includes(phrase)) {
        score += 1.2; // Very high weight for phrase matches
        matchCount++;
      }
    }

    // Apply context bonuses
    if (context.previousPatterns) {
      const contextBonus = this.calculateContextBonus(pattern, context.previousPatterns);
      score += contextBonus;
    }

    // Normalize score based on input length and base confidence
    const normalizedScore = Math.min(score / Math.max(totalWords * 0.3, 1), 1.0);
    
    return normalizedScore * pattern.confidence;
  }

  /**
   * Calculate context bonus based on previous patterns
   * @param {Object} pattern - Current pattern
   * @param {Array} previousPatterns - Previous pattern matches
   * @returns {number} Context bonus score
   */
  calculateContextBonus(pattern, previousPatterns) {
    let bonus = 0;
    
    // Define pattern relationships
    const relationships = {
      'backend': ['database', 'testing', 'deployment'],
      'frontend': ['testing', 'deployment'],
      'database': ['backend', 'testing'],
      'testing': ['deployment'],
      'planning': ['frontend', 'backend', 'database', 'testing', 'deployment']
    };

    // Check if current pattern is related to previous patterns
    for (const prevPattern of previousPatterns) {
      if (relationships[prevPattern.type]?.includes(pattern.type)) {
        bonus += 0.2; // Small bonus for related patterns
      }
    }

    return Math.min(bonus, 0.5); // Cap the context bonus
  }

  /**
   * Generate reasoning for pattern match
   * @param {string} input - User input
   * @param {Object} pattern - Matched pattern
   * @returns {string} Human-readable reasoning
   */
  generateReasoning(input, pattern) {
    const matchedKeywords = pattern.keywords.filter(keyword => input.includes(keyword));
    const matchedPhrases = pattern.phrases.filter(phrase => input.includes(phrase));
    
    const reasons = [];
    
    if (matchedKeywords.length > 0) {
      reasons.push(`Keywords: ${matchedKeywords.slice(0, 3).join(', ')}`);
    }
    
    if (matchedPhrases.length > 0) {
      reasons.push(`Phrases: ${matchedPhrases.slice(0, 2).join(', ')}`);
    }
    
    return reasons.join('; ') || 'Pattern characteristics detected';
  }

  /**
   * Get the best pattern match
   * @param {string} input - User input
   * @param {Object} context - Additional context
   * @returns {Object|null} Best pattern match or null
   */
  getBestMatch(input, context = {}) {
    const matches = this.matchPatterns(input, context);
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Check if input matches specific pattern type
   * @param {string} input - User input
   * @param {string} patternType - Pattern type to check
   * @param {Object} context - Additional context
   * @returns {Object|null} Match result or null
   */
  matchPattern(input, patternType, context = {}) {
    const pattern = this.patterns.get(patternType);
    if (!pattern) return null;

    const score = this.calculatePatternScore(input.toLowerCase(), pattern, context);
    
    if (score > 0.3) {
      return {
        type: patternType,
        confidence: score,
        pattern: pattern,
        reasoning: this.generateReasoning(input.toLowerCase(), pattern)
      };
    }
    
    return null;
  }

  /**
   * Add or update a pattern
   * @param {string} patternType - Pattern type identifier
   * @param {Object} pattern - Pattern configuration
   */
  addPattern(patternType, pattern) {
    this.patterns.set(patternType, {
      keywords: pattern.keywords || [],
      phrases: pattern.phrases || [],
      confidence: pattern.confidence || 0.5,
      ...pattern
    });
  }

  /**
   * Get all available pattern types
   * @returns {Array} Array of pattern type names
   */
  getPatternTypes() {
    return Array.from(this.patterns.keys());
  }

  /**
   * Get pattern statistics
   * @returns {Object} Pattern usage statistics
   */
  getStats() {
    return {
      totalPatterns: this.patterns.size,
      patternTypes: this.getPatternTypes(),
      averageKeywords: this.calculateAverageKeywords(),
      averagePhrases: this.calculateAveragePhrases()
    };
  }

  calculateAverageKeywords() {
    let total = 0;
    for (const pattern of this.patterns.values()) {
      total += pattern.keywords.length;
    }
    return total / this.patterns.size;
  }

  calculateAveragePhrases() {
    let total = 0;
    for (const pattern of this.patterns.values()) {
      total += pattern.phrases.length;
    }
    return total / this.patterns.size;
  }
}

module.exports = { PatternMatcher };