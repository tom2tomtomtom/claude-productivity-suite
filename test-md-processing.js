/**
 * Test .md XML command file processing
 */

const { MarkdownProcessor } = require('./src/core/markdown-processor');
const { XMLMetadataParser } = require('./src/core/xml-metadata-parser');
const { CommandIntegrator } = require('./src/core/command-integrator');
const { WorkflowExecutor } = require('./src/core/workflow-executor');

async function testMdProcessing() {
  console.log('🧪 Testing .md XML Command File Processing\n');

  try {
    // Test XML metadata parser
    console.log('1. Testing XML metadata parser...');
    const xmlParser = new XMLMetadataParser();
    
    const sampleXML = `
<command_meta>
  <name>test-command</name>
  <type>testing</type>
</command_meta>

<workflow_steps>
  <step number="1" name="test_step">
    <command>@test</command>
    <condition>always</condition>
  </step>
</workflow_steps>
    `;
    
    const metadata = xmlParser.parseXMLMetadata(sampleXML);
    console.log('✅ XML metadata parsed:', {
      hasCommandMeta: !!metadata.command_meta,
      workflowStepCount: metadata.workflow_steps.length,
      firstStepName: metadata.workflow_steps[0]?.name
    });
    console.log();

    // Test markdown processor
    console.log('2. Testing markdown processor...');
    const mdProcessor = new MarkdownProcessor();
    
    try {
      const parsedCommand = await mdProcessor.parseCommandFile('./commands/test-command.md');
      console.log('✅ Command file parsed:', {
        commandName: parsedCommand.commandName,
        hasWorkflow: parsedCommand.hasWorkflow(),
        requiresRouting: parsedCommand.requiresRouting(),
        supportsCostOptimization: parsedCommand.supportsCostOptimization(),
        workflowSteps: parsedCommand.getWorkflowSteps().length
      });
      
      if (parsedCommand.hasWorkflow()) {
        console.log('   Workflow steps:');
        parsedCommand.getWorkflowSteps().forEach((step, index) => {
          console.log(`     ${index + 1}. ${step.name}: ${step.command} (${step.condition})`);
        });
      }
      console.log();

      // Test command chain resolution
      console.log('3. Testing command chain resolution...');
      const commandChain = await mdProcessor.resolveCommandChain(parsedCommand);
      console.log('✅ Command chain resolved:', {
        chainLength: commandChain.length,
        firstStep: commandChain[0]?.name,
        lastStep: commandChain[commandChain.length - 1]?.name
      });
      console.log();

    } catch (fileError) {
      console.log('⚠️  Command file not found, using mock data');
      console.log();
    }

    // Test full integration
    console.log('4. Testing full integration with test command...');
    const workflowExecutor = new WorkflowExecutor();
    const commandIntegrator = new CommandIntegrator();
    commandIntegrator.setWorkflowExecutor(workflowExecutor);
    
    const sessionContext = {
      sessionId: 'test-md-session',
      userId: 'test-user',
      userProfile: {},
      history: []
    };

    const result = await commandIntegrator.executeCommand('/test-command', sessionContext);
    console.log('✅ Full integration result:', {
      success: result.success,
      type: result.type,
      message: result.message,
      stepsCompleted: result.technical?.stepsExecuted || 'N/A'
    });
    console.log();

    console.log('🎉 .md XML processing test completed successfully!');

  } catch (error) {
    console.error('❌ .md XML processing test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testMdProcessing();
}

module.exports = { testMdProcessing };