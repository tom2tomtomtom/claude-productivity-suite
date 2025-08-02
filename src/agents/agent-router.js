/**
 * Agent Router - Intelligent routing to Claude Code specialist agents
 * Routes tasks to the most appropriate specialist agent using Task tool
 */

class AgentRouter {
  constructor() {
    this.availableAgents = new Map();
    this.routingHistory = [];
    this.initializeAgents();
  }

  /**
   * Initialize all available Claude Code specialist agents
   */
  initializeAgents() {
    // Core existing agents
    this.availableAgents.set('frontend-specialist', {
      type: 'frontend-specialist',
      description: 'UI/UX design, React components, responsive design, user experience',
      capabilities: ['ui-design', 'component-creation', 'responsive-design', 'user-experience', 'visual-design', 'accessibility'],
      tools: ['react', 'css', 'html', 'design-systems']
    });
    
    this.availableAgents.set('backend-specialist', {
      type: 'backend-specialist', 
      description: 'APIs, server logic, databases, authentication, data processing',
      capabilities: ['api-development', 'server-logic', 'database-integration', 'authentication', 'data-processing'],
      tools: ['nodejs', 'express', 'apis', 'databases']
    });
    
    this.availableAgents.set('database-specialist', {
      type: 'database-specialist',
      description: 'Data modeling, storage optimization, queries, database design',
      capabilities: ['data-modeling', 'storage-optimization', 'query-optimization', 'database-design'],
      tools: ['sql', 'mongodb', 'database-design']
    });
    
    this.availableAgents.set('deployment-specialist', {
      type: 'deployment-specialist',
      description: 'Hosting, production deployment, performance optimization, monitoring',
      capabilities: ['deployment', 'hosting', 'performance-optimization', 'monitoring'],
      tools: ['vercel', 'netlify', 'docker', 'hosting-platforms']
    });
    
    this.availableAgents.set('testing-specialist', {
      type: 'testing-specialist',
      description: 'Quality assurance, automated testing, bug detection, test coverage',
      capabilities: ['automated-testing', 'bug-detection', 'test-coverage', 'quality-assurance'],
      tools: ['jest', 'cypress', 'playwright', 'testing-frameworks']
    });

    // New missing critical agents
    this.availableAgents.set('security-specialist', {
      type: 'security-specialist',
      description: 'Authentication, authorization, vulnerability scanning, security audits',
      capabilities: ['authentication', 'authorization', 'vulnerability-scanning', 'security-audits', 'data-protection'],
      tools: ['auth-systems', 'security-scanners', 'encryption']
    });

    this.availableAgents.set('performance-specialist', {
      type: 'performance-specialist', 
      description: 'Code optimization, load testing, profiling, caching strategies',
      capabilities: ['code-optimization', 'load-testing', 'profiling', 'caching', 'performance-monitoring'],
      tools: ['profilers', 'load-testing-tools', 'optimization-tools']
    });

    this.availableAgents.set('devops-specialist', {
      type: 'devops-specialist',
      description: 'CI/CD pipelines, containerization, infrastructure as code',
      capabilities: ['ci-cd', 'containerization', 'infrastructure-automation', 'deployment-pipelines'],
      tools: ['docker', 'kubernetes', 'github-actions', 'terraform']
    });

    this.availableAgents.set('api-specialist', {
      type: 'api-specialist',
      description: 'REST/GraphQL design, API documentation, versioning, integration',
      capabilities: ['api-design', 'api-documentation', 'api-versioning', 'api-integration'],
      tools: ['openapi', 'graphql', 'postman', 'api-tools']
    });

    this.availableAgents.set('data-specialist', {
      type: 'data-specialist',
      description: 'Analytics, reporting, data pipelines, ETL processes',
      capabilities: ['data-analytics', 'reporting', 'data-pipelines', 'etl-processes'],
      tools: ['analytics-tools', 'data-visualization', 'etl-tools']
    });

    this.availableAgents.set('mobile-specialist', {
      type: 'mobile-specialist',
      description: 'React Native, responsive design, mobile-specific features',
      capabilities: ['mobile-development', 'react-native', 'mobile-ui', 'responsive-design'],
      tools: ['react-native', 'mobile-frameworks', 'responsive-tools']
    });

    this.availableAgents.set('documentation-specialist', {
      type: 'documentation-specialist',
      description: 'Technical writing, API docs, user guides, README files',
      capabilities: ['technical-writing', 'api-documentation', 'user-guides', 'readme-creation'],
      tools: ['markdown', 'documentation-tools', 'technical-writing']
    });

    this.availableAgents.set('monitoring-specialist', {
      type: 'monitoring-specialist',
      description: 'Logging, error tracking, performance monitoring, alerts',
      capabilities: ['logging', 'error-tracking', 'performance-monitoring', 'alerting'],
      tools: ['logging-tools', 'monitoring-platforms', 'error-tracking']
    });
    
    console.log(`🎯 Agent Router initialized with ${this.availableAgents.size} Claude Code specialists`);
  }

