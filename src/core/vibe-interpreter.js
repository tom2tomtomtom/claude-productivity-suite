/**
 * Enhanced Vibe Interpreter
 * Transforms natural language descriptions into detailed application requirements
 * with domain-specific patterns and token optimization
 */

const { DomainPatternLibrary } = require('./domain-patterns');
const { ContextAnalyzer } = require('./context-analyzer');
const { TokenOptimizer } = require('./token-optimizer');
const { VibeLearningEngine } = require('./vibe-learning-engine');

class VibeInterpreter {
  constructor() {
    this.domainPatterns = new DomainPatternLibrary();
    this.contextAnalyzer = new ContextAnalyzer();
    this.tokenOptimizer = new TokenOptimizer();
    this.learningEngine = new VibeLearningEngine();
    this.interpretationCache = new Map();
  }

  /**
   * Interpret user's vibe into detailed application requirements
   * @param {string} vibe - User's natural language description
   * @param {Object} userContext - User context and session information
   * @returns {Object} Comprehensive interpretation result
   */
  async interpretVibe(vibe, userContext) {
    const startTime = Date.now();
    
    try {
      console.log(`🎨 Interpreting vibe: "${vibe.substring(0, 50)}..."`);
      
      // Check cache for similar interpretations
      const cacheKey = this.generateCacheKey(vibe, userContext);
      if (this.interpretationCache.has(cacheKey)) {
        console.log('📋 Using cached interpretation');
        return this.interpretationCache.get(cacheKey);
      }

      // 1. Preprocess and normalize vibe
      const normalizedVibe = await this.preprocessVibe(vibe);
      
      // 2. Analyze context and extract implicit requirements
      const contextAnalysis = await this.contextAnalyzer.analyze(
        normalizedVibe, userContext
      );
      
      // 3. Detect domain and apply specialized patterns
      const domainDetection = await this.domainPatterns.detectDomain(
        normalizedVibe, contextAnalysis
      );
      
      // 4. Extract explicit and implicit requirements
      const requirements = await this.extractRequirements(
        normalizedVibe, contextAnalysis, domainDetection
      );
      
      // 5. Optimize for token efficiency
      const optimizedPlan = await this.tokenOptimizer.optimizeVibeProcessing(
        requirements, userContext
      );
      
      // 6. Calculate confidence score
      const confidence = this.calculateConfidence(
        normalizedVibe, contextAnalysis, domainDetection, requirements
      );

      const result = {
        originalVibe: vibe,
        interpretation: requirements,
        domain: domainDetection,
        context: contextAnalysis,
        plan: optimizedPlan,
        confidence: confidence,
        tokenSavings: optimizedPlan.tokenSavings,
        processingTime: Date.now() - startTime,
        cacheKey: cacheKey
      };

      // 7. Learn from this interpretation for future use
      await this.learningEngine.recordInterpretation(
        vibe, requirements, optimizedPlan, result
      );

      // Cache successful interpretations
      if (confidence > 0.7) {
        this.interpretationCache.set(cacheKey, result);
      }

      console.log(`✅ Vibe interpreted with ${(confidence * 100).toFixed(1)}% confidence`);
      console.log(`   Domain: ${domainDetection.domain}`);
      console.log(`   Token savings: ${optimizedPlan.tokenSavings.percentage}%`);

      return result;

    } catch (error) {
      console.error('Vibe interpretation error:', error);
      return this.handleInterpretationError(error, vibe, userContext);
    }
  }

  /**
   * Preprocess and normalize vibe input
   * @param {string} vibe - Raw vibe input
   * @returns {Object} Normalized vibe data
   */
  async preprocessVibe(vibe) {
    const normalized = {
      original: vibe,
      cleaned: this.cleanText(vibe),
      normalized: this.normalizeLanguage(vibe),
      keywords: this.extractKeywords(vibe),
      entities: this.extractEntities(vibe),
      sentiment: this.analyzeSentiment(vibe),
      complexity: this.assessVibeComplexity(vibe),
      length: vibe.length,
      wordCount: vibe.split(/\s+/).length
    };

    console.log(`📝 Preprocessed vibe: ${normalized.keywords.join(', ')}`);
    return normalized;
  }

