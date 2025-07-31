/**
 * Command Integration Layer
 * Integrates .md XML command files with the core Claude Productivity Suite system
 */

const { MarkdownProcessor } = require('./markdown-processor');
// const { CommandProcessor } = require('./command-processor'); // Optional - loaded on demand

class CommandIntegrator {
  constructor() {
    this.mdProcessor = new MarkdownProcessor();
    this.commandProcessor = null; // Loaded on demand
    this.workflowExecutor = null; // Will be set by workflow executor
    this.activeWorkflows = new Map();
  }

  /**
   * Set workflow executor instance
   * @param {Object} workflowExecutor - Workflow executor instance
   */
  setWorkflowExecutor(workflowExecutor) {
    this.workflowExecutor = workflowExecutor;
  }

  /**
   * Execute command with full integration pipeline
   * @param {string} userInput - User input/command
   * @param {Object} sessionContext - Session context
   * @returns {Object} Execution result
   */
  async executeCommand(userInput, sessionContext) {
    try {
      console.log(`🔧 Integrating command: ${userInput}`);

      // 1. Parse user input to identify command
      const commandAnalysis = await this.analyzeUserInput(userInput, sessionContext);
      
      // 2. Resolve command against .md files
      const resolvedCommand = await this.resolveCommand(commandAnalysis, sessionContext);
      
      // 3. Build execution workflow
      const executionWorkflow = await this.buildExecutionWorkflow(
        resolvedCommand, commandAnalysis, sessionContext
      );
      
      // 4. Execute with integrated processor
      const result = await this.executeIntegratedWorkflow(
        executionWorkflow, sessionContext
      );
      
      // 5. Handle response and cleanup
      return await this.processExecutionResult(result, sessionContext);
      
    } catch (error) {
      console.error('Command integration error:', error);
      return this.handleIntegrationError(error, userInput, sessionContext);
    }
  }

  /**
   * Analyze user input to understand command intent
   * @param {string} userInput - Raw user input
   * @param {Object} sessionContext - Session context
   * @returns {Object} Command analysis
   */
  async analyzeUserInput(userInput, sessionContext) {
    const analysis = {
      originalInput: userInput,
      commandType: null,
      commandName: null,
      arguments: null,
      confidence: 0,
      intent: null
    };

    // Direct command (starts with /)
    if (userInput.trim().startsWith('/')) {
      const parts = userInput.trim().split(' ');
      analysis.commandType = 'direct';
      analysis.commandName = parts[0].substring(1); // Remove /
      analysis.arguments = parts.slice(1).join(' ');
      analysis.confidence = 0.9;
      analysis.intent = 'execute_command';
    }
    // Natural language
    else {
      analysis.commandType = 'natural';
      analysis.intent = await this.inferIntent(userInput, sessionContext);
      analysis.commandName = await this.mapIntentToCommand(analysis.intent, userInput);
      analysis.arguments = userInput;
      analysis.confidence = 0.7;
    }

    return analysis;
  }

  /**
   * Resolve command against available .md command files
   * @param {Object} commandAnalysis - Analyzed command
   * @param {Object} sessionContext - Session context
   * @returns {Object} Resolved command with .md metadata
   */
  async resolveCommand(commandAnalysis, sessionContext) {
    const { commandName, commandType } = commandAnalysis;
    
    // Find matching .md command file
    const parsedCommand = await this.mdProcessor.findCommand(commandName);
    
    if (!parsedCommand) {
      // Fallback to basic command processing
      return {
        type: 'fallback',
        commandName,
        analysis: commandAnalysis,
        hasWorkflow: false,
        useFallback: true
      };
    }

    // Resolve command chain if workflow exists
    const commandChain = parsedCommand.hasWorkflow() 
      ? await this.mdProcessor.resolveCommandChain(parsedCommand)
      : [];

    return {
      type: 'integrated',
      commandName,
      analysis: commandAnalysis,
      parsedCommand,
      commandChain,
      hasWorkflow: parsedCommand.hasWorkflow(),
      requiresRouting: parsedCommand.requiresRouting(),
      supportsCostOptimization: parsedCommand.supportsCostOptimization(),
      useFallback: false
    };
  }

