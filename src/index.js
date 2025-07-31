#!/usr/bin/env node

/**
 * Claude Productivity Suite - Main Entry Point
 * Implements the complete non-coder workflow system with token optimization
 */

const { CommandProcessor } = require('./core/command-processor');
const { CommandIntegrator } = require('./core/command-integrator');
const { WorkflowExecutor } = require('./core/workflow-executor');
const { SessionManager } = require('./core/session-manager');
const { UserNotificationSystem } = require('./core/user-notification-system');
const { HealthMonitor } = require('./core/health-monitor');
const chalk = require('chalk');
const { program } = require('commander');

class ClaudeProductivitySuite {
  constructor() {
    this.processor = new CommandProcessor();
    this.workflowExecutor = new WorkflowExecutor();
    this.commandIntegrator = new CommandIntegrator();
    this.sessions = new SessionManager();
    this.notifications = new UserNotificationSystem();
    this.health = new HealthMonitor();
    
    // Wire up the integrated system
    this.commandIntegrator.setWorkflowExecutor(this.workflowExecutor);
    
    this.version = '3.0.0';
    this.initialized = false;
    this.useIntegratedCommands = false; // Feature flag - disabled until dependencies are ready
  }

  async initialize() {
    if (this.initialized) return;

    console.log(chalk.blue.bold(`
╔═══════════════════════════════════════════════════════════════╗
║                 Claude Productivity Suite v${this.version}                ║
║          Making App Building Simple for Everyone               ║
╚═══════════════════════════════════════════════════════════════╝
    `));

    console.log(chalk.gray('Initializing intelligent systems...'));

    try {
      // Initialize core systems
      await this.processor.initialize();
      await this.sessions.initialize();
      await this.health.initialize();

      // Perform system health check
      const healthStatus = await this.health.performSystemCheck();
      
      if (healthStatus.overall === 'healthy') {
        console.log(chalk.green('✅ All systems operational'));
      } else {
        console.log(chalk.yellow('⚠️  Some systems need attention'));
        this.displayHealthIssues(healthStatus);
      }

      this.initialized = true;
      this.displayWelcomeMessage();
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize Claude Productivity Suite:'), error.message);
      process.exit(1);
    }
  }

  displayWelcomeMessage() {
    console.log(chalk.green(`
🚀 Welcome to Claude Productivity Suite!

You can now build apps with simple commands:
  ${chalk.cyan('/build-my-app "describe your idea"')} - Start building
  ${chalk.cyan('/make-it-look-better')} - Improve design  
  ${chalk.cyan('/fix-whatever-is-broken')} - Auto-fix issues
  ${chalk.cyan('/deploy-when-ready')} - Put online
  ${chalk.cyan('/show-me-progress')} - See what's built

${chalk.dim('Type any command or describe what you want to build!')}
    `));
  }

  displayHealthIssues(healthStatus) {
    if (healthStatus.issues && healthStatus.issues.length > 0) {
      console.log(chalk.yellow('\nHealth Issues:'));
      for (const issue of healthStatus.issues) {
        console.log(chalk.yellow(`  • ${issue.description}`));
        if (issue.suggestion) {
          console.log(chalk.dim(`    Suggestion: ${issue.suggestion}`));
        }
      }
      console.log();
    }
  }

  async processUserInput(input, sessionId) {
    try {
      // Get or create session context
      const sessionContext = await this.sessions.getOrCreateSession(sessionId);
      
      let result;
      
      if (this.useIntegratedCommands) {
        console.log(chalk.blue('🔧 Using integrated command processing...'));
        
        // Use new integrated command processing
        result = await this.commandIntegrator.executeCommand(input, sessionContext);
      } else {
        // Fallback to legacy processing
        console.log(chalk.yellow('📋 Using legacy command processing...'));
        
        const { command, args } = this.parseInput(input);
        result = await this.processor.processCommand(command, args, sessionContext);
      }
      
      // Update session with result
      await this.sessions.updateSession(sessionId, result);
      
      // Display result to user
      await this.displayResult(result);
      
      return result;
      
    } catch (error) {
      console.error(chalk.red('Error processing input:'), error.message);
      return this.handleProcessingError(error, input, sessionId);
    }
  }

