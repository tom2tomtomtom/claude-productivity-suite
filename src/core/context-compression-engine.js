/**
 * Context Compression Engine - Intelligent token usage optimization
 * Implements the token optimization strategies from the specification
 */

const { PatternLibrary } = require('./pattern-library');
const { SemanticCompressor } = require('./semantic-compressor');
const { UserPreferenceCache } = require('./user-preference-cache');

class ContextCompressionEngine {
  constructor() {
    this.patterns = new PatternLibrary();
    this.semanticCompressor = new SemanticCompressor();
    this.userPreferences = new UserPreferenceCache();
    this.compressionMetrics = new Map();
  }

  async compressContext(sessionContext, options = {}) {
    const {
      targetReduction = 0.5,
      preserveQuality = true,
      userLevel = 'beginner'
    } = options;

    const startTime = Date.now();
    const originalSize = this.calculateTokenCount(sessionContext);
    
    let compressed = { ...sessionContext };
    const appliedStrategies = [];

    try {
      // Strategy 1: Pattern substitution (highest impact)
      if (targetReduction > 0.2) {
        const patternResult = await this.applyPatternSubstitution(compressed);
        compressed = patternResult.context;
        appliedStrategies.push({
          name: 'Pattern Substitution',
          reduction: patternResult.reduction,
          tokensaved: patternResult.tokensSaved
        });
      }

      // Strategy 2: Semantic compression (medium impact)
      if (targetReduction > 0.3) {
        const semanticResult = await this.applySemanticCompression(compressed, userLevel);
        compressed = semanticResult.context;
        appliedStrategies.push({
          name: 'Semantic Compression',
          reduction: semanticResult.reduction,
          tokensSaved: semanticResult.tokensSaved
        });
      }

      // Strategy 3: User preference optimization
      const preferenceResult = await this.applyCachedPreferences(compressed, sessionContext.userId);
      compressed = preferenceResult.context;
      appliedStrategies.push({
        name: 'Preference Caching',
        reduction: preferenceResult.reduction,
        tokensSaved: preferenceResult.tokensSaved
      });

      // Strategy 4: Technical detail abstraction
      if (userLevel === 'beginner') {
        const abstractionResult = await this.abstractTechnicalDetails(compressed);
        compressed = abstractionResult.context;
        appliedStrategies.push({
          name: 'Technical Abstraction',
          reduction: abstractionResult.reduction,
          tokensSaved: abstractionResult.tokensSaved
        });
      }

      const finalSize = this.calculateTokenCount(compressed);
      const actualReduction = (originalSize - finalSize) / originalSize;
      const processingTime = Date.now() - startTime;

      // Record metrics
      this.recordCompressionMetrics({
        originalSize,
        finalSize,
        targetReduction,
        actualReduction,
        processingTime,
        strategies: appliedStrategies,
        preserveQuality,
        userLevel
      });

      return {
        compressed,
        originalTokens: originalSize,
        finalTokens: finalSize,
        reductionPercentage: actualReduction * 100,
        appliedStrategies,
        processingTime,
        qualityPreserved: preserveQuality
      };

    } catch (error) {
      console.error('Context compression failed:', error);
      return {
        compressed: sessionContext, // Return original on error
        error: error.message,
        fallback: true
      };
    }
  }

  async applyPatternSubstitution(context) {
    const identifiedPatterns = await this.patterns.identifyPatterns(context);
    let tokensSaved = 0;
    let compressed = { ...context };

    for (const section in compressed) {
      if (typeof compressed[section] === 'string') {
        const sectionPatterns = identifiedPatterns.filter(p => 
          p.section === section && p.confidence > 0.8
        );

        for (const pattern of sectionPatterns) {
          const originalLength = pattern.fullText.length;
          compressed[section] = compressed[section].replace(
            pattern.fullText,
            `[PATTERN:${pattern.reference}]`
          );
          
          const newLength = compressed[section].length;
          tokensSaved += this.estimateTokenSavings(originalLength - newLength);
        }
      }
    }

    const reduction = tokensSaved / this.calculateTokenCount(context);

    return {
      context: compressed,
      reduction,
      tokensSaved,
      patternsApplied: identifiedPatterns.length
    };
  }