  /**
   * Build execution workflow from resolved command
   * @param {Object} resolvedCommand - Resolved command structure
   * @param {Object} commandAnalysis - Original command analysis
   * @param {Object} sessionContext - Session context
   * @returns {Object} Execution workflow
   */
  async buildExecutionWorkflow(resolvedCommand, commandAnalysis, sessionContext) {
    const workflow = {
      id: this.generateWorkflowId(),
      type: resolvedCommand.type,
      command: resolvedCommand.commandName,
      steps: [],
      context: sessionContext,
      metadata: {
        startTime: Date.now(),
        userInput: commandAnalysis.originalInput,
        estimatedDuration: 0,
        requiresRouting: resolvedCommand.requiresRouting,
        supportsCostOptimization: resolvedCommand.supportsCostOptimization
      }
    };

    if (resolvedCommand.useFallback) {
      // Simple fallback workflow
      workflow.steps = [{
        id: 'fallback-execution',
        type: 'fallback',
        command: resolvedCommand.commandName,
        arguments: commandAnalysis.arguments,
        condition: { type: 'always', result: true }
      }];
    } else {
      // Build workflow from command chain
      workflow.steps = resolvedCommand.commandChain.map((step, index) => ({
        id: `step-${index + 1}`,
        order: index + 1,
        ...step,
        status: 'pending'
      }));
      
      // Calculate estimated duration
      workflow.metadata.estimatedDuration = workflow.steps.reduce(
        (total, step) => total + (step.executionContext?.estimatedDuration || 60), 0
      );
    }

    return workflow;
  }

  /**
   * Execute integrated workflow
   * @param {Object} workflow - Execution workflow
   * @param {Object} sessionContext - Session context
   * @returns {Object} Execution result
   */
  async executeIntegratedWorkflow(workflow, sessionContext) {
    console.log(`🚀 Executing workflow: ${workflow.command} (${workflow.steps.length} steps)`);
    
    // Store active workflow
    this.activeWorkflows.set(workflow.id, workflow);
    
    try {
      if (workflow.type === 'fallback') {
        return await this.executeFallbackWorkflow(workflow, sessionContext);
      } else {
        return await this.executeFullWorkflow(workflow, sessionContext);
      }
    } finally {
      // Cleanup
      this.activeWorkflows.delete(workflow.id);
    }
  }

  /**
   * Execute fallback workflow (no .md integration)
   * @param {Object} workflow - Workflow to execute
   * @param {Object} sessionContext - Session context
   * @returns {Object} Execution result
   */
  async executeFallbackWorkflow(workflow, sessionContext) {
    const step = workflow.steps[0];
    
    console.log(`📋 Executing fallback command: ${step.command}`);
    
    try {
      // Load command processor on demand
      if (!this.commandProcessor) {
        const { CommandProcessor } = require('./command-processor');
        this.commandProcessor = new CommandProcessor();
      }
      
      // Use existing command processor
      const result = await this.commandProcessor.processCommand(
        step.command, 
        step.arguments, 
        sessionContext
      );

      return {
        success: true,
        type: 'fallback',
        workflow: workflow,
        result: result,
        message: 'Command executed successfully (fallback mode)',
        executionTime: Date.now() - workflow.metadata.startTime
      };
    } catch (error) {
      console.warn('Command processor not available, using basic fallback');
      
      // Basic fallback without command processor
      return {
        success: true,
        type: 'basic_fallback',
        workflow: workflow,
        result: {
          success: true,
          message: `Processed command: ${step.command}`,
          command: step.command,
          arguments: step.arguments
        },
        message: 'Command processed with basic fallback',
        executionTime: Date.now() - workflow.metadata.startTime
      };
    }
  }

