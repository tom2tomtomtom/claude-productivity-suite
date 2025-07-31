/**
 * Base Agent Class - Foundation for all specialist agents
 * Provides common functionality and interface standardization
 */

class BaseAgent {
  constructor(agentId) {
    this.agentId = agentId;
    this.expertise = [];
    this.tools = {};
    this.capabilities = {};
    this.performance = {
      executionCount: 0,
      successCount: 0,
      averageTokenUsage: 0,
      averageExecutionTime: 0
    };
  }

  // Abstract methods that must be implemented by subclasses
  async execute(command, context, callbacks = {}) {
    throw new Error(`Execute method must be implemented by ${this.constructor.name}`);
  }

  assessTaskFit(taskType, context) {
    throw new Error(`AssessTaskFit method must be implemented by ${this.constructor.name}`);
  }

  getContextFilter() {
    throw new Error(`GetContextFilter method must be implemented by ${this.constructor.name}`);
  }

  // Common utility methods available to all agents
  async recordExecution(startTime, success, tokenUsage) {
    const executionTime = Date.now() - startTime;
    
    this.performance.executionCount++;
    if (success) {
      this.performance.successCount++;
    }
    
    // Update averages
    this.performance.averageTokenUsage = (
      (this.performance.averageTokenUsage * (this.performance.executionCount - 1)) + tokenUsage
    ) / this.performance.executionCount;
    
    this.performance.averageExecutionTime = (
      (this.performance.averageExecutionTime * (this.performance.executionCount - 1)) + executionTime
    ) / this.performance.executionCount;
  }

  getPerformanceMetrics() {
    return {
      ...this.performance,
      successRate: this.performance.executionCount > 0 
        ? this.performance.successCount / this.performance.executionCount 
        : 0
    };
  }

  // Helper method for non-coder friendly explanations
  generateNonCoderExplanation(technicalResult) {
    return {
      whatHappened: this.simplifyTechnicalExplanation(technicalResult.technical),
      whyItMatters: this.explainBenefits(technicalResult.benefits),
      whatYouCanExpect: this.describeUserExperience(technicalResult.userImpact)
    };
  }

  simplifyTechnicalExplanation(technical) {
    // Convert technical jargon to plain English
    const simplifications = {
      'API': 'connection between different parts of your app',
      'database': 'where your app stores information',
      'responsive design': 'looks good on phones and computers',
      'optimization': 'making your app faster and better',
      'deployment': 'putting your app online for others to use',
      'authentication': 'user login system',
      'middleware': 'helper functions that make your app work smoothly'
    };
    
    let simplified = technical;
    for (const [tech, simple] of Object.entries(simplifications)) {
      simplified = simplified.replace(new RegExp(tech, 'gi'), simple);
    }
    
    return simplified;
  }

  explainBenefits(benefits) {
    return benefits.map(benefit => {
      return `• ${benefit.description} - This means ${benefit.userValue}`;
    });
  }

  describeUserExperience(userImpact) {
    return userImpact.map(impact => {
      return `• ${impact.change} - ${impact.benefit}`;
    });
  }

  // Token optimization helpers
  async optimizeResponse(response, targetReduction = 0.3) {
    const { ContextCompressionEngine } = require('../core/context-compression-engine');
    const compressor = new ContextCompressionEngine();
    
    return await compressor.compressContent(response, {
      targetReduction,
      preserveClarity: true,
      maintainUserFriendliness: true
    });
  }

  // Pattern matching for reusable solutions
  async findApplicablePatterns(command, context) {
    const { PatternMatcher } = require('../core/pattern-matcher');
    const matcher = new PatternMatcher();
    
    return await matcher.findPatternsForAgent(this.agentId, command, context);
  }

  // Error handling with user-friendly messages
  handleError(error, command, context) {
    const userFriendlyMessage = this.translateErrorForUser(error);
    
    return {
      success: false,
      error: {
        technical: error.message,
        userFriendly: userFriendlyMessage,
        suggestions: this.generateErrorSuggestions(error, command)
      },
      recovery: {
        canAutoFix: this.canAutoFixError(error),
        alternativeApproaches: this.suggestAlternatives(command, context),
        nextSteps: this.suggestNextSteps(error, command)
      }
    };
  }