  /**
   * Route command to most appropriate Claude Code specialist
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
      
      // Step 3: Execute with selected Claude Code specialist
      if (callbacks.onProgress) {
        callbacks.onProgress(1, `Routing to ${selectedSpecialist.type}`, { tokenUsage: 5 });
      }
      
      const executionResult = await this.executeWithClaudeSpecialist(
        selectedSpecialist, command, context, callbacks
      );
      
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
   * Execute command using Claude Code specialist agent
   * @param {Object} selectedSpecialist - Selected specialist info
   * @param {Object} command - Command to execute  
   * @param {Object} context - Execution context
   * @param {Object} callbacks - Progress callbacks
   * @returns {Object} Execution result
   */
  async executeWithClaudeSpecialist(selectedSpecialist, command, context, callbacks) {
    const agentInfo = this.availableAgents.get(selectedSpecialist.type);
    
    // Create detailed prompt for the Claude Code specialist
    const specialistPrompt = this.createSpecialistPrompt(command, context, agentInfo);
    
    try {
      // This would be called via the Task tool in the actual implementation
      // For now, we'll simulate the behavior
      console.log(`🚀 Executing with ${selectedSpecialist.type}:`, specialistPrompt.substring(0, 100) + '...');
      
      // Simulate execution (in real implementation, this would use Task tool)
      const result = await this.simulateClaudeExecution(specialistPrompt, agentInfo);
      
      return {
        success: true,
        message: `${selectedSpecialist.type} completed task: ${result.summary}`,
        executionTime: Date.now() - Date.now() + 1000,
        data: {
          result: result,
          estimatedTokenSavings: this.estimateTokenSavings(selectedSpecialist.type),
          agentCapabilities: agentInfo.capabilities
        }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `${selectedSpecialist.type} execution failed: ${error.message}`,
        executionTime: Date.now() - Date.now() + 500,
        error: error.message
      };
    }
  }

  /**
   * Create specialized prompt for Claude Code agent
   * @param {Object} command - Command to execute
   * @param {Object} context - Execution context  
   * @param {Object} agentInfo - Agent information and capabilities
   * @returns {string} Formatted prompt for specialist
   */
  createSpecialistPrompt(command, context, agentInfo) {
    return `
As a ${agentInfo.type}, you specialize in: ${agentInfo.description}

Your core capabilities include: ${agentInfo.capabilities.join(', ')}
Your available tools: ${agentInfo.tools.join(', ')}

TASK: ${command.type || 'Execute specialized task'}
DESCRIPTION: ${command.description || command.arguments || 'No specific description provided'}

CONTEXT:
- Project: ${context.projectName || 'Claude Productivity Suite'}
- Current Phase: ${context.currentPhase || 'Development'}
- Token Budget: ${context.tokenBudget || 'Standard'}
- User Level: ${context.userLevel || 'Non-technical'}

REQUIREMENTS:
1. Focus on your specialty area: ${agentInfo.description}
2. Provide practical, actionable solutions
3. Use non-technical language when explaining to user
4. Optimize for token efficiency
5. Break complex tasks into simple steps
6. Follow established project patterns and conventions

Please execute this task using your specialized expertise and provide a clear, actionable result.
    `.trim();
  }