  /**
   * Extract comprehensive requirements from vibe and context
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} contextAnalysis - Context analysis
   * @param {Object} domainDetection - Domain detection results
   * @returns {Object} Extracted requirements
   */
  async extractRequirements(normalizedVibe, contextAnalysis, domainDetection) {
    const requirements = {
      // Explicit requirements from vibe
      explicit: this.extractExplicitRequirements(normalizedVibe),
      
      // Implicit requirements from domain patterns
      implicit: await domainDetection.patterns.expandRequirements(
        normalizedVibe, contextAnalysis
      ),
      
      // Functional requirements
      functional: this.extractFunctionalRequirements(normalizedVibe, domainDetection),
      
      // Non-functional requirements
      nonFunctional: this.extractNonFunctionalRequirements(
        normalizedVibe, contextAnalysis, domainDetection
      ),
      
      // Technical requirements
      technical: await this.extractTechnicalRequirements(
        normalizedVibe, contextAnalysis, domainDetection
      ),
      
      // User experience requirements
      userExperience: this.extractUXRequirements(normalizedVibe, contextAnalysis),
      
      // Business requirements
      business: contextAnalysis.businessContext
    };

    console.log(`📋 Extracted ${requirements.explicit.length} explicit, ${requirements.implicit.length} implicit requirements`);
    return requirements;
  }

  /**
   * Clean and normalize text input
   * @param {string} text - Raw text
   * @returns {string} Cleaned text
   */
  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalize language variations
   * @param {string} text - Input text
   * @returns {string} Normalized text
   */
  normalizeLanguage(text) {
    const synonyms = {
      'website': ['site', 'web app', 'web application'],
      'ecommerce': ['online store', 'shop', 'store', 'marketplace'],
      'blog': ['content site', 'articles', 'posts', 'writing'],
      'portfolio': ['showcase', 'gallery', 'work samples'],
      'dashboard': ['admin panel', 'control panel', 'management interface'],
      'authentication': ['login', 'user accounts', 'sign in', 'auth'],
      'responsive': ['mobile friendly', 'mobile optimized', 'works on mobile'],
      'database': ['data storage', 'save data', 'store information']
    };

    let normalized = text.toLowerCase();
    
    Object.entries(synonyms).forEach(([standard, variations]) => {
      variations.forEach(variation => {
        const regex = new RegExp(variation, 'gi');
        normalized = normalized.replace(regex, standard);
      });
    });

    return normalized;
  }

