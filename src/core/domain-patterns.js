/**
 * Domain Pattern Library
 * Provides domain-specific patterns for interpreting user vibes
 */

class DomainPatternLibrary {
  constructor() {
    this.patterns = {
      ecommerce: new EcommercePatterns(),
      blog: new BlogPatterns(),
      portfolio: new PortfolioPatterns(),
      utility: new UtilityPatterns(),
      social: new SocialPatterns(),
      business: new BusinessPatterns(),
      landing: new LandingPagePatterns()
    };
  }

  /**
   * Detect the most likely domain for a vibe
   * @param {Object} normalizedVibe - Preprocessed vibe data
   * @param {Object} context - Context analysis
   * @returns {Object} Domain detection result
   */
  async detectDomain(normalizedVibe, context) {
    const scores = await Promise.all(
      Object.entries(this.patterns).map(async ([domain, pattern]) => ({
        domain,
        score: await pattern.matchScore(normalizedVibe, context),
        patterns: pattern,
        confidence: await pattern.getConfidence(normalizedVibe, context)
      }))
    );

    // Sort by score and return the best match
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    const bestMatch = sortedScores[0];

    console.log(`🎯 Domain detection: ${bestMatch.domain} (${(bestMatch.score * 100).toFixed(1)}%)`);
    
    return {
      domain: bestMatch.domain,
      score: bestMatch.score,
      patterns: bestMatch.patterns,
      confidence: bestMatch.confidence,
      alternatives: sortedScores.slice(1, 3).map(s => ({
        domain: s.domain,
        score: s.score
      }))
    };
  }

  /**
   * Get all available domains
   * @returns {Array} List of domain names
   */
  getAvailableDomains() {
    return Object.keys(this.patterns);
  }

  /**
   * Get pattern for specific domain
   * @param {string} domain - Domain name
   * @returns {Object} Domain pattern
   */
  getPattern(domain) {
    return this.patterns[domain];
  }
}

/**
 * Base pattern class for all domain patterns
 */
class BaseDomainPattern {
  constructor() {
    this.keywords = [];
    this.implicitRequirements = [];
    this.commonFeatures = [];
    this.architecture = {};
  }

  /**
   * Calculate match score for this domain
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} context - Context analysis
   * @returns {number} Match score (0-1)
   */
  async matchScore(normalizedVibe, context) {
    let score = 0;
    let factors = 0;

    // Keyword matching
    const keywordScore = this.calculateKeywordScore(normalizedVibe);
    score += keywordScore * 0.4;
    factors += 1;

    // Context matching
    const contextScore = this.calculateContextScore(context);
    score += contextScore * 0.3;
    factors += 1;

    // Entity matching
    const entityScore = this.calculateEntityScore(normalizedVibe);
    score += entityScore * 0.2;
    factors += 1;

    // Semantic matching
    const semanticScore = this.calculateSemanticScore(normalizedVibe);
    score += semanticScore * 0.1;
    factors += 1;

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Get confidence level for this domain match
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} context - Context analysis
   * @returns {string} Confidence level
   */
  async getConfidence(normalizedVibe, context) {
    const score = await this.matchScore(normalizedVibe, context);
    
    if (score > 0.8) return 'high';
    if (score > 0.6) return 'medium';
    if (score > 0.4) return 'low';
    return 'very-low';
  }

  /**
   * Expand requirements based on domain patterns
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @param {Object} context - Context analysis
   * @returns {Array} Expanded requirements
   */
  async expandRequirements(normalizedVibe, context) {
    const baseRequirements = [...this.implicitRequirements];
    const contextualRequirements = this.getContextualRequirements(normalizedVibe, context);
    const featureRequirements = this.getFeatureRequirements(normalizedVibe);
    
    return [...baseRequirements, ...contextualRequirements, ...featureRequirements];
  }

  /**
   * Get functional requirements for this domain
   * @param {Object} normalizedVibe - Preprocessed vibe
   * @returns {Array} Functional requirements
   */
  getFunctionalRequirements(normalizedVibe) {
    return this.commonFeatures.filter(feature => 
      this.isFeatureRelevant(feature, normalizedVibe)
    );
  }

  // Helper methods
  calculateKeywordScore(vibe) {
    const vibeText = vibe.normalized.toLowerCase();
    const matchedKeywords = this.keywords.filter(keyword => 
      vibeText.includes(keyword.toLowerCase())
    );
    
    return this.keywords.length > 0 ? matchedKeywords.length / this.keywords.length : 0;
  }

  calculateContextScore(context) {
    // Override in subclasses for domain-specific context scoring
    return 0.5;
  }

