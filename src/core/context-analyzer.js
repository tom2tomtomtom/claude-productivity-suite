/**
 * Context Analyzer
 * Analyzes user context to understand implicit requirements and constraints
 */

class ContextAnalyzer {
  constructor() {
    this.userTypePatterns = this.initializeUserTypePatterns();
    this.businessModelPatterns = this.initializeBusinessModelPatterns();
    this.technicalLevelIndicators = this.initializeTechnicalLevelIndicators();
  }

  /**
   * Perform comprehensive context analysis
   * @param {Object} normalizedVibe - Preprocessed vibe data
   * @param {Object} userContext - User session context
   * @returns {Object} Context analysis results
   */
  async analyze(normalizedVibe, userContext) {
    const analysis = {
      userType: await this.detectUserType(normalizedVibe, userContext),
      businessContext: await this.extractBusinessContext(normalizedVibe),
      technicalLevel: await this.assessTechnicalLevel(normalizedVibe, userContext),
      constraints: await this.identifyConstraints(normalizedVibe, userContext),
      goals: await this.extractGoals(normalizedVibe),
      timeline: await this.estimateTimeline(normalizedVibe),
      scale: await this.assessScale(normalizedVibe),
      budget: await this.assessBudgetConstraints(normalizedVibe),
      urgency: await this.assessUrgency(normalizedVibe),
      preferences: await this.extractPreferences(normalizedVibe, userContext)
    };

    console.log(`🔍 Context analysis: ${analysis.userType} user, ${analysis.scale} scale, ${analysis.technicalLevel} technical level`);
    
    return analysis;
  }

  /**
   * Detect user type based on vibe and context
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} userContext - User context
   * @returns {string} Detected user type
   */
  async detectUserType(normalizedVibe, userContext) {
    const vibeText = normalizedVibe.normalized.toLowerCase();
    const scores = {};

    // Calculate scores for each user type
    Object.entries(this.userTypePatterns).forEach(([userType, indicators]) => {
      scores[userType] = indicators.filter(indicator => 
        vibeText.includes(indicator.toLowerCase())
      ).length;
    });

    // Add bonus for context clues
    if (userContext.previousProjects) {
      // Analyze previous project patterns
      const projectTypes = this.analyzeProjectHistory(userContext.previousProjects);
      Object.keys(scores).forEach(userType => {
        if (projectTypes.includes(userType)) {
          scores[userType] += 2;
        }
      });
    }

    // Return the highest scoring user type, or 'general' if no clear match
    const bestMatch = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    );

