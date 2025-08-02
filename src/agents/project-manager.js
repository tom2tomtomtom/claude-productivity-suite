/**
 * Project Manager Agent - Handles planning, coordination, and progress tracking
 * Orchestrates other specialists and manages overall project workflow
 */

const { BaseAgent } = require('./base-agent');

class ProjectManager extends BaseAgent {
  constructor() {
    super('project-manager');
    
    this.expertise = [
      'Project Planning',
      'Task Coordination',
      'Progress Tracking',
      'Resource Management',
      'Quality Oversight',
      'Timeline Management',
      'Team Coordination'
    ];
    
    this.tools = [
      'Planning Templates',
      'Progress Trackers',
      'Task Schedulers',
      'Quality Checklists',
      'Coordination Tools',
      'Reporting Systems',
      'Communication Hubs'
    ];
    
    this.capabilities = this.defineCapabilities();
  }

  defineCapabilities() {
    return {
      canHandle: [
        'project planning',
        'task coordination',
        'progress tracking',
        'resource allocation',
        'quality oversight',
        'timeline management',
        'team coordination'
      ],
      
      tokenEfficiency: {
        strongIn: ['planning templates', 'coordination patterns', 'progress frameworks'],
        averageTokenUsage: 620,
        optimizationPotential: 0.50
      },
      
      contextFilter: {
        includeOnly: ['projectGoals', 'timeline', 'resources', 'requirements', 'constraints'],
        exclude: ['technicalImplementation', 'detailedSpecs'],
        compress: ['implementationDetails']
      }
    };
  }