  /**
   * Extract key terms and concepts
   * @param {string} text - Input text
   * @returns {Array} Extracted keywords
   */
  extractKeywords(text) {
    const stopWords = new Set([
      'i', 'want', 'need', 'like', 'would', 'could', 'should', 'can',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
      'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'make', 'create', 'build', 'develop'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 20); // Limit to top 20 keywords
  }

  /**
   * Extract named entities (simplified implementation)
   * @param {string} text - Input text
   * @returns {Object} Extracted entities
   */
  extractEntities(text) {
    const entities = {
      technologies: [],
      platforms: [],
      features: [],
      businessTypes: []
    };

    const patterns = {
      technologies: ['react', 'vue', 'angular', 'node', 'python', 'django', 'flask', 'express'],
      platforms: ['mobile', 'web', 'desktop', 'ios', 'android', 'pwa'],
      features: ['auth', 'payment', 'search', 'chat', 'notifications', 'analytics'],
      businessTypes: ['restaurant', 'retail', 'service', 'blog', 'portfolio', 'startup']
    };

    const lowerText = text.toLowerCase();
    
    Object.entries(patterns).forEach(([category, terms]) => {
      terms.forEach(term => {
        if (lowerText.includes(term)) {
          entities[category].push(term);
        }
      });
    });

    return entities;
  }

  /**
   * Analyze sentiment of the vibe
   * @param {string} text - Input text
   * @returns {Object} Sentiment analysis
   */
  analyzeSentiment(text) {
    const positiveWords = [
      'awesome', 'amazing', 'great', 'excellent', 'beautiful', 'modern',
      'clean', 'simple', 'elegant', 'professional', 'stunning', 'perfect'
    ];
    
    const urgentWords = [
      'urgent', 'asap', 'quickly', 'fast', 'immediately', 'now', 'soon'
    ];

    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const urgentCount = urgentWords.filter(word => lowerText.includes(word)).length;
    
    return {
      enthusiasm: positiveCount > 0 ? 'high' : 'neutral',
      urgency: urgentCount > 0 ? 'high' : 'normal',
      tone: positiveCount > urgentCount ? 'positive' : urgentCount > 0 ? 'urgent' : 'neutral'
    };
  }

  /**
   * Assess vibe complexity
   * @param {string} text - Input text
   * @returns {string} Complexity level
   */
  assessVibeComplexity(text) {
    const complexityIndicators = {
      high: [
        'integration', 'api', 'database', 'authentication', 'payment',
        'real-time', 'scalable', 'enterprise', 'advanced', 'complex'
      ],
      medium: [
        'responsive', 'modern', 'interactive', 'dynamic', 'users',
        'accounts', 'admin', 'dashboard', 'search', 'filter'
      ],
      low: [
        'simple', 'basic', 'quick', 'easy', 'static', 'landing',
        'portfolio', 'showcase', 'display', 'info'
      ]
    };

    const lowerText = text.toLowerCase();
    let scores = { high: 0, medium: 0, low: 0 };

    Object.entries(complexityIndicators).forEach(([level, indicators]) => {
      indicators.forEach(indicator => {
        if (lowerText.includes(indicator)) {
          scores[level]++;
        }
      });
    });

    // Determine complexity based on highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'medium'; // Default
    
    return Object.entries(scores).find(([, score]) => score === maxScore)[0];
  }

  /**
   * Extract explicit requirements from vibe
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {Array} Explicit requirements
   */
  extractExplicitRequirements(normalizedVibe) {
    const requirements = [];
    const text = normalizedVibe.normalized;

    // Feature extraction patterns
    const featurePatterns = {
      'user-authentication': ['login', 'sign up', 'user accounts', 'authentication'],
      'responsive-design': ['mobile', 'responsive', 'mobile friendly'],
      'search-functionality': ['search', 'find', 'filter'],
      'payment-processing': ['payment', 'pay', 'checkout', 'stripe', 'paypal'],
      'content-management': ['posts', 'articles', 'content', 'blog'],
      'real-time-features': ['real-time', 'live', 'instant', 'websocket'],
      'admin-dashboard': ['admin', 'dashboard', 'management', 'control panel'],
      'social-features': ['comments', 'likes', 'share', 'social'],
      'notifications': ['notifications', 'alerts', 'email', 'notify'],
      'analytics': ['analytics', 'tracking', 'metrics', 'stats']
    };

    Object.entries(featurePatterns).forEach(([requirement, patterns]) => {
      if (patterns.some(pattern => text.includes(pattern))) {
        requirements.push(requirement);
      }
    });

    return requirements;
  }

  /**
   * Extract functional requirements
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} domainDetection - Domain detection results
   * @returns {Array} Functional requirements
   */
  extractFunctionalRequirements(normalizedVibe, domainDetection) {
    const baseRequirements = [
      'user-interface',
      'data-persistence',
      'error-handling',
      'input-validation'
    ];

    // Add domain-specific functional requirements
    const domainRequirements = domainDetection.patterns.getFunctionalRequirements(
      normalizedVibe
    );

    return [...baseRequirements, ...domainRequirements];
  }

  /**
   * Extract non-functional requirements
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} contextAnalysis - Context analysis
   * @param {Object} domainDetection - Domain detection
   * @returns {Object} Non-functional requirements
   */
  extractNonFunctionalRequirements(normalizedVibe, contextAnalysis, domainDetection) {
    return {
      performance: this.extractPerformanceRequirements(normalizedVibe, contextAnalysis),
      security: this.extractSecurityRequirements(normalizedVibe, domainDetection),
      usability: this.extractUsabilityRequirements(normalizedVibe, contextAnalysis),
      scalability: this.extractScalabilityRequirements(normalizedVibe, contextAnalysis),
      reliability: ['error-recovery', 'data-backup', 'uptime-monitoring']
    };
  }

  /**
   * Extract technical requirements
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} contextAnalysis - Context analysis
   * @param {Object} domainDetection - Domain detection
   * @returns {Object} Technical requirements
   */
  async extractTechnicalRequirements(normalizedVibe, contextAnalysis, domainDetection) {
    const requirements = {
      frontend: this.recommendFrontendTech(normalizedVibe, domainDetection),
      backend: this.recommendBackendTech(normalizedVibe, domainDetection),
      database: this.recommendDatabaseTech(normalizedVibe, domainDetection),
      deployment: this.recommendDeploymentTech(normalizedVibe, contextAnalysis),
      apis: this.identifyApiRequirements(normalizedVibe, domainDetection)
    };

    return requirements;
  }

  /**
   * Calculate interpretation confidence
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} contextAnalysis - Context analysis
   * @param {Object} domainDetection - Domain detection
   * @param {Object} requirements - Extracted requirements
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(normalizedVibe, contextAnalysis, domainDetection, requirements) {
    let confidence = 0;
    let factors = 0;

    // Domain detection confidence
    confidence += domainDetection.score * 0.3;
    factors += 1;

    // Keyword richness
    const keywordRichness = Math.min(normalizedVibe.keywords.length / 10, 1);
    confidence += keywordRichness * 0.2;
    factors += 1;

    // Requirement extraction success
    const totalRequirements = requirements.explicit.length + requirements.implicit.length;
    const requirementScore = Math.min(totalRequirements / 15, 1);
    confidence += requirementScore * 0.2;
    factors += 1;

    // Vibe complexity alignment
    const complexityAlignment = this.assessComplexityAlignment(
      normalizedVibe.complexity, domainDetection.domain
    );
    confidence += complexityAlignment * 0.15;
    factors += 1;

    // Context richness
    const contextScore = this.assessContextRichness(contextAnalysis);
    confidence += contextScore * 0.15;
    factors += 1;

    return confidence / factors;
  }

  /**
   * Generate cache key for interpretation
   * @param {string} vibe - Original vibe
   * @param {Object} userContext - User context
   * @returns {string} Cache key
   */
  generateCacheKey(vibe, userContext) {
    const vibeHash = this.hashString(vibe.toLowerCase().trim());
    const contextHash = this.hashString(JSON.stringify({
      userType: userContext.userType || 'general',
      technicalLevel: userContext.technicalLevel || 'beginner'
    }));
    
    return `${vibeHash}-${contextHash}`;
  }

  /**
   * Handle interpretation errors gracefully
   * @param {Error} error - Error that occurred
   * @param {string} vibe - Original vibe
   * @param {Object} userContext - User context
   * @returns {Object} Fallback interpretation
   */
  handleInterpretationError(error, vibe, userContext) {
    console.error('Interpretation error:', error.message);

    return {
      originalVibe: vibe,
      interpretation: {
        explicit: ['basic-web-application'],
        implicit: ['responsive-design', 'user-interface'],
        functional: ['user-interface', 'data-persistence'],
        nonFunctional: {
          performance: ['basic-optimization'],
          security: ['basic-security'],
          usability: ['intuitive-interface'],
          scalability: ['small-scale'],
          reliability: ['error-recovery']
        },
        technical: {
          frontend: 'React',
          backend: 'Node.js',
          database: 'JSON files',
          deployment: 'Vercel',
          apis: []
        }
      },
      domain: { domain: 'general', score: 0.5, patterns: null },
      context: { userType: 'general', technicalLevel: 'beginner' },
      plan: { tokenSavings: { percentage: 30, baseline: 1000, optimized: 700 } },
      confidence: 0.3,
      error: {
        type: 'interpretation_error',
        message: error.message,
        fallbackUsed: true
      }
    };
  }

  // Helper methods for requirements extraction
  extractPerformanceRequirements(vibe, context) {
    const performance = ['basic-optimization'];
    
    if (vibe.normalized.includes('fast') || vibe.normalized.includes('performance')) {
      performance.push('performance-optimization', 'caching', 'compression');
    }
    
    return performance;
  }

  extractSecurityRequirements(vibe, domain) {
    const security = ['basic-security'];
    
    if (domain.domain === 'ecommerce' || vibe.normalized.includes('payment')) {
      security.push('ssl-encryption', 'pci-compliance', 'secure-payments');
    }
    
    if (vibe.normalized.includes('user') || vibe.normalized.includes('account')) {
      security.push('authentication-security', 'password-protection');
    }
    
    return security;
  }

  extractUsabilityRequirements(vibe, context) {
    return [
      'intuitive-interface',
      'accessible-design',
      'responsive-layout',
      'clear-navigation'
    ];
  }

  extractScalabilityRequirements(vibe, context) {
    if (context.scale === 'large' || vibe.normalized.includes('scale')) {
      return ['horizontal-scaling', 'load-balancing', 'caching'];
    }
    return ['small-scale', 'basic-optimization'];
  }

  extractUXRequirements(vibe, context) {
    return {
      design: vibe.sentiment.enthusiasm === 'high' ? 'modern-beautiful' : 'clean-simple',
      navigation: 'intuitive',
      responsiveness: 'mobile-first',
      accessibility: 'wcag-aa',
      interactions: 'smooth-animations'
    };
  }

  recommendFrontendTech(vibe, domain) {
    if (domain.domain === 'ecommerce') return 'React with e-commerce components';
    if (domain.domain === 'blog') return 'React with content management';
    return 'React with modern UI components';
  }

  recommendBackendTech(vibe, domain) {
    if (vibe.normalized.includes('api') || domain.domain === 'ecommerce') {
      return 'Node.js with Express and authentication';
    }
    return 'Serverless functions';
  }

  recommendDatabaseTech(vibe, domain) {
    if (domain.domain === 'ecommerce') return 'PostgreSQL for complex data';
    if (vibe.complexity === 'high') return 'PostgreSQL';
    return 'JSON file storage';
  }

  recommendDeploymentTech(vibe, context) {
    if (context.budgetConstraints === 'free-tier') return 'Vercel free tier';
    return 'Vercel with custom domain';
  }

  identifyApiRequirements(vibe, domain) {
    const apis = [];
    
    if (vibe.normalized.includes('payment')) apis.push('stripe-api');
    if (vibe.normalized.includes('email')) apis.push('email-service');
    if (domain.domain === 'ecommerce') apis.push('payment-gateway');
    
    return apis;
  }

  assessComplexityAlignment(vibeComplexity, domain) {
    const domainComplexity = {
      'ecommerce': 'high',
      'blog': 'medium',
      'portfolio': 'low',
      'utility': 'low',
      'social': 'high'
    };
    
    const expectedComplexity = domainComplexity[domain] || 'medium';
    
    if (vibeComplexity === expectedComplexity) return 1.0;
    if (Math.abs(['low', 'medium', 'high'].indexOf(vibeComplexity) - 
                ['low', 'medium', 'high'].indexOf(expectedComplexity)) === 1) return 0.7;
    return 0.4;
  }

  assessContextRichness(context) {
    let richness = 0;
    let factors = 0;
    
    if (context.userType && context.userType !== 'general') {
      richness += 0.25;
    }
    factors += 1;
    
    if (context.businessContext && Object.keys(context.businessContext).length > 0) {
      richness += 0.25;
    }
    factors += 1;
    
    if (context.technicalLevel && context.technicalLevel !== 'unknown') {
      richness += 0.25;
    }
    factors += 1;
    
    if (context.constraints && context.constraints.length > 0) {
      richness += 0.25;
    }
    factors += 1;
    
    return factors > 0 ? richness / factors : 0.5;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Clear interpretation cache
   */
  clearCache() {
    this.interpretationCache.clear();
    console.log('🧹 Vibe interpretation cache cleared');
  }

  /**
   * Get interpretation statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      cacheSize: this.interpretationCache.size,
      interpretationsProcessed: this.learningEngine.getInterpretationCount(),
      averageConfidence: this.learningEngine.getAverageConfidence()
    };
  }
}

module.exports = { VibeInterpreter };