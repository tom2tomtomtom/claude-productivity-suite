/**
 * Vibe Learning Engine
 * Learns from successful vibe interpretations to improve future accuracy
 */

class VibeLearningEngine {
  constructor() {
    this.interpretationDatabase = new InterpretationDatabase();
    this.successPatterns = new SuccessPatternLibrary();
    this.failureAnalyzer = new FailureAnalyzer();
    this.learningStats = {
      totalInterpretations: 0,
      successfulInterpretations: 0,
      averageConfidence: 0,
      improvementRate: 0
    };
  }

  /**
   * Record a new vibe interpretation
   * @param {string} vibe - Original vibe text
   * @param {Object} requirements - Extracted requirements
   * @param {Object} plan - Optimization plan
   * @param {Object} result - Full interpretation result
   * @returns {string} Interpretation ID for later outcome recording
   */
  async recordInterpretation(vibe, requirements, plan, result) {
    const interpretationId = this.generateInterpretationId();
    
    const record = {
      id: interpretationId,
      timestamp: Date.now(),
      vibe: {
        original: vibe,
        normalized: result.originalVibe,
        keywords: result.interpretation?.keywords || [],
        complexity: result.interpretation?.complexity || 'medium'
      },
      requirements: requirements,
      plan: plan,
      domain: result.domain,
      confidence: result.confidence,
      tokenSavings: result.tokenSavings,
      processingTime: result.processingTime,
      outcome: null, // Will be updated when outcome is known
      userFeedback: null
    };

    await this.interpretationDatabase.store(record);
    this.updateStats(record);
    
    console.log(`📚 Recorded interpretation ${interpretationId} for learning`);
    return interpretationId;
  }

  /**
   * Record the outcome of an interpretation
   * @param {string} interpretationId - ID of the interpretation
   * @param {Object} outcome - Success/failure outcome with details
   */
  async recordOutcome(interpretationId, outcome) {
    try {
      const record = await this.interpretationDatabase.get(interpretationId);
      if (!record) {
        console.warn(`Interpretation ${interpretationId} not found for outcome recording`);
        return;
      }

      record.outcome = {
        success: outcome.success,
        userSatisfaction: outcome.userSatisfaction || null,
        actualRequirements: outcome.actualRequirements || null,
        completionTime: outcome.completionTime || null,
        tokensUsed: outcome.tokensUsed || null,
        issues: outcome.issues || [],
        timestamp: Date.now()
      };

      await this.interpretationDatabase.update(interpretationId, record);

      if (outcome.success) {
        await this.successPatterns.addPattern(record);
        this.learningStats.successfulInterpretations++;
      } else {
        await this.failureAnalyzer.analyzeFailure(record);
      }

      console.log(`📊 Recorded outcome for interpretation ${interpretationId}: ${outcome.success ? 'success' : 'failure'}`);
      
    } catch (error) {
      console.error('Error recording outcome:', error);
    }
  }

  /**
   * Record user feedback on interpretation quality
   * @param {string} interpretationId - ID of the interpretation
   * @param {Object} feedback - User feedback
   */
  async recordUserFeedback(interpretationId, feedback) {
    try {
      const record = await this.interpretationDatabase.get(interpretationId);
      if (!record) return;

      record.userFeedback = {
        satisfaction: feedback.satisfaction, // 1-5 scale
        accuracy: feedback.accuracy, // 1-5 scale
        completeness: feedback.completeness, // 1-5 scale
        comments: feedback.comments || '',
        wouldRecommend: feedback.wouldRecommend || false,
        timestamp: Date.now()
      };

      await this.interpretationDatabase.update(interpretationId, record);
      
      // Use feedback to improve future interpretations
      await this.incorporateFeedback(record);
      
      console.log(`💬 Recorded user feedback for interpretation ${interpretationId}`);
      
    } catch (error) {
      console.error('Error recording user feedback:', error);
    }
  }

  /**
   * Improve interpretation based on similar successful cases
   * @param {string} vibe - New vibe to interpret
   * @param {Object} userContext - User context
   * @returns {Object} Improvement suggestions
   */
  async improveInterpretation(vibe, userContext) {
    try {
      // Find similar successful interpretations
      const similarSuccess = await this.successPatterns.findSimilar(vibe, userContext);
      
      if (similarSuccess.length === 0) {
        return { improvements: [], confidence: 0.5 };
      }

      // Extract improvements from successful patterns
      const improvements = await this.extractImprovements(similarSuccess, vibe, userContext);
      
      // Calculate confidence boost from learning
      const confidenceBoost = this.calculateConfidenceBoost(similarSuccess);
      
      console.log(`🎯 Found ${improvements.length} improvement suggestions from learning`);
      
      return {
        improvements: improvements,
        confidence: confidenceBoost,
        basedOnCases: similarSuccess.length,
        patterns: this.extractSuccessPatterns(similarSuccess)
      };
      
    } catch (error) {
      console.error('Error improving interpretation:', error);
      return { improvements: [], confidence: 0.5 };
    }
  }

