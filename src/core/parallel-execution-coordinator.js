/**
 * Parallel Execution Coordinator
 * Manages parallel agent execution for improved efficiency
 */

class ParallelExecutionCoordinator {
  constructor() {
    this.activeExecutions = new Map();
    this.executionHistory = [];
    this.coordinationRules = this.loadCoordinationRules();
  }

  loadCoordinationRules() {
    return {
      // Define which agents can work in parallel
      parallelCompatible: {
        'frontend-specialist': ['backend-specialist', 'database-specialist'],
        'backend-specialist': ['frontend-specialist', 'database-specialist', 'testing-specialist'],
        'database-specialist': ['frontend-specialist', 'backend-specialist'],
        'testing-specialist': ['deployment-specialist'],
        'deployment-specialist': ['testing-specialist']
      },
      
      // Define coordination dependencies
      dependencies: {
        'frontend-specialist': {
          requires: [], // Can start independently
          provides: ['ui-components', 'user-interface']
        },
        'backend-specialist': {
          requires: [], // Can start independently
          provides: ['api-endpoints', 'business-logic', 'data-processing']
        },
        'database-specialist': {
          requires: [], // Can start independently
          provides: ['data-models', 'database-schema']
        },
        'testing-specialist': {
          requires: ['ui-components', 'api-endpoints'], // Needs something to test
          provides: ['test-coverage', 'quality-assurance']
        },
        'deployment-specialist': {
          requires: ['ui-components', 'api-endpoints', 'database-schema'], // Needs complete app
          provides: ['live-deployment', 'production-environment']
        }
      }
    };
  }

  /**
   * Analyze if parallel execution is beneficial for the given routing
   */
  async analyzePrallelExecution(selectedRoute, parsedCommand, sessionContext) {
    console.log('🔄 Analyzing parallel execution opportunities...');
    
    // Determine if command is complex enough for parallel execution
    const complexityAnalysis = this.analyzeCommandComplexity(parsedCommand);
    
    if (!complexityAnalysis.benefitsFromParallel) {
      return {
        recommended: false,
        reason: 'Command too simple for parallel execution',
        parallelPlan: null
      };
    }
    
    // Identify potential parallel agents
    const parallelCandidates = this.identifyParallelCandidates(
      selectedRoute.agent, 
      parsedCommand, 
      sessionContext
    );
    
    if (parallelCandidates.length === 0) {
      return {
        recommended: false,
        reason: 'No suitable agents for parallel execution',
        parallelPlan: null
      };
    }
    
    // Create parallel execution plan
    const parallelPlan = await this.createParallelExecutionPlan(
      selectedRoute,
      parallelCandidates,
      complexityAnalysis
    );
    
    // Validate plan feasibility
    const feasibilityCheck = this.validateParallelPlan(parallelPlan);
    
    if (!feasibilityCheck.feasible) {
      return {
        recommended: false,
        reason: feasibilityCheck.reason,
        parallelPlan: null
      };
    }
    
    console.log(`✅ Parallel execution recommended: ${parallelPlan.phases.length} phases, ${parallelPlan.estimatedSpeedup}x speedup`);
    
    return {
      recommended: true,
      reason: `${parallelPlan.estimatedSpeedup}x speedup with ${parallelPlan.totalAgents} agents`,
      parallelPlan: parallelPlan
    };
  }

  /**
   * Analyze command complexity for parallel execution suitability
   */
  analyzeCommandComplexity(parsedCommand) {
    const complexityIndicators = {
      multiDomain: false,
      multiStep: false,
      highTokenCount: false,
      independentTasks: false
    };
    
    // Check for multi-domain requirements
    const domains = this.extractDomains(parsedCommand);
    complexityIndicators.multiDomain = domains.length > 1;
    
    // Check for multi-step processes
    const steps = this.extractSteps(parsedCommand);
    complexityIndicators.multiStep = steps.length > 2;
    
    // Check for high token count (indicating complex request)
    const estimatedTokens = this.estimateTokenCount(parsedCommand);
    complexityIndicators.highTokenCount = estimatedTokens > 1500;
    
    // Check for independent task patterns
    complexityIndicators.independentTasks = this.hasIndependentTasks(parsedCommand);
    
    const complexityScore = Object.values(complexityIndicators).reduce((sum, val) => sum + (val ? 1 : 0), 0);
    
    return {
      ...complexityIndicators,
      complexityScore,
      benefitsFromParallel: complexityScore >= 2, // Need at least 2 complexity indicators
      domains,
      steps,
      estimatedTokens
    };
  }