    return bestMatch[1] > 0 ? bestMatch[0] : 'general';
  }

  /**
   * Extract business context information
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {Object} Business context analysis
   */
  async extractBusinessContext(normalizedVibe) {
    const vibeText = normalizedVibe.normalized.toLowerCase();
    
    return {
      businessModel: this.detectBusinessModel(vibeText),
      targetAudience: this.identifyAudience(vibeText),
      valueProposition: this.extractValue(vibeText),
      revenue: this.detectRevenueModel(vibeText),
      marketSize: this.assessMarketSize(vibeText),
      competitiveAdvantage: this.identifyAdvantages(vibeText)
    };
  }

  /**
   * Assess user's technical level
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} userContext - User context
   * @returns {string} Technical level assessment
   */
  async assessTechnicalLevel(normalizedVibe, userContext) {
    const vibeText = normalizedVibe.normalized.toLowerCase();
    let score = 0;

    // Check for technical indicators
    Object.entries(this.technicalLevelIndicators).forEach(([level, indicators]) => {
      const matches = indicators.filter(indicator => 
        vibeText.includes(indicator.toLowerCase())
      ).length;
      
      if (level === 'advanced') score += matches * 3;
      else if (level === 'intermediate') score += matches * 2;
      else score += matches; // beginner
    });

    // Factor in user context
    if (userContext.technicalBackground) {
      if (userContext.technicalBackground === 'developer') score += 5;
      else if (userContext.technicalBackground === 'designer') score += 3;
      else if (userContext.technicalBackground === 'business') score += 1;
    }

    // Determine level based on score
    if (score >= 8) return 'advanced';
    if (score >= 4) return 'intermediate';
    return 'beginner';
  }

  /**
   * Identify constraints from vibe and context
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} userContext - User context
   * @returns {Array} Identified constraints
   */
  async identifyConstraints(normalizedVibe, userContext) {
    const constraints = [];
    const vibeText = normalizedVibe.normalized.toLowerCase();

    // Budget constraints
    if (vibeText.includes('free') || vibeText.includes('no budget') || vibeText.includes('cheap')) {
      constraints.push({ type: 'budget', value: 'minimal', impact: 'high' });
    }

    // Time constraints
    if (vibeText.includes('quick') || vibeText.includes('asap') || vibeText.includes('urgent')) {
      constraints.push({ type: 'timeline', value: 'short', impact: 'high' });
    }

    // Technical constraints
    if (vibeText.includes('simple') || vibeText.includes('no code') || vibeText.includes('easy maintain')) {
      constraints.push({ type: 'technical', value: 'low-complexity', impact: 'medium' });
    }

    // Scale constraints
    if (vibeText.includes('small') || vibeText.includes('personal') || vibeText.includes('just me')) {
      constraints.push({ type: 'scale', value: 'small', impact: 'medium' });
    }

    // Platform constraints
    if (vibeText.includes('mobile only') || vibeText.includes('app only')) {
      constraints.push({ type: 'platform', value: 'mobile-first', impact: 'high' });
    }

    return constraints;
  }

  /**
   * Extract goals from vibe
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {Array} Extracted goals
   */
  async extractGoals(normalizedVibe) {
    const goals = [];
    const vibeText = normalizedVibe.normalized.toLowerCase();

    const goalPatterns = {
      'revenue-generation': ['make money', 'sell', 'monetize', 'income', 'profit'],
      'audience-building': ['grow audience', 'followers', 'subscribers', 'community'],
      'lead-generation': ['leads', 'customers', 'clients', 'prospects'],
      'brand-building': ['brand', 'reputation', 'awareness', 'recognition'],
      'productivity': ['organize', 'efficient', 'productive', 'streamline'],
      'learning': ['learn', 'education', 'tutorial', 'course', 'teaching'],
      'portfolio': ['showcase', 'portfolio', 'work', 'skills', 'experience'],
      'automation': ['automate', 'automatic', 'streamline', 'workflow']
    };

    Object.entries(goalPatterns).forEach(([goal, patterns]) => {
      if (patterns.some(pattern => vibeText.includes(pattern))) {
        goals.push(goal);
      }
    });

    return goals.length > 0 ? goals : ['general-purpose'];
  }

  /**
   * Estimate project timeline from vibe
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {string} Timeline estimate
   */
  async estimateTimeline(normalizedVibe) {
    const vibeText = normalizedVibe.normalized.toLowerCase();

    const timelineIndicators = {
      'immediate': ['asap', 'urgent', 'immediately', 'now', 'today'],
      'short': ['quick', 'fast', 'soon', 'this week', 'few days'],
      'medium': ['month', 'few weeks', 'reasonable time', 'moderate'],
      'long': ['eventually', 'when ready', 'no rush', 'future', 'long term']
    };

    for (const [timeline, indicators] of Object.entries(timelineIndicators)) {
      if (indicators.some(indicator => vibeText.includes(indicator))) {
        return timeline;
      }
    }

    // Estimate based on complexity
    if (normalizedVibe.complexity === 'high') return 'long';
    if (normalizedVibe.complexity === 'low') return 'short';
    return 'medium';
  }

  /**
   * Assess project scale
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {string} Scale assessment
   */
  async assessScale(normalizedVibe) {
    const vibeText = normalizedVibe.normalized.toLowerCase();

    const scaleIndicators = {
      'large': ['enterprise', 'thousands', 'millions', 'global', 'massive', 'scale'],
      'medium': ['hundreds', 'growing', 'expanding', 'regional', 'moderate'],
      'small': ['personal', 'small', 'local', 'friends', 'family', 'few users']
    };

    for (const [scale, indicators] of Object.entries(scaleIndicators)) {
      if (indicators.some(indicator => vibeText.includes(indicator))) {
        return scale;
      }
    }

    // Default based on user type inference
    if (vibeText.includes('business') || vibeText.includes('company')) return 'medium';
    if (vibeText.includes('personal') || vibeText.includes('hobby')) return 'small';
    return 'medium';
  }

  /**
   * Assess budget constraints
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {string} Budget assessment
   */
  async assessBudgetConstraints(normalizedVibe) {
    const vibeText = normalizedVibe.normalized.toLowerCase();

    if (vibeText.includes('free') || vibeText.includes('no budget') || vibeText.includes('open source')) {
      return 'free-tier';
    }
    
    if (vibeText.includes('premium') || vibeText.includes('enterprise') || vibeText.includes('unlimited budget')) {
      return 'premium';
    }
    
    if (vibeText.includes('startup') || vibeText.includes('bootstrap') || vibeText.includes('small budget')) {
      return 'startup';
    }

    return 'moderate';
  }

  /**
   * Assess urgency level
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {string} Urgency level
   */
  async assessUrgency(normalizedVibe) {
    const vibeText = normalizedVibe.normalized.toLowerCase();

    const urgencyIndicators = {
      'critical': ['emergency', 'critical', 'asap', 'immediately'],
      'high': ['urgent', 'soon', 'quickly', 'fast'],
      'medium': ['reasonable', 'normal', 'standard'],
      'low': ['eventually', 'when ready', 'no rush']
    };

    for (const [urgency, indicators] of Object.entries(urgencyIndicators)) {
      if (indicators.some(indicator => vibeText.includes(indicator))) {
        return urgency;
      }
    }

    return 'medium';
  }

  /**
   * Extract user preferences
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} userContext - User context
   * @returns {Object} User preferences
   */
  async extractPreferences(normalizedVibe, userContext) {
    const vibeText = normalizedVibe.normalized.toLowerCase();
    
    return {
      designStyle: this.extractDesignStyle(vibeText),
      technology: this.extractTechnologyPreferences(vibeText),
      features: this.extractFeaturePreferences(vibeText),
      platform: this.extractPlatformPreferences(vibeText),
      maintenance: this.extractMaintenancePreferences(vibeText)
    };
  }

  // Helper methods for business context extraction
  detectBusinessModel(vibeText) {
    const businessModels = {
      'ecommerce': ['sell', 'shop', 'store', 'products', 'retail'],
      'saas': ['subscription', 'software', 'service', 'platform'],
      'content': ['blog', 'content', 'media', 'publishing'],
      'service': ['consulting', 'agency', 'freelance', 'professional services'],
      'marketplace': ['marketplace', 'connect buyers', 'platform', 'commission'],
      'advertising': ['ads', 'advertising', 'sponsored', 'affiliate']
    };

    for (const [model, keywords] of Object.entries(businessModels)) {
      if (keywords.some(keyword => vibeText.includes(keyword))) {
        return model;
      }
    }

    return 'general';
  }

  identifyAudience(vibeText) {
    const audienceTypes = {
      'b2b': ['business', 'companies', 'enterprises', 'professionals'],
      'b2c': ['customers', 'consumers', 'users', 'people'],
      'niche': ['specific', 'specialized', 'targeted', 'particular'],
      'mass': ['everyone', 'general', 'broad', 'wide audience']
    };

    for (const [audience, keywords] of Object.entries(audienceTypes)) {
      if (keywords.some(keyword => vibeText.includes(keyword))) {
        return audience;
      }
    }

    return 'general';
  }

  extractValue(vibeText) {
    const valueProps = [];
    
    const valuePatterns = {
      'convenience': ['easy', 'simple', 'convenient', 'quick'],
      'cost-saving': ['cheap', 'affordable', 'save money', 'cost effective'],
      'time-saving': ['fast', 'quick', 'save time', 'efficient'],
      'quality': ['high quality', 'premium', 'excellent', 'superior'],
      'innovation': ['innovative', 'new', 'cutting edge', 'advanced']
    };

    Object.entries(valuePatterns).forEach(([value, patterns]) => {
      if (patterns.some(pattern => vibeText.includes(pattern))) {
        valueProps.push(value);
      }
    });

    return valueProps.length > 0 ? valueProps : ['general-value'];
  }

  detectRevenueModel(vibeText) {
    const revenueModels = {
      'sales': ['sell', 'purchase', 'buy', 'one-time'],
      'subscription': ['subscription', 'monthly', 'recurring', 'membership'],
      'advertising': ['ads', 'advertising', 'sponsored'],
      'freemium': ['freemium', 'free tier', 'premium features'],
      'commission': ['commission', 'transaction fee', 'percentage']
    };

    for (const [model, keywords] of Object.entries(revenueModels)) {
      if (keywords.some(keyword => vibeText.includes(keyword))) {
        return model;
      }
    }

    return 'unknown';
  }

  assessMarketSize(vibeText) {
    if (vibeText.includes('global') || vibeText.includes('worldwide')) return 'global';
    if (vibeText.includes('national') || vibeText.includes('country')) return 'national';
    if (vibeText.includes('local') || vibeText.includes('city')) return 'local';
    return 'regional';
  }

  identifyAdvantages(vibeText) {
    const advantages = [];
    
    const advantagePatterns = {
      'first-mover': ['first', 'pioneer', 'new market'],
      'cost-leader': ['cheapest', 'lowest cost', 'affordable'],
      'quality-leader': ['best quality', 'premium', 'superior'],
      'convenience': ['most convenient', 'easiest', 'simplest'],
      'innovation': ['most innovative', 'cutting edge', 'revolutionary']
    };

    Object.entries(advantagePatterns).forEach(([advantage, patterns]) => {
      if (patterns.some(pattern => vibeText.includes(pattern))) {
        advantages.push(advantage);
      }
    });

    return advantages;
  }

  // Helper methods for preferences extraction
  extractDesignStyle(vibeText) {
    const stylePatterns = {
      'modern': ['modern', 'contemporary', 'sleek', 'clean'],
      'minimalist': ['minimal', 'simple', 'clean', 'uncluttered'],
      'professional': ['professional', 'business', 'corporate', 'formal'],
      'creative': ['creative', 'artistic', 'unique', 'colorful'],
      'playful': ['fun', 'playful', 'casual', 'friendly']
    };

    for (const [style, patterns] of Object.entries(stylePatterns)) {
      if (patterns.some(pattern => vibeText.includes(pattern))) {
        return style;
      }
    }

    return 'balanced';
  }

  extractTechnologyPreferences(vibeText) {
    const preferences = [];
    
    const techPatterns = {
      'react': ['react', 'jsx', 'modern frontend'],
      'wordpress': ['wordpress', 'cms', 'content management'],
      'static': ['static', 'jamstack', 'fast loading'],
      'database': ['database', 'dynamic', 'user data'],
      'api': ['api', 'integration', 'third party']
    };

    Object.entries(techPatterns).forEach(([tech, patterns]) => {
      if (patterns.some(pattern => vibeText.includes(pattern))) {
        preferences.push(tech);
      }
    });

    return preferences;
  }

  extractFeaturePreferences(vibeText) {
    return this.extractGoals({ normalized: vibeText }); // Reuse goals extraction
  }

  extractPlatformPreferences(vibeText) {
    const platforms = [];
    
    if (vibeText.includes('mobile') || vibeText.includes('phone')) platforms.push('mobile');
    if (vibeText.includes('desktop') || vibeText.includes('computer')) platforms.push('desktop');
    if (vibeText.includes('tablet')) platforms.push('tablet');
    if (vibeText.includes('web') || vibeText.includes('browser')) platforms.push('web');

    return platforms.length > 0 ? platforms : ['web', 'mobile'];
  }

  extractMaintenancePreferences(vibeText) {
    if (vibeText.includes('no maintenance') || vibeText.includes('set and forget')) {
      return 'minimal';
    }
    if (vibeText.includes('regular updates') || vibeText.includes('active maintenance')) {
      return 'active';
    }
    return 'moderate';
  }

  // Initialize pattern libraries
  initializeUserTypePatterns() {
    return {
      'entrepreneur': ['business', 'startup', 'revenue', 'customers', 'market', 'sell', 'profit'],
      'creative': ['portfolio', 'art', 'design', 'showcase', 'creative', 'visual', 'gallery'],
      'educator': ['students', 'course', 'learning', 'educational', 'teach', 'lesson', 'curriculum'],
      'nonprofit': ['community', 'volunteer', 'donation', 'cause', 'charity', 'social impact'],
      'personal': ['hobby', 'personal', 'family', 'friends', 'fun', 'interest'],
      'freelancer': ['freelance', 'client', 'portfolio', 'services', 'professional', 'work'],
      'developer': ['code', 'api', 'technical', 'programming', 'development', 'software'],
      'blogger': ['blog', 'content', 'writing', 'articles', 'posts', 'publishing']
    };
  }

  initializeBusinessModelPatterns() {
    return {
      'ecommerce': ['online store', 'sell products', 'shopping cart', 'inventory'],
      'saas': ['software service', 'subscription', 'platform', 'recurring revenue'],
      'content': ['blog', 'articles', 'content creation', 'publishing'],
      'service': ['consulting', 'professional services', 'client work'],
      'marketplace': ['connect buyers sellers', 'commission', 'platform'],
      'educational': ['courses', 'learning', 'education', 'students']
    };
  }

  initializeTechnicalLevelIndicators() {
    return {
      'advanced': ['api', 'database', 'server', 'deployment', 'architecture', 'scalable', 'performance'],
      'intermediate': ['responsive', 'interactive', 'dynamic', 'integration', 'authentication'],
      'beginner': ['simple', 'easy', 'basic', 'no code', 'template', 'drag and drop']
    };
  }

  analyzeProjectHistory(projects) {
    // Simplified project history analysis
    return projects.map(project => project.type || 'general');
  }
}

module.exports = { ContextAnalyzer };