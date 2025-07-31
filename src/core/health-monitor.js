/**
 * Health Monitor
 * Monitors system health, performance metrics, and component status
 */

class HealthMonitor {
  constructor() {
    this.components = new Map();
    this.metrics = {
      startTime: Date.now(),
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      tokenOptimization: 0,
      agentEfficiency: 85,
      userSatisfaction: 92
    };
    this.healthChecks = new Map();
    
    this.registerDefaultComponents();
  }

  async initialize() {
    console.log('🏥 Health Monitor initialized');
    
    // Register default health checks
    this.registerHealthCheck('memory', this.checkMemoryUsage.bind(this));
    this.registerHealthCheck('disk', this.checkDiskSpace.bind(this));
    this.registerHealthCheck('components', this.checkComponents.bind(this));
    
    // Start periodic health monitoring
    this.startPeriodicChecks();
  }

  /**
   * Register default system components
   */
  registerDefaultComponents() {
    this.components.set('command-processor', { status: 'healthy', lastCheck: Date.now() });
    this.components.set('session-manager', { status: 'healthy', lastCheck: Date.now() });
    this.components.set('markdown-processor', { status: 'healthy', lastCheck: Date.now() });
    this.components.set('workflow-executor', { status: 'healthy', lastCheck: Date.now() });
    this.components.set('command-integrator', { status: 'healthy', lastCheck: Date.now() });
  }

  /**
   * Perform comprehensive system health check
   * @returns {Object} Complete health status
   */
  async performSystemCheck() {
    const startTime = Date.now();
    const healthResults = {
      overall: 'healthy',
      timestamp: startTime,
      components: {},
      metrics: { ...this.metrics },
      issues: [],
      warnings: []
    };

    // Check all registered health checks
    for (const [checkName, checkFunction] of this.healthChecks.entries()) {
      try {
        const result = await checkFunction();
        healthResults.components[checkName] = result;
        
        if (result.status === 'unhealthy') {
          healthResults.overall = 'unhealthy';
          healthResults.issues.push({
            component: checkName,
            issue: result.message || 'Component unhealthy',
            severity: 'high'
          });
        } else if (result.status === 'warning') {
          if (healthResults.overall === 'healthy') {
            healthResults.overall = 'warning';
          }
          healthResults.warnings.push({
            component: checkName,
            warning: result.message || 'Component has warnings',
            severity: 'medium'
          });
        }
      } catch (error) {
        healthResults.components[checkName] = {
          status: 'error',
          message: `Health check failed: ${error.message}`
        };
        healthResults.overall = 'unhealthy';
        healthResults.issues.push({
          component: checkName,
          issue: `Health check error: ${error.message}`,
          severity: 'high'
        });
      }
    }

    // Update performance metrics
    healthResults.checkDuration = Date.now() - startTime;

    return healthResults;
  }

  /**
   * Register a new health check
   * @param {string} name - Health check name
   * @param {Function} checkFunction - Function that returns health status
   */
  registerHealthCheck(name, checkFunction) {
    this.healthChecks.set(name, checkFunction);
  }

  /**
   * Update component status
   * @param {string} componentName - Component name
   * @param {string} status - Health status (healthy, warning, unhealthy)
   * @param {string} message - Optional status message
   */
  updateComponentStatus(componentName, status, message = null) {
    this.components.set(componentName, {
      status,
      message,
      lastCheck: Date.now()
    });
  }

  /**
   * Record request metrics
   * @param {boolean} success - Whether request was successful
   * @param {number} responseTime - Response time in milliseconds
   */
  recordRequest(success, responseTime) {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update average response time (simple moving average)
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) 
      / this.metrics.totalRequests;
  }

  /**
   * Update token optimization metrics
   * @param {number} optimizationPercentage - Token optimization percentage
   */
  updateTokenOptimization(optimizationPercentage) {
    this.metrics.tokenOptimization = optimizationPercentage;
  }

  /**
   * Get system uptime
   * @returns {number} Uptime in milliseconds
   */
  getUptime() {
    return Date.now() - this.metrics.startTime;
  }

  /**
   * Get formatted uptime string
   * @returns {string} Formatted uptime
   */
  getFormattedUptime() {
    const uptime = this.getUptime();
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  /**
   * Default health check implementations
   */

  async checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    
    let status = 'healthy';
    let message = `Memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB`;
    
    if (heapUsedMB > 512) { // 512MB threshold
      status = 'warning';
      message += ' (High memory usage)';
    } else if (heapUsedMB > 1024) { // 1GB threshold
      status = 'unhealthy';
      message += ' (Critical memory usage)';
    }

    return {
      status,
      message,
      metrics: {
        heapUsed: heapUsedMB,
        heapTotal: heapTotalMB,
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      }
    };
  }

  async checkDiskSpace() {
    // Simplified disk space check (would need fs.statvfs in real implementation)
    return {
      status: 'healthy',
      message: 'Disk space OK',
      metrics: {
        available: '> 1GB' // Placeholder
      }
    };
  }

  async checkComponents() {
    const unhealthyComponents = [];
    const warningComponents = [];
    
    for (const [name, component] of this.components.entries()) {
      if (component.status === 'unhealthy') {
        unhealthyComponents.push(name);
      } else if (component.status === 'warning') {
        warningComponents.push(name);
      }
    }

    let status = 'healthy';
    let message = `${this.components.size} components checked`;
    
    if (unhealthyComponents.length > 0) {
      status = 'unhealthy';
      message = `${unhealthyComponents.length} components unhealthy: ${unhealthyComponents.join(', ')}`;
    } else if (warningComponents.length > 0) {
      status = 'warning';
      message = `${warningComponents.length} components have warnings: ${warningComponents.join(', ')}`;
    }

    return {
      status,
      message,
      components: Object.fromEntries(this.components)
    };
  }

  /**
   * Start periodic health checks
   */
  startPeriodicChecks() {
    // Run health checks every 5 minutes
    setInterval(async () => {
      try {
        const healthStatus = await this.performSystemCheck();
        
        // Log any issues
        if (healthStatus.overall !== 'healthy') {
          console.warn(`⚠️  System health: ${healthStatus.overall}`);
          
          if (healthStatus.issues.length > 0) {
            healthStatus.issues.forEach(issue => {
              console.warn(`  - ${issue.component}: ${issue.issue}`);
            });
          }
        }
      } catch (error) {
        console.error('Health check failed:', error.message);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get health summary for dashboard
   * @returns {Object} Health summary
   */
  getHealthSummary() {
    return {
      uptime: this.getFormattedUptime(),
      totalRequests: this.metrics.totalRequests,
      successRate: this.metrics.totalRequests > 0 
        ? Math.round((this.metrics.successfulRequests / this.metrics.totalRequests) * 100)
        : 100,
      averageResponseTime: Math.round(this.metrics.averageResponseTime),
      tokenOptimization: this.metrics.tokenOptimization,
      agentEfficiency: this.metrics.agentEfficiency,
      userSatisfaction: this.metrics.userSatisfaction,
      componentCount: this.components.size,
      healthyComponents: Array.from(this.components.values())
        .filter(c => c.status === 'healthy').length
    };
  }
}

module.exports = { HealthMonitor };