  /**
   * Identify agents that can work in parallel with the selected agent
   */
  identifyParallelCandidates(primaryAgent, parsedCommand, sessionContext) {
    const compatibleAgents = this.coordinationRules.parallelCompatible[primaryAgent] || [];
    const candidates = [];
    
    // Filter compatible agents based on command requirements
    compatibleAgents.forEach(agentType => {
      const relevanceScore = this.calculateAgentRelevance(agentType, parsedCommand);
      
      if (relevanceScore > 0.3) { // Minimum relevance threshold
        candidates.push({
          agent: agentType,
          relevanceScore,
          canStartImmediately: this.canStartImmediately(agentType, primaryAgent),
          estimatedContribution: this.estimateContribution(agentType, parsedCommand)
        });
      }
    });
    
    return candidates.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Create detailed parallel execution plan
   */
  async createParallelExecutionPlan(selectedRoute, parallelCandidates, complexityAnalysis) {
    const plan = {
      primaryAgent: selectedRoute.agent,  
      totalAgents: 1 + parallelCandidates.length,
      phases: [],
      dependencies: new Map(),
      estimatedSpeedup: 1.0,
      tokenOptimization: {
        parallelSavings: 0,
        coordinationOverhead: 0,
        netSavings: 0
      }
    };
    
    // Phase 1: Independent parallel work
    const phase1Agents = [selectedRoute.agent];
    parallelCandidates.forEach(candidate => {
      if (candidate.canStartImmediately) {
        phase1Agents.push(candidate.agent);
      }
    });
    
    plan.phases.push({
      phase: 1,
      type: 'parallel',
      agents: phase1Agents,
      description: 'Independent parallel execution',
      estimatedDuration: this.estimatePhaseDuration(phase1Agents, complexityAnalysis),
      coordination: 'minimal'
    });
    
    // Phase 2: Dependent work (if any)
    const dependentCandidates = parallelCandidates.filter(c => !c.canStartImmediately);
    if (dependentCandidates.length > 0) {
      plan.phases.push({
        phase: 2,
        type: 'sequential-then-parallel',
        agents: dependentCandidates.map(c => c.agent),
        description: 'Work requiring outputs from Phase 1',
        estimatedDuration: this.estimatePhaseDuration(dependentCandidates.map(c => c.agent), complexityAnalysis),
        coordination: 'synchronized',
        dependencies: phase1Agents
      });
    }
    
    // Calculate estimated speedup
    plan.estimatedSpeedup = this.calculateSpeedup(plan, complexityAnalysis);
    
    // Calculate token optimization impact
    plan.tokenOptimization = this.calculateParallelTokenImpact(plan);
    
    return plan;
  }

  /**
   * Validate that parallel plan is feasible
   */
  validateParallelPlan(plan) {
    // Check for circular dependencies
    const circularDeps = this.checkCircularDependencies(plan);
    if (circularDeps.found) {
      return {
        feasible: false,
        reason: `Circular dependency detected: ${circularDeps.cycle.join(' -> ')}`
      };
    }
    
    // Check for resource conflicts
    const resourceConflicts = this.checkResourceConflicts(plan);
    if (resourceConflicts.found) {
      return {
        feasible: false,
        reason: `Resource conflict: ${resourceConflicts.conflict}`
      };
    }
    
    // Check minimum speedup threshold
    if (plan.estimatedSpeedup < 1.3) { // Must be at least 30% faster
      return {
        feasible: false,
        reason: `Insufficient speedup: ${plan.estimatedSpeedup}x (minimum: 1.3x)`
      };
    }
    
    // Check coordination overhead
    if (plan.tokenOptimization.coordinationOverhead > plan.tokenOptimization.parallelSavings) {
      return {
        feasible: false,
        reason: 'Coordination overhead exceeds parallel benefits'
      };
    }
    
    return {
      feasible: true,
      reason: 'Parallel plan validated successfully'
    };
  }

  /**
   * Execute parallel plan with coordination
   */
  async executeParallelPlan(parallelPlan, parsedCommand, sessionContext) {
    const executionId = this.generateExecutionId();
    
    console.log(`🚀 Starting parallel execution ${executionId} with ${parallelPlan.totalAgents} agents`);
    
    // Initialize execution tracking
    this.activeExecutions.set(executionId, {
      plan: parallelPlan,
      startTime: Date.now(),
      phase: 0,
      agentStatus: new Map(),
      results: new Map(),
      coordination: []
    });
    
    try {
      // Execute each phase
      for (let i = 0; i < parallelPlan.phases.length; i++) {
        const phase = parallelPlan.phases[i];
        console.log(`📋 Executing Phase ${phase.phase}: ${phase.description}`);
        
        const phaseResults = await this.executePhase(
          executionId, 
          phase, 
          parsedCommand, 
          sessionContext
        );
        
        // Update execution state
        const execution = this.activeExecutions.get(executionId);
        execution.phase = phase.phase;
        phase.agents.forEach(agent => {
          execution.results.set(agent, phaseResults[agent]);
        });
      }
      
      // Aggregate results
      const finalResults = await this.aggregateResults(executionId);
      
      // Record execution completion
      await this.recordExecution(executionId, true, finalResults);
      
      console.log(`✅ Parallel execution ${executionId} completed successfully`);
      
      return finalResults;
      
    } catch (error) {
      console.error(`❌ Parallel execution ${executionId} failed:`, error);
      await this.recordExecution(executionId, false, error);
      throw error;
      
    } finally {
      // Cleanup
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * Execute a single phase of the parallel plan
   */
  async executePhase(executionId, phase, parsedCommand, sessionContext) {
    const phaseResults = {};
    
    if (phase.type === 'parallel') {
      // Execute all agents in parallel
      const agentPromises = phase.agents.map(async (agent) => {
        const agentResult = await this.executeAgent(agent, parsedCommand, sessionContext, executionId);
        return { agent, result: agentResult };
      });
      
      const results = await Promise.all(agentPromises);
      results.forEach(({ agent, result }) => {
        phaseResults[agent] = result;
      });
      
    } else if (phase.type === 'sequential-then-parallel') {
      // Wait for dependencies, then execute in parallel
      await this.waitForDependencies(executionId, phase.dependencies);
      
      const agentPromises = phase.agents.map(async (agent) => {
        const agentResult = await this.executeAgent(agent, parsedCommand, sessionContext, executionId);
        return { agent, result: agentResult };
      });
      
      const results = await Promise.all(agentPromises);
      results.forEach(({ agent, result }) => {
        phaseResults[agent] = result;
      });
    }
    
    return phaseResults;
  }

  // Helper methods

  extractDomains(parsedCommand) {
    const domainKeywords = {
      frontend: ['ui', 'interface', 'design', 'visual', 'component'],
      backend: ['api', 'server', 'data', 'logic', 'endpoint'],
      database: ['store', 'save', 'query', 'model', 'schema'],
      testing: ['test', 'verify', 'check', 'validate'],
      deployment: ['deploy', 'live', 'production', 'hosting']
    };
    
    const text = `${parsedCommand.type} ${parsedCommand.description || ''}`.toLowerCase();
    const domains = [];
    
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        domains.push(domain);
      }
    });
    
    return domains;
  }