  /**
   * Simulate Claude Code execution (placeholder for actual Task tool call)
   * @param {string} prompt - Specialist prompt
   * @param {Object} agentInfo - Agent information
   * @returns {Object} Simulated execution result
   */
  async simulateClaudeExecution(prompt, agentInfo) {
    // In real implementation, this would be:
    // await Task({
    //   subagent_type: agentInfo.type,
    //   description: `${agentInfo.type} task execution`,
    //   prompt: prompt
    // });
    
    return {
      summary: `${agentInfo.type} would handle this specialized task`,
      approach: `Using ${agentInfo.capabilities.join(', ')} capabilities`,
      nextSteps: ['Analyze requirements', 'Apply specialized knowledge', 'Deliver optimized solution'],
      tokenEfficiency: 'High - specialized agent reduces context switching'
    };
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
   * Select the best Claude Code specialist for the task
   * @param {Object} analysis - Routing analysis
   * @param {Object} context - Execution context
   * @returns {Object} Selected specialist with confidence score
   */
  async selectSpecialist(analysis, context) {
    const candidateScores = new Map();
    
    // Score each Claude Code specialist for this task
    for (const [specialistType, agentInfo] of this.availableAgents) {
      const score = await this.scoreSpecialistFit(agentInfo, analysis, context);
      candidateScores.set(specialistType, {
        type: specialistType,
        agentInfo: agentInfo,
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
   * Score how well a Claude Code specialist fits the task
   * @param {Object} agentInfo - Specialist agent information
   * @param {Object} analysis - Routing analysis
   * @param {Object} context - Execution context
   * @returns {Object} Fit score and reasoning
   */
  async scoreSpecialistFit(agentInfo, analysis, context) {
    let totalScore = 0;
    let scoreCount = 0;
    const reasons = [];
    let hasPrimaryMatch = false;

    // Score based on task types - prioritize first (primary) task type
    for (let i = 0; i < analysis.taskTypes.length; i++) {
      const taskType = analysis.taskTypes[i];
      const taskFit = this.assessTaskFitForAgent(agentInfo, taskType, context);
      
      // Weight the first task type higher (it's the primary match)
      const weight = i === 0 ? 2.0 : 1.0;
      totalScore += taskFit.confidence * weight;
      scoreCount += weight;
      
      if (taskFit.confidence > 0.90) {
        hasPrimaryMatch = true;
        reasons.push(`Primary specialist for ${taskType}`);
      } else if (taskFit.confidence > 0.7) {
        reasons.push(`Strong fit for ${taskType}`);
      }
    }

    // Score based on domain areas (lower weight)
    for (const domain of analysis.domainAreas) {
      const domainScore = this.scoreDomainFit(agentInfo, domain);
      totalScore += domainScore * 0.5; // Lower weight for domain
      scoreCount += 0.5;
    }

    // Score based on capability overlap (lower weight)
    const capabilityScore = this.scoreCapabilityOverlap(agentInfo, analysis);
    totalScore += capabilityScore * 0.3; // Even lower weight
    scoreCount += 0.3;

    // Boost score significantly if this agent is a primary match
    if (hasPrimaryMatch) {
      totalScore *= 1.2;
    }

    // Adjust for complexity
    const complexityAdjustment = this.getComplexityAdjustment(agentInfo, analysis.complexity);
    totalScore *= complexityAdjustment;

    const finalScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    
    return {
      confidence: Math.min(finalScore, 1.0),
      reasoning: reasons.join(', ') || `${agentInfo.type} evaluation`,
      estimatedEfficiency: finalScore * 0.9
    };
  }

  /**
   * Assess how well an agent fits a specific task type
   * @param {Object} agentInfo - Agent information
   * @param {string} taskType - Task type to assess
   * @param {Object} context - Execution context
   * @returns {Object} Task fit assessment
   */
  assessTaskFitForAgent(agentInfo, taskType, context) {
    const taskCapabilityMap = {
      'security-audit': ['security-specialist'],
      'performance-optimization': ['performance-specialist'],
      'api-development': ['api-specialist', 'backend-specialist'],
      'mobile-development': ['mobile-specialist'],
      'documentation-writing': ['documentation-specialist'],
      'monitoring-setup': ['monitoring-specialist'],
      'devops-pipeline': ['devops-specialist'],
      'data-analysis': ['data-specialist'],
      'ui-design': ['frontend-specialist', 'mobile-specialist'],
      'backend-logic': ['backend-specialist', 'api-specialist'],
      'database-design': ['database-specialist', 'data-specialist'],
      'deployment': ['deployment-specialist', 'devops-specialist'],
      'testing': ['testing-specialist', 'performance-specialist'],
      'styling': ['frontend-specialist', 'mobile-specialist'],
      'authentication': ['security-specialist', 'backend-specialist'],
      'performance': ['performance-specialist'],
      'monitoring': ['monitoring-specialist', 'devops-specialist'],
      'security': ['security-specialist'],
      'mobile': ['mobile-specialist', 'frontend-specialist'],
      'documentation': ['documentation-specialist'],
      'general-development': ['frontend-specialist', 'backend-specialist']
    };

    const matchingAgents = taskCapabilityMap[taskType] || [];
    const isDirectMatch = matchingAgents.includes(agentInfo.type);
    const isPrimaryMatch = matchingAgents[0] === agentInfo.type;
    const isSecondaryMatch = agentInfo.capabilities.some(cap => 
      cap.includes(taskType.replace(/-/g, '')) || taskType.includes(cap.replace(/-/g, ''))
    );

    let confidence = 0.2; // Base confidence
    if (isPrimaryMatch) confidence = 0.95; // Highest for primary specialist
    else if (isDirectMatch) confidence = 0.80; // High for secondary specialists
    else if (isSecondaryMatch) confidence = 0.60; // Medium for capability match

    return {
      confidence,
      reasoning: isPrimaryMatch ? 'Primary specialist match' :
                isDirectMatch ? 'Direct capability match' : 
                isSecondaryMatch ? 'Secondary capability match' : 'Generic capability'
    };
  }

  /**
   * Score capability overlap between agent and task requirements
   * @param {Object} agentInfo - Agent information
   * @param {Object} analysis - Task analysis
   * @returns {number} Capability overlap score
   */
  scoreCapabilityOverlap(agentInfo, analysis) {
    const taskKeywords = [
      ...analysis.taskTypes,
      ...analysis.technologies,
      ...analysis.domainAreas
    ].map(item => item.toLowerCase().replace(/-/g, ''));

    const agentKeywords = [
      ...agentInfo.capabilities,
      ...agentInfo.tools,
      agentInfo.type.replace('-specialist', '')
    ].map(item => item.toLowerCase().replace(/-/g, ''));

    const matches = taskKeywords.filter(keyword => 
      agentKeywords.some(agentKeyword => 
        agentKeyword.includes(keyword) || keyword.includes(agentKeyword)
      )
    );

    return Math.min(matches.length / Math.max(taskKeywords.length, 1), 1.0);
  }

  /**
   * Extract task types from command description with improved patterns for new specialists
   * @param {string} description - Command description
   * @returns {Array} Identified task types
   */
  extractTaskTypes(description) {
    const taskPatterns = {
      'security-audit': ['security', 'vulnerabilities', 'audit', 'secure', 'encryption', 'auth', 'permission'],
      'performance-optimization': ['performance', 'optimize', 'speed', 'fast', 'slow', 'cache', 'profile'],
      'api-development': ['api', 'endpoint', 'rest', 'graphql', 'integration', 'webhook'],
      'mobile-development': ['mobile', 'react native', 'phone', 'app store', 'ios', 'android'],
      'documentation-writing': ['documentation', 'docs', 'readme', 'guide', 'manual', 'help'],
      'monitoring-setup': ['monitoring', 'logs', 'logging', 'alerts', 'tracking', 'metrics'],
      'devops-pipeline': ['devops', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'infrastructure'],
      'data-analysis': ['analytics', 'reporting', 'data analysis', 'dashboard', 'charts'],
      'ui-design': ['ui', 'design', 'interface', 'visual', 'frontend', 'component', 'beautiful', 'style'],
      'backend-logic': ['backend', 'server', 'logic', 'business'],
      'database-design': ['database', 'data', 'model', 'schema', 'storage', 'query'],
      'deployment': ['deploy', 'host', 'publish', 'production', 'launch', 'live'],
      'testing': ['test', 'qa', 'bug', 'quality', 'validate', 'check'],
      'styling': ['css', 'theme', 'responsive']
    };

    const identified = [];
    let maxScore = 0;
    let bestMatch = null;

    // Score each task type by keyword matches
    for (const [taskType, keywords] of Object.entries(taskPatterns)) {
      const matches = keywords.filter(keyword => description.toLowerCase().includes(keyword.toLowerCase()));
      const score = matches.length;
      
      if (score > 0) {
        identified.push({ taskType, score, matches });
        if (score > maxScore) {
          maxScore = score;
          bestMatch = taskType;
        }
      }
    }

    // Return the highest scoring task types, prioritizing the best match
    const taskTypes = identified
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.taskType);

    return taskTypes.length > 0 ? taskTypes : ['general-development'];
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
   * Score domain fit for Claude Code specialist
   * @param {Object} agentInfo - Specialist agent information
   * @param {string} domain - Domain area
   * @returns {number} Domain fit score
   */
  scoreDomainFit(agentInfo, domain) {
    const specialistDomainMap = {
      'frontend-specialist': { frontend: 0.95, testing: 0.3, backend: 0.1, mobile: 0.7 },
      'backend-specialist': { backend: 0.95, database: 0.7, frontend: 0.2, api: 0.8 },
      'database-specialist': { database: 0.95, backend: 0.6, frontend: 0.1, data: 0.9 },
      'deployment-specialist': { devops: 0.95, backend: 0.4, testing: 0.3, deployment: 0.95 },
      'testing-specialist': { testing: 0.95, frontend: 0.6, backend: 0.5, quality: 0.9 },
      'security-specialist': { security: 0.95, backend: 0.7, authentication: 0.9, devops: 0.5 },
      'performance-specialist': { performance: 0.95, backend: 0.8, frontend: 0.6, optimization: 0.9 },
      'devops-specialist': { devops: 0.95, deployment: 0.9, backend: 0.6, infrastructure: 0.95 },
      'api-specialist': { api: 0.95, backend: 0.8, integration: 0.9, documentation: 0.7 },
      'data-specialist': { data: 0.95, database: 0.8, analytics: 0.9, reporting: 0.9 },
      'mobile-specialist': { mobile: 0.95, frontend: 0.8, responsive: 0.9, ui: 0.7 },
      'documentation-specialist': { documentation: 0.95, technical: 0.9, api: 0.6, guides: 0.9 },
      'monitoring-specialist': { monitoring: 0.95, logging: 0.9, performance: 0.7, devops: 0.6 }
    };

    const domainScores = specialistDomainMap[agentInfo.type] || {};
    return domainScores[domain] || 0.2; // Default low score
  }

  /**
   * Get complexity adjustment multiplier for Claude Code specialist
   * @param {Object} agentInfo - Specialist agent information
   * @param {string} complexity - Complexity level
   * @returns {number} Adjustment multiplier
   */
  getComplexityAdjustment(agentInfo, complexity) {
    // Some specialists handle complexity better than others
    const complexityMultipliers = {
      high: { 
        'backend-specialist': 1.1, 
        'database-specialist': 1.1, 
        'devops-specialist': 1.2,
        'security-specialist': 1.1,
        'performance-specialist': 1.2,
        'api-specialist': 1.1,
        'frontend-specialist': 0.9,
        'mobile-specialist': 0.9
      },
      medium: { 
        'frontend-specialist': 1.1, 
        'testing-specialist': 1.1,
        'documentation-specialist': 1.2,
        'mobile-specialist': 1.1,
        'monitoring-specialist': 1.1
      },
      low: { 
        'frontend-specialist': 1.2, 
        'deployment-specialist': 1.1,
        'documentation-specialist': 1.3,
        'mobile-specialist': 1.1
      }
    };

    return complexityMultipliers[complexity]?.[agentInfo.type] || 1.0;
  }

  /**
   * Add method to estimate token savings for different agent types
   * @param {string} agentType - Type of agent
   * @returns {number} Estimated token savings
   */
  estimateTokenSavings(agentType) {
    const tokenSavingsMap = {
      'frontend-specialist': 650,
      'backend-specialist': 750, 
      'database-specialist': 800,
      'deployment-specialist': 600,
      'testing-specialist': 550,
      'security-specialist': 700,
      'performance-specialist': 850,
      'devops-specialist': 900,
      'api-specialist': 750,
      'data-specialist': 800,
      'mobile-specialist': 650,
      'documentation-specialist': 400,
      'monitoring-specialist': 600
    };

    return tokenSavingsMap[agentType] || 500;
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
   * Handle routing errors gracefully with Claude Code specialists
   * @param {Error} error - Routing error
   * @param {Object} command - Original command
   * @param {Object} context - Execution context
   * @returns {Object} Error response
   */
  async handleRoutingError(error, command, context) {
    console.error('Routing error:', error.message);

    // Fallback to frontend specialist for unknown commands
    const fallbackAgentInfo = this.availableAgents.get('frontend-specialist');
    
    try {
      const fallbackSpecialist = {
        type: 'frontend-specialist',
        agentInfo: fallbackAgentInfo,
        confidence: 0.5,
        reasoning: 'Fallback agent due to routing error'
      };
      
      const fallbackResult = await this.executeWithClaudeSpecialist(
        fallbackSpecialist, command, context
      );
      
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
   * Get available Claude Code specialists
   * @returns {Array} List of available specialists
   */
  getAvailableSpecialists() {
    return Array.from(this.availableAgents.keys());
  }

  /**
   * Get Claude Code specialist by type
   * @param {string} type - Specialist type
   * @returns {Object} Specialist agent information
   */
  getSpecialist(type) {
    return this.availableAgents.get(type);
  }

  /**
   * Get all specialist details for debugging/monitoring
   * @returns {Object} All available specialists with their details
   */
  getAllSpecialistDetails() {
    const details = {};
    for (const [type, agentInfo] of this.availableAgents) {
      details[type] = {
        description: agentInfo.description,
        capabilities: agentInfo.capabilities,
        tools: agentInfo.tools
      };
    }
    return details;
  }

  /**
   * Perform health check on all Claude Code specialists
   * @returns {Object} Health check results
   */
  async performHealthCheck() {
    const results = {};
    
    for (const [type, agentInfo] of this.availableAgents) {
      try {
        // Since Claude Code specialists are external, we can only check if they're properly configured
        results[type] = {
          status: 'healthy',
          description: agentInfo.description,
          capabilities: agentInfo.capabilities.length,
          tools: agentInfo.tools.length,
          lastHealthCheck: new Date().toISOString()
        };
      } catch (error) {
        results[type] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    return {
      router: { 
        status: 'healthy', 
        specialists: Object.keys(results).length,
        system: 'claude-code-agents',
        lastCheck: new Date().toISOString()
      },
      specialists: results
    };
  }
}

module.exports = { AgentRouter };