  /**
   * Get learning statistics
   * @returns {Object} Learning statistics
   */
  getStats() {
    return {
      ...this.learningStats,
      successRate: this.learningStats.totalInterpretations > 0 
        ? (this.learningStats.successfulInterpretations / this.learningStats.totalInterpretations) * 100 
        : 0,
      databaseSize: this.interpretationDatabase.size(),
      patternCount: this.successPatterns.size()
    };
  }

  /**
   * Get interpretation count
   * @returns {number} Total interpretations processed
   */
  getInterpretationCount() {
    return this.learningStats.totalInterpretations;
  }

  /**
   * Get average confidence
   * @returns {number} Average confidence score
   */
  getAverageConfidence() {
    return this.learningStats.averageConfidence;
  }

  /**
   * Perform weekly learning cycle
   * @returns {Object} Learning cycle results
   */
  async performLearningCycle() {
    console.log('🔄 Starting weekly learning cycle...');
    
    try {
      // Analyze recent interpretations
      const recentInterpretations = await this.interpretationDatabase.getRecent(7); // Last 7 days
      
      // Update success patterns
      const newPatterns = await this.successPatterns.updatePatterns(recentInterpretations);
      
      // Analyze failures and improve
      const failureInsights = await this.failureAnalyzer.generateInsights(recentInterpretations);
      
      // Update improvement rate
      const oldSuccessRate = this.learningStats.successRate || 0;
      const newSuccessRate = this.calculateCurrentSuccessRate();
      this.learningStats.improvementRate = newSuccessRate - oldSuccessRate;
      
      const results = {
        newPatterns: newPatterns.length,
        failureInsights: failureInsights.length,
        improvementRate: this.learningStats.improvementRate,
        totalInterpretations: recentInterpretations.length,
        recommendations: await this.generateRecommendations(failureInsights)
      };
      
      console.log(`✅ Learning cycle completed: ${results.newPatterns} new patterns, ${results.improvementRate.toFixed(1)}% improvement`);
      
      return results;
      
    } catch (error) {
      console.error('Error in learning cycle:', error);
      return { error: error.message };
    }
  }