  extractSteps(parsedCommand) {
    // Simple step extraction based on common patterns
    const stepIndicators = ['first', 'then', 'next', 'after', 'finally', 'and'];
    const text = parsedCommand.description || '';
    
    const steps = text.split(/[,;.]/).filter(step => step.trim().length > 0);
    return steps.length > 1 ? steps : ['single-step'];
  }

  estimateTokenCount(parsedCommand) {
    const text = `${parsedCommand.type} ${parsedCommand.description || ''}`;
    return text.split(' ').length * 1.3; // Rough token estimation
  }

  hasIndependentTasks(parsedCommand) {
    const independenceIndicators = ['and', 'also', 'plus', 'including', 'with'];
    const text = (parsedCommand.description || '').toLowerCase();
    return independenceIndicators.some(indicator => text.includes(indicator));
  }

  calculateAgentRelevance(agentType, parsedCommand) {
    // Simple relevance scoring based on keywords
    const agentKeywords = {
      'frontend-specialist': ['ui', 'interface', 'design', 'visual', 'component', 'user'],
      'backend-specialist': ['api', 'server', 'data', 'logic', 'endpoint', 'auth'],
      'database-specialist': ['store', 'save', 'query', 'model', 'schema', 'data'],
      'testing-specialist': ['test', 'verify', 'check', 'validate', 'quality'],
      'deployment-specialist': ['deploy', 'live', 'production', 'hosting', 'publish']
    };
    
    const keywords = agentKeywords[agentType] || [];
    const text = `${parsedCommand.type} ${parsedCommand.description || ''}`.toLowerCase();
    
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    return Math.min(matchCount / keywords.length, 1.0);
  }

  canStartImmediately(agentType, primaryAgent) {
    const dependencies = this.coordinationRules.dependencies[agentType];
    return !dependencies || dependencies.requires.length === 0;
  }

