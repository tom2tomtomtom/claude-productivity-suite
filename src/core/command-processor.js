/**
 * Core Command Processor - Central nervous system for all user commands
 * Handles routing, execution, progress tracking, and optimization
 */

const { IntelligentRouter } = require('./intelligent-router');
const { AgentPool } = require('./agent-pool');
const { ContextManager } = require('./context-manager');
const { ProgressTracker } = require('./progress-tracker');
const { TokenBudgetManager } = require('./token-budget-manager');
const { ErrorHandler } = require('./error-handler');

class CommandProcessor {
  constructor() {
    this.router = new IntelligentRouter();
    this.agents = new AgentPool();
    this.context = new ContextManager();
    this.progress = new ProgressTracker();
    this.budget = new TokenBudgetManager();
    this.errorHandler = new ErrorHandler();
    
    this.commandMap = this.initializeCommandMap();
  }

  /**
   * Initialize the command processor and all subsystems
   */
  async initialize() {
    console.log('Initializing Command Processor...');
    
    // Initialize all subsystems
    await this.router.initialize?.();
    await this.agents.performHealthCheck?.();
    await this.context.reset?.();
    await this.progress.reset?.();
    await this.budget.reset?.();
    await this.errorHandler.reset?.();
    
    console.log('✓ Command Processor initialized successfully');
  }

  initializeCommandMap() {
    const { BuildAppCommand } = require('./commands/build-app-command');
    const { FixBrokenCommand } = require('./commands/fix-broken-command');
    const { ImproveDesignCommand } = require('./commands/improve-design-command');
    const { DeployCommand } = require('./commands/deploy-command');
    const { ShowProgressCommand } = require('./commands/show-progress-command');
    const { AddFeatureCommand } = require('./commands/add-feature-command');
    const { TestCommand } = require('./commands/test-command');
    const { StartOverCommand } = require('./commands/start-over-command');

    return {
      '/build-my-app': new BuildAppCommand(),
      '/fix-whatever-is-broken': new FixBrokenCommand(),
      '/make-it-look-better': new ImproveDesignCommand(),
      '/deploy-when-ready': new DeployCommand(),
      '/show-me-progress': new ShowProgressCommand(),
      '/add-this-feature': new AddFeatureCommand(),
      '/test-everything': new TestCommand(),
      '/start-over-simpler': new StartOverCommand(),
      '/intelligence-dashboard': require('./commands/intelligence-dashboard-command'),
      '/optimize-tokens': require('./commands/optimize-tokens-command')
    };
  }

  async processCommand(command, userInput, sessionContext) {
    const sessionId = sessionContext.sessionId;
    
    try {
      // Start token tracking for this command
      const tokenTracker = await this.budget.startCommandTracking(sessionId, command);
      
      // Parse and validate command
      const parsedCommand = await this.parseCommand(command, userInput, sessionContext);
      
      // Determine optimal routing with token efficiency
      const routingDecision = await this.router.determineOptimalRoute(
        parsedCommand,
        sessionContext,
        { optimizeForTokens: true }
      );
      
      // Execute with comprehensive tracking
      const result = await this.executeWithTracking(
        routingDecision,
        parsedCommand,
        sessionContext,
        tokenTracker
      );
      
      // Update context and learning systems
      await this.updateSystemLearning(result, sessionContext);
      
      // Generate intelligent next step recommendations
      const recommendations = await this.generateNextStepRecommendations(
        result,
        sessionContext
      );
      
      return {
        ...result,
        recommendations,
        tokenUsage: tokenTracker.getUsage(),
        optimizations: tokenTracker.getOptimizations()
      };
      
    } catch (error) {
      return await this.errorHandler.handleCommandError(
        error,
        command,
        userInput,
        sessionContext
      );
    }
  }

  async parseCommand(command, userInput, sessionContext) {
    const commandHandler = this.commandMap[command];
    
    if (!commandHandler) {
      // Try natural language interpretation
      const interpretation = await this.interpretNaturalLanguage(
        `${command} ${userInput}`,
        sessionContext
      );
      
      if (interpretation.confidence > 0.8) {
        return interpretation.parsedCommand;
      }
      
      throw new Error(`Unknown command: ${command}. Try /help for available commands.`);
    }

    return await commandHandler.parse(userInput, sessionContext);
  }