  calculateEntityScore(vibe) {
    const relevantEntities = this.getRelevantEntities();
    let matches = 0;
    let total = relevantEntities.length;

    // Handle case where vibe.entities might be undefined
    if (vibe.entities && typeof vibe.entities === 'object') {
      Object.entries(vibe.entities).forEach(([category, entities]) => {
        if (Array.isArray(entities)) {
          entities.forEach(entity => {
            if (relevantEntities.includes(entity)) {
              matches++;
            }
          });
        }
      });
    }

    return total > 0 ? matches / total : 0;
  }

  calculateSemanticScore(vibe) {
    // Simplified semantic analysis based on word combinations
    const semanticPatterns = this.getSemanticPatterns();
    const vibeText = vibe.normalized.toLowerCase();
    
    const matches = semanticPatterns.filter(pattern => 
      vibeText.includes(pattern.toLowerCase())
    ).length;
    
    return semanticPatterns.length > 0 ? matches / semanticPatterns.length : 0;
  }

  getContextualRequirements(vibe, context) {
    // Override in subclasses
    return [];
  }

  getFeatureRequirements(vibe) {
    // Override in subclasses
    return [];
  }

  isFeatureRelevant(feature, vibe) {
    // Override in subclasses
    return true;
  }

  getRelevantEntities() {
    // Override in subclasses
    return [];
  }

  getSemanticPatterns() {
    // Override in subclasses
    return [];
  }
}

/**
 * E-commerce domain patterns
 */
class EcommercePatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'shop', 'store', 'buy', 'sell', 'product', 'cart', 'checkout',
      'payment', 'order', 'inventory', 'customer', 'delivery', 'shipping',
      'ecommerce', 'marketplace', 'catalog', 'purchase', 'retail'
    ];
    
    this.implicitRequirements = [
      'user-authentication', 'payment-processing', 'ssl-security',
      'responsive-design', 'seo-optimization', 'admin-dashboard',
      'order-management', 'inventory-tracking', 'customer-support'
    ];
    
    this.commonFeatures = [
      'product-catalog', 'shopping-cart', 'user-accounts', 'payment-gateway',
      'order-tracking', 'review-system', 'wishlist', 'search-filter',
      'inventory-management', 'shipping-calculator', 'tax-calculation'
    ];
    
    this.architecture = {
      frontend: 'React with e-commerce UI components',
      backend: 'Node.js with payment integration',
      database: 'PostgreSQL with product/order schema',
      deployment: 'Vercel with SSL and CDN',
      apis: ['stripe-api', 'shipping-api', 'tax-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.businessContext?.businessModel === 'retail') score += 0.4;
    if (context.businessContext?.revenue === 'sales') score += 0.3;
    if (context.userType === 'entrepreneur') score += 0.2;
    if (context.scale === 'large') score += 0.1;
    
    return Math.min(score, 1.0);
  }

  getContextualRequirements(vibe, context) {
    const requirements = [];
    
    if (context.businessContext?.targetAudience === 'global') {
      requirements.push('multi-currency', 'multi-language');
    }
    
    if (context.scale === 'large') {
      requirements.push('load-balancing', 'caching', 'cdn');
    }
    
    if (vibe.normalized.includes('subscription')) {
      requirements.push('subscription-management', 'recurring-billing');
    }
    
    return requirements;
  }

  getRelevantEntities() {
    return ['retail', 'payment', 'product', 'shop', 'store'];
  }

  getSemanticPatterns() {
    return [
      'online store', 'sell products', 'shopping cart', 'payment gateway',
      'product catalog', 'customer orders', 'inventory management'
    ];
  }
}

/**
 * Blog/Content domain patterns
 */
class BlogPatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'blog', 'content', 'article', 'post', 'write', 'publish', 'author',
      'cms', 'editorial', 'news', 'magazine', 'journal', 'story',
      'publishing', 'writer', 'reader', 'subscriber'
    ];
    
    this.implicitRequirements = [
      'content-management', 'seo-optimization', 'responsive-design',
      'social-sharing', 'search-functionality', 'comment-system',
      'rss-feeds', 'author-profiles', 'category-organization'
    ];
    
    this.commonFeatures = [
      'post-editor', 'categories-tags', 'comment-system', 'author-profiles',
      'archive-navigation', 'related-posts', 'social-sharing', 'newsletter',
      'search-functionality', 'reading-time', 'post-scheduling'
    ];
    
    this.architecture = {
      frontend: 'React with content-focused design',
      backend: 'Node.js with CMS capabilities',
      database: 'PostgreSQL with content schema',
      deployment: 'Vercel with SEO optimization',
      apis: ['email-api', 'social-api', 'analytics-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.userType === 'creative') score += 0.3;
    if (context.businessContext?.businessModel === 'content') score += 0.3;
    if (context.goals?.includes('audience-building')) score += 0.2;
    if (context.userType === 'educator') score += 0.2;
    
    return Math.min(score, 1.0);
  }

  getContextualRequirements(vibe, context) {
    const requirements = [];
    
    if (context.userType === 'educator') {
      requirements.push('course-integration', 'student-portal');
    }
    
    if (vibe.normalized.includes('monetize')) {
      requirements.push('subscription-paywall', 'ad-integration');
    }
    
    if (context.scale === 'large') {
      requirements.push('cdn', 'caching', 'performance-optimization');
    }
    
    return requirements;
  }

  getRelevantEntities() {
    return ['blog', 'content', 'writing', 'article', 'post'];
  }

  getSemanticPatterns() {
    return [
      'content management', 'blog posts', 'article publishing',
      'author platform', 'editorial content', 'content strategy'
    ];
  }
}