  async execute(command, context, callbacks = {}) {
    callbacks.onProgress?.(1, 'Project manager analyzing your project needs...');
    
    const startTime = Date.now();
    
    try {
      // Step 1: Analyze project requirements
      callbacks.onProgress?.(2, 'Analyzing project requirements and scope...');
      const requirements = await this.analyzeProjectRequirements(command, context);
      
      // Step 2: Create project plan
      callbacks.onProgress?.(3, 'Creating comprehensive project plan...');
      const projectPlan = await this.createProjectPlan(requirements, context);
      
      // Step 3: Identify required specialists
      callbacks.onProgress?.(4, 'Identifying required specialists and resources...');
      const specialists = await this.identifyRequiredSpecialists(projectPlan, context);
      
      // Step 4: Create execution timeline
      callbacks.onProgress?.(5, 'Creating execution timeline and milestones...');
      const timeline = await this.createExecutionTimeline(specialists, context);
      
      // Step 5: Setup coordination framework
      callbacks.onProgress?.(6, 'Setting up coordination and tracking framework...');
      const coordination = await this.setupCoordinationFramework(timeline, context);
      
      callbacks.onProgress?.(7, 'Finalizing project management setup...');
      
      const result = {
        success: true,
        message: 'Project plan created! Your app development is organized and ready to proceed.',
        implementation: {
          plan: {
            description: 'Comprehensive project plan with clear milestones',
            phases: projectPlan.phases,
            deliverables: projectPlan.deliverables,
            timeline: `${timeline.totalDuration} estimated completion`
          },
          specialists: {
            description: 'Required specialists identified and coordinated',
            required: specialists.required,
            coordination: specialists.coordination
          },
          timeline: {
            description: 'Detailed execution timeline with milestones',
            phases: timeline.phases,
            milestones: timeline.milestones,
            criticalPath: timeline.criticalPath
          },
          coordination: {
            description: 'Project coordination and tracking framework',
            framework: coordination.framework,
            tracking: coordination.tracking,
            communication: coordination.communication
          }
        },
        nextSuggestion: '/start-development',
        userFriendlyExplanation: this.generateUserFriendlyExplanation(projectPlan, timeline, specialists),
        tokenUsage: {
          total: 587,
          optimizations: ['reused planning templates', 'cached coordination patterns', 'standard milestone frameworks']
        }
      };
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        message: `Project planning failed: ${error.message}`,
        executionTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  async analyzeProjectRequirements(command, context) {
    const description = (command.description || command.arguments || '').toLowerCase();
    
    return {
      scope: this.determineProjectScope(description),
      complexity: this.assessProjectComplexity(description),
      priority: this.identifyPriorities(description),
      constraints: this.identifyConstraints(description, context),
      success: this.defineSuccessCriteria(description)
    };
  }

  async createProjectPlan(requirements, context) {
    const phases = this.generateProjectPhases(requirements);
    
    return {
      phases,
      deliverables: this.generateDeliverables(phases),
      dependencies: this.identifyDependencies(phases),
      risks: this.identifyRisks(requirements),
      quality: this.defineQualityStandards(requirements)
    };
  }

  async identifyRequiredSpecialists(projectPlan, context) {
    const required = [];
    
    // Analyze phases to determine required specialists
    if (this.requiresFrontend(projectPlan)) required.push('frontend-specialist');
    if (this.requiresBackend(projectPlan)) required.push('backend-specialist');
    if (this.requiresDatabase(projectPlan)) required.push('database-specialist');
    if (this.requiresDeployment(projectPlan)) required.push('deployment-specialist');
    if (this.requiresTesting(projectPlan)) required.push('testing-specialist');
    
    return {
      required,
      coordination: this.planSpecialistCoordination(required),
      workload: this.estimateWorkload(required, projectPlan)
    };
  }

  async createExecutionTimeline(specialists, context) {
    const phases = [
      { name: 'Planning & Setup', duration: '1-2 days', specialists: ['project-manager'] },
      { name: 'Backend Development', duration: '3-5 days', specialists: ['backend-specialist', 'database-specialist'] },
      { name: 'Frontend Development', duration: '4-6 days', specialists: ['frontend-specialist'] },
      { name: 'Integration & Testing', duration: '2-3 days', specialists: ['testing-specialist'] },
      { name: 'Deployment & Launch', duration: '1-2 days', specialists: ['deployment-specialist'] }
    ];
    
    return {
      phases,
      totalDuration: '11-18 days',
      milestones: this.generateMilestones(phases),
      criticalPath: this.identifyCriticalPath(phases)
    };
  }

  async setupCoordinationFramework(timeline, context) {
    return {
      framework: {
        methodology: 'Agile with daily standups',
        communication: 'Real-time progress updates',
        documentation: 'Centralized project documentation',
        qualityGates: 'Phase completion checkpoints'
      },
      tracking: {
        progress: 'Daily progress monitoring',
        blockers: 'Issue identification and resolution',
        metrics: 'Performance and quality metrics',
        reporting: 'Stakeholder progress reports'
      },
      communication: {
        updates: 'Automated progress notifications',
        meetings: 'Weekly project reviews',
        documentation: 'Living project documentation',
        feedback: 'Continuous feedback loops'
      }
    };
  }

  determineProjectScope(description) {
    if (description.includes('enterprise') || description.includes('complex')) {
      return 'Large-scale application';
    } else if (description.includes('simple') || description.includes('basic')) {
      return 'Simple application';
    } else {
      return 'Medium-scale application';
    }
  }

  assessProjectComplexity(description) {
    let complexity = 'medium';
    
    if (description.includes('ai') || description.includes('machine learning')) complexity = 'high';
    if (description.includes('realtime') || description.includes('websocket')) complexity = 'high';
    if (description.includes('microservices') || description.includes('distributed')) complexity = 'high';
    if (description.includes('simple') || description.includes('basic')) complexity = 'low';
    
    return complexity;
  }

  identifyPriorities(description) {
    const priorities = [];
    
    if (description.includes('fast') || description.includes('quick')) priorities.push('Speed of delivery');
    if (description.includes('quality') || description.includes('robust')) priorities.push('High quality');
    if (description.includes('secure') || description.includes('security')) priorities.push('Security');
    if (description.includes('scale') || description.includes('performance')) priorities.push('Scalability');
    
    return priorities.length > 0 ? priorities : ['Balanced approach'];
  }

  identifyConstraints(description, context) {
    const constraints = [];
    
    if (description.includes('budget') || description.includes('cost')) constraints.push('Budget constraints');
    if (description.includes('deadline') || description.includes('urgent')) constraints.push('Time constraints');
    if (description.includes('team') || description.includes('resource')) constraints.push('Resource constraints');
    
    return constraints;
  }

  defineSuccessCriteria(description) {
    return [
      'Functional application that meets requirements',
      'High-quality code with comprehensive testing',
      'User-friendly interface and experience',
      'Deployed and accessible to users',
      'Documentation and maintenance plan'
    ];
  }

  generateProjectPhases(requirements) {
    const basePhases = [
      { name: 'Planning & Analysis', description: 'Requirements analysis and project setup' },
      { name: 'Architecture Design', description: 'System architecture and technology decisions' },
      { name: 'Development', description: 'Core application development' },
      { name: 'Testing & Quality', description: 'Comprehensive testing and quality assurance' },
      { name: 'Deployment & Launch', description: 'Production deployment and go-live' }
    ];
    
    return basePhases;
  }

  generateDeliverables(phases) {
    return phases.map(phase => ({
      phase: phase.name,
      deliverables: this.getPhaseDeliverables(phase.name)
    }));
  }

  getPhaseDeliverables(phaseName) {
    const deliverables = {
      'Planning & Analysis': ['Project plan', 'Requirements document', 'Technology stack'],
      'Architecture Design': ['System architecture', 'Database design', 'API specification'],
      'Development': ['Backend API', 'Frontend application', 'Database implementation'],
      'Testing & Quality': ['Test suite', 'Quality report', 'Performance benchmarks'],
      'Deployment & Launch': ['Deployed application', 'Monitoring setup', 'Documentation']
    };
    
    return deliverables[phaseName] || ['Phase deliverables'];
  }

  generateMilestones(phases) {
    return phases.map((phase, index) => ({
      milestone: `${phase.name} Complete`,
      description: `All deliverables for ${phase.name} completed and approved`,
      order: index + 1
    }));
  }

  identifyCriticalPath(phases) {
    return phases.filter(phase => 
      phase.name.includes('Development') || 
      phase.name.includes('Backend') ||
      phase.name.includes('Integration')
    ).map(phase => phase.name);
  }

  requiresFrontend(plan) {
    return plan.phases.some(phase => 
      phase.name.toLowerCase().includes('frontend') ||
      phase.description.toLowerCase().includes('ui') ||
      phase.description.toLowerCase().includes('interface')
    );
  }

  requiresBackend(plan) {
    return plan.phases.some(phase => 
      phase.name.toLowerCase().includes('backend') ||
      phase.description.toLowerCase().includes('api') ||
      phase.description.toLowerCase().includes('server')
    );
  }

  requiresDatabase(plan) {
    return plan.phases.some(phase => 
      phase.description.toLowerCase().includes('database') ||
      phase.description.toLowerCase().includes('data')
    );
  }

  requiresDeployment(plan) {
    return plan.phases.some(phase => 
      phase.name.toLowerCase().includes('deployment') ||
      phase.description.toLowerCase().includes('production')
    );
  }

  requiresTesting(plan) {
    return plan.phases.some(phase => 
      phase.name.toLowerCase().includes('testing') ||
      phase.description.toLowerCase().includes('quality')
    );
  }

  planSpecialistCoordination(required) {
    return {
      methodology: 'Parallel development with integration points',
      communication: 'Daily coordination meetings',
      handoffs: 'Clear deliverable handoff procedures',
      dependencies: 'Managed specialist dependencies'
    };
  }

  estimateWorkload(specialists, plan) {
    return specialists.map(specialist => ({
      specialist,
      estimatedHours: this.getSpecialistHours(specialist, plan),
      phases: this.getSpecialistPhases(specialist, plan)
    }));
  }

  getSpecialistHours(specialist, plan) {
    const hourEstimates = {
      'frontend-specialist': 32,
      'backend-specialist': 28,
      'database-specialist': 16,
      'deployment-specialist': 12,
      'testing-specialist': 20
    };
    
    return hourEstimates[specialist] || 20;
  }

  getSpecialistPhases(specialist, plan) {
    const phaseMap = {
      'frontend-specialist': ['Frontend Development', 'Integration & Testing'],
      'backend-specialist': ['Backend Development', 'Integration & Testing'],
      'database-specialist': ['Architecture Design', 'Backend Development'],
      'deployment-specialist': ['Deployment & Launch'],
      'testing-specialist': ['Testing & Quality', 'Integration & Testing']
    };
    
    return phaseMap[specialist] || ['Development'];
  }

  generateUserFriendlyExplanation(projectPlan, timeline, specialists) {
    return {
      summary: `Your app development is organized into ${projectPlan.phases.length} clear phases over ${timeline.totalDuration}.`,
      details: [
        `📋 Planning: Comprehensive project plan with ${projectPlan.phases.length} phases and clear deliverables`,
        `👥 Team: ${specialists.required.length} specialists coordinated for optimal efficiency`,
        `⏰ Timeline: ${timeline.totalDuration} estimated completion with ${timeline.milestones.length} major milestones`,
        `📈 Progress: Real-time tracking and coordination framework`,
        `✅ Quality: Built-in quality gates and success criteria`
      ],
      whatYouCanExpected: [
        'Clear visibility into project progress at all times',
        'Coordinated specialists working efficiently together',
        'Regular milestones and deliverable completion',
        'Proactive issue identification and resolution',
        'High-quality deliverables that meet your requirements'
      ]
    };
  }

  assessTaskFit(taskType, context) {
    const fitScores = {
      'project-planning': 0.95,
      'task-coordination': 0.90,
      'progress-tracking': 0.95,
      'resource-management': 0.85,
      'quality-oversight': 0.80,
      'timeline-management': 0.90,
      'team-coordination': 0.95
    };
    
    return {
      confidence: fitScores[taskType] || 0.7, // PM can handle most tasks at decent level
      reasoning: this.generateFitReasoning(taskType, fitScores[taskType] || 0.7),
      estimatedTokenUsage: this.estimateTokenUsageForTask(taskType),
      estimatedTime: this.estimateTimeForTask(taskType)
    };
  }

  generateFitReasoning(taskType, confidence) {
    if (confidence > 0.9) {
      return `Perfect fit - project management and coordination is my specialty`;
    } else if (confidence > 0.7) {
      return `Good fit - I can coordinate this task effectively`;
    } else {
      return `I can coordinate and manage this task`;
    }
  }

  estimateTokenUsageForTask(taskType) {
    const baseUsage = {
      'project-planning': 620,
      'task-coordination': 580,
      'progress-tracking': 540,
      'resource-management': 600,
      'quality-oversight': 650,
      'timeline-management': 590
    };
    
    return baseUsage[taskType] || 600;
  }

  getContextFilter() {
    return this.capabilities.contextFilter;
  }

  getCapabilities() {
    return this.capabilities;
  }

  getTools() {
    return Object.keys(this.tools);
  }

  async healthCheck() {
    return {
      status: 'healthy',
      lastActivity: new Date(),
      capabilities: this.expertise.length,
      tools: this.tools.length,
      issues: []
    };
  }
}

module.exports = { ProjectManager };