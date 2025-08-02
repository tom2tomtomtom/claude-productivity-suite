/**
 * Error Handler - Centralized error handling and recovery system
 * Provides graceful error handling, logging, and user-friendly error messages
 */

class ErrorHandler {
  constructor() {
    this.errorStats = new Map();
    this.errorPatterns = new Map();
    this.recoveryStrategies = new Map();
    this.errorLog = [];
    
    this.initializeRecoveryStrategies();
  }

  /**
   * Initialize built-in recovery strategies
   */
  initializeRecoveryStrategies() {
    // Agent routing failures
    this.recoveryStrategies.set('AGENT_ROUTING_FAILURE', {
      strategy: 'fallback_to_general_agent',
      description: 'Route to general-purpose agent when specialist routing fails',
      implementation: this.fallbackToGeneralAgent.bind(this)
    });
    
    // Token budget exceeded
    this.recoveryStrategies.set('TOKEN_BUDGET_EXCEEDED', {
      strategy: 'optimize_and_retry',
      description: 'Apply aggressive optimization and retry with smaller context',
      implementation: this.optimizeAndRetry.bind(this)
    });
    
    // Agent execution timeout
    this.recoveryStrategies.set('AGENT_EXECUTION_TIMEOUT', {
      strategy: 'simplified_execution',
      description: 'Retry with simplified context and reduced complexity',
      implementation: this.simplifiedExecution.bind(this)
    });
    
    // Context compression failure
    this.recoveryStrategies.set('CONTEXT_COMPRESSION_FAILURE', {
      strategy: 'manual_context_reduction',
      description: 'Manually reduce context size and retry',
      implementation: this.manualContextReduction.bind(this)
    });
    
    // Pattern matching failure
    this.recoveryStrategies.set('PATTERN_MATCHING_FAILURE', {
      strategy: 'default_routing',
      description: 'Use default routing when pattern matching fails',
      implementation: this.defaultRouting.bind(this)
    });
  }

  /**
   * Handle an error with automatic recovery
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   * @returns {Object} Error handling result
   */
  async handleError(error, context = {}) {
    const errorInfo = this.analyzeError(error, context);
    
    // Log the error
    this.logError(errorInfo);
    
    // Update error statistics
    this.updateErrorStats(errorInfo);
    
    // Attempt recovery if strategy exists
    const recoveryResult = await this.attemptRecovery(errorInfo, context);
    
    return {
      error: errorInfo,
      recovery: recoveryResult,
      userMessage: this.generateUserFriendlyMessage(errorInfo, recoveryResult),
      suggestedActions: this.generateSuggestedActions(errorInfo),
      canRetry: recoveryResult.success || this.canRetryError(errorInfo.type)
    };
  }

  /**
   * Analyze error to determine type and severity
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   * @returns {Object} Error analysis
   */
  analyzeError(error, context) {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      type: this.determineErrorType(error),
      severity: this.determineSeverity(error, context),
      context: {
        operationId: context.operationId,
        agentId: context.agentId,
        userId: context.userId,
        sessionId: context.sessionId,
        command: context.command,
        ...context
      },
      isRecoverable: this.isRecoverable(error)
    };
    
