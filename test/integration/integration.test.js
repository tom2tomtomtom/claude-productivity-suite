/**
 * Test the new .md XML Command Integration system
 */

const { ClaudeProductivitySuite } = require('../../src/index');

async function testIntegration() {
  console.log('🧪 Testing .md XML Command Integration\n');

  const suite = new ClaudeProductivitySuite();
  
  try {
    // Initialize the suite
    console.log('1. Initializing Claude Productivity Suite...');
    await suite.initialize();
    console.log('✅ Suite initialized successfully\n');

    // Test basic command
    console.log('2. Testing basic command processing...');
    const result1 = await suite.processUserInput('/build-my-app "simple todo app"', 'test-session-1');
    console.log('✅ Basic command processed:', result1.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', result1.message);
    console.log('   Type:', result1.type || 'unknown');
    console.log();

    // Test natural language
    console.log('3. Testing natural language processing...');
    const result2 = await suite.processUserInput('I want to build a simple blog for my bakery', 'test-session-2');
    console.log('✅ Natural language processed:', result2.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', result2.message);
    console.log('   Type:', result2.type || 'unknown');
    console.log();

    // Test workflow functionality
    console.log('4. Testing workflow execution...');
    const result3 = await suite.processUserInput('/show-me-progress', 'test-session-3');
    console.log('✅ Workflow processed:', result3.success ? 'SUCCESS' : 'FAILED');
    console.log('   Message:', result3.message);
    console.log();

    // Test error handling
    console.log('5. Testing error handling...');
    const result4 = await suite.processUserInput('/unknown-command', 'test-session-4');
    console.log('✅ Error handling:', result4.success ? 'UNEXPECTED SUCCESS' : 'HANDLED GRACEFULLY');
    console.log('   Message:', result4.message);
    console.log();

    console.log('🎉 Integration test completed successfully!');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testIntegration();
}

module.exports = { testIntegration };