  /**
   * Execute full integrated workflow
   * @param {Object} workflow - Workflow to execute
   * @param {Object} sessionContext - Session context
   * @returns {Object} Execution result
   */
  async executeFullWorkflow(workflow, sessionContext) {
    if (!this.workflowExecutor) {
      throw new Error('Workflow executor not available - falling back to basic processing');
    }

    console.log(`⚙️ Executing integrated workflow: ${workflow.command}`);
    
    const result = await this.workflowExecutor.executeWorkflow(
      workflow.steps, 
      sessionContext,
      {
        workflowId: workflow.id,
        metadata: workflow.metadata
      }
    );

    return {
      success: result.success,
      type: 'integrated',
      workflow: workflow,
      result: result,
      message: result.success 
        ? 'Workflow completed successfully' 
        : 'Workflow completed with issues',
      executionTime: Date.now() - workflow.metadata.startTime,
      stepsCompleted: result.completedSteps || 0,
      totalSteps: workflow.steps.length
    };
  }

  /**
   * Process execution result and prepare response
   * @param {Object} executionResult - Raw execution result
   * @param {Object} sessionContext - Session context
   * @returns {Object} Processed result
   */
  async processExecutionResult(executionResult, sessionContext) {
    const processedResult = {
      success: executionResult.success,
      message: executionResult.message,
      type: executionResult.type,
      executionTime: executionResult.executionTime,
      
      // User-friendly explanation
      userExplanation: {
        summary: this.generateExecutionSummary(executionResult),
        details: this.generateExecutionDetails(executionResult),
        nextSteps: await this.generateNextSteps(executionResult, sessionContext)
      },

      // Technical details (for debugging)
      technical: {
        workflowId: executionResult.workflow?.id,
        stepsExecuted: executionResult.stepsCompleted,
        totalSteps: executionResult.totalSteps,
        executionType: executionResult.type
      }
    };

    // Add recommendations if available
    const recommendations = await this.generateRecommendations(
      executionResult, sessionContext
    );
    if (recommendations.length > 0) {
      processedResult.recommendations = {
        immediate: recommendations[0],
        alternatives: recommendations.slice(1)
      };
    }

    return processedResult;
  }

  /**
   * Handle integration errors gracefully
   * @param {Error} error - Error that occurred
   * @param {string} userInput - Original user input
   * @param {Object} sessionContext - Session context
   * @returns {Object} Error response
   */
  async handleIntegrationError(error, userInput, sessionContext) {
    console.error('Integration error:', error.message);

    return {
      success: false,
      message: 'I encountered an issue processing your command, but I can still help',
      error: {
        type: 'integration_error',
        message: error.message,
        userFriendly: this.translateErrorForUser(error)
      },
      recovery: {
        suggestion: 'Try using a simpler command format or use /help to see available commands',
        fallbackAvailable: true
      },
      userExplanation: {
        summary: 'Command processing hit a snag, but we can work around it',
        details: [
          'The advanced command processing had an issue',
          'Your command can still be handled in basic mode',
          'All core functionality remains available'
        ]
      }
    };
  }