    return errorInfo;
  }

  /**
   * Determine error type from error object
   * @param {Error} error - Error object
   * @returns {string} Error type
   */
  determineErrorType(error) {
    if (error.code === 'MODULE_NOT_FOUND') return 'MODULE_NOT_FOUND';
    if (error.message.includes('timeout')) return 'TIMEOUT_ERROR';
    if (error.message.includes('budget')) return 'TOKEN_BUDGET_EXCEEDED';
    if (error.message.includes('routing')) return 'AGENT_ROUTING_FAILURE';
    if (error.message.includes('compression')) return 'CONTEXT_COMPRESSION_FAILURE';
    if (error.message.includes('pattern')) return 'PATTERN_MATCHING_FAILURE';
    if (error.name === 'ValidationError') return 'VALIDATION_ERROR';
    if (error.name === 'NetworkError') return 'NETWORK_ERROR';
    if (error.name === 'TypeError') return 'TYPE_ERROR';
    if (error.name === 'ReferenceError') return 'REFERENCE_ERROR';
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Determine error severity
   * @param {Error} error - Error object
   * @param {Object} context - Error context
   * @returns {string} Severity level
   */
  determineSeverity(error, context) {
    const criticalTypes = ['MODULE_NOT_FOUND', 'REFERENCE_ERROR', 'SYSTEM_ERROR'];
    const warningTypes = ['TIMEOUT_ERROR', 'VALIDATION_ERROR'];
    
    if (criticalTypes.includes(this.determineErrorType(error))) {
      return 'critical';
    }
    
    if (warningTypes.includes(this.determineErrorType(error))) {
      return 'warning';
    }
    
    // Check context for severity indicators
    if (context.isUserFacing) return 'high';
    if (context.isSystemCritical) return 'critical';
    
    return 'medium';
  }

  /**
   * Check if error is recoverable
   * @param {Error} error - Error object
   * @returns {boolean} Whether error is recoverable
   */
  isRecoverable(error) {
    const unrecoverableTypes = ['MODULE_NOT_FOUND', 'REFERENCE_ERROR', 'SYNTAX_ERROR'];
    const errorType = this.determineErrorType(error);
    
    return !unrecoverableTypes.includes(errorType);
  }

  /**
   * Attempt error recovery
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async attemptRecovery(errorInfo, context) {
    if (!errorInfo.isRecoverable) {
      return {
        success: false,
        reason: 'Error is not recoverable',
        strategy: null
      };
    }
    
    const strategy = this.recoveryStrategies.get(errorInfo.type);
    if (!strategy) {
      return {
        success: false,
        reason: 'No recovery strategy available',
        strategy: null
      };
    }
    
    try {
      const result = await strategy.implementation(errorInfo, context);
      
      return {
        success: true,
        strategy: strategy.strategy,
        description: strategy.description,
        result,
        retryRecommended: true
      };
    } catch (recoveryError) {
      return {
        success: false,
        reason: 'Recovery strategy failed',
        strategy: strategy.strategy,
        error: recoveryError.message
      };
    }
  }

  /**
   * Recovery strategy: Fallback to general agent
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async fallbackToGeneralAgent(errorInfo, context) {
    return {
      newAgent: 'project-manager',
      simplifiedContext: this.simplifyContext(context),
      message: 'Routing to project manager for general assistance'
    };
  }

  /**
   * Recovery strategy: Optimize and retry
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async optimizeAndRetry(errorInfo, context) {
    return {
      optimizedContext: this.aggressiveContextOptimization(context),
      reducedScope: true,
      message: 'Applied aggressive optimization, retry with reduced scope'
    };
  }

  /**
   * Recovery strategy: Simplified execution
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async simplifiedExecution(errorInfo, context) {
    return {
      simplifiedCommand: this.simplifyCommand(context.command),
      reducedContext: this.simplifyContext(context),
      message: 'Simplified command for faster execution'
    };
  }

  /**
   * Recovery strategy: Manual context reduction
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async manualContextReduction(errorInfo, context) {
    return {
      reducedContext: this.manuallyReduceContext(context),
      preservedEssentials: ['userCommand', 'projectType', 'requirements'],
      message: 'Manually reduced context while preserving essentials'
    };
  }

  /**
   * Recovery strategy: Default routing
   * @param {Object} errorInfo - Error information
   * @param {Object} context - Error context
   * @returns {Object} Recovery result
   */
  async defaultRouting(errorInfo, context) {
    return {
      defaultAgent: 'project-manager',
      routingMethod: 'simple',
      message: 'Using default routing when pattern matching fails'
    };
  }

  /**
   * Generate user-friendly error message
   * @param {Object} errorInfo - Error information
   * @param {Object} recoveryResult - Recovery result
   * @returns {string} User-friendly message
   */
  generateUserFriendlyMessage(errorInfo, recoveryResult) {
    const baseMessages = {
      'MODULE_NOT_FOUND': 'A required component is missing. Please check the installation.',
      'TIMEOUT_ERROR': 'The operation took longer than expected. Let me try a different approach.',
      'TOKEN_BUDGET_EXCEEDED': 'Token budget limit reached. Optimizing for efficiency and retrying.',
      'AGENT_ROUTING_FAILURE': 'Had trouble selecting the right specialist. Using a general approach instead.',
      'CONTEXT_COMPRESSION_FAILURE': 'Context processing failed. Simplifying and trying again.',
      'PATTERN_MATCHING_FAILURE': 'Pattern recognition failed. Using standard processing instead.',
      'VALIDATION_ERROR': 'Input validation failed. Please check your request and try again.',
      'NETWORK_ERROR': 'Network connection issue. Please check your connection and retry.',
      'UNKNOWN_ERROR': 'An unexpected issue occurred. Attempting automatic resolution.'
    };
    
    let message = baseMessages[errorInfo.type] || 'An unexpected issue occurred.';
    
    if (recoveryResult.success) {
      message += ` \u2713 ${recoveryResult.description}`;
    } else if (errorInfo.isRecoverable) {
      message += ' Please try again or contact support if the issue persists.';
    } else {
      message += ' This appears to be a system issue that requires technical attention.';
    }
    
    return message;
  }

  /**
   * Generate suggested actions for user
   * @param {Object} errorInfo - Error information
   * @returns {Array} Array of suggested actions
   */
  generateSuggestedActions(errorInfo) {
    const suggestions = {
      'MODULE_NOT_FOUND': [
        'Check if all dependencies are installed',
        'Try restarting the application',
        'Contact support if the issue persists'
      ],
      'TIMEOUT_ERROR': [
        'Try breaking down your request into smaller parts',
        'Check your internet connection',
        'Retry the operation'
      ],
      'TOKEN_BUDGET_EXCEEDED': [
        'Consider simplifying your request',
        'Try processing in smaller chunks',
        'Review your token usage settings'
      ],
      'VALIDATION_ERROR': [
        'Double-check your input format',
        'Refer to the documentation for correct syntax',
        'Try a simplified version of your request'
      ]
    };
    
    return suggestions[errorInfo.type] || [
      'Try the operation again',
      'Check the system status',
      'Contact support if the problem continues'
    ];
  }

  /**
   * Log error for analysis
   * @param {Object} errorInfo - Error information
   */
  logError(errorInfo) {
    this.errorLog.push(errorInfo);
    
    // Keep only last 1000 errors to prevent memory issues
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-1000);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`🚨 Error [${errorInfo.type}]:`, errorInfo.message);
      if (errorInfo.context.operationId) {
        console.error(`   Operation: ${errorInfo.context.operationId}`);
      }
    }
  }

  /**
   * Update error statistics
   * @param {Object} errorInfo - Error information
   */
  updateErrorStats(errorInfo) {
    const type = errorInfo.type;
    
    if (!this.errorStats.has(type)) {
      this.errorStats.set(type, {
        count: 0,
        firstSeen: errorInfo.timestamp,
        lastSeen: errorInfo.timestamp,
        severity: errorInfo.severity,
        recoverySuccess: 0,
        recoveryFailure: 0
      });
    }
    
    const stats = this.errorStats.get(type);
    stats.count++;
    stats.lastSeen = errorInfo.timestamp;
  }

  /**
   * Check if error can be retried
   * @param {string} errorType - Error type
   * @returns {boolean} Whether retry is possible
   */
  canRetryError(errorType) {
    const nonRetryableTypes = ['MODULE_NOT_FOUND', 'REFERENCE_ERROR', 'SYNTAX_ERROR'];
    return !nonRetryableTypes.includes(errorType);
  }

  /**
   * Simplify context for recovery
   * @param {Object} context - Original context
   * @returns {Object} Simplified context
   */
  simplifyContext(context) {
    return {
      userCommand: context.userCommand || context.command,
      projectType: context.projectType,
      essential: true
    };
  }

  /**
   * Apply aggressive context optimization
   * @param {Object} context - Original context
   * @returns {Object} Optimized context
   */
  aggressiveContextOptimization(context) {
    return {
      userCommand: context.userCommand || context.command,
      basicRequirements: context.requirements?.slice(0, 3) || [],
      optimized: true
    };
  }

  /**
   * Simplify command for recovery
   * @param {Object} command - Original command
   * @returns {Object} Simplified command
   */
  simplifyCommand(command) {
    if (typeof command === 'string') {
      return {
        type: 'general',
        input: command,
        simplified: true
      };
    }
    
    return {
      type: command.type || 'general',
      input: command.input || command.description,
      simplified: true
    };
  }

  /**
   * Manually reduce context size
   * @param {Object} context - Original context
   * @returns {Object} Reduced context
   */
  manuallyReduceContext(context) {
    const essential = {
      userCommand: context.userCommand || context.command,
      projectType: context.projectType,
      manuallyReduced: true
    };
    
    // Add only the most important context elements
    if (context.requirements && context.requirements.length > 0) {
      essential.requirements = context.requirements.slice(0, 2);
    }
    
    return essential;
  }

  /**
   * Generate unique error ID
   * @returns {string} Unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {
      totalErrors: this.errorLog.length,
      errorTypes: {},
      recentErrors: this.errorLog.slice(-10),
      topErrorTypes: [],
      healthScore: 0
    };
    
    // Compile error type statistics
    for (const [type, typeStats] of this.errorStats) {
      stats.errorTypes[type] = {
        count: typeStats.count,
        lastSeen: typeStats.lastSeen,
        severity: typeStats.severity,
        recoveryRate: typeStats.recoverySuccess / (typeStats.recoverySuccess + typeStats.recoveryFailure)
      };
    }
    
    // Get top error types
    stats.topErrorTypes = Array.from(this.errorStats.entries())
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5)
      .map(([type, data]) => ({ type, count: data.count }));
    
    // Calculate health score (0-100)
    const totalErrors = this.errorLog.length;
    const recentErrors = this.errorLog.filter(e => (Date.now() - e.timestamp) < 24 * 60 * 60 * 1000).length;
    stats.healthScore = Math.max(0, 100 - (recentErrors * 10));
    
    return stats;
  }

  /**
   * Export error data for analysis
   * @returns {Object} Exportable error data
   */
  exportErrorData() {
    return {
      errorLog: this.errorLog,
      errorStats: Object.fromEntries(this.errorStats),
      recoveryStrategies: Array.from(this.recoveryStrategies.keys()),
      stats: this.getErrorStats(),
      exportTimestamp: Date.now()
    };
  }

  /**
   * Reset error tracking (useful for testing)
   */
  reset() {
    this.errorStats.clear();
    this.errorLog = [];
  }

  /**
   * Get health status
   * @returns {Object} Health status
   */
  getHealthStatus() {
    const stats = this.getErrorStats();
    const recentCriticalErrors = this.errorLog
      .filter(e => (Date.now() - e.timestamp) < 60 * 60 * 1000) // Last hour
      .filter(e => e.severity === 'critical').length;
    
    return {
      status: recentCriticalErrors > 0 ? 'critical' : 
              stats.healthScore < 70 ? 'warning' : 'healthy',
      healthScore: stats.healthScore,
      totalErrors: stats.totalErrors,
      recentCriticalErrors,
      topErrorType: stats.topErrorTypes[0]?.type || 'none',
      recoveryStrategies: this.recoveryStrategies.size
    };
  }
}

module.exports = { ErrorHandler };