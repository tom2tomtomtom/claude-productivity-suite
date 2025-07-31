/**
 * Optimization Pattern Library
 * Manages reusable optimization patterns for token efficiency
 */

class OptimizationPatternLibrary {
  constructor() {
    this.patterns = new Map();
    this.initializeBasePatterns();
  }

  /**
   * Find patterns applicable to a vibe
   * @param {Object} requirements - Vibe requirements
   * @param {Object} userContext - User context
   * @returns {Array} Applicable patterns
   */
  async findPatternsForVibe(requirements, userContext) {
    const applicablePatterns = [];
    
    for (const [id, pattern] of this.patterns) {
      const applicability = await this.assessPatternApplicability(pattern, requirements, userContext);
      
      if (applicability.score > 0.6) {
        applicablePatterns.push({
          ...pattern,
          applicabilityScore: applicability.score,
          reasoning: applicability.reasoning
        });
      }
    }
    
    return applicablePatterns.sort((a, b) => b.applicabilityScore - a.applicabilityScore);
  }

  /**
   * Assess how applicable a pattern is to current requirements
   * @param {Object} pattern - Pattern to assess
   * @param {Object} requirements - Requirements
   * @param {Object} userContext - User context
   * @returns {Object} Applicability assessment
   */
  async assessPatternApplicability(pattern, requirements, userContext) {
    let score = 0;
    const reasons = [];
    
    // Domain matching
    if (pattern.domains && requirements.domain) {
      if (pattern.domains.includes(requirements.domain)) {
        score += 0.4;
        reasons.push('Domain match');
      }
    }
    
    // User type matching
    if (pattern.userTypes && userContext.userType) {
      if (pattern.userTypes.includes(userContext.userType)) {
        score += 0.3;
        reasons.push('User type match');
      }
    }
    
    // Complexity matching
    if (pattern.complexity && requirements.complexity) {
      if (pattern.complexity === requirements.complexity) {
        score += 0.2;
        reasons.push('Complexity match');
      }
    }
    
    // Scale matching
    if (pattern.scale && userContext.scale) {
      if (pattern.scale === userContext.scale) {
        score += 0.1;
        reasons.push('Scale match');
      }
    }
    
    return {
      score: Math.min(score, 1.0),
      reasoning: reasons.join(', ')
    };
  }

  /**
   * Initialize base optimization patterns
   */
  initializeBasePatterns() {
    // Todo App Pattern
    this.patterns.set('todo-app-basic', {
      id: 'todo-app-basic',
      name: 'Basic Todo App',
      domains: ['utility', 'productivity'],
      userTypes: ['personal', 'general'],
      complexity: 'low',
      scale: 'small',
      averageTokenSavings: 200,
      requirements: {
        implicit: ['responsive-design', 'local-storage', 'simple-ui'],
        technical: {
          frontend: 'React with hooks',
          backend: 'none',
          database: 'localStorage'
        }
      }
    });
    
    // E-commerce Pattern
    this.patterns.set('ecommerce-basic', {
      id: 'ecommerce-basic',
      name: 'Basic E-commerce Store',
      domains: ['ecommerce'],
      userTypes: ['entrepreneur', 'business'],
      complexity: 'medium',
      scale: 'medium',
      averageTokenSavings: 300,
      requirements: {
        implicit: ['payment-processing', 'user-authentication', 'ssl-security', 'product-catalog'],
        technical: {
          frontend: 'React with e-commerce components',
          backend: 'Node.js with payment integration',
          database: 'PostgreSQL'
        }
      }
    });
    
    // Blog Pattern
    this.patterns.set('blog-basic', {
      id: 'blog-basic',
      name: 'Basic Blog/Content Site',
      domains: ['blog', 'content'],
      userTypes: ['creative', 'blogger', 'educator'],
      complexity: 'low',
      scale: 'small',
      averageTokenSavings: 180,
      requirements: {
        implicit: ['content-management', 'seo-optimization', 'responsive-design'],
        technical: {
          frontend: 'React with content-focused design',
          backend: 'Static or minimal CMS',
          database: 'Markdown files or headless CMS'
        }
      }
    });
    
    // Portfolio Pattern
    this.patterns.set('portfolio-basic', {
      id: 'portfolio-basic',
      name: 'Basic Portfolio Site',
      domains: ['portfolio'],
      userTypes: ['creative', 'freelancer'],
      complexity: 'low',
      scale: 'small',
      averageTokenSavings: 150,
      requirements: {
        implicit: ['responsive-design', 'image-optimization', 'contact-form'],
        technical: {
          frontend: 'React with portfolio design',
          backend: 'Static',
          database: 'JSON files'
        }
      }
    });
  }

  getPatternCount() {
    return this.patterns.size;
  }
}

module.exports = { OptimizationPatternLibrary };