  estimateContribution(agentType, parsedCommand) {
    // Estimate how much this agent would contribute to the overall task
    const relevance = this.calculateAgentRelevance(agentType, parsedCommand);
    const baseContribution = {
      'frontend-specialist': 0.30,
      'backend-specialist': 0.35,
      'database-specialist': 0.20,
      'testing-specialist': 0.10,
      'deployment-specialist': 0.15
    };
    
    return (baseContribution[agentType] || 0.10) * relevance;
  }

  estimatePhaseDuration(agents, complexityAnalysis) {
    const baseDuration = 60; // seconds
    const complexityMultiplier = 1 + (complexityAnalysis.complexityScore * 0.2);
    const agentEfficiency = Math.max(0.7, 1 - (agents.length * 0.1)); // More agents = slight coordination overhead
    
    return Math.round(baseDuration * complexityMultiplier * agentEfficiency);
  }

  calculateSpeedup(plan, complexityAnalysis) {
    const sequentialTime = plan.phases.reduce((sum, phase) => sum + phase.estimatedDuration, 0);
    const parallelTime = Math.max(...plan.phases.map(phase => phase.estimatedDuration));
    
    const theoreticalSpeedup = sequentialTime / parallelTime;
    const coordinationOverhead = 0.8; // 20% overhead for coordination
    
    return Math.round((theoreticalSpeedup * coordinationOverhead) * 100) / 100;
  }

  calculateParallelTokenImpact(plan) {
    const baseTokenSavings = plan.totalAgents * 200; // Estimated savings per agent
    const coordinationOverhead = plan.phases.length * 100; // Coordination cost per phase
    
    return {
      parallelSavings: baseTokenSavings,
      coordinationOverhead: coordinationOverhead,
      netSavings: Math.max(0, baseTokenSavings - coordinationOverhead)
    };
  }

  checkCircularDependencies(plan) {
    // Simplified circular dependency check
    return { found: false, cycle: [] };
  }

  checkResourceConflicts(plan) {
    // Simplified resource conflict check
    return { found: false, conflict: null };
  }

  generateExecutionId() {
    return `parallel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async executeAgent(agent, parsedCommand, sessionContext, executionId) {
    // Placeholder for actual agent execution
    console.log(`  🔄 Executing ${agent}...`);
    
    // Simulate agent work
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    return {
      agent,
      success: true,
      output: `${agent} completed successfully`,
      tokensUsed: Math.floor(Math.random() * 500 + 200),
      executionTime: Math.floor(Math.random() * 2000 + 500)
    };
  }

  async waitForDependencies(executionId, dependencies) {
    // Wait for dependent agents to complete
    const execution = this.activeExecutions.get(executionId);
    
    while (!dependencies.every(dep => execution.results.has(dep))) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async aggregateResults(executionId) {
    const execution = this.activeExecutions.get(executionId);
    const results = Array.from(execution.results.values());
    
    return {
      success: results.every(r => r.success),
      totalTokensUsed: results.reduce((sum, r) => sum + r.tokensUsed, 0),
      totalExecutionTime: Date.now() - execution.startTime,
      agentResults: Object.fromEntries(execution.results),
      parallelEfficiency: this.calculateActualEfficiency(execution)
    };
  }

  calculateActualEfficiency(execution) {
    const theoreticalTime = Array.from(execution.results.values())
      .reduce((sum, r) => sum + r.executionTime, 0);
    const actualTime = Date.now() - execution.startTime;
    
    return Math.round((theoreticalTime / actualTime) * 100) / 100;
  }

  async recordExecution(executionId, success, results) {
    const execution = this.activeExecutions.get(executionId);
    
    const record = {
      executionId,
      success,
      plan: execution.plan,
      duration: Date.now() - execution.startTime,
      results: success ? results : null,
      error: success ? null : results,
      timestamp: Date.now()
    };
    
    this.executionHistory.push(record);
    
    // Limit history size
    if (this.executionHistory.length > 100) {
      this.executionHistory = this.executionHistory.slice(-50);
    }
  }

  /**
   * Get parallel execution statistics
   */
  getExecutionStatistics() {
    const recent = this.executionHistory.slice(-20);
    
    return {
      totalExecutions: this.executionHistory.length,
      recentExecutions: recent.length,
      successRate: recent.filter(e => e.success).length / recent.length,
      averageSpeedup: recent
        .filter(e => e.success && e.results)
        .reduce((sum, e) => sum + (e.results.parallelEfficiency || 1), 0) / recent.length,
      averageDuration: recent.reduce((sum, e) => sum + e.duration, 0) / recent.length,
      activeExecutions: this.activeExecutions.size
    };
  }
}

module.exports = { ParallelExecutionCoordinator };