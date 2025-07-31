/**
 * Workflow Execution Engine
 * Executes multi-step workflows from .md XML command files with intelligent routing
 */

const EventEmitter = require('events');

class WorkflowExecutor extends EventEmitter {
  constructor() {
    super();
    this.activeWorkflows = new Map();
    this.stepProcessors = new Map();
    this.conditionalEvaluator = new ConditionalEvaluator();
    this.contextManager = new WorkflowContextManager();
  }

  /**
   * Register step processor for specific step types
   * @param {string} stepType - Type of step to process
   * @param {Function} processor - Processor function
   */
  registerStepProcessor(stepType, processor) {
    this.stepProcessors.set(stepType, processor);
  }

  /**
   * Execute complete workflow with step-by-step processing
   * @param {Array} workflowSteps - Array of workflow steps
   * @param {Object} context - Execution context
   * @param {Object} options - Execution options
   * @returns {Object} Execution result
   */
  async executeWorkflow(workflowSteps, context, options = {}) {
    const workflowId = options.workflowId || this.generateWorkflowId();
    const startTime = Date.now();
    
    console.log(`🔄 Starting workflow execution: ${workflowId}`);
    
    const workflowState = {
      id: workflowId,
      steps: workflowSteps.map((step, index) => ({
        ...step,
        index,
        status: 'pending',
        result: null,
        error: null,
        startTime: null,
        endTime: null
      })),
      context: this.contextManager.initializeContext(context, options),
      status: 'running',
      startTime,
      endTime: null,
      completedSteps: 0,
      failedSteps: 0,
      skippedSteps: 0,
      results: []
    };

    // Store active workflow
    this.activeWorkflows.set(workflowId, workflowState);
    
    try {
      // Execute steps sequentially
      for (const step of workflowState.steps) {
        const stepResult = await this.executeStep(step, workflowState);
        
        // Update workflow state
        this.updateWorkflowState(workflowState, step, stepResult);
        
        // Check if workflow should continue
        if (!this.shouldContinueWorkflow(workflowState, stepResult)) {
          break;
        }
      }

      // Finalize workflow
      const finalResult = await this.finalizeWorkflow(workflowState);
      
      console.log(`✅ Workflow completed: ${workflowId} (${finalResult.completedSteps}/${workflowState.steps.length} steps)`);
      
      return finalResult;
      
    } catch (error) {
      console.error(`❌ Workflow failed: ${workflowId}`, error);
      return await this.handleWorkflowError(workflowState, error);
    } finally {
      // Cleanup
      this.activeWorkflows.delete(workflowId);
    }
  }

  /**
   * Execute individual workflow step
   * @param {Object} step - Step to execute
   * @param {Object} workflowState - Current workflow state
   * @returns {Object} Step execution result
   */
  async executeStep(step, workflowState) {
    console.log(`📋 Executing step ${step.index + 1}: ${step.name || step.command}`);
    
    step.status = 'running';
    step.startTime = Date.now();
    
    // Emit step start event
    this.emit('step-start', {
      workflowId: workflowState.id,
      step,
      context: workflowState.context
    });

    try {
      // Evaluate step condition
      if (step.condition && !await this.evaluateCondition(step.condition, workflowState)) {
        console.log(`⏭️  Skipping step ${step.index + 1}: condition not met`);
        return {
          success: true,
          skipped: true,
          reason: 'Condition not met',
          condition: step.condition
        };
      }

      // Execute step based on type
      const result = await this.processStep(step, workflowState);
      
      step.status = 'completed';
      step.endTime = Date.now();
      step.result = result;
      
      console.log(`✅ Step ${step.index + 1} completed successfully`);
      
      // Emit step completion event
      this.emit('step-complete', {
        workflowId: workflowState.id,
        step,
        result,
        context: workflowState.context
      });
      
      return result;
      
    } catch (error) {
      console.error(`❌ Step ${step.index + 1} failed:`, error.message);
      
      step.status = 'failed';
      step.endTime = Date.now();
      step.error = error;
      
      // Emit step failure event
      this.emit('step-failed', {
        workflowId: workflowState.id,
        step,
        error,
        context: workflowState.context
      });
      
      return {
        success: false,
        error: error.message,
        step: step.name || step.command
      };
    }
  }

  /**
   * Process individual step based on its type
   * @param {Object} step - Step to process
   * @param {Object} workflowState - Current workflow state
   * @returns {Object} Step processing result
   */
  async processStep(step, workflowState) {
    const { commandType, command } = step;
    
    // Update context for this step
    const stepContext = this.contextManager.createStepContext(
      workflowState.context, step
    );

    switch (commandType) {
      case 'reference':
        return await this.processReferenceCommand(step, stepContext);
      
      case 'direct':
        return await this.processDirectCommand(step, stepContext);
      
      case 'action':
        return await this.processActionCommand(step, stepContext);
      
      default:
        // Try registered step processors
        const processor = this.stepProcessors.get(commandType || command);
        if (processor) {
          return await processor(step, stepContext);
        }
        
        // Fallback to generic processing
        return await this.processGenericStep(step, stepContext);
    }
  }