  // Private helper methods
  generateInterpretationId() {
    return `interp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  updateStats(record) {
    this.learningStats.totalInterpretations++;
    
    // Update average confidence (running average)
    const currentAvg = this.learningStats.averageConfidence;
    const count = this.learningStats.totalInterpretations;
    this.learningStats.averageConfidence = ((currentAvg * (count - 1)) + record.confidence) / count;
  }

  async extractImprovements(similarCases, vibe, userContext) {
    const improvements = [];
    
    // Analyze what made similar cases successful
    for (const case_ of similarCases.slice(0, 5)) { // Top 5 similar cases
      
      // Domain improvements
      if (case_.domain && case_.domain.score > 0.8) {
        improvements.push({
          type: 'domain',
          suggestion: `Consider ${case_.domain.domain} domain patterns`,
          confidence: case_.domain.score,
          reasoning: 'Similar successful case used this domain'
        });
      }
      
      // Requirement improvements
      if (case_.requirements && case_.outcome?.userSatisfaction > 4) {
        const missingRequirements = case_.requirements.implicit.filter(req => 
          !vibe.toLowerCase().includes(req.replace('-', ' '))
        );
        
        if (missingRequirements.length > 0) {
          improvements.push({
            type: 'requirements',
            suggestion: `Add implicit requirements: ${missingRequirements.join(', ')}`,
            confidence: 0.8,
            reasoning: 'Similar successful cases included these requirements'
          });
        }
      }
      
      // Token optimization improvements
      if (case_.tokenSavings && case_.tokenSavings.percentage > 60) {
        improvements.push({
          type: 'optimization',
          suggestion: 'Apply proven token optimization patterns',
          confidence: 0.7,
          reasoning: `Similar case achieved ${case_.tokenSavings.percentage}% savings`
        });
      }
    }
    
    return improvements;
  }

  calculateConfidenceBoost(similarCases) {
    if (similarCases.length === 0) return 0;
    
    const avgSuccessConfidence = similarCases.reduce((sum, case_) => 
      sum + (case_.confidence || 0.5), 0
    ) / similarCases.length;
    
    // Boost confidence based on similar successful cases
    return Math.min(avgSuccessConfidence * 0.2, 0.3); // Max 30% boost
  }

  extractSuccessPatterns(similarCases) {
    const patterns = {
      commonDomains: {},
      commonRequirements: {},
      commonOptimizations: {}
    };
    
    similarCases.forEach(case_ => {
      // Track domain patterns
      if (case_.domain?.domain) {
        patterns.commonDomains[case_.domain.domain] = 
          (patterns.commonDomains[case_.domain.domain] || 0) + 1;
      }
      
      // Track requirement patterns
      if (case_.requirements?.implicit) {
        case_.requirements.implicit.forEach(req => {
          patterns.commonRequirements[req] = 
            (patterns.commonRequirements[req] || 0) + 1;
        });
      }
    });
    
    return patterns;
  }

  async incorporateFeedback(record) {
    if (!record.userFeedback) return;
    
    const feedback = record.userFeedback;
    
    // If feedback is positive, strengthen the patterns used
    if (feedback.satisfaction >= 4 && feedback.accuracy >= 4) {
      await this.successPatterns.reinforcePattern(record);
    }
    
    // If feedback is negative, mark patterns for review
    if (feedback.satisfaction <= 2 || feedback.accuracy <= 2) {
      await this.failureAnalyzer.flagForReview(record, feedback);
    }
  }

  calculateCurrentSuccessRate() {
    return this.learningStats.totalInterpretations > 0 
      ? (this.learningStats.successfulInterpretations / this.learningStats.totalInterpretations) * 100 
      : 0;
  }

  async generateRecommendations(failureInsights) {
    const recommendations = [];
    
    failureInsights.forEach(insight => {
      if (insight.type === 'domain_misclassification') {
        recommendations.push({
          type: 'improvement',
          area: 'domain_detection',
          action: 'Enhance domain pattern matching',
          priority: 'high'
        });
      }
      
      if (insight.type === 'missing_requirements') {
        recommendations.push({
          type: 'improvement',
          area: 'requirement_extraction',
          action: 'Improve implicit requirement detection',
          priority: 'medium'
        });
      }
    });
    
    return recommendations;
  }
}

/**
 * Interpretation Database - Simple in-memory storage
 */
class InterpretationDatabase {
  constructor() {
    this.records = new Map();
    this.indices = {
      byDomain: new Map(),
      byUserType: new Map(),
      byTimestamp: []
    };
  }

  async store(record) {
    this.records.set(record.id, record);
    this.updateIndices(record);
    return record.id;
  }

  async get(id) {
    return this.records.get(id);
  }

  async update(id, record) {
    this.records.set(id, record);
    this.updateIndices(record);
  }

  async getRecent(days) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return Array.from(this.records.values())
      .filter(record => record.timestamp > cutoff)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  size() {
    return this.records.size;
  }

  updateIndices(record) {
    // Update domain index
    if (record.domain?.domain) {
      if (!this.indices.byDomain.has(record.domain.domain)) {
        this.indices.byDomain.set(record.domain.domain, []);
      }
      this.indices.byDomain.get(record.domain.domain).push(record.id);
    }
    
    // Update timestamp index (keep last 1000 for performance)
    this.indices.byTimestamp.push({ id: record.id, timestamp: record.timestamp });
    this.indices.byTimestamp.sort((a, b) => b.timestamp - a.timestamp);
    if (this.indices.byTimestamp.length > 1000) {
      this.indices.byTimestamp = this.indices.byTimestamp.slice(0, 1000);
    }
  }
}

/**
 * Success Pattern Library
 */
class SuccessPatternLibrary {
  constructor() {
    this.patterns = new Map();
    this.patternStats = new Map();
  }

  async addPattern(record) {
    if (!record.outcome?.success) return;
    
    const patternKey = this.generatePatternKey(record);
    
    if (!this.patterns.has(patternKey)) {
      this.patterns.set(patternKey, {
        key: patternKey,
        examples: [],
        successRate: 0,
        averageConfidence: 0,
        averageTokenSavings: 0,
        createdAt: Date.now()
      });
    }
    
    const pattern = this.patterns.get(patternKey);
    pattern.examples.push(record);
    
    // Update pattern statistics
    this.updatePatternStats(pattern);
    
    console.log(`📈 Added success pattern: ${patternKey}`);
  }

  async findSimilar(vibe, userContext) {
    const vibeKey = this.generateVibeKey(vibe, userContext);
    const similar = [];
    
    for (const [key, pattern] of this.patterns) {
      const similarity = this.calculateSimilarity(vibeKey, key);
      if (similarity > 0.6) { // 60% similarity threshold
        similar.push({
          ...pattern,
          similarity: similarity,
          examples: pattern.examples.slice(0, 3) // Limit examples
        });
      }
    }
    
    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  async reinforcePattern(record) {
    const patternKey = this.generatePatternKey(record);
    const pattern = this.patterns.get(patternKey);
    
    if (pattern) {
      pattern.reinforcements = (pattern.reinforcements || 0) + 1;
      pattern.lastReinforced = Date.now();
    }
  }

  async updatePatterns(recentInterpretations) {
    const newPatterns = [];
    
    const successfulOnes = recentInterpretations.filter(r => r.outcome?.success);
    
    for (const record of successfulOnes) {
      const patternKey = this.generatePatternKey(record);
      if (!this.patterns.has(patternKey)) {
        await this.addPattern(record);
        newPatterns.push(patternKey);
      }
    }
    
    return newPatterns;
  }

  size() {
    return this.patterns.size;
  }

  // Helper methods
  generatePatternKey(record) {
    const domain = record.domain?.domain || 'unknown';
    const complexity = record.vibe?.complexity || 'medium';
    const userType = record.userContext?.userType || 'general';
    
    return `${domain}-${complexity}-${userType}`;
  }

  generateVibeKey(vibe, userContext) {
    // Simplified vibe key generation
    const words = vibe.toLowerCase().split(/\s+/).slice(0, 5).sort();
    const userType = userContext?.userType || 'general';
    
    return `${words.join('-')}-${userType}`;
  }

  calculateSimilarity(key1, key2) {
    const parts1 = key1.split('-');
    const parts2 = key2.split('-');
    
    let matches = 0;
    const maxLength = Math.max(parts1.length, parts2.length);
    
    for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
      if (parts1[i] === parts2[i]) matches++;
    }
    
    return matches / maxLength;
  }

  updatePatternStats(pattern) {
    const examples = pattern.examples;
    
    pattern.successRate = 100; // All examples in success patterns are successful
    pattern.averageConfidence = examples.reduce((sum, ex) => sum + ex.confidence, 0) / examples.length;
    pattern.averageTokenSavings = examples.reduce((sum, ex) => 
      sum + (ex.tokenSavings?.percentage || 0), 0
    ) / examples.length;
  }
}

/**
 * Failure Analyzer
 */
class FailureAnalyzer {
  constructor() {
    this.failures = [];
    this.failurePatterns = new Map();
  }

  async analyzeFailure(record) {
    if (record.outcome?.success) return;
    
    this.failures.push(record);
    
    const failureType = this.classifyFailure(record);
    const analysis = {
      record: record,
      type: failureType,
      possibleCauses: this.identifyPossibleCauses(record, failureType),
      timestamp: Date.now()
    };
    
    console.log(`❌ Analyzed failure: ${failureType}`);
    return analysis;
  }

  async flagForReview(record, feedback) {
    // Mark patterns used in this record for review
    console.log(`🔍 Flagged interpretation ${record.id} for review based on negative feedback`);
  }

  async generateInsights(recentInterpretations) {
    const failures = recentInterpretations.filter(r => r.outcome && !r.outcome.success);
    const insights = [];
    
    // Analyze failure patterns
    const failureTypes = {};
    failures.forEach(failure => {
      const type = this.classifyFailure(failure);
      failureTypes[type] = (failureTypes[type] || 0) + 1;
    });
    
    // Generate insights based on common failure types
    Object.entries(failureTypes).forEach(([type, count]) => {
      if (count > 1) {
        insights.push({
          type: type,
          frequency: count,
          recommendation: this.getRecommendationForFailureType(type)
        });
      }
    });
    
    return insights;
  }

  classifyFailure(record) {
    if (!record.outcome) return 'unknown';
    
    const issues = record.outcome.issues || [];
    
    if (issues.includes('wrong_domain')) return 'domain_misclassification';
    if (issues.includes('missing_features')) return 'missing_requirements';
    if (issues.includes('poor_quality')) return 'quality_issues';
    if (issues.includes('too_complex')) return 'complexity_mismatch';
    
    return 'general_failure';
  }

  identifyPossibleCauses(record, failureType) {
    const causes = [];
    
    switch (failureType) {
      case 'domain_misclassification':
        causes.push('Insufficient domain keywords');
        causes.push('Ambiguous vibe description');
        break;
      
      case 'missing_requirements':
        causes.push('Incomplete implicit requirement detection');
        causes.push('Domain patterns missing common features');
        break;
      
      case 'quality_issues':
        causes.push('Low confidence interpretation accepted');
        causes.push('Insufficient context analysis');
        break;
    }
    
    return causes;
  }

  getRecommendationForFailureType(type) {
    const recommendations = {
      'domain_misclassification': 'Improve domain detection patterns and keyword matching',
      'missing_requirements': 'Enhance implicit requirement extraction for common domains',
      'quality_issues': 'Implement stricter confidence thresholds',
      'complexity_mismatch': 'Better align vibe complexity with user technical level'
    };
    
    return recommendations[type] || 'Review and improve interpretation accuracy';
  }
}

module.exports = { 
  VibeLearningEngine,
  InterpretationDatabase,
  SuccessPatternLibrary,
  FailureAnalyzer
};