  parseInput(input) {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('/')) {
      // Command format
      const parts = trimmed.split(' ');
      return {
        command: parts[0],
        args: parts.slice(1).join(' ')
      };
    } else {
      // Natural language - convert to most likely command
      return this.interpretNaturalLanguage(trimmed);
    }
  }

  interpretNaturalLanguage(input) {
    const interpretations = {
      build: ['build', 'create', 'make', 'start', 'new'],
      improve: ['better', 'improve', 'enhance', 'upgrade', 'polish'],
      fix: ['fix', 'repair', 'broken', 'error', 'problem', 'issue'],
      deploy: ['deploy', 'publish', 'online', 'live', 'launch'],
      progress: ['progress', 'status', 'show', 'see', 'check'],
      help: ['help', 'what', 'how', 'commands']
    };

    const lowerInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(interpretations)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return this.mapIntentToCommand(intent, input);
      }
    }

    // Default to build command for descriptions
    return {
      command: '/build-my-app',
      args: input
    };
  }

  mapIntentToCommand(intent, originalInput) {
    const commandMap = {
      build: { command: '/build-my-app', args: originalInput },
      improve: { command: '/make-it-look-better', args: '' },
      fix: { command: '/fix-whatever-is-broken', args: '' },
      deploy: { command: '/deploy-when-ready', args: '' },
      progress: { command: '/show-me-progress', args: '' },
      help: { command: '/help', args: '' }
    };

    return commandMap[intent] || { command: '/help', args: '' };
  }

  async displayResult(result) {
    if (!result) return;

    // Success message
    if (result.success) {
      console.log(chalk.green('\n✅ ' + result.message));
    } else {
      console.log(chalk.red('\n❌ ' + result.message));
    }

    // User-friendly explanation
    if (result.userExplanation) {
      this.displayUserExplanation(result.userExplanation);
    }

    // Next step recommendations
    if (result.recommendations) {
      this.displayRecommendations(result.recommendations);
    }

    // Token usage info (if optimization enabled)
    if (result.tokenUsage) {
      this.displayTokenUsage(result.tokenUsage);
    }

    // Progress info
    if (result.completionPercentage) {
      this.displayProgressBar(result.completionPercentage);
    }
  }

  displayUserExplanation(explanation) {
    if (explanation.summary) {
      console.log(chalk.white('\n📝 ' + explanation.summary));
    }

    if (explanation.details && explanation.details.length > 0) {
      console.log(chalk.gray('\nWhat I did:'));
      for (const detail of explanation.details) {
        console.log(chalk.gray('  ' + detail));
      }
    }

    if (explanation.whatYouCanExpect && explanation.whatYouCanExpected.length > 0) {
      console.log(chalk.blue('\nWhat to expect:'));
      for (const expectation of explanation.whatYouCanExpect) {
        console.log(chalk.blue('  • ' + expectation));
      }
    }
  }

  displayRecommendations(recommendations) {
    if (recommendations.immediate) {
      console.log(chalk.cyan(`\n🎯 Recommended next step: ${recommendations.immediate.command}`));
      console.log(chalk.dim(`   ${recommendations.immediate.reason}`));
    }

    if (recommendations.alternatives && recommendations.alternatives.length > 0) {
      console.log(chalk.dim('\nOr try:'));
      for (const alt of recommendations.alternatives) {
        console.log(chalk.dim(`  • ${alt.command} - ${alt.reason}`));
      }
    }
  }

  displayTokenUsage(tokenUsage) {
    if (tokenUsage.saved && tokenUsage.saved > 0) {
      console.log(chalk.green(`\n💰 Saved ${tokenUsage.saved} tokens (${Math.round((tokenUsage.saved/tokenUsage.gross)*100)}% reduction)`));
    }

    if (tokenUsage.optimizations && tokenUsage.optimizations.length > 0) {
      console.log(chalk.dim('Optimizations applied:'));
      for (const opt of tokenUsage.optimizations) {
        console.log(chalk.dim(`  • ${opt}`));
      }
    }
  }

  displayProgressBar(percentage) {
    const width = 30;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    console.log(chalk.blue(`\nProgress: [${bar}] ${percentage}%`));
  }

  async handleProcessingError(error, input, sessionId) {
    const errorResult = {
      success: false,
      message: "I encountered an issue, but I can help you resolve it.",
      error: {
        userFriendly: this.translateErrorForUser(error),
        technical: error.message
      },
      recovery: {
        suggestions: [
          "Try '/fix-whatever-is-broken' to automatically resolve issues",
          "Use '/help' to see all available commands",
          "Describe what you want in simpler terms"
        ]
      }
    };

    await this.displayResult(errorResult);
    return errorResult;
  }

  translateErrorForUser(error) {
    const translations = {
      'NetworkError': 'Connection issue - please check your internet',
      'ValidationError': 'Invalid input - let me help you fix that',
      'TimeoutError': 'Request took too long - trying simpler approach',
      'UnknownCommandError': 'Command not recognized - try describing what you want',
      'SessionError': 'Session issue - starting fresh session'
    };

    return translations[error.constructor.name] || 
           "Something unexpected happened, but I know how to handle it";
  }

  // CLI Command Interface
  setupCLI() {
    program
      .name('claude-suite')
      .description('Claude Productivity Suite - AI-powered development for everyone')
      .version(this.version);

    program
      .command('start')
      .description('Start interactive session')
      .action(async () => {
        await this.initialize();
        await this.startInteractiveSession();
      });

    program
      .command('build <description>')
      .description('Build an app from description')
      .action(async (description) => {
        await this.initialize();
        await this.processUserInput(`/build-my-app ${description}`, 'cli-session');
      });

    program
      .command('health')
      .description('Check system health')
      .action(async () => {
        await this.initialize();
        const health = await this.health.performSystemCheck();
        this.displayHealthStatus(health);
      });

    program
      .command('dashboard')
      .description('Show intelligence dashboard')
      .action(async () => {
        await this.initialize();
        await this.processUserInput('/intelligence-dashboard', 'cli-session');
      });

    return program;
  }

  async startInteractiveSession() {
    const inquirer = require('inquirer');
    const sessionId = 'interactive-' + Date.now();
    
    console.log(chalk.green('\n🎉 Starting interactive session! Type "exit" to quit.\n'));

    while (true) {
      try {
        const { input } = await inquirer.prompt([
          {
            type: 'input',
            name: 'input',
            message: chalk.cyan('What would you like to do?'),
            prefix: '🤖'
          }
        ]);

        if (input.toLowerCase() === 'exit') {
          console.log(chalk.yellow('👋 Thanks for using Claude Productivity Suite!'));
          break;
        }

        await this.processUserInput(input, sessionId);
        console.log(); // Add spacing between interactions
        
      } catch (error) {
        console.error(chalk.red('Session error:'), error.message);
        break;
      }
    }
  }

  displayHealthStatus(health) {
    console.log(chalk.blue('\n🏥 System Health Status'));
    console.log(chalk.blue('═'.repeat(50)));
    
    const statusColor = health.overall === 'healthy' ? chalk.green : 
                       health.overall === 'warning' ? chalk.yellow : chalk.red;
    
    console.log(`Overall Status: ${statusColor(health.overall.toUpperCase())}`);
    
    if (health.components) {
      console.log('\nComponents:');
      for (const [name, status] of Object.entries(health.components)) {
        const color = status.status === 'healthy' ? chalk.green : 
                     status.status === 'warning' ? chalk.yellow : chalk.red;
        console.log(`  ${name}: ${color(status.status)}`);
      }
    }

    if (health.metrics) {
      console.log('\nPerformance Metrics:');
      console.log(`  Token Optimization: ${health.metrics.tokenOptimization}%`);
      console.log(`  Agent Efficiency: ${health.metrics.agentEfficiency}%`);
      console.log(`  User Satisfaction: ${health.metrics.userSatisfaction}%`);
    }
  }
}

// Main execution
async function main() {
  const suite = new ClaudeProductivitySuite();
  
  // Setup CLI
  const cli = suite.setupCLI();
  
  // If called directly (not as module), start CLI
  if (require.main === module) {
    if (process.argv.length === 2) {
      // No arguments - start interactive mode
      await suite.initialize();
      await suite.startInteractiveSession();
    } else {
      // Parse CLI arguments
      cli.parse();
    }
  }
  
  return suite;
}

// Export for programmatic use
module.exports = { ClaudeProductivitySuite, main };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error:'), error.message);
    process.exit(1);
  });
}