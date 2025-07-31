/**
 * Agent Pool - Manages all specialist agents and their capabilities
 * Implements the agent specialist system from the routing specification
 */

const { FrontendSpecialist } = require('../agents/frontend-specialist');
const { BackendSpecialist } = require('../agents/backend-specialist');
const { DatabaseSpecialist } = require('../agents/database-specialist');
const { DeploymentSpecialist } = require('../agents/deployment-specialist');
const { TestingSpecialist } = require('../agents/testing-specialist');
const { ProjectManager } = require('../agents/project-manager');
const { TokenOptimizer } = require('../agents/token-optimizer');

class AgentPool {
  constructor() {
    this.agents = new Map();
    this.performanceMetrics = new Map();
    this.loadBalancer = new AgentLoadBalancer();
    
    this.initializeAgents();
  }

  initializeAgents() {
    // Core specialist agents
    this.agents.set('frontend-specialist', new FrontendSpecialist());
    this.agents.set('backend-specialist', new BackendSpecialist());
    this.agents.set('database-specialist', new DatabaseSpecialist());
    this.agents.set('deployment-specialist', new DeploymentSpecialist());
    this.agents.set('testing-specialist', new TestingSpecialist());
    this.agents.set('project-manager', new ProjectManager());
    this.agents.set('token-optimizer', new TokenOptimizer());
    
    // Initialize performance tracking for each agent
    for (const [agentId, agent] of this.agents) {
      this.performanceMetrics.set(agentId, {
        totalExecutions: 0,
        successfulExecutions: 0,
        averageTokenUsage: 0,
        averageExecutionTime: 0,
        userSatisfactionScore: 0.5,
        specialtyAccuracy: 0.5,
        lastUpdated: new Date()
      });
    }
  }

  getAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }
    return agent;
  }

  async executeWithAgent(agentId, command, context, callbacks = {}) {
    const agent = this.getAgent(agentId);
    const startTime = Date.now();
    
    try {
      // Pre-execution setup
      const optimizedContext = await this.prepareAgentContext(agentId, context);
      
      // Execute command with agent
      const result = await agent.execute(command, optimizedContext, {
        ...callbacks,
        onTokenUsage: (usage) => {
          this.recordTokenUsage(agentId, usage);
          callbacks.onTokenUsage?.(usage);
        }
      });
      
      // Record successful execution
      const executionTime = Date.now() - startTime;
      await this.recordSuccessfulExecution(agentId, executionTime, result);
      
      return result;
      
    } catch (error) {
      // Record failed execution
      const executionTime = Date.now() - startTime;
      await this.recordFailedExecution(agentId, executionTime, error);
      throw error;
    }
  }

  async prepareAgentContext(agentId, baseContext) {
    const agent = this.getAgent(agentId);
    
    // Get agent-specific context optimization
    const contextFilter = agent.getContextFilter();
    const optimizedContext = await this.filterContextForAgent(baseContext, contextFilter);
    
    // Add agent-specific tools and capabilities
    optimizedContext.agentCapabilities = agent.getCapabilities();
    optimizedContext.agentTools = agent.getTools();
    
    return optimizedContext;
  }

  async filterContextForAgent(context, filter) {
    const filtered = { ...context };
    
    // Include only relevant context sections
    if (filter.includeOnly) {
      const relevantKeys = Object.keys(filtered).filter(key => 
        filter.includeOnly.includes(key)
      );
      
      for (const key of Object.keys(filtered)) {
        if (!relevantKeys.includes(key)) {
          delete filtered[key];
        }
      }
    }
    
    // Exclude irrelevant context sections
    if (filter.exclude) {
      for (const excludeKey of filter.exclude) {
        delete filtered[excludeKey];
      }
    }
    
    // Compress verbose sections for token efficiency
    if (filter.compress) {
      for (const compressKey of filter.compress) {
        if (filtered[compressKey] && typeof filtered[compressKey] === 'string') {
          filtered[compressKey] = await this.compressContextSection(
            filtered[compressKey],
            filter.compressionLevel || 0.5
          );
        }
      }
    }
    
    return filtered;
  }

  async compressContextSection(content, compressionLevel) {
    const { ContextCompressionEngine } = require('./context-compression-engine');
    const compressor = new ContextCompressionEngine();
    
    const result = await compressor.compressContent(content, {
      targetReduction: compressionLevel,
      preserveEssentials: true
    });
    
    return result.compressed;
  }

  recordTokenUsage(agentId, usage) {
    const metrics = this.performanceMetrics.get(agentId);
    if (metrics) {
      // Update running average of token usage
      const totalExecutions = metrics.totalExecutions || 1;
      metrics.averageTokenUsage = (
        (metrics.averageTokenUsage * totalExecutions) + usage.total
      ) / (totalExecutions + 1);
    }
  }

  async recordSuccessfulExecution(agentId, executionTime, result) {
    const metrics = this.performanceMetrics.get(agentId);
    if (!metrics) return;
    
    metrics.totalExecutions++;
    metrics.successfulExecutions++;
    
    // Update execution time average
    metrics.averageExecutionTime = (
      (metrics.averageExecutionTime * (metrics.totalExecutions - 1)) + executionTime
    ) / metrics.totalExecutions;
    
    // Update user satisfaction if provided
    if (result.userSatisfaction) {
      metrics.userSatisfactionScore = (
        (metrics.userSatisfactionScore * (metrics.successfulExecutions - 1)) + result.userSatisfaction
      ) / metrics.successfulExecutions;
    }
    
    metrics.lastUpdated = new Date();
  }

  async recordFailedExecution(agentId, executionTime, error) {
    const metrics = this.performanceMetrics.get(agentId);
    if (!metrics) return;
    
    metrics.totalExecutions++;
    
    // Update execution time average (including failed attempts)
    metrics.averageExecutionTime = (
      (metrics.averageExecutionTime * (metrics.totalExecutions - 1)) + executionTime
    ) / metrics.totalExecutions;
    
    // Record error type for analysis
    if (!metrics.errorTypes) {
      metrics.errorTypes = new Map();
    }
    
    const errorType = error.constructor.name;
    metrics.errorTypes.set(errorType, (metrics.errorTypes.get(errorType) || 0) + 1);
    
    metrics.lastUpdated = new Date();
  }

  async getAgentPerformance(agentId) {
    const metrics = this.performanceMetrics.get(agentId);
    if (!metrics) {
      return {
        successRate: 0.5,
        averageTokenUsage: 1000,
        averageExecutionTime: 30000,
        userSatisfactionScore: 0.5,
        available: false
      };
    }
    
    return {
      successRate: metrics.totalExecutions > 0 
        ? metrics.successfulExecutions / metrics.totalExecutions 
        : 0.5,
      averageTokenUsage: metrics.averageTokenUsage,
      averageExecutionTime: metrics.averageExecutionTime,
      userSatisfactionScore: metrics.userSatisfactionScore,
      totalExecutions: metrics.totalExecutions,
      available: true,
      lastUpdated: metrics.lastUpdated
    };
  }

  async updatePerformanceMetrics(result, sessionContext) {
    if (!result.agentId) return;
    
    const metrics = this.performanceMetrics.get(result.agentId);
    if (!metrics) return;
    
    // Update specialty accuracy based on user feedback
    if (result.userFeedback) {
      const feedback = result.userFeedback;
      if (feedback.correctSpecialist !== undefined) {
        const currentAccuracy = metrics.specialtyAccuracy;
        const newDataPoint = feedback.correctSpecialist ? 1 : 0;
        
        // Update running average
        const totalFeedback = metrics.totalFeedback || 0;
        metrics.specialtyAccuracy = (
          (currentAccuracy * totalFeedback) + newDataPoint
        ) / (totalFeedback + 1);
        
        metrics.totalFeedback = totalFeedback + 1;
      }
      
      // Update satisfaction score
      if (feedback.satisfaction !== undefined) {
        const currentSatisfaction = metrics.userSatisfactionScore;
        const totalSatisfactionData = metrics.totalSatisfactionData || 0;
        
        metrics.userSatisfactionScore = (
          (currentSatisfaction * totalSatisfactionData) + feedback.satisfaction
        ) / (totalSatisfactionData + 1);
        
        metrics.totalSatisfactionData = totalSatisfactionData + 1;
      }
    }
  }

  // Get the best agent for a specific task type
  async getBestAgentForTask(taskType, context = {}) {
    const candidates = this.getAgentCandidatesForTask(taskType);
    
    const scoredCandidates = await Promise.all(
      candidates.map(async agentId => {
        const performance = await this.getAgentPerformance(agentId);
        const agent = this.getAgent(agentId);
        const taskFit = await agent.assessTaskFit(taskType, context);
        
        return {
          agentId,
          performance,
          taskFit,
          compositeScore: this.calculateAgentScore(performance, taskFit)
        };
      })
    );
    
    return scoredCandidates.sort((a, b) => b.compositeScore - a.compositeScore)[0];
  }

  getAgentCandidatesForTask(taskType) {
    const taskAgentMap = {
      'ui-design': ['frontend-specialist', 'project-manager'],
      'api-development': ['backend-specialist', 'project-manager'],
      'database-design': ['database-specialist', 'backend-specialist'],
      'deployment': ['deployment-specialist', 'project-manager'],
      'testing': ['testing-specialist', 'project-manager'],
      'planning': ['project-manager'],
      'optimization': ['token-optimizer', 'project-manager'],
      'error-fixing': ['testing-specialist', 'backend-specialist', 'frontend-specialist']
    };
    
    return taskAgentMap[taskType] || ['project-manager'];
  }

  calculateAgentScore(performance, taskFit) {
    return (
      performance.successRate * 0.3 +
      (1 - performance.averageTokenUsage / 2000) * 0.2 + // Lower token usage is better
      performance.userSatisfactionScore * 0.2 +
      taskFit.confidence * 0.3
    );
  }

  // Load balancing for high-demand scenarios
  async getAvailableAgent(agentId) {
    return await this.loadBalancer.getAvailableAgent(agentId, this.agents);
  }

  // Agent health monitoring
  async performHealthCheck() {
    const healthReport = new Map();
    
    for (const [agentId, agent] of this.agents) {
      try {
        const health = await agent.healthCheck();
        const performance = await this.getAgentPerformance(agentId);
        
        healthReport.set(agentId, {
          status: health.status,
          lastActivity: performance.lastUpdated,
          successRate: performance.successRate,
          averageResponseTime: performance.averageExecutionTime,
          issues: health.issues || []
        });
      } catch (error) {
        healthReport.set(agentId, {
          status: 'error',
          error: error.message,
          lastActivity: null
        });
      }
    }
    
    return healthReport;
  }
}

