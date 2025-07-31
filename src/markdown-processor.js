/**
 * Markdown Processor - Simple parser for markdown commands with XML metadata
 * Handles the core parsing and execution logic for the productivity suite
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

class MarkdownProcessor {
  constructor() {
    this.commandsDir = path.join(__dirname, '..', 'commands');
    this.agentsDir = path.join(__dirname, '..', 'agents');
    this.templatesDir = path.join(__dirname, '..', 'templates');
    this.patternsDir = path.join(__dirname, '..', 'patterns');
    
    this.loadedCommands = new Map();
    this.loadedAgents = new Map();
    this.loadedTemplates = new Map();
    this.loadedPatterns = new Map();
    
    this.tokenOptimizer = new TokenOptimizer();
  }

  /**
   * Parse and execute a command
   */
  async processCommand(commandName, userInput, sessionContext = {}) {
    try {
      // Load command definition
      const command = await this.loadCommand(commandName);
      if (!command) {
        throw new Error(`Unknown command: ${commandName}`);
      }

      // Parse user input based on command requirements
      const parsedInput = await this.parseUserInput(userInput, command, sessionContext);
      
      // Execute the command workflow
      const result = await this.executeCommand(command, parsedInput, sessionContext);
      
      // Apply token optimizations
      const optimizedResult = await this.tokenOptimizer.optimizeResponse(result, sessionContext);
      
      return optimizedResult;
      
    } catch (error) {
      return this.handleError(error, commandName, userInput, sessionContext);
    }
  }

  /**
   * Load and parse a command markdown file
   */
  async loadCommand(commandName) {
    const cacheKey = commandName;
    if (this.loadedCommands.has(cacheKey)) {
      return this.loadedCommands.get(cacheKey);
    }

    const commandFile = path.join(this.commandsDir, `${commandName}.md`);
    if (!fs.existsSync(commandFile)) {
      return null;
    }

    try {
      const content = fs.readFileSync(commandFile, 'utf8');
      const parsed = this.parseMarkdownWithMeta(content);
      
      this.loadedCommands.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error loading command ${commandName}:`, error);
      return null;
    }
  }

  /**
   * Parse markdown content with XML metadata
   */
  parseMarkdownWithMeta(content) {
    const result = {
      metadata: {},
      sections: {},
      workflow: [],
      questions: [],
      templates: [],
      patterns: []
    };

    // Extract XML metadata blocks
    const xmlBlocks = this.extractXMLBlocks(content);
    
    // Parse command_meta
    if (xmlBlocks.command_meta) {
      result.metadata = this.parseXMLBlock(xmlBlocks.command_meta);
    }

    // Parse workflow steps
    if (xmlBlocks.workflow) {
      result.workflow = this.parseWorkflowSteps(xmlBlocks.workflow);
    }

    // Parse questions
    if (xmlBlocks.questions) {
      result.questions = this.parseQuestions(xmlBlocks.questions);
    }

    // Parse templates
    if (xmlBlocks.template_mapping) {
      result.templates = this.parseTemplateMappings(xmlBlocks.template_mapping);
    }

    // Parse content sections
    const sections = this.parseMarkdownSections(content);
    result.sections = sections;

    return result;
  }

  /**
   * Extract XML blocks from markdown content
   */
  extractXMLBlocks(content) {
    const blocks = {};
    const xmlBlockRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    
    let match;
    while ((match = xmlBlockRegex.exec(content)) !== null) {
      const [, tagName, blockContent] = match;
      blocks[tagName] = blockContent.trim();
    }

    return blocks;
  }

  /**
   * Parse XML block content into structured data
   */
  parseXMLBlock(xmlContent) {
    const result = {};
    
    // Simple XML parsing for our specific format
    const tagRegex = /<(\w+)>([^<]*)<\/\1>/g;
    let match;
    
    while ((match = tagRegex.exec(xmlContent)) !== null) {
      const [, tagName, tagValue] = match;
      
      // Handle special parsing for certain fields
      if (tagName === 'patterns') {
        result[tagName] = this.parseArray(tagValue);
      } else if (tagName === 'confidence' || tagName === 'success_rate') {
        result[tagName] = parseFloat(tagValue);
      } else if (tagName === 'token_estimate') {
        result[tagName] = parseInt(tagValue);
      } else {
        result[tagName] = tagValue.trim();
      }
    }

    return result;
  }

  /**
   * Parse workflow steps from XML
   */
  parseWorkflowSteps(workflowXML) {
    const steps = [];
    const stepRegex = /<step number="(\d+)"[^>]*>([\s\S]*?)<\/step>/g;
    
    let match;
    while ((match = stepRegex.exec(workflowXML)) !== null) {
      const [, stepNumber, stepContent] = match;
      
      const step = {
        number: parseInt(stepNumber),
        ...this.parseXMLBlock(stepContent)
      };
      
      steps.push(step);
    }

    return steps.sort((a, b) => a.number - b.number);
  }

  /**
   * Parse questions from XML
   */
  parseQuestions(questionsXML) {
    const questions = [];
    const questionRegex = /<question[^>]*>([\s\S]*?)<\/question>/g;
    
    let match;
    while ((match = questionRegex.exec(questionsXML)) !== null) {
      const [fullMatch, questionContent] = match;
      
      // Extract attributes
      const attrs = this.parseXMLAttributes(fullMatch);
      const content = this.parseXMLBlock(questionContent);
      
      questions.push({ ...attrs, ...content });
    }

    return questions;
  }

  /**
   * Parse XML attributes
   */
  parseXMLAttributes(xmlTag) {
    const attrs = {};
    const attrRegex = /(\w+)="([^"]*)"/g;
    
    let match;
    while ((match = attrRegex.exec(xmlTag)) !== null) {
      const [, attrName, attrValue] = match;
      attrs[attrName] = attrValue;
    }

    return attrs;
  }

  /**
   * Parse user input based on command requirements
   */
  async parseUserInput(userInput, command, sessionContext) {
    const parsed = {
      originalInput: userInput,
      type: command.metadata.name,
      sessionId: sessionContext.sessionId || 'default',
      userId: sessionContext.userId || 'anonymous',
      timestamp: new Date()
    };

    // If command has questions, we might need to ask them
    if (command.questions && command.questions.length > 0) {
      parsed.needsQuestions = this.determineNeededQuestions(userInput, command.questions);
    }

    // Extract intent and parameters from input
    parsed.intent = this.extractIntent(userInput, command);
    parsed.parameters = this.extractParameters(userInput, command);

    return parsed;
  }

  /**
   * Execute a command workflow
   */
  async executeCommand(command, parsedInput, sessionContext) {
    const execution = {
      command: command.metadata.name,
      startTime: Date.now(),
      steps: [],
      currentStep: 0,
      totalSteps: command.workflow.length,
      context: sessionContext
    };

    try {
      // Execute each workflow step
      for (const step of command.workflow) {
        execution.currentStep = step.number;
        
        const stepResult = await this.executeWorkflowStep(step, parsedInput, execution);
        execution.steps.push(stepResult);
        
        // Notify progress if callback provided
        if (sessionContext.onProgress) {
          sessionContext.onProgress(step.number, step.user_message || step.title, {
            percentage: (step.number / execution.totalSteps) * 100,
            step: stepResult
          });
        }
      }

      // Generate success response
      const response = await this.generateSuccessResponse(command, execution, parsedInput);
      
      return {
        success: true,
        executionTime: Date.now() - execution.startTime,
        ...response
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - execution.startTime,
        completedSteps: execution.steps.length,
        totalSteps: execution.totalSteps
      };
    }
  }

  /**
   * Execute a single workflow step
   */
  async executeWorkflowStep(step, parsedInput, execution) {
    const stepResult = {
      number: step.number,
      title: step.title,
      agent: step.agent,
      startTime: Date.now(),
      actions: []
    };

    try {
      // Load agent if specified
      let agent = null;
      if (step.agent) {
        agent = await this.loadAgent(step.agent);
      }

      // Execute step actions
      if (step.actions) {
        for (const action of step.actions) {
          const actionResult = await this.executeAction(action, agent, parsedInput, execution);
          stepResult.actions.push(actionResult);
        }
      }

      stepResult.success = true;
      stepResult.executionTime = Date.now() - stepResult.startTime;
      
      return stepResult;

    } catch (error) {
      stepResult.success = false;
      stepResult.error = error.message;
      stepResult.executionTime = Date.now() - stepResult.startTime;
      
      throw error;
    }
  }

  /**
   * Load agent definition
   */
  async loadAgent(agentName) {
    const cacheKey = agentName;
    if (this.loadedAgents.has(cacheKey)) {
      return this.loadedAgents.get(cacheKey);
    }

    const agentFile = path.join(this.agentsDir, `${agentName}.md`);
    if (!fs.existsSync(agentFile)) {
      // Return a basic agent if specific one not found
      return { name: agentName, capabilities: [] };
    }

    try {
      const content = fs.readFileSync(agentFile, 'utf8');
      const parsed = this.parseMarkdownWithMeta(content);
      
      this.loadedAgents.set(cacheKey, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error loading agent ${agentName}:`, error);
      return { name: agentName, capabilities: [], error: error.message };
    }
  }

  /**
   * Generate success response from templates
   */
  async generateSuccessResponse(command, execution, parsedInput) {
    const responseTemplate = command.sections.success_response || 
                            command.sections.success_responses;

    if (!responseTemplate) {
      return {
        message: `${command.metadata.name} completed successfully!`,
        executionSteps: execution.steps.length,
        totalTime: execution.executionTime
      };
    }

    // Process template variables
    const processed = await this.processTemplate(responseTemplate, {
      command: command.metadata.name,
      execution,
      input: parsedInput,
      steps: execution.steps
    });

    return {
      message: processed.message || `${command.metadata.name} completed successfully!`,
      details: processed.details,
      nextSteps: processed.nextSteps,
      userExplanation: processed.user_friendly_explanation,
      executionSteps: execution.steps.length,
      totalTime: Date.now() - execution.startTime
    };
  }

  /**
   * Process template with variables
   */
  async processTemplate(template, variables) {
    let processed = template;

    // Simple template variable replacement
    const variableRegex = /\{\{(\w+)\}\}/g;
    processed = processed.replace(variableRegex, (match, varName) => {
      return variables[varName] || match;
    });

    // Parse any structured content
    try {
      // If template contains YAML-like structure, parse it
      if (template.includes('message:') || template.includes('details:')) {
        return yaml.parse(processed);
      }
    } catch (error) {
      // If parsing fails, return as text
    }

    return { message: processed };
  }

  /**
   * Simple array parsing from string
   */
  parseArray(str) {
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        return JSON.parse(str);
      } catch (error) {
        // Fallback to simple comma splitting
        return str.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
      }
    }
    return [str];
  }

  /**
   * Extract intent from user input
   */
  extractIntent(userInput, command) {
    const input = userInput.toLowerCase();
    
    // Map common intents
    const intentMap = {
      build: ['build', 'create', 'make', 'start', 'new'],
      improve: ['better', 'improve', 'enhance', 'upgrade'],
      fix: ['fix', 'repair', 'broken', 'error', 'problem'],
      deploy: ['deploy', 'publish', 'online', 'live'],
      progress: ['progress', 'status', 'show', 'see']
    };

    for (const [intent, keywords] of Object.entries(intentMap)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  /**
   * Extract parameters from user input
   */
  extractParameters(userInput, command) {
    const params = {};
    
    // Extract quoted strings
    const quotedStrings = userInput.match(/"([^"]*)"/g);
    if (quotedStrings) {
      params.quotedContent = quotedStrings.map(str => str.replace(/"/g, ''));
    }

    // Extract app types
    const appTypes = ['website', 'store', 'blog', 'portfolio', 'app'];
    for (const type of appTypes) {
      if (userInput.toLowerCase().includes(type)) {
        params.appType = type;
        break;
      }
    }

    return params;
  }

  /**
   * Handle errors gracefully
   */
  handleError(error, commandName, userInput, sessionContext) {
    console.error(`Error processing command ${commandName}:`, error);

    return {
      success: false,
      message: "I encountered an issue, but I can help you resolve it.",
      error: {
        userFriendly: this.translateErrorForUser(error),
        technical: error.message
      },
      recovery: {
        suggestions: [
          "Try rephrasing your request in simpler terms",
          "Use '/help' to see available commands",
          "Try '/fix-whatever-is-broken' if something seems wrong"
        ]
      },
      command: commandName,
      originalInput: userInput
    };
  }

  /**
   * Translate technical errors to user-friendly messages
   */
  translateErrorForUser(error) {
    const errorMap = {
      'ENOENT': 'Could not find the requested file or command',
      'SyntaxError': 'There was a formatting issue with the command',
      'TypeError': 'Invalid input provided',
      'ReferenceError': 'Missing required information'
    };

    const errorType = error.constructor.name;
    return errorMap[errorType] || 
           errorMap[error.code] || 
           "Something unexpected happened, but I know how to handle it";
  }

  /**
   * Parse markdown sections
   */
  parseMarkdownSections(content) {
    const sections = {};
    const sectionRegex = /^## (.+)$/gm;
    
    let lastIndex = 0;
    let match;
    let lastSectionName = null;

    while ((match = sectionRegex.exec(content)) !== null) {
      if (lastSectionName) {
        sections[lastSectionName] = content.slice(lastIndex, match.index).trim();
      }
      
      lastSectionName = match[1].toLowerCase().replace(/\s+/g, '_');
      lastIndex = match.index + match[0].length;
    }

    // Handle the last section
    if (lastSectionName) {
      sections[lastSectionName] = content.slice(lastIndex).trim();
    }

    return sections;
  }

  /**
   * Determine which questions need to be asked
   */
  determineNeededQuestions(userInput, questions) {
    const needed = [];
    
    for (const question of questions) {
      if (question.required === 'true') {
        // Check if user input already answers this question
        const isAnswered = this.checkIfQuestionAnswered(userInput, question);
        if (!isAnswered) {
          needed.push(question);
        }
      }
    }

    return needed;
  }

  /**
   * Check if a question is already answered in user input
   */
  checkIfQuestionAnswered(userInput, question) {
    const input = userInput.toLowerCase();
    
    // Simple heuristic checks based on question type
    if (question.id === 'app-type') {
      const appTypes = ['website', 'store', 'blog', 'portfolio', 'app'];
      return appTypes.some(type => input.includes(type));
    }

    if (question.id === 'target-users') {
      const userTypes = ['customers', 'personal', 'friends', 'business', 'visitors'];
      return userTypes.some(type => input.includes(type));
    }

    return false;
  }

  /**
   * Execute an action (placeholder for actual implementation)
   */
  async executeAction(action, agent, parsedInput, execution) {
    // This is a simplified action execution
    // In a real implementation, this would call actual services
    
    return {
      action: action,
      agent: agent?.name || 'system',
      result: 'completed',
      timestamp: new Date()
    };
  }
}

/**
 * Token Optimizer - Handles pattern-based optimization
 */
class TokenOptimizer {
  constructor() {
    this.patterns = new Map();
    this.loadPatterns();
  }

  async loadPatterns() {
    // Load common patterns for token optimization
    this.patterns.set('app-template-selection', {
      reference: '[PATTERN:APP_TEMPLATE_SELECTION]',
      savings: 180,
      fullContent: 'Standard app type selection and template matching process...'
    });
    
    this.patterns.set('user-requirements', {
      reference: '[PATTERN:USER_REQUIREMENTS_FLOW]',
      savings: 95,
      fullContent: 'User requirement gathering and clarification workflow...'
    });
    
    this.patterns.set('gentle-questions', {
      reference: '[PATTERN:GENTLE_QUESTIONING]',
      savings: 120,
      fullContent: 'Non-intimidating question asking methodology...'
    });
  }

  async optimizeResponse(response, sessionContext) {
    if (!response.success) {
      return response; // Don't optimize error responses
    }

    let optimized = { ...response };
    let tokensSaved = 0;

    // Apply pattern-based optimizations
    for (const [patternName, pattern] of this.patterns) {
      if (optimized.message && optimized.message.includes(pattern.fullContent)) {
        optimized.message = optimized.message.replace(pattern.fullContent, pattern.reference);
        tokensSaved += pattern.savings;
      }
    }

    // Add optimization metadata
    if (tokensSaved > 0) {
      optimized.tokenOptimization = {
        saved: tokensSaved,
        patterns: Array.from(this.patterns.keys()),
        efficiency: `${Math.round((tokensSaved / 1000) * 100)}% reduction`
      };
    }

    return optimized;
  }
}

module.exports = { MarkdownProcessor, TokenOptimizer };