  translateErrorForUser(error) {
    const errorTranslations = {
      'NetworkError': 'There was a problem connecting to the internet. Please check your connection and try again.',
      'ValidationError': 'Some information was missing or incorrect. Let me help you fix that.',
      'TimeoutError': 'The request took too long to complete. Let\'s try a simpler approach.',
      'AuthenticationError': 'There was a problem with permissions. Let me handle this automatically.',
      'NotFoundError': 'I couldn\'t find what we were looking for. Let me try a different approach.'
    };
    
    const errorType = error.constructor.name;
    return errorTranslations[errorType] || "Something unexpected happened, but don't worry - I'll fix it for you.";
  }

  generateErrorSuggestions(error, command) {
    // Generate user-friendly suggestions based on error type
    return [
      "Let me try a different approach that's more likely to work",
      "I can break this down into smaller, simpler steps",
      "We can use a proven template that usually works well"
    ];
  }

  canAutoFixError(error) {
    const autoFixableErrors = ['ValidationError', 'ConfigurationError', 'MissingDependencyError'];
    return autoFixableErrors.includes(error.constructor.name);
  }

  suggestAlternatives(command, context) {
    return [
      "Try a simpler version first, then add complexity later",
      "Use a proven template as a starting point",
      "Break the task into smaller pieces"
    ];
  }

  suggestNextSteps(error, command) {
    return [
      "I'll automatically fix this and continue",
      "Let's try the '/fix-whatever-is-broken' command",
      "We can start over with a simpler approach using '/start-over-simpler'"
    ];
  }

  // Progress tracking helpers
  createProgressTracker(totalSteps, taskDescription) {
    return {
      current: 0,
      total: totalSteps,
      description: taskDescription,
      update: (step, message) => {
        this.current = step;
        return {
          percentage: Math.round((step / totalSteps) * 100),
          message,
          remaining: totalSteps - step
        };
      }
    };
  }

  // User preference learning
  async learnFromUserFeedback(feedback, command, result) {
    if (!feedback) return;
    
    const learningData = {
      agentId: this.agentId,
      command: command.type,
      result: result.success,
      userSatisfaction: feedback.satisfaction,
      preferences: feedback.preferences,
      improvements: feedback.suggestions,
      timestamp: new Date()
    };
    
    // Store learning data for future optimization
    await this.storeLearningData(learningData);
  }

  async storeLearningData(data) {
    // In a real implementation, this would store to a database
    // For now, we'll just log it for debugging
    console.log(`Learning data for ${this.agentId}:`, data);
  }

  // Health check for agent status
  async healthCheck() {
    try {
      // Default health check - can be overridden by subclasses
      return {
        status: 'healthy',
        agentId: this.agentId,
        capabilities: Object.keys(this.capabilities),
        tools: Object.keys(this.tools),
        performance: this.getPerformanceMetrics(),
        lastActivity: new Date()
      };
    } catch (error) {
      return {
        status: 'error',
        agentId: this.agentId,
        error: error.message,
        issues: ['Health check failed']
      };
    }
  }

  // Capability assessment
  getCapabilityScore(taskType) {
    const capabilities = this.capabilities.canHandle || [];
    const matches = capabilities.filter(capability => 
      taskType.toLowerCase().includes(capability.toLowerCase()) ||
      capability.toLowerCase().includes(taskType.toLowerCase())
    );
    
    return matches.length / capabilities.length;
  }

  // Context optimization for token efficiency
  async optimizeContextForTask(context, taskType) {
    const filter = this.getContextFilter();
    const optimized = { ...context };
    
    // Apply agent-specific context filtering
    if (filter.includeOnly) {
      const relevantKeys = Object.keys(optimized).filter(key => 
        filter.includeOnly.some(include => key.toLowerCase().includes(include.toLowerCase()))
      );
      
      for (const key of Object.keys(optimized)) {
        if (!relevantKeys.includes(key)) {
          delete optimized[key];
        }
      }
    }
    
    return optimized;
  }
}

module.exports = { BaseAgent };