  async executeWithTracking(routingDecision, parsedCommand, sessionContext, tokenTracker) {
    const execution = new CommandExecution(routingDecision, parsedCommand, sessionContext);
    
    // Initialize progress tracking
    const estimatedSteps = execution.getEstimatedSteps();
    this.progress.start(sessionContext.sessionId, estimatedSteps);
    
    // Execute with comprehensive monitoring
    const result = await execution.run({
      onProgress: (step, message, metadata) => {
        this.progress.update(sessionContext.sessionId, step, message);
        this.notifyUser('progress', { step, message, metadata });
        tokenTracker.recordStep(step, metadata.tokenUsage || 0);
      },
      
      onTokenUsage: (usage) => {
        tokenTracker.recordUsage(usage);
        this.checkTokenBudget(sessionContext.sessionId, tokenTracker);
      },
      
      onOptimization: (optimization) => {
        tokenTracker.recordOptimization(optimization);
        this.notifyUser('optimization', optimization);
      },
      
      onError: (error) => {
        this.progress.error(sessionContext.sessionId, error);
        this.notifyUser('error', { error });
      },
      
      onSuccess: (result) => {
        this.progress.complete(sessionContext.sessionId);
        this.notifyUser('success', { result });
      }
    });
    
    return result;
  }

  async interpretNaturalLanguage(input, sessionContext) {
    const { NaturalLanguageProcessor } = require('./nlp-processor');
    const nlp = new NaturalLanguageProcessor();
    
    const analysis = await nlp.analyzeIntent(input, sessionContext);
    
    return {
      confidence: analysis.confidence,
      parsedCommand: analysis.suggestedCommand,
      reasoning: analysis.reasoning
    };
  }

  async generateNextStepRecommendations(result, sessionContext) {
    const { RecommendationEngine } = require('./recommendation-engine');
    const engine = new RecommendationEngine();
    
    return await engine.generateRecommendations(result, sessionContext);
  }

  async updateSystemLearning(result, sessionContext) {
    // Update pattern library
    await this.context.patternLibrary.learnFromResult(result, sessionContext);
    
    // Update user preferences
    await this.context.userProfile.updateFromSession(result, sessionContext);
    
    // Update agent performance metrics
    await this.agents.updatePerformanceMetrics(result, sessionContext);
    
    // Update routing effectiveness
    await this.router.updateRoutingMetrics(result, sessionContext);
  }

  checkTokenBudget(sessionId, tokenTracker) {
    const usage = tokenTracker.getUsage();
    
    if (usage.utilizationRate > 0.75) {
      this.notifyUser('budget_warning', {
        message: 'Approaching token budget limit. Applying optimizations...',
        utilizationRate: usage.utilizationRate,
        remainingTokens: usage.remaining
      });
      
      // Trigger aggressive optimization
      this.budget.triggerOptimization(sessionId, 'aggressive');
    }
  }

  notifyUser(type, data) {
    const { UserNotificationSystem } = require('./user-notification-system');
    UserNotificationSystem.notify(type, data);
  }
}

/**
 * Command Execution Class - Handles the actual execution of commands
 * with comprehensive monitoring and optimization
 */
class CommandExecution {
  constructor(routingDecision, parsedCommand, sessionContext) {
    this.routing = routingDecision;
    this.command = parsedCommand;
    this.context = sessionContext;
    this.steps = [];
    this.currentStep = 0;
  }

  getEstimatedSteps() {
    // Estimate steps based on command type and complexity
    const stepEstimates = {
      'build-app': 8,
      'fix-broken': 4,
      'improve-design': 5,
      'deploy': 3,
      'show-progress': 1,
      'add-feature': 6,
      'test': 4,
      'start-over': 3
    };

    return stepEstimates[this.command.type] || 5;
  }

  async run(callbacks) {
    try {
      const agent = this.routing.selectedAgent;
      const optimizedContext = await this.prepareOptimizedContext();
      
      // Execute command with selected agent
      const result = await agent.execute(
        this.command,
        optimizedContext,
        callbacks
      );
      
      callbacks.onSuccess?.(result);
      return result;
      
    } catch (error) {
      callbacks.onError?.(error);
      throw error;
    }
  }

  async prepareOptimizedContext() {
    const { ContextCompressionEngine } = require('./context-compression-engine');
    const compressor = new ContextCompressionEngine();
    
    return await compressor.compressContext(
      this.context,
      { targetReduction: 0.5, preserveQuality: true }
    );
  }
}

module.exports = { CommandProcessor, CommandExecution };