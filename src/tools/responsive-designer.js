/**
 * Responsive Designer Tool
 * Helps create responsive layouts and design systems
 */

class ResponsiveDesigner {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1200px'
    };
  }

  generateMediaQueries(styles) {
    return {
      mobile: `@media (max-width: ${this.breakpoints.mobile}) { ${styles.mobile || ''} }`,
      tablet: `@media (max-width: ${this.breakpoints.tablet}) { ${styles.tablet || ''} }`,
      desktop: `@media (min-width: ${this.breakpoints.desktop}) { ${styles.desktop || ''} }`
    };
  }

  createResponsiveGrid(columns = 12) {
    return `
      .grid { display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 1rem; }
      @media (max-width: ${this.breakpoints.tablet}) { 
        .grid { grid-template-columns: repeat(2, 1fr); } 
      }
      @media (max-width: ${this.breakpoints.mobile}) { 
        .grid { grid-template-columns: 1fr; } 
      }
    `;
  }

  optimizeForMobile(design) {
    return {
      ...design,
      fontSize: '16px', // Minimum for mobile
      touchTargets: '44px', // Minimum touch target size
      spacing: 'rem', // Use relative units
      images: 'responsive' // Make images responsive
    };
  }

  validateResponsive(css) {
    const checks = {
      hasMediaQueries: /@media/.test(css),
      usesRelativeUnits: /(rem|em|%|vh|vw)/.test(css),
      hasTouchTargets: /min-(width|height):\s*44px/.test(css)
    };

    return {
      isResponsive: Object.values(checks).some(Boolean),
      checks,
      recommendations: this.getRecommendations(checks)
    };
  }

  getRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.hasMediaQueries) {
      recommendations.push('Add media queries for different screen sizes');
    }
    
    if (!checks.usesRelativeUnits) {
      recommendations.push('Use relative units (rem, em, %) instead of fixed pixels');
    }
    
    if (!checks.hasTouchTargets) {
      recommendations.push('Ensure touch targets are at least 44px in size');
    }

    return recommendations;
  }
}

module.exports = { ResponsiveDesigner };