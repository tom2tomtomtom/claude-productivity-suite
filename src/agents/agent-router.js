/**
 * Agent Router - Intelligent routing to specialist agents
 * Routes tasks to the most appropriate specialist agent
 */

const { SimpleFrontendSpecialist } = require('./simple-frontend-specialist');
const { SimpleBackendSpecialist } = require('./simple-backend-specialist');
const { SimpleDatabaseSpecialist } = require('./simple-database-specialist');
const { SimpleDeploymentSpecialist } = require('./simple-deployment-specialist');
const { SimpleTestingSpecialist } = require('./simple-testing-specialist');

class AgentRouter {
  constructor() {
    this.specialists = new Map();
    this.routingHistory = [];
    this.initializeSpecialists();
  }

  /**
   * Initialize all specialist agents
   */
  initializeSpecialists() {
    this.specialists.set('frontend', new SimpleFrontendSpecialist());
    this.specialists.set('backend', new SimpleBackendSpecialist());
    this.specialists.set('database', new SimpleDatabaseSpecialist());
    this.specialists.set('deployment', new SimpleDeploymentSpecialist());
    this.specialists.set('testing', new SimpleTestingSpecialist());
    
    console.log(`🎯 Agent Router initialized with ${this.specialists.size} specialists`);
  }

  /**
   * Route command to most appropriate specialist
   * @param {Object} command - Command to route
   * @param {Object} context - Execution context
   * @param {Object} callbacks - Progress callbacks
   * @returns {Object} Routing and execution result
   */
  async routeCommand(command, context, callbacks = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`🎯 Routing command: ${command.type || 'unknown'}`);
      
      // Step 1: Analyze command for routing
      const routingAnalysis = await this.analyzeCommandForRouting(command, context);
      
      // Step 2: Select best specialist
      const selectedSpecialist = await this.selectSpecialist(routingAnalysis, context);
      
      // Step 3: Execute with selected specialist
      if (callbacks.onProgress) {
        callbacks.onProgress(1, `Routing to ${selectedSpecialist.type}`, { tokenUsage: 5 });
      }
      
      const executionResult = await selectedSpecialist.agent.execute(command, context, callbacks);
      
      // Step 4: Record routing decision
      this.recordRoutingDecision(command, routingAnalysis, selectedSpecialist, executionResult);
      
      return {
        success: executionResult.success,
        agent: selectedSpecialist.type,
        confidence: selectedSpecialist.confidence,
        message: executionResult.message,
        routingTime: Date.now() - startTime,
        executionTime: executionResult.executionTime,
        data: executionResult.data,
        routing: {
          analysis: routingAnalysis,
          selectedAgent: selectedSpecialist.type,
          confidence: selectedSpecialist.confidence,
          reasoning: selectedSpecialist.reasoning,
          alternatives: selectedSpecialist.alternatives
        }
      };

    } catch (error) {
      console.error('Agent routing error:', error);
      return this.handleRoutingError(error, command, context);
    }
  }

  /**
   * Analyze command to determine routing requirements
   * @param {Object} command - Command to analyze
   * @param {Object} context - Execution context
   * @returns {Object} Routing analysis
   */
  async analyzeCommandForRouting(command, context) {
    const description = (command.description || command.arguments || '').toLowerCase();
    
    const analysis = {
      taskTypes: this.extractTaskTypes(description),
      technologies: this.extractTechnologies(description),
      complexity: this.assessComplexity(description),
      domainAreas: this.identifyDomainAreas(description),
      urgency: this.assessUrgency(description),
      multiSpecialistNeeded: false
    };

    // Check if multiple specialists might be needed
    if (analysis.taskTypes.length > 2 || analysis.domainAreas.length > 2) {
      analysis.multiSpecialistNeeded = true;
    }

    console.log(`📊 Routing analysis:`, {
      taskTypes: analysis.taskTypes,
      domainAreas: analysis.domainAreas,
      complexity: analysis.complexity,
      multiSpecialist: analysis.multiSpecialistNeeded
    });

    return analysis;
  }

  /**
   * Select the best specialist for the task
   * @param {Object} analysis - Routing analysis
   * @param {Object} context - Execution context
   * @returns {Object} Selected specialist with confidence score
   */
  async selectSpecialist(analysis, context) {
    const candidateScores = new Map();
    
    // Score each specialist for this task
    for (const [specialistType, specialist] of this.specialists) {
      const score = await this.scoreSpecialistFit(specialist, analysis, context);
      candidateScores.set(specialistType, {
        agent: specialist,
        type: specialistType,
        score: score.confidence,
        reasoning: score.reasoning,
        efficiency: score.estimatedEfficiency
      });
    }

    // Sort by score and select the best
    const sortedCandidates = Array.from(candidateScores.entries())
      .sort(([,a], [,b]) => b.score - a.score);

    const selected = sortedCandidates[0][1];
    const alternatives = sortedCandidates.slice(1, 3).map(([type, candidate]) => ({
      type,
      score: candidate.score,
      reasoning: candidate.reasoning
    }));

    console.log(`🎯 Selected: ${selected.type} (confidence: ${(selected.score * 100).toFixed(1)}%)`);
    
    return {
      ...selected,
      confidence: selected.score,
      alternatives
    };
  }

  /**
   * Score how well a specialist fits the task
   * @param {Object} specialist - Specialist agent
   * @param {Object} analysis - Routing analysis
   * @param {Object} context - Execution context
   * @returns {Object} Fit score and reasoning
   */
  async scoreSpecialistFit(specialist, analysis, context) {
    let totalScore = 0;
    let scoreCount = 0;
    const reasons = [];

    // Score based on task types
    for (const taskType of analysis.taskTypes) {
      const taskFit = await specialist.assessTaskFit(taskType, context);
      totalScore += taskFit.confidence;
      scoreCount++;
      
      if (taskFit.confidence > 0.7) {
        reasons.push(`Strong fit for ${taskType}`);
      }
    }

    // Score based on domain areas
    for (const domain of analysis.domainAreas) {
      const domainScore = this.scoreDomainFit(specialist, domain);
      totalScore += domainScore;
      scoreCount++;
    }

    // Adjust for complexity
    const complexityAdjustment = this.getComplexityAdjustment(specialist, analysis.complexity);
    totalScore *= complexityAdjustment;

    const finalScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    
    return {
      confidence: Math.min(finalScore, 1.0),
      reasoning: reasons.join(', ') || `${specialist.type} evaluation`,
      estimatedEfficiency: finalScore * 0.9
    };
  }

  /**
   * Extract task types from command description
   * @param {string} description - Command description
   * @returns {Array} Identified task types
   */
  extractTaskTypes(description) {
    const taskPatterns = {
      'ui-design': ['ui', 'design', 'interface', 'visual', 'frontend', 'component'],
      'api-development': ['api', 'endpoint', 'backend', 'server', 'rest', 'graphql'],
      'database-design': ['database', 'data', 'model', 'schema', 'storage', 'query'],
      'deployment': ['deploy', 'host', 'publish', 'production', 'launch', 'live'],
      'testing': ['test', 'qa', 'bug', 'quality', 'validate', 'check'],
      'authentication': ['auth', 'login', 'user', 'security', 'permission'],
      'performance': ['performance', 'speed', 'optimize', 'fast', 'slow'],
      'styling': ['style', 'css', 'theme', 'responsive', 'mobile']
    };

    const identified = [];
    for (const [taskType, keywords] of Object.entries(taskPatterns)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        identified.push(taskType);
      }
    }

    return identified.length > 0 ? identified : ['general-development'];
  }

  /**
   * Extract technologies from command description
   * @param {string} description - Command description
   * @returns {Array} Identified technologies
   */
  extractTechnologies(description) {
    const techPatterns = {
      'react': ['react', 'jsx', 'component'],
      'nodejs': ['node', 'express', 'npm'],
      'database': ['sql', 'mongodb', 'database', 'db'],
      'testing': ['jest', 'cypress', 'playwright', 'test'],
      'deployment': ['vercel', 'netlify', 'heroku', 'docker']
    };

    const identified = [];
    for (const [tech, keywords] of Object.entries(techPatterns)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        identified.push(tech);
      }
    }

    return identified;
  }

  /**
   * Assess task complexity
   * @param {string} description - Command description
   * @returns {string} Complexity level
   */
  assessComplexity(description) {
    const complexityIndicators = {
      high: ['enterprise', 'scale', 'complex', 'advanced', 'multiple', 'integration'],
      medium: ['some', 'moderate', 'intermediate', 'several'],
      low: ['simple', 'basic', 'quick', 'easy', 'small']
    };

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => description.includes(indicator))) {
        return level;
      }
    }

    return 'medium'; // Default
  }

  /**
   * Identify domain areas
   * @param {string} description - Command description
   * @returns {Array} Domain areas
   */
  identifyDomainAreas(description) {
    const domainPatterns = {
      'frontend': ['ui', 'frontend', 'client', 'browser', 'component', 'design'],
      'backend': ['backend', 'server', 'api', 'service', 'logic'],
      'database': ['database', 'data', 'storage', 'query', 'model'],
      'devops': ['deploy', 'host', 'production', 'infrastructure', 'ci/cd'],
      'testing': ['test', 'qa', 'quality', 'bug', 'validate']
    };

    const identified = [];
    for (const [domain, keywords] of Object.entries(domainPatterns)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        identified.push(domain);
      }
    }

    return identified;
  }

  /**
   * Score domain fit for specialist
   * @param {Object} specialist - Specialist agent
   * @param {string} domain - Domain area
   * @returns {number} Domain fit score
   */
  scoreDomainFit(specialist, domain) {
    const specialistDomainMap = {
      'frontend-specialist': { frontend: 0.95, testing: 0.3, backend: 0.1 },
      'backend-specialist': { backend: 0.95, database: 0.7, frontend: 0.2 },
      'database-specialist': { database: 0.95, backend: 0.6, frontend: 0.1 },
      'deployment-specialist': { devops: 0.95, backend: 0.4, testing: 0.3 },
      'testing-specialist': { testing: 0.95, frontend: 0.6, backend: 0.5 }
    };

    const domainScores = specialistDomainMap[specialist.type] || {};
    return domainScores[domain] || 0.2; // Default low score
  }

  /**
   * Get complexity adjustment multiplier
   * @param {Object} specialist - Specialist agent
   * @param {string} complexity - Complexity level
   * @returns {number} Adjustment multiplier
   */
  getComplexityAdjustment(specialist, complexity) {
    // Some specialists handle complexity better than others
    const complexityMultipliers = {
      high: { 'backend-specialist': 1.1, 'database-specialist': 1.1, 'frontend-specialist': 0.9 },
      medium: { 'frontend-specialist': 1.1, 'testing-specialist': 1.1 },
      low: { 'frontend-specialist': 1.2, 'deployment-specialist': 1.1 }
    };

    return complexityMultipliers[complexity]?.[specialist.type] || 1.0;
  }

  /**
   * Assess task urgency
   * @param {string} description - Command description
   * @returns {string} Urgency level
   */
  assessUrgency(description) {
    const urgencyIndicators = {
      high: ['urgent', 'asap', 'immediately', 'critical', 'emergency'],
      medium: ['soon', 'important', 'priority'],
      low: ['when possible', 'eventually', 'future']
    };

    for (const [level, indicators] of Object.entries(urgencyIndicators)) {
      if (indicators.some(indicator => description.includes(indicator))) {
        return level;
      }
    }

    return 'medium'; // Default
  }

  /**
   * Record routing decision for learning
   * @param {Object} command - Original command
   * @param {Object} analysis - Routing analysis
   * @param {Object} selectedSpecialist - Selected specialist
   * @param {Object} executionResult - Execution result
   */
  recordRoutingDecision(command, analysis, selectedSpecialist, executionResult) {
    const record = {
      timestamp: new Date(),
      command: {
        type: command.type,
        description: command.description || command.arguments
      },
      analysis,
      routing: {
        selectedAgent: selectedSpecialist.type,
        confidence: selectedSpecialist.confidence,
        reasoning: selectedSpecialist.reasoning
      },
      outcome: {
        success: executionResult.success,
        executionTime: executionResult.executionTime,
        tokenSavings: executionResult.data?.estimatedTokenSavings || 0
      }
    };

    this.routingHistory.push(record);
    
    // Keep only last 100 decisions
    if (this.routingHistory.length > 100) {
      this.routingHistory = this.routingHistory.slice(-100);
    }
  }

  /**
   * Handle routing errors gracefully
   * @param {Error} error - Routing error
   * @param {Object} command - Original command
   * @param {Object} context - Execution context
   * @returns {Object} Error response
   */
  async handleRoutingError(error, command, context) {
    console.error('Routing error:', error.message);

    // Fallback to frontend specialist for unknown commands
    const fallbackSpecialist = this.specialists.get('frontend');
    
    try {
      const fallbackResult = await fallbackSpecialist.execute(command, context);
      return {
        success: fallbackResult.success,
        agent: 'frontend-specialist',
        confidence: 0.5,
        message: `Routing failed, used fallback: ${fallbackResult.message}`,
        routingTime: 0,
        executionTime: fallbackResult.executionTime,
        data: fallbackResult.data,
        error: {
          type: 'routing_error',
          message: error.message,
          fallbackUsed: true
        }
      };
    } catch (fallbackError) {
      return {
        success: false,
        agent: 'router',
        confidence: 0,
        message: 'Both routing and fallback failed',
        error: {
          type: 'complete_routing_failure',
          originalError: error.message,
          fallbackError: fallbackError.message
        }
      };
    }
  }

  /**
   * Get routing statistics
   * @returns {Object} Routing statistics
   */
  getRoutingStats() {
    if (this.routingHistory.length === 0) {
      return { totalRoutes: 0, successRate: 0, averageConfidence: 0 };
    }

    const successful = this.routingHistory.filter(r => r.outcome.success);
    const totalConfidence = this.routingHistory.reduce((sum, r) => sum + r.routing.confidence, 0);
    
    return {
      totalRoutes: this.routingHistory.length,
      successRate: (successful.length / this.routingHistory.length) * 100,
      averageConfidence: (totalConfidence / this.routingHistory.length) * 100,
      agentUsage: this.getAgentUsageStats()
    };
  }

  /**
   * Get agent usage statistics
   * @returns {Object} Agent usage breakdown
   */
  getAgentUsageStats() {
    const usage = {};
    this.routingHistory.forEach(record => {
      const agent = record.routing.selectedAgent;
      usage[agent] = (usage[agent] || 0) + 1;
    });
    return usage;
  }

  /**
   * Get available specialists
   * @returns {Array} List of available specialists
   */
  getAvailableSpecialists() {
    return Array.from(this.specialists.keys());
  }

  /**
   * Get specialist by type
   * @param {string} type - Specialist type
   * @returns {Object} Specialist agent
   */
  getSpecialist(type) {
    return this.specialists.get(type);
  }

  /**
   * Perform health check on all specialists
   * @returns {Object} Health check results
   */
  async performHealthCheck() {
    const results = {};
    
    for (const [type, specialist] of this.specialists) {
      try {
        results[type] = await specialist.healthCheck();
      } catch (error) {
        results[type] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    return {
      router: { status: 'healthy', specialists: Object.keys(results).length },
      specialists: results
    };
  }
}

module.exports = { AgentRouter };