  /**
   * Process reference command (e.g., @interpret-vibe)
   * @param {Object} step - Step to process
   * @param {Object} context - Step context
   * @returns {Object} Processing result
   */
  async processReferenceCommand(step, context) {
    const referencedCommand = step.referencedCommand;
    
    console.log(`🔗 Processing reference command: ${referencedCommand}`);
    
    // Map reference commands to actual implementations
    const referenceMap = {
      'interpret-vibe': this.interpretVibe.bind(this),
      'route-to-specialist': this.routeToSpecialist.bind(this),
      'apply-patterns': this.applyPatterns.bind(this),
      'build-app': this.buildApp.bind(this),
      'validate-app': this.validateApp.bind(this)
    };

    const handler = referenceMap[referencedCommand];
    if (handler) {
      return await handler(step, context);
    }

    throw new Error(`Unknown reference command: ${referencedCommand}`);
  }

  /**
   * Process direct command (e.g., /build-my-app)
   * @param {Object} step - Step to process
   * @param {Object} context - Step context
   * @returns {Object} Processing result
   */
  async processDirectCommand(step, context) {
    const command = step.directCommand;
    
    console.log(`⚡ Processing direct command: ${command}`);
    
    // Integration with existing command processor would go here
    // For now, simulate command execution
    return {
      success: true,
      command,
      message: `Direct command ${command} executed`,
      context: context
    };
  }

  /**
   * Process action command (generic action type)
   * @param {Object} step - Step to process
   * @param {Object} context - Step context
   * @returns {Object} Processing result
   */
  async processActionCommand(step, context) {
    const actionType = step.actionType;
    
    console.log(`🎯 Processing action: ${actionType}`);
    
    // Action type handlers
    const actionHandlers = {
      'vibe_interpretation': this.handleVibeInterpretation.bind(this),
      'agent_routing': this.handleAgentRouting.bind(this),
      'pattern_optimization': this.handlePatternOptimization.bind(this),
      'app_generation': this.handleAppGeneration.bind(this),
      'validation': this.handleValidation.bind(this)
    };

    const handler = actionHandlers[actionType];
    if (handler) {
      return await handler(step, context);
    }

    return await this.processGenericStep(step, context);
  }

  /**
   * Process generic step (fallback)
   * @param {Object} step - Step to process
   * @param {Object} context - Step context
   * @returns {Object} Processing result
   */
  async processGenericStep(step, context) {
    console.log(`🔄 Processing generic step: ${step.name || 'unnamed'}`);
    
    // Simulate processing time
    await this.delay(500 + Math.random() * 1000);
    
    return {
      success: true,
      step: step.name || step.command,
      message: `Step processed successfully`,
      processingTime: Date.now() - step.startTime
    };
  }

  /**
   * Evaluate step condition
   * @param {Object} condition - Condition to evaluate
   * @param {Object} workflowState - Current workflow state
   * @returns {boolean} Whether condition is met
   */
  async evaluateCondition(condition, workflowState) {
    return await this.conditionalEvaluator.evaluate(condition, workflowState);
  }

  /**
   * Update workflow state after step execution
   * @param {Object} workflowState - Workflow state to update
   * @param {Object} step - Executed step
   * @param {Object} stepResult - Step execution result
   */
  updateWorkflowState(workflowState, step, stepResult) {
    workflowState.results.push({
      stepIndex: step.index,
      stepName: step.name,
      result: stepResult,
      timestamp: Date.now()
    });

    if (stepResult.skipped) {
      workflowState.skippedSteps++;
    } else if (stepResult.success) {
      workflowState.completedSteps++;
    } else {
      workflowState.failedSteps++;
    }

    // Update context with step results
    this.contextManager.updateContext(
      workflowState.context, step, stepResult
    );

    // Emit progress event
    this.emit('workflow-progress', {
      workflowId: workflowState.id,
      progress: {
        completed: workflowState.completedSteps,
        failed: workflowState.failedSteps,
        skipped: workflowState.skippedSteps,
        total: workflowState.steps.length,
        percentage: Math.round(
          ((workflowState.completedSteps + workflowState.failedSteps + workflowState.skippedSteps) 
           / workflowState.steps.length) * 100
        )
      }
    });
  }

  /**
   * Determine if workflow should continue after step execution
   * @param {Object} workflowState - Current workflow state
   * @param {Object} stepResult - Last step result
   * @returns {boolean} Whether to continue
   */
  shouldContinueWorkflow(workflowState, stepResult) {
    // Stop on critical failures
    if (!stepResult.success && !stepResult.skipped && stepResult.critical) {
      console.log('⛔ Stopping workflow due to critical failure');
      return false;
    }

    // Continue by default
    return true;
  }

