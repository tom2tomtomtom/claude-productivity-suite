/**
 * Design Patterns Library
 * Provides design patterns and best practices for frontend development
 */

class DesignPatterns {
  constructor() {
    this.patterns = new Map();
    this.initializePatterns();
  }

  initializePatterns() {
    this.patterns.set('responsive', {
      name: 'Responsive Design',
      description: 'Mobile-first responsive design patterns',
      principles: ['Mobile-first', 'Flexible grids', 'Media queries'],
      code: `
        .container { max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .container { padding: 1rem; } }
      `
    });

    this.patterns.set('accessibility', {
      name: 'Accessibility',
      description: 'WCAG compliance patterns',
      principles: ['Semantic HTML', 'Keyboard navigation', 'Screen readers'],
      code: `
        <button aria-label="Close dialog" tabindex="0">×</button>
        <img src="image.jpg" alt="Descriptive text">
      `
    });

    this.patterns.set('performance', {
      name: 'Performance',
      description: 'Frontend performance optimization patterns',
      principles: ['Lazy loading', 'Code splitting', 'Caching'],
      code: `
        <img loading="lazy" src="image.jpg">
        <link rel="preload" href="critical.css" as="style">
      `
    });
  }

  getPattern(name) {
    return this.patterns.get(name);
  }

  getAllPatterns() {
    return Array.from(this.patterns.values());
  }

  getRecommendations(context) {
    const recommendations = [];
    
    if (context.includes('mobile')) {
      recommendations.push(this.getPattern('responsive'));
    }
    
    if (context.includes('accessible')) {
      recommendations.push(this.getPattern('accessibility'));
    }
    
    if (context.includes('fast') || context.includes('performance')) {
      recommendations.push(this.getPattern('performance'));
    }

    return recommendations;
  }
}

module.exports = { DesignPatterns };