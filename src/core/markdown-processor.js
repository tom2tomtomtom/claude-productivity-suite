/**
 * Enhanced Markdown Processor for Command Files
 * Processes .md command files with XML metadata integration
 */

const fs = require('fs').promises;
const path = require('path');
const { XMLMetadataParser } = require('./xml-metadata-parser');

class MarkdownProcessor {
  constructor() {
    this.xmlParser = new XMLMetadataParser();
    this.commandsDir = path.join(__dirname, '../../commands');
    this.cache = new Map();
  }

  /**
   * Parse a command file with XML metadata and markdown content
   * @param {string} filePath - Path to the .md command file
   * @returns {Object} Parsed command structure
   */
  async parseCommandFile(filePath) {
    try {
      // Check cache first
      const cacheKey = filePath;
      const stats = await fs.stat(filePath);
      const cachedEntry = this.cache.get(cacheKey);
      
      if (cachedEntry && cachedEntry.mtime >= stats.mtime) {
        return cachedEntry.data;
      }

      // Read and parse file
      const content = await fs.readFile(filePath, 'utf-8');
      const parsedCommand = await this.parseContent(content, filePath);

      // Cache the result
      this.cache.set(cacheKey, {
        data: parsedCommand,
        mtime: stats.mtime
      });

      return parsedCommand;
    } catch (error) {
      throw new Error(`Failed to parse command file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse markdown content with XML metadata
   * @param {string} content - Raw markdown content
   * @param {string} filePath - Source file path
   * @returns {Object} Parsed command structure
   */
  async parseContent(content, filePath) {
    // Extract XML metadata
    const metadata = this.xmlParser.parseXMLMetadata(content);
    
    // Validate metadata
    const validation = this.xmlParser.validateMetadata(metadata);
    if (!validation.isValid) {
      console.warn(`Validation errors in ${filePath}:`, validation.errors);
    }

    // Parse markdown sections
    const markdownSections = this.parseMarkdownSections(content);
    
    // Extract command name from filename
    const commandName = path.basename(filePath, '.md');
    
    return {
      commandName,
      filePath,
      metadata,
      content: markdownSections,
      validation,
      lastModified: new Date(),
      
      // Convenience accessors
      getWorkflowSteps: () => metadata.workflow_steps || [],
      getErrorScenarios: () => metadata.error_scenarios || [],
      getValidationGates: () => metadata.validation_gates || [],
      getCommandMeta: () => metadata.command_meta || {},
      
      // Workflow execution helpers
      hasWorkflow: () => metadata.workflow_steps && metadata.workflow_steps.length > 0,
      requiresRouting: () => this.checkRoutingRequirement(metadata),
      supportsCostOptimization: () => this.checkCostOptimization(metadata)
    };
  }

  /**
   * Parse markdown sections (headings, content blocks)
   * @param {string} content - Markdown content
   * @returns {Object} Parsed sections
   */
  parseMarkdownSections(content) {
    const sections = {};
    
    // Remove XML blocks for markdown parsing
    const cleanContent = content.replace(/<[\s\S]*?>/g, '');
    
    // Split by headings
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const parts = cleanContent.split(headingRegex);
    
    let currentSection = null;
    for (let i = 0; i < parts.length; i += 3) {
      const beforeHeading = parts[i];
      const headingLevel = parts[i + 1];
      const headingText = parts[i + 2];
      
      if (headingLevel && headingText) {
        const sectionKey = headingText.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_');
        
        sections[sectionKey] = {
          level: headingLevel.length,
          title: headingText.trim(),
          content: ''
        };
        currentSection = sectionKey;
      } else if (currentSection && beforeHeading) {
        sections[currentSection].content += beforeHeading.trim();
      }
    }

    return sections;
  }

  /**
   * Resolve command chain from workflow steps
   * @param {Object} parsedCommand - Parsed command structure
   * @returns {Array} Resolved command chain
   */
  async resolveCommandChain(parsedCommand) {
    const workflowSteps = parsedCommand.getWorkflowSteps();
    const commandChain = [];

    for (const step of workflowSteps) {
      const resolvedStep = await this.resolveWorkflowStep(step, parsedCommand);
      commandChain.push(resolvedStep);
    }

    return commandChain;
  }

  /**
   * Resolve individual workflow step
   * @param {Object} step - Workflow step
   * @param {Object} parsedCommand - Parent command
   * @returns {Object} Resolved step
   */
  async resolveWorkflowStep(step, parsedCommand) {
    const resolved = {
      ...step,
      resolved: true,
      parentCommand: parsedCommand.commandName
    };

    // Parse command reference
    if (step.command && step.command.startsWith('@')) {
      resolved.commandType = 'reference';
      resolved.referencedCommand = step.command.substring(1);
    } else if (step.command && step.command.startsWith('/')) {
      resolved.commandType = 'direct';
      resolved.directCommand = step.command;
    } else {
      resolved.commandType = 'action';
      resolved.actionType = step.command;
    }

    // Parse condition
    if (step.condition) {
      resolved.condition = this.parseCondition(step.condition);
    }

    // Add execution context
    resolved.executionContext = {
      requiresUserInput: this.checkUserInputRequirement(step),
      estimatedDuration: this.estimateStepDuration(step),
      dependencies: this.extractStepDependencies(step)
    };

    return resolved;
  }

  /**
   * Parse condition string into evaluable condition
   * @param {string} conditionStr - Condition string
   * @returns {Object} Parsed condition
   */
  parseCondition(conditionStr) {
    const condition = {
      type: 'simple',
      expression: conditionStr,
      evaluable: true
    };

    // Common condition patterns
    if (conditionStr === 'always') {
      condition.type = 'always';
      condition.result = true;
    } else if (conditionStr.includes('after_')) {
      condition.type = 'sequential';
      condition.dependency = conditionStr.replace('after_', '');
    } else if (conditionStr.includes('if_')) {
      condition.type = 'conditional';
      condition.check = conditionStr.replace('if_', '');
    }

    return condition;
  }

  /**
   * Load all available command files
   * @returns {Map} Map of command name to parsed command
   */
  async loadAllCommands() {
    const commands = new Map();
    
    try {
      const files = await fs.readdir(this.commandsDir);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      for (const file of mdFiles) {
        const filePath = path.join(this.commandsDir, file);
        try {
          const parsedCommand = await this.parseCommandFile(filePath);
          commands.set(parsedCommand.commandName, parsedCommand);
        } catch (error) {
          console.warn(`Failed to load command file ${file}:`, error.message);
        }
      }
    } catch (error) {
      console.warn(`Failed to read commands directory: ${error.message}`);
    }

    return commands;
  }

  /**
   * Find command by name or pattern
   * @param {string} commandName - Command name to find
   * @returns {Object|null} Found command or null
   */
  async findCommand(commandName) {
    // Normalize command name
    const normalizedName = commandName.replace(/^\//, '').replace(/-/g, '-');
    
    // Try direct lookup first
    const directPath = path.join(this.commandsDir, `${normalizedName}.md`);
    try {
      return await this.parseCommandFile(directPath);
    } catch (error) {
      // Command file doesn't exist, try pattern matching
    }

    // Load all commands and find best match
    const allCommands = await this.loadAllCommands();
    
    // Exact match
    if (allCommands.has(normalizedName)) {
      return allCommands.get(normalizedName);
    }

    // Fuzzy match
    const matches = Array.from(allCommands.entries()).filter(([name]) => 
      name.includes(normalizedName) || normalizedName.includes(name)
    );

    return matches.length > 0 ? matches[0][1] : null;
  }

  /**
   * Check if command requires routing to specialists
   * @param {Object} metadata - Command metadata
   * @returns {boolean} Whether routing is required
   */
  checkRoutingRequirement(metadata) {
    if (metadata.command_meta && metadata.command_meta.routing) {
      return metadata.command_meta.routing === 'intelligent' || 
             metadata.command_meta.routing === 'specialist';
    }
    return false;
  }

  /**
   * Check if command supports cost optimization
   * @param {Object} metadata - Command metadata
   * @returns {boolean} Whether cost optimization is supported
   */
  checkCostOptimization(metadata) {
    if (metadata.command_meta && metadata.command_meta.cost_optimization) {
      return metadata.command_meta.cost_optimization === 'true' || 
             metadata.command_meta.cost_optimization === true;
    }
    return false;
  }

  /**
   * Check if step requires user input
   * @param {Object} step - Workflow step
   * @returns {boolean} Whether user input is required
   */
  checkUserInputRequirement(step) {
    const userInputIndicators = [
      'user_input', 'confirmation', 'selection', 'approval'
    ];
    
    return userInputIndicators.some(indicator => 
      step.condition && step.condition.includes(indicator) ||
      step.description && step.description.includes(indicator)
    );
  }

  /**
   * Estimate step duration
   * @param {Object} step - Workflow step
   * @returns {number} Estimated duration in seconds
   */
  estimateStepDuration(step) {
    // Basic estimation based on step type
    const durationMap = {
      'vibe_interpretation': 30,
      'agent_routing': 10,
      'architecture_planning': 60,
      'code_generation': 180,
      'testing': 120,
      'deployment': 240
    };

    return durationMap[step.name] || 60; // Default 60 seconds
  }

  /**
   * Extract step dependencies
   * @param {Object} step - Workflow step
   * @returns {Array} Array of dependency step names
   */
  extractStepDependencies(step) {
    const dependencies = [];
    
    if (step.condition && step.condition.includes('after_')) {
      const dependency = step.condition.replace('after_', '');
      dependencies.push(dependency);
    }

    return dependencies;
  }

  /**
   * Clear cache (useful for development/testing)
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = { MarkdownProcessor };