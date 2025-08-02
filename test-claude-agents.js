/**
 * Test script for Claude Code agent routing system
 * Tests the new agent routing with all specialists
 */

const { AgentRouter } = require('./src/agents/agent-router');
const { IntelligentRouter } = require('./src/core/intelligent-router');

async function testClaudeAgentRouting() {
  console.log('🧪 Testing Claude Code Agent Routing System...\n');

  // Initialize routers
  const agentRouter = new AgentRouter();
  const intelligentRouter = new IntelligentRouter();

  // Test scenarios
  const testScenarios = [
    {
      name: 'Frontend Design Task',
      command: {
        type: 'build-component',
        description: 'Create a beautiful login form with modern design'
      },
      expectedAgent: 'frontend-specialist'
    },
    {
      name: 'Security Task',
      command: {
        type: 'security-audit',
        description: 'Review authentication system for vulnerabilities'
      },
      expectedAgent: 'security-specialist'
    },
    {
      name: 'Performance Optimization',
      command: {
        type: 'optimize-performance',
        description: 'Make the app load faster and cache data efficiently'
      },
      expectedAgent: 'performance-specialist'
    },
    {
      name: 'API Development',
      command: {
        type: 'create-api',
        description: 'Build REST endpoints for user management'
      },
      expectedAgent: 'api-specialist'
    },
    {
      name: 'Mobile UI',
      command: {
        type: 'mobile-design',
        description: 'Create responsive mobile interface for React Native app'
      },
      expectedAgent: 'mobile-specialist'
    },
    {
      name: 'Documentation',
      command: {
        type: 'write-docs',
        description: 'Create comprehensive API documentation and user guide'
      },
      expectedAgent: 'documentation-specialist'
    }
  ];

  const context = {
    projectName: 'Claude Productivity Suite',
    currentPhase: 'Testing',
    userLevel: 'Developer',
    tokenBudget: 'Standard'
  };

  console.log('📊 Available Claude Code Specialists:');
  const specialists = agentRouter.getAvailableSpecialists();
  specialists.forEach(specialist => {
    const info = agentRouter.getSpecialist(specialist);
    console.log(`  • ${specialist}: ${info.description}`);
  });
  console.log(`\nTotal: ${specialists.length} specialists\n`);

  // Test each scenario
  for (const scenario of testScenarios) {
    console.log(`🎯 Testing: ${scenario.name}`);
    console.log(`   Command: ${scenario.command.description}`);
    
    try {
      // Test with AgentRouter
      const routingResult = await agentRouter.routeCommand(scenario.command, context);
      
      console.log(`   ✅ Routed to: ${routingResult.agent}`);
      console.log(`   📈 Confidence: ${Math.round(routingResult.confidence * 100)}%`);
      console.log(`   💡 Reasoning: ${routingResult.routing.reasoning}`);
      
      // Check if it matches expected
      if (routingResult.agent === scenario.expectedAgent) {
        console.log(`   ✅ Expected agent match!`);
      } else {
        console.log(`   ⚠️  Expected ${scenario.expectedAgent}, got ${routingResult.agent}`);
      }
      
      // Test with IntelligentRouter for comparison
      const intelligentResult = await intelligentRouter.determineOptimalRoute(scenario.command, context);
      console.log(`   🧠 Intelligent Router: ${intelligentResult.selectedAgent} (${Math.round(intelligentResult.confidence * 100)}%)`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test health check
  console.log('🏥 Health Check:');
  const healthCheck = await agentRouter.performHealthCheck();
  console.log(`   Router Status: ${healthCheck.router.status}`);
  console.log(`   Specialists: ${healthCheck.router.specialists}`);
  console.log(`   System: ${healthCheck.router.system}`);

  // Test statistics
  console.log('\n📊 Routing Statistics:');
  const stats = agentRouter.getRoutingStats();
  console.log(`   Total Routes: ${stats.totalRoutes}`);
  console.log(`   Success Rate: ${stats.successRate.toFixed(1)}%`);
  console.log(`   Average Confidence: ${stats.averageConfidence.toFixed(1)}%`);

  console.log('\n✅ Claude Code Agent Testing Complete!');
}

// Run the test
if (require.main === module) {
  testClaudeAgentRouting().catch(console.error);
}

module.exports = { testClaudeAgentRouting };