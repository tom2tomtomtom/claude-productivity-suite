/**
 * Test just the new .md XML Command Integration system
 */

const { CommandIntegrator } = require('./src/core/command-integrator');
const { WorkflowExecutor } = require('./src/core/workflow-executor');

async function testSimpleIntegration() {
  console.log('🧪 Testing .md XML Command Integration (Simple)\n');

  try {
    // Create the integrated system
    console.log('1. Creating command integrator and workflow executor...');
    const workflowExecutor = new WorkflowExecutor();
    const commandIntegrator = new CommandIntegrator();
    commandIntegrator.setWorkflowExecutor(workflowExecutor);
    console.log('✅ Integration system created\n');

    // Create mock session context
    const sessionContext = {
      sessionId: 'test-session',
      userId: 'test-user',
      userProfile: {},
      history: []
    };

    // Test basic command
    console.log('2. Testing basic command integration...');
    const result1 = await commandIntegrator.executeCommand('/build-my-app "simple todo app"', sessionContext);
    console.log('✅ Basic command result:');
    console.log('   Success:', result1.success);
    console.log('   Message:', result1.message);
    console.log('   Type:', result1.type);
    console.log('   Steps completed:', result1.technical?.stepsExecuted || 'N/A');
    console.log();

    // Test natural language
    console.log('3. Testing natural language integration...');
    const result2 = await commandIntegrator.executeCommand('I want to create a blog website', sessionContext);
    console.log('✅ Natural language result:');
    console.log('   Success:', result2.success);
    console.log('   Message:', result2.message);
    console.log('   Type:', result2.type);
    console.log();

    // Test workflow execution directly
    console.log('4. Testing workflow executor directly...');
    const testSteps = [
      {
        id: 'step-1',
        name: 'analyze_request',
        command: 'analyze',
        condition: { type: 'always', result: true }
      },
      {
        id: 'step-2', 
        name: 'generate_response',
        command: 'generate',
        condition: { type: 'sequential', dependency: 'analyze_request' }
      }
    ];

    const workflowResult = await workflowExecutor.executeWorkflow(testSteps, sessionContext);
    console.log('✅ Workflow executor result:');
    console.log('   Success:', workflowResult.success);
    console.log('   Completed steps:', workflowResult.completedSteps);
    console.log('   Total steps:', workflowResult.totalSteps);
    console.log('   Execution time:', workflowResult.executionTime + 'ms');
    console.log();

    console.log('🎉 Simple integration test completed successfully!');

  } catch (error) {
    console.error('❌ Simple integration test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testSimpleIntegration();
}

module.exports = { testSimpleIntegration };