/**
 * Portfolio domain patterns
 */
class PortfolioPatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'portfolio', 'showcase', 'gallery', 'work', 'project', 'creative',
      'artist', 'designer', 'photographer', 'developer', 'freelancer',
      'resume', 'cv', 'professional', 'personal', 'brand'
    ];
    
    this.implicitRequirements = [
      'responsive-design', 'image-optimization', 'seo-optimization',
      'contact-form', 'social-links', 'project-showcase',
      'mobile-optimization', 'fast-loading'
    ];
    
    this.commonFeatures = [
      'project-gallery', 'about-section', 'contact-form', 'resume-download',
      'skill-showcase', 'testimonials', 'social-links', 'blog-integration',
      'project-details', 'image-lightbox', 'filtering-sorting'
    ];
    
    this.architecture = {
      frontend: 'React with portfolio-focused design',
      backend: 'Static or minimal backend',
      database: 'JSON files or headless CMS',
      deployment: 'Vercel with custom domain',
      apis: ['contact-form-api', 'analytics-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.userType === 'creative') score += 0.4;
    if (context.userType === 'freelancer') score += 0.3;
    if (context.goals?.includes('personal-branding')) score += 0.2;
    if (context.scale === 'small') score += 0.1;
    
    return Math.min(score, 1.0);
  }

  getRelevantEntities() {
    return ['portfolio', 'creative', 'designer', 'artist', 'freelancer'];
  }

  getSemanticPatterns() {
    return [
      'showcase work', 'personal brand', 'creative portfolio',
      'professional showcase', 'project gallery', 'skill demonstration'
    ];
  }
}

/**
 * Utility/Tool domain patterns
 */
class UtilityPatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'tool', 'utility', 'calculator', 'converter', 'tracker', 'manager',
      'organizer', 'planner', 'todo', 'task', 'productivity', 'helper',
      'widget', 'app', 'simple', 'quick', 'easy'
    ];
    
    this.implicitRequirements = [
      'simple-interface', 'fast-performance', 'offline-capability',
      'data-export', 'responsive-design', 'bookmark-friendly'
    ];
    
    this.commonFeatures = [
      'input-forms', 'calculation-logic', 'data-storage', 'export-functionality',
      'history-tracking', 'settings-customization', 'keyboard-shortcuts',
      'responsive-layout', 'fast-interactions'
    ];
    
    this.architecture = {
      frontend: 'React with utility-focused UI',
      backend: 'Minimal or client-side only',
      database: 'Local storage or JSON files',
      deployment: 'Vercel or Netlify',
      apis: ['minimal-backend-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.goals?.includes('productivity')) score += 0.3;
    if (context.complexity === 'low') score += 0.3;
    if (context.timeline === 'short') score += 0.2;
    if (context.userType === 'personal') score += 0.2;
    
    return Math.min(score, 1.0);
  }

  getRelevantEntities() {
    return ['tool', 'utility', 'calculator', 'tracker', 'productivity'];
  }

  getSemanticPatterns() {
    return [
      'simple tool', 'quick calculator', 'productivity app',
      'utility tool', 'helper application', 'task manager'
    ];
  }
}

/**
 * Social Network domain patterns
 */
class SocialPatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'social', 'network', 'community', 'connect', 'share', 'follow',
      'friend', 'message', 'chat', 'feed', 'timeline', 'profile',
      'like', 'comment', 'post', 'discussion', 'forum'
    ];
    
    this.implicitRequirements = [
      'user-authentication', 'real-time-features', 'notification-system',
      'privacy-controls', 'content-moderation', 'responsive-design',
      'mobile-optimization', 'scalable-architecture'
    ];
    
    this.commonFeatures = [
      'user-profiles', 'friend-system', 'messaging', 'news-feed',
      'post-creation', 'like-comment', 'notification-center',
      'privacy-settings', 'search-users', 'groups-communities'
    ];
    
    this.architecture = {
      frontend: 'React with real-time UI',
      backend: 'Node.js with WebSocket support',
      database: 'PostgreSQL with social schema',
      deployment: 'Scalable cloud deployment',
      apis: ['websocket-api', 'notification-api', 'media-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.businessContext?.businessModel === 'social') score += 0.4;
    if (context.scale === 'large') score += 0.3;
    if (context.goals?.includes('community-building')) score += 0.2;
    if (context.technicalLevel === 'advanced') score += 0.1;
    
    return Math.min(score, 1.0);
  }

  getRelevantEntities() {
    return ['social', 'community', 'network', 'chat', 'messaging'];
  }

  getSemanticPatterns() {
    return [
      'social network', 'community platform', 'social media',
      'connect people', 'social interaction', 'online community'
    ];
  }
}

/**
 * Business/Corporate domain patterns
 */
class BusinessPatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'business', 'company', 'corporate', 'professional', 'service',
      'consulting', 'agency', 'enterprise', 'b2b', 'client',
      'customer', 'lead', 'crm', 'dashboard', 'analytics'
    ];
    
    this.implicitRequirements = [
      'professional-design', 'contact-forms', 'service-pages',
      'testimonials', 'case-studies', 'seo-optimization',
      'analytics-integration', 'lead-generation'
    ];
    
    this.commonFeatures = [
      'service-showcase', 'team-profiles', 'contact-system',
      'testimonials', 'case-studies', 'blog-integration',
      'lead-capture', 'analytics-dashboard', 'client-portal'
    ];
    
    this.architecture = {
      frontend: 'React with professional design',
      backend: 'Node.js with CRM integration',
      database: 'PostgreSQL with business schema',
      deployment: 'Professional hosting with SSL',
      apis: ['crm-api', 'analytics-api', 'email-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.userType === 'entrepreneur') score += 0.3;
    if (context.businessContext?.businessModel === 'service') score += 0.3;
    if (context.goals?.includes('lead-generation')) score += 0.2;
    if (context.scale === 'medium' || context.scale === 'large') score += 0.2;
    
    return Math.min(score, 1.0);
  }

  getRelevantEntities() {
    return ['business', 'service', 'consulting', 'professional', 'corporate'];
  }

  getSemanticPatterns() {
    return [
      'business website', 'professional service', 'corporate platform',
      'consulting firm', 'business solution', 'client management'
    ];
  }
}

/**
 * Landing Page domain patterns
 */
class LandingPagePatterns extends BaseDomainPattern {
  constructor() {
    super();
    this.keywords = [
      'landing', 'page', 'marketing', 'campaign', 'conversion', 'lead',
      'signup', 'download', 'trial', 'demo', 'promotion', 'launch',
      'product', 'feature', 'benefit', 'cta', 'funnel'
    ];
    
    this.implicitRequirements = [
      'conversion-optimization', 'a/b-testing', 'analytics-tracking',
      'mobile-optimization', 'fast-loading', 'seo-optimization',
      'lead-capture', 'social-proof'
    ];
    
    this.commonFeatures = [
      'hero-section', 'feature-highlights', 'testimonials',
      'call-to-action', 'signup-form', 'pricing-section',
      'faq-section', 'social-proof', 'contact-information'
    ];
    
    this.architecture = {
      frontend: 'React with conversion-focused design',
      backend: 'Minimal backend for form handling',
      database: 'Simple lead storage',
      deployment: 'Fast CDN deployment',
      apis: ['form-api', 'analytics-api', 'email-api']
    };
  }

  calculateContextScore(context) {
    let score = 0;
    
    if (context.goals?.includes('lead-generation')) score += 0.4;
    if (context.timeline === 'short') score += 0.3;
    if (context.businessContext?.businessModel === 'marketing') score += 0.2;
    if (context.complexity === 'low') score += 0.1;
    
    return Math.min(score, 1.0);
  }

  getRelevantEntities() {
    return ['landing', 'marketing', 'campaign', 'conversion', 'lead'];
  }

  getSemanticPatterns() {
    return [
      'landing page', 'marketing campaign', 'lead generation',
      'product launch', 'conversion funnel', 'promotional page'
    ];
  }
}

module.exports = { 
  DomainPatternLibrary,
  EcommercePatterns,
  BlogPatterns,
  PortfolioPatterns,
  UtilityPatterns,
  SocialPatterns,
  BusinessPatterns,
  LandingPagePatterns
};