  /**
   * Infer intent from natural language input
   * @param {string} input - User input
   * @param {Object} context - Session context
   * @returns {string} Inferred intent
   */
  async inferIntent(input, context) {
    const intentPatterns = {
      'build_app': ['build', 'create', 'make', 'develop', 'app', 'application'],
      'fix_issue': ['fix', 'repair', 'broken', 'error', 'problem', 'issue'],
      'improve_design': ['better', 'improve', 'enhance', 'design', 'look', 'ui'],
      'deploy_app': ['deploy', 'publish', 'online', 'live', 'launch'],
      'show_progress': ['progress', 'status', 'show', 'check', 'see'],
      'help': ['help', 'how', 'what', 'commands']
    };

    const lowerInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return intent;
      }
    }

    return 'general_request';
  }

  /**
   * Map intent to command name
   * @param {string} intent - Inferred intent
   * @param {string} input - Original input
   * @returns {string} Command name
   */
  async mapIntentToCommand(intent, input) {
    const intentToCommand = {
      'build_app': 'build-my-app',
      'fix_issue': 'fix-whatever-is-broken',
      'improve_design': 'make-it-look-better',
      'deploy_app': 'deploy-when-ready',
      'show_progress': 'show-me-progress',
      'help': 'help',
      'general_request': 'build-my-app' // Default
    };

    return intentToCommand[intent] || 'help';
  }

  /**
   * Generate execution summary for user
   * @param {Object} executionResult - Execution result
   * @returns {string} User-friendly summary
   */
  generateExecutionSummary(executionResult) {
    if (executionResult.type === 'fallback') {
      return 'Command processed successfully using standard approach';
    } else {
      const steps = executionResult.stepsCompleted || 0;
      const total = executionResult.totalSteps || 0;
      return `Workflow completed: ${steps}/${total} steps executed successfully`;
    }
  }

  /**
   * Generate execution details for user
   * @param {Object} executionResult - Execution result
   * @returns {Array} Array of detail strings
   */
  generateExecutionDetails(executionResult) {
    const details = [];
    
    if (executionResult.type === 'integrated') {
      details.push('Used advanced workflow processing');
      details.push(`Executed ${executionResult.stepsCompleted || 0} workflow steps`);
      
      if (executionResult.workflow?.metadata?.supportsCostOptimization) {
        details.push('Applied cost optimization patterns');
      }
      
      if (executionResult.workflow?.metadata?.requiresRouting) {
        details.push('Used intelligent agent routing');
      }
    } else {
      details.push('Used standard command processing');
      details.push('All core functionality applied');
    }

    return details;
  }

  /**
   * Generate next steps for user
   * @param {Object} executionResult - Execution result
   * @param {Object} sessionContext - Session context
   * @returns {Array} Array of next step suggestions
   */
  async generateNextSteps(executionResult, sessionContext) {
    const nextSteps = [];

    if (executionResult.success) {
      nextSteps.push('Your command completed successfully');
      
      if (executionResult.workflow?.command === 'build-my-app') {
        nextSteps.push('You can now use /show-me-progress to see your app');
        nextSteps.push('Or use /make-it-look-better to improve the design');
      }
    } else {
      nextSteps.push('Try using /fix-whatever-is-broken to resolve issues');
      nextSteps.push('Or use /help to see all available commands');
    }

    return nextSteps;
  }

  /**
   * Generate recommendations based on execution result
   * @param {Object} executionResult - Execution result
   * @param {Object} sessionContext - Session context
   * @returns {Array} Array of recommendations
   */
  async generateRecommendations(executionResult, sessionContext) {
    const recommendations = [];

    if (executionResult.success && executionResult.type === 'integrated') {
      recommendations.push({
        command: '/show-me-progress',
        reason: 'See the results of your completed workflow'
      });
    }

    if (executionResult.type === 'fallback') {
      recommendations.push({
        command: '/help',
        reason: 'Learn about advanced commands for better integration'
      });
    }

    return recommendations;
  }

  /**
   * Translate technical errors for users
   * @param {Error} error - Technical error
   * @returns {string} User-friendly error message
   */
  translateErrorForUser(error) {
    const errorTranslations = {
      'Failed to parse command file': 'Command file format issue - using basic processing',
      'Workflow executor not available': 'Advanced features temporarily unavailable',
      'Command not found': 'Command not recognized - try /help for available options'
    };

    for (const [technical, friendly] of Object.entries(errorTranslations)) {
      if (error.message.includes(technical)) {
        return friendly;
      }
    }

    return 'Something unexpected happened, but basic functionality is still available';
  }

  /**
   * Generate unique workflow ID
   * @returns {string} Unique workflow ID
   */
  generateWorkflowId() {
    return `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get active workflows (for monitoring)
   * @returns {Map} Active workflows
   */
  getActiveWorkflows() {
    return new Map(this.activeWorkflows);
  }

  /**
   * Clear cache and reset state
   */
  reset() {
    this.mdProcessor.clearCache();
    this.xmlParser.clearCache();
    this.activeWorkflows.clear();
    this.integrationStats = {
      totalExecutions: 0,
      successfulExecutions: 0,
      tokenSavings: 0,
      parallelExecutions: 0
    };
    console.log('🔄 Command Integrator reset completed');
  }
}

module.exports = { CommandIntegrator };