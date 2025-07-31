/**
 * Unit Tests for Enhanced Command Integrator
 * Tests the integration between .md XML commands, routing, and optimization
 */

const { CommandIntegrator } = require('../../src/core/command-integrator');

// Mock dependencies to isolate CommandIntegrator testing
jest.mock('../../src/core/xml-metadata-parser');
jest.mock('../../src/core/intelligent-router');
jest.mock('../../src/core/token-optimizer');
jest.mock('../../src/core/parallel-execution-coordinator');

const { XMLMetadataParser } = require('../../src/core/xml-metadata-parser');
const { IntelligentRouter } = require('../../src/core/intelligent-router');
const { TokenOptimizer } = require('../../src/core/token-optimizer');
const { ParallelExecutionCoordinator } = require('../../src/core/parallel-execution-coordinator');

describe('CommandIntegrator', () => {
  let commandIntegrator;
  let mockSessionContext;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    XMLMetadataParser.mockImplementation(() => ({
      parseMarkdownXML: jest.fn().mockResolvedValue({
        name: 'test-command',
        category: 'testing',
        tokenSavings: { baseline: 1000, optimized: 700, saved: 300, percentage: 30 },
        workflow: { steps: [{ id: 'step1', agent: 'frontend-specialist' }] },
        agentRouting: { required: ['frontend-specialist'] }
      }),
      clearCache: jest.fn()
    }));

    IntelligentRouter.mockImplementation(() => ({
      determineOptimalRoute: jest.fn().mockResolvedValue({
        selectedAgent: 'frontend-specialist',
        selectedRoute: { agent: 'frontend-specialist', confidence: 0.9 },
        confidence: 0.9,
        reasoning: 'Test routing reasoning',
        expectedTokenSavings: { percentage: 25 },
        tokenOptimization: { baseline: 1000, saved: 250 }
      })
    }));

    TokenOptimizer.mockImplementation(() => ({
      optimizeVibeProcessing: jest.fn().mockResolvedValue({
        tokenSavings: { baseline: 1000, optimized: 700, saved: 300, percentage: 30 },
        plan: { steps: [{ type: 'pattern-application', tokenSavings: 150 }] }
      })
    }));

    ParallelExecutionCoordinator.mockImplementation(() => ({
      analyzePrallelExecution: jest.fn().mockResolvedValue({
        recommended: false,
        reason: 'Single agent execution sufficient'
      })
    }));

    commandIntegrator = new CommandIntegrator();
    
    mockSessionContext = {
      userId: 'test-user-123',
      sessionId: 'session-456',
      userProfile: {
        technicalLevel: 'beginner',
        preferences: {}
      }
    };
  });

  describe('Initialization', () => {
    test('should initialize with all required components', () => {
      expect(commandIntegrator.xmlParser).toBeDefined();
      expect(commandIntegrator.intelligentRouter).toBeDefined();
      expect(commandIntegrator.tokenOptimizer).toBeDefined();
      expect(commandIntegrator.parallelCoordinator).toBeDefined();
      expect(commandIntegrator.integrationStats).toBeDefined();
    });

    test('should start with empty statistics', () => {
      const stats = commandIntegrator.integrationStats;
      expect(stats.totalExecutions).toBe(0);
      expect(stats.successfulExecutions).toBe(0);
      expect(stats.tokenSavings).toBe(0);
      expect(stats.parallelExecutions).toBe(0);
    });
  });

  describe('Command Parsing and Analysis', () => {
    test('should parse direct commands correctly', async () => {
      const directCommand = '/build-my-app "simple todo app"';
      
      const result = await commandIntegrator.parseUserInput(directCommand, mockSessionContext);
      
      expect(result.commandType).toBe('direct');
      expect(result.commandName).toBe('build-my-app');
      expect(result.arguments).toBe('"simple todo app"');
      expect(result.isDirectCommand).toBe(true);
      expect(result.confidence).toBe(0.9);
    });

    test('should parse natural language vibes correctly', async () => {
      const vibeInput = 'I want to create a beautiful portfolio website';
      
      const result = await commandIntegrator.parseUserInput(vibeInput, mockSessionContext);
      
      expect(result.commandType).toBe('natural');
      expect(result.isDirectCommand).toBe(false);
      expect(result.intent).toBeDefined();
      expect(result.arguments).toBe(vibeInput);
      expect(result.confidence).toBe(0.7);
    });

    test('should infer correct intent from natural language', async () => {
      const testCases = [
        { input: 'build me an app', expectedIntent: 'build_app' },
        { input: 'fix the broken login', expectedIntent: 'fix_issue' },
        { input: 'make it look better', expectedIntent: 'improve_design' },
        { input: 'deploy my website', expectedIntent: 'deploy_app' },
        { input: 'show me progress', expectedIntent: 'show_progress' }
      ];

      for (const testCase of testCases) {
        const result = await commandIntegrator.parseUserInput(testCase.input, mockSessionContext);
        expect(result.intent).toBe(testCase.expectedIntent);
      }
    });
  });

  describe('Command Resolution', () => {
    test('should resolve enhanced .md XML commands', async () => {
      // Mock file system to return a valid command file path
      commandIntegrator.findCommandFile = jest.fn().mockReturnValue('/path/to/test-command.md');
      
      const commandAnalysis = {
        commandType: 'direct',
        commandName: 'test-command',
        arguments: 'test arguments'
      };

      const result = await commandIntegrator.resolveCommandWithOptimization(
        commandAnalysis, 
        mockSessionContext
      );

      expect(result.type).toBe('enhanced-integrated');
      expect(result.tokenOptimized).toBe(true);
      expect(result.enhancedCommand).toBeDefined();
      expect(XMLMetadataParser.prototype.parseMarkdownXML).toHaveBeenCalledWith(
        '/path/to/test-command.md',
        mockSessionContext
      );
    });

    test('should fall back to basic processing when .md XML not found', async () => {
      // Mock no command file found
      commandIntegrator.findCommandFile = jest.fn().mockReturnValue(null);
      
      // Mock basic markdown processor
      commandIntegrator.mdProcessor.findCommand = jest.fn().mockResolvedValue(null);

      const commandAnalysis = {
        commandType: 'direct',
        commandName: 'nonexistent-command',
        arguments: 'test arguments'
      };

      const result = await commandIntegrator.resolveCommandWithOptimization(
        commandAnalysis, 
        mockSessionContext
      );

      expect(result.type).toBe('fallback');
      expect(result.useFallback).toBe(true);
      expect(result.tokenOptimized).toBe(false);
    });
  });

  describe('Routing Plan Creation', () => {
    test('should create intelligent routing plan for integrated commands', async () => {
      const resolvedCommand = {
        type: 'enhanced-integrated',
        commandName: 'test-command',
        enhancedCommand: { name: 'test', workflow: { steps: [] } }
      };

      const result = await commandIntegrator.createIntelligentRoutingPlan(
        resolvedCommand, 
        mockSessionContext
      );

      expect(result.routing).toBeDefined();
      expect(result.intelligentRouting).toBe(true);
      expect(IntelligentRouter.prototype.determineOptimalRoute).toHaveBeenCalledWith(
        resolvedCommand,
        mockSessionContext,
        expect.objectContaining({
          optimizeForTokens: true,
          checkAgentAvailability: true,
          respectUserPreferences: true
        })
      );
    });

    test('should skip routing for fallback commands', async () => {
      const fallbackCommand = {
        type: 'fallback',
        commandName: 'unknown-command'
      };

      const result = await commandIntegrator.createIntelligentRoutingPlan(
        fallbackCommand, 
        mockSessionContext
      );

      expect(result).toEqual(fallbackCommand); // Should return unchanged
      expect(IntelligentRouter.prototype.determineOptimalRoute).not.toHaveBeenCalled();
    });
  });

  describe('Workflow Building', () => {
    test('should build optimized workflow from enhanced command', async () => {
      const routingPlan = {
        type: 'enhanced-integrated',
        commandName: 'test-command',
        enhancedCommand: {
          workflow: {
            steps: [
              { id: 'step1', agent: 'frontend-specialist', tokenOptimized: true },
              { id: 'step2', agent: 'backend-specialist', tokenOptimized: true }
            ],
            parallelizable: true,
            estimatedDuration: 120
          },
          tokenSavings: { percentage: 30 }
        },
        routing: { selectedAgent: 'frontend-specialist' }
      };

      const commandAnalysis = { arguments: 'test args', originalInput: 'test input' };

      const workflow = await commandIntegrator.buildOptimizedWorkflow(
        routingPlan, 
        commandAnalysis, 
        mockSessionContext
      );

      expect(workflow.type).toBe('enhanced-integrated');
      expect(workflow.steps).toHaveLength(2);
      expect(workflow.parallelizable).toBe(true);
      expect(workflow.metadata.tokenOptimized).toBe(true);
      expect(workflow.metadata.estimatedDuration).toBe(120);
      expect(workflow.steps[0].tokenOptimized).toBe(true);
    });

    test('should create fallback workflow for basic commands', async () => {
      const routingPlan = {
        type: 'fallback',
        commandName: 'unknown-command',
        useFallback: true
      };

      const commandAnalysis = { arguments: 'test args', originalInput: 'test input' };

      const workflow = await commandIntegrator.buildOptimizedWorkflow(
        routingPlan, 
        commandAnalysis, 
        mockSessionContext
      );

      expect(workflow.type).toBe('fallback');
      expect(workflow.steps).toHaveLength(1);
      expect(workflow.steps[0].type).toBe('fallback');
      expect(workflow.parallelizable).toBe(false);
    });
  });

  describe('Execution with Optimization', () => {
    test('should execute enhanced workflow successfully', async () => {
      const workflow = {
        id: 'test-workflow',
        command: 'test-command',
        type: 'enhanced-integrated',
        steps: [
          { id: 'step1', agent: 'frontend-specialist', tokenOptimized: true }
        ],
        routing: { selectedAgent: 'frontend-specialist' },
        tokenOptimization: { percentage: 30 },
        parallelizable: false,
        metadata: { startTime: Date.now(), tokenOptimized: true }
      };

      const result = await commandIntegrator.executeWithOptimization(
        workflow, 
        mockSessionContext, 
        'exec-123'
      );

      expect(result.success).toBe(true);
      expect(result.type).toBe('enhanced-integrated');
      expect(result.stepsCompleted).toBe(1);
      expect(result.tokensUsed).toBeGreaterThan(0);
      expect(result.tokenSavings).toBeDefined();
    });

    test('should attempt parallel execution when workflow is parallelizable', async () => {
      const workflow = {
        id: 'test-workflow',
        command: 'test-command',
        type: 'enhanced-integrated',
        steps: [
          { id: 'step1', agent: 'frontend-specialist' },
          { id: 'step2', agent: 'backend-specialist' }
        ],
        routing: { selectedAgent: 'frontend-specialist' },
        parallelizable: true,
        metadata: { startTime: Date.now() }
      };

      // Mock parallel execution recommendation
      ParallelExecutionCoordinator.prototype.analyzePrallelExecution.mockResolvedValue({
        recommended: true,
        reason: 'Multiple agents can work in parallel',
        parallelPlan: { totalAgents: 2, estimatedSpeedup: 1.8 }
      });

      await commandIntegrator.executeWithOptimization(
        workflow, 
        mockSessionContext, 
        'exec-123'
      );

      expect(ParallelExecutionCoordinator.prototype.analyzePrallelExecution).toHaveBeenCalled();
    });
  });

  describe('Result Processing', () => {
    test('should process optimized results with comprehensive metrics', async () => {
      const executionResult = {
        success: true,
        type: 'enhanced-integrated',
        message: 'Test execution completed',
        tokensUsed: 700,
        tokenSavings: { baseline: 1000, optimized: 700, saved: 300, percentage: 30 },
        routing: { selectedAgent: 'frontend-specialist', confidence: 0.9 },
        stepsCompleted: 2,
        totalSteps: 2,
        parallelExecution: false,
        workflow: { 
          id: 'test-workflow',
          metadata: { tokenOptimized: true, intelligentRouting: true }
        }
      };

      const startTime = Date.now() - 5000; // 5 seconds ago

      const result = await commandIntegrator.processOptimizedResult(
        executionResult, 
        mockSessionContext, 
        startTime
      );

      expect(result.success).toBe(true);
      expect(result.tokenSavings).toBeDefined();
      expect(result.tokenSavings.percentage).toBe(30);
      expect(result.routing).toBeDefined();
      expect(result.routing.strategy).toBe('frontend-specialist');
      expect(result.userExplanation).toBeDefined();
      expect(result.userExplanation.optimization).toBeDefined();
      expect(result.technical).toBeDefined();
    });

    test('should generate appropriate optimization summary', async () => {
      const executionResult = {
        tokenSavings: { saved: 300, percentage: 30 },
        parallelExecution: true,
        parallelEfficiency: 1.5
      };

      const summary = commandIntegrator.generateOptimizationSummary(executionResult);

      expect(summary).toBeDefined();
      expect(summary.tokensSaved).toBe(300);
      expect(summary.percentageSaved).toBe(30);
      expect(summary.processingSpeed).toContain('1.5x faster');
    });
  });

  describe('Statistics and Monitoring', () => {
    test('should track integration statistics correctly', async () => {
      // Execute several commands
      await commandIntegrator.executeCommand('/test-command', mockSessionContext);
      await commandIntegrator.executeCommand('natural language vibe', mockSessionContext);
      
      const stats = commandIntegrator.getIntegrationStatistics();
      
      expect(stats.totalExecutions).toBe(2);
      expect(stats.successfulExecutions).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(0);
    });

    test('should calculate success rate correctly', async () => {
      // Simulate some executions
      commandIntegrator.integrationStats.totalExecutions = 10;
      commandIntegrator.integrationStats.successfulExecutions = 8;
      
      const stats = commandIntegrator.getIntegrationStatistics();
      
      expect(stats.successRate).toBe(80);
    });
  });

  describe('Error Handling', () => {
    test('should handle XML parsing errors gracefully', async () => {
      XMLMetadataParser.prototype.parseMarkdownXML.mockRejectedValue(
        new Error('XML parsing failed')
      );
      
      commandIntegrator.findCommandFile = jest.fn().mockReturnValue('/path/to/bad-file.md');
      
      const result = await commandIntegrator.executeCommand('/bad-command', mockSessionContext);
      
      expect(result).toBeDefined();
      // Should not crash and should provide some form of response
    });

    test('should handle routing failures gracefully', async () => {
      IntelligentRouter.prototype.determineOptimalRoute.mockRejectedValue(
        new Error('Routing failed')
      );
      
      const result = await commandIntegrator.executeCommand('/test-command', mockSessionContext);
      
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });

    test('should provide user-friendly error messages', async () => {
      const error = new Error('Technical error message');
      
      const result = await commandIntegrator.handleIntegrationError(
        error, 
        'test input', 
        mockSessionContext
      );

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.userExplanation).toBeDefined();
      expect(result.recovery).toBeDefined();
      expect(result.recovery.suggestion).toBeDefined();
    });
  });

  describe('Utility Methods', () => {
    test('should find command files correctly', () => {
      const fs = require('fs');
      fs.existsSync = jest.fn()
        .mockReturnValueOnce(false) // First file doesn't exist
        .mockReturnValueOnce(true);  // Second file exists

      const result = commandIntegrator.findCommandFile('test-command');
      
      expect(fs.existsSync).toHaveBeenCalledTimes(2);
      expect(result).toContain('test-command-command.md');
    });

    test('should generate unique execution IDs', () => {
      const id1 = commandIntegrator.generateExecutionId();
      const id2 = commandIntegrator.generateExecutionId();
      
      expect(id1).toMatch(/^exec-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^exec-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    test('should reset state correctly', () => {
      // Add some data
      commandIntegrator.integrationStats.totalExecutions = 5;
      commandIntegrator.integrationStats.successfulExecutions = 4;
      
      commandIntegrator.reset();
      
      expect(commandIntegrator.integrationStats.totalExecutions).toBe(0);
      expect(commandIntegrator.integrationStats.successfulExecutions).toBe(0);
      expect(XMLMetadataParser.prototype.clearCache).toHaveBeenCalled();
    });
  });
});