  async applySemanticCompression(context, userLevel) {
    const compressedSections = {};
    let totalTokensSaved = 0;

    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string' && this.shouldCompressSection(key, value)) {
        const originalTokens = this.calculateTokenCount(value);
        
        const compressed = await this.semanticCompressor.compress(value, {
          preserveClarity: true,
          targetAudience: userLevel,
          compressionLevel: this.getSectionCompressionLevel(key)
        });

        const compressedTokens = this.calculateTokenCount(compressed);
        const sectionSavings = originalTokens - compressedTokens;
        
        compressedSections[key] = compressed;
        totalTokensSaved += sectionSavings;
      } else {
        compressedSections[key] = value;
      }
    }

    const reduction = totalTokensSaved / this.calculateTokenCount(context);

    return {
      context: compressedSections,
      reduction,
      tokensSaved: totalTokensSaved
    };
  }

  shouldCompressSection(key, value) {
    const compressibleSections = [
      'explanation',
      'description',
      'technicalDetails',
      'implementation',
      'documentation'
    ];

    return compressibleSections.some(section => 
      key.toLowerCase().includes(section.toLowerCase())
    ) && value.length > 200; // Only compress longer content
  }

  getSectionCompressionLevel(sectionKey) {
    const compressionLevels = {
      explanation: 0.4,
      technicalDetails: 0.6,
      implementation: 0.3,
      documentation: 0.5,
      userInstructions: 0.2 // Preserve user-facing content
    };

    for (const [pattern, level] of Object.entries(compressionLevels)) {
      if (sectionKey.toLowerCase().includes(pattern.toLowerCase())) {
        return level;
      }
    }

    return 0.3; // Default compression level
  }

  async applyCachedPreferences(context, userId) {
    if (!userId) {
      return { context, reduction: 0, tokensSaved: 0 };
    }

    const userPrefs = await this.userPreferences.getPreferences(userId);
    let tokensSaved = 0;
    const optimized = { ...context };

    // Replace repeated preference explanations with references
    if (userPrefs.stylingPreferences) {
      const stylingExplanation = this.findStylingExplanations(optimized);
      if (stylingExplanation.length > 0) {
        tokensSaved += this.replaceWithPreferenceReference(
          optimized,
          stylingExplanation,
          '[USER_STYLING_PREFS]'
        );
      }
    }

    // Cache common explanations user has seen before
    if (userPrefs.understoodConcepts) {
      for (const concept of userPrefs.understoodConcepts) {
        const conceptExplanations = this.findConceptExplanations(optimized, concept);
        tokensSaved += this.replaceWithConceptReference(
          optimized,
          conceptExplanations,
          concept
        );
      }
    }

    const reduction = tokensSaved / this.calculateTokenCount(context);

    return {
      context: optimized,
      reduction,
      tokensSaved
    };
  }

  async abstractTechnicalDetails(context) {
    let tokensSaved = 0;
    const abstracted = { ...context };

    // Remove or simplify technical jargon for beginners
    const technicalTerms = {
      'API endpoint': 'connection point',
      'database schema': 'data structure',
      'middleware': 'helper function',
      'authentication': 'login system',
      'deployment': 'publishing online',
      'responsive design': 'mobile-friendly',
      'optimization': 'making faster'
    };

    for (const [key, value] of Object.entries(abstracted)) {
      if (typeof value === 'string') {
        let simplified = value;
        let originalLength = value.length;

        // Replace technical terms
        for (const [technical, simple] of Object.entries(technicalTerms)) {
          simplified = simplified.replace(
            new RegExp(technical, 'gi'),
            simple
          );
        }

        // Remove overly technical sections
        simplified = this.removeTechnicalSections(simplified);

        const newLength = simplified.length;
        tokensSaved += this.estimateTokenSavings(originalLength - newLength);
        
        abstracted[key] = simplified;
      }
    }

    const reduction = tokensSaved / this.calculateTokenCount(context);

    return {
      context: abstracted,
      reduction,
      tokensSaved
    };
  }

  removeTechnicalSections(text) {
    // Remove sections that are too technical for beginners
    const technicalPatterns = [
      /Technical implementation details:.*?(?=\n\n|\n[A-Z]|$)/gs,
      /Advanced configuration options:.*?(?=\n\n|\n[A-Z]|$)/gs,
      /Optimization considerations:.*?(?=\n\n|\n[A-Z]|$)/gs,
      /Debug information:.*?(?=\n\n|\n[A-Z]|$)/gs
    ];

    let cleaned = text;
    for (const pattern of technicalPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned.trim();
  }

  calculateTokenCount(content) {
    if (typeof content === 'string') {
      // Rough estimation: ~4 characters per token
      return Math.ceil(content.length / 4);
    }
    
    if (typeof content === 'object') {
      return Object.values(content)
        .map(value => this.calculateTokenCount(value))
        .reduce((sum, count) => sum + count, 0);
    }

    return 0;
  }

  estimateTokenSavings(charactersSaved) {
    return Math.ceil(charactersSaved / 4);
  }

  findStylingExplanations(context) {
    const explanations = [];
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string' && 
          value.includes('color') && 
          value.includes('design')) {
        explanations.push({ key, content: value });
      }
    }
    return explanations;
  }

  replaceWithPreferenceReference(context, explanations, reference) {
    let tokensSaved = 0;
    
    for (const explanation of explanations) {
      const original = context[explanation.key];
      const shortened = `${reference} - Using your preferred styling approach`;
      
      tokensSaved += this.estimateTokenSavings(original.length - shortened.length);
      context[explanation.key] = shortened;
    }

    return tokensSaved;
  }

  recordCompressionMetrics(metrics) {
    const sessionId = metrics.sessionId || 'default';
    
    if (!this.compressionMetrics.has(sessionId)) {
      this.compressionMetrics.set(sessionId, []);
    }

    this.compressionMetrics.get(sessionId).push({
      ...metrics,
      timestamp: new Date()
    });
  }

  getCompressionStats() {
    const allMetrics = Array.from(this.compressionMetrics.values()).flat();
    
    if (allMetrics.length === 0) {
      return { noData: true };
    }

    const totalCompressions = allMetrics.length;
    const averageReduction = allMetrics.reduce((sum, m) => sum + m.actualReduction, 0) / totalCompressions;
    const totalTokensSaved = allMetrics.reduce((sum, m) => sum + (m.originalSize - m.finalSize), 0);
    const averageProcessingTime = allMetrics.reduce((sum, m) => sum + m.processingTime, 0) / totalCompressions;

    return {
      totalCompressions,
      averageReductionPercentage: averageReduction * 100,
      totalTokensSaved,
      averageProcessingTime,
      strategiesUsed: this.getStrategyUsageStats(allMetrics)
    };
  }

  getStrategyUsageStats(metrics) {
    const strategyStats = {};
    
    for (const metric of metrics) {
      for (const strategy of metric.strategies) {
        if (!strategyStats[strategy.name]) {
          strategyStats[strategy.name] = {
            usageCount: 0,
            totalReduction: 0,
            totalTokensSaved: 0
          };
        }
        
        strategyStats[strategy.name].usageCount++;
        strategyStats[strategy.name].totalReduction += strategy.reduction;
        strategyStats[strategy.name].totalTokensSaved += strategy.tokensSaved;
      }
    }

    // Calculate averages
    for (const [name, stats] of Object.entries(strategyStats)) {
      stats.averageReduction = stats.totalReduction / stats.usageCount;
      stats.averageTokensSaved = stats.totalTokensSaved / stats.usageCount;
    }

    return strategyStats;
  }

  // Specialized compression for different content types
  async compressContent(content, options = {}) {
    const {
      targetReduction = 0.3,
      preserveEssentials = true,
      contentType = 'general'
    } = options;

    switch (contentType) {
      case 'explanation':
        return await this.compressExplanation(content, targetReduction);
      case 'code':
        return await this.compressCode(content, targetReduction);
      case 'documentation':
        return await this.compressDocumentation(content, targetReduction);
      default:
        return await this.compressGeneral(content, targetReduction);
    }
  }

  async compressExplanation(explanation, targetReduction) {
    // Focus on removing redundancy while preserving clarity
    let compressed = explanation;
    
    // Remove redundant phrases
    const redundantPhrases = [
      'as mentioned before',
      'as we discussed',
      'in other words',
      'to put it simply',
      'basically'
    ];

    for (const phrase of redundantPhrases) {
      compressed = compressed.replace(new RegExp(phrase, 'gi'), '');
    }

    // Simplify complex sentences
    compressed = await this.semanticCompressor.simplifysentences(compressed);

    return {
      compressed: compressed.trim(),
      originalLength: explanation.length,
      finalLength: compressed.length,
      reduction: (explanation.length - compressed.length) / explanation.length
    };
  }
}

module.exports = { ContextCompressionEngine };