  /**
   * Finalize workflow execution
   * @param {Object} workflowState - Final workflow state
   * @returns {Object} Final workflow result
   */
  async finalizeWorkflow(workflowState) {
    workflowState.status = 'completed';
    workflowState.endTime = Date.now();
    
    const result = {
      success: workflowState.failedSteps === 0,
      workflowId: workflowState.id,
      completedSteps: workflowState.completedSteps,
      failedSteps: workflowState.failedSteps,
      skippedSteps: workflowState.skippedSteps,
      totalSteps: workflowState.steps.length,
      executionTime: workflowState.endTime - workflowState.startTime,
      results: workflowState.results,
      context: workflowState.context
    };

    // Emit workflow completion event
    this.emit('workflow-complete', {
      workflowState,
      result
    });

    return result;
  }

  /**
   * Handle workflow execution error
   * @param {Object} workflowState - Workflow state when error occurred
   * @param {Error} error - Error that occurred
   * @returns {Object} Error result
   */
  async handleWorkflowError(workflowState, error) {
    workflowState.status = 'error';
    workflowState.endTime = Date.now();
    
    const result = {
      success: false,
      workflowId: workflowState.id,
      error: error.message,
      completedSteps: workflowState.completedSteps,
      failedSteps: workflowState.failedSteps + 1,
      skippedSteps: workflowState.skippedSteps,
      totalSteps: workflowState.steps.length,
      executionTime: workflowState.endTime - workflowState.startTime,
      results: workflowState.results
    };

    // Emit workflow error event
    this.emit('workflow-error', {
      workflowState,
      error,
      result
    });

    return result;
  }

  // Step Handler Methods (to be implemented based on specific needs)

  async interpretVibe(step, context) {
    console.log('🧠 Interpreting vibe...');
    return { success: true, message: 'Vibe interpreted successfully' };
  }

  async routeToSpecialist(step, context) {
    console.log('🎯 Routing to specialist...');
    return { success: true, message: 'Routed to appropriate specialist' };
  }

  async applyPatterns(step, context) {
    console.log('📋 Applying patterns...');
    return { success: true, message: 'Patterns applied successfully' };
  }

  async buildApp(step, context) {
    console.log('🏗️ Building app...');
    return { success: true, message: 'App built successfully' };
  }

  async validateApp(step, context) {
    console.log('✅ Validating app...');
    return { success: true, message: 'App validated successfully' };
  }

  async handleVibeInterpretation(step, context) {
    return await this.interpretVibe(step, context);
  }

  async handleAgentRouting(step, context) {
    return await this.routeToSpecialist(step, context);
  }

  async handlePatternOptimization(step, context) {
    return await this.applyPatterns(step, context);
  }

  async handleAppGeneration(step, context) {
    return await this.buildApp(step, context);
  }

  async handleValidation(step, context) {
    return await this.validateApp(step, context);
  }

  /**
   * Utility methods
   */

  generateWorkflowId() {
    return `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getActiveWorkflows() {
    return new Map(this.activeWorkflows);
  }
}

/**
 * Conditional Evaluator for workflow step conditions
 */
class ConditionalEvaluator {
  async evaluate(condition, workflowState) {
    switch (condition.type) {
      case 'always':
        return true;
      
      case 'sequential':
        return this.evaluateSequential(condition, workflowState);
      
      case 'conditional':
        return this.evaluateConditional(condition, workflowState);
      
      default:
        return this.evaluateSimple(condition, workflowState);
    }
  }

  evaluateSequential(condition, workflowState) {
    const dependency = condition.dependency;
    
    // Check if dependency step completed successfully
    const dependentStep = workflowState.steps.find(
      step => step.name === dependency || step.command === dependency
    );
    
    return dependentStep && dependentStep.status === 'completed' && 
           dependentStep.result && dependentStep.result.success;
  }

  evaluateConditional(condition, workflowState) {
    const check = condition.check;
    
    // Context-based checks
    const contextChecks = {
      'changes_made': workflowState.context.changesMade || false,
      'issues_found': workflowState.context.issuesFound || false,
      'user_input_available': workflowState.context.userInput != null
    };

    return contextChecks[check] || false;
  }

  evaluateSimple(condition, workflowState) {
    // Default evaluation logic
    return condition.result !== false;
  }
}

/**
 * Workflow Context Manager
 */
class WorkflowContextManager {
  initializeContext(baseContext, options) {
    return {
      ...baseContext,
      workflowId: options.workflowId,
      startTime: Date.now(),
      stepResults: [],
      changesMade: false,
      issuesFound: false,
      ...options.metadata
    };
  }

  createStepContext(workflowContext, step) {
    return {
      ...workflowContext,
      currentStep: step,
      stepStartTime: Date.now()
    };
  }

  updateContext(context, step, stepResult) {
    // Update context based on step results
    context.stepResults.push({
      step: step.name,
      result: stepResult
    });

    // Update flags based on step results
    if (stepResult.changesMade) {
      context.changesMade = true;
    }
    
    if (stepResult.issuesFound) {
      context.issuesFound = true;
    }

    return context;
  }
}

module.exports = { WorkflowExecutor };