/**
 * Agent Load Balancer - Handles agent availability and load distribution
 */
class AgentLoadBalancer {
  constructor() {
    this.agentLoad = new Map();
    this.maxConcurrentExecutions = 5; // Per agent
  }

  async getAvailableAgent(agentId, agentPool) {
    const currentLoad = this.agentLoad.get(agentId) || 0;
    
    if (currentLoad < this.maxConcurrentExecutions) {
      this.agentLoad.set(agentId, currentLoad + 1);
      return agentPool.get(agentId);
    }
    
    // Agent at capacity, try fallback or queue
    return await this.handleAgentCapacity(agentId, agentPool);
  }

  async handleAgentCapacity(agentId, agentPool) {
    // For now, just wait a bit and retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentLoad = this.agentLoad.get(agentId) || 0;
    if (currentLoad < this.maxConcurrentExecutions) {
      this.agentLoad.set(agentId, currentLoad + 1);
      return agentPool.get(agentId);
    }
    
    // Still at capacity, return the agent anyway (simple implementation)
    return agentPool.get(agentId);
  }

  releaseAgent(agentId) {
    const currentLoad = this.agentLoad.get(agentId) || 0;
    this.agentLoad.set(agentId, Math.max(0, currentLoad - 1));
  }
}

module.exports = { AgentPool, AgentLoadBalancer };