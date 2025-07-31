# Vibe Coding Workflow

<workflow_meta>
  <name>vibe-coding</name>
  <description>Transform user vibes into professional applications</description>
  <estimated_time>5-30 minutes depending on complexity</estimated_time>
  <target_users>non-coders, vibe coders</target_users>
</workflow_meta>

## Overview

The core workflow that makes Claude Productivity Suite special - turning natural language "vibes" into working applications through cost-optimized Claude Code interactions.

## Workflow Steps

<workflow_steps>
  <step number="1" name="vibe_capture">
    <command>Natural language input</command>
    <condition>always</condition>
    <description>User describes their app idea in natural language</description>
    <examples>
      - "I want a food delivery app for my neighborhood"
      - "Build me a simple blog for my bakery"
      - "Create a todo app with a nice design"
    </examples>
  </step>
  
  <step number="2" name="vibe_interpretation">
    <command>@interpret-vibe</command>
    <condition>after_vibe_capture</condition>
    <description>AI analyzes the vibe and extracts technical requirements</description>
    <implementation>src/index.js:132-155 interpretNaturalLanguage()</implementation>
  </step>
  
  <step number="3" name="agent_routing">
    <command>@route-to-specialist</command>
    <condition>after_interpretation</condition>
    <description>Route to appropriate specialist agents based on requirements</description>
    <specialists>
      - Frontend: UI/UX needs
      - Backend: API/database needs  
      - Deployment: Hosting needs
      - Testing: Quality assurance
    </specialists>
  </step>
  
  <step number="4" name="pattern_optimization">
    <command>@apply-patterns</command>
    <condition>during_development</condition>
    <description>Apply learned patterns to reduce token usage</description>
    <target_savings>50-85% token reduction</target_savings>
  </step>
  
  <step number="5" name="app_generation">
    <command>@build-app</command>
    <condition>after_routing</condition>
    <description>Generate working application code</description>
    <integration>commands/*.md XML command processing</integration>
  </step>
  
  <step number="6" name="validation">
    <command>@validate-app</command>
    <condition>after_generation</condition>
    <description>Test and validate the generated application</description>
    <testing>Playwright integration</testing>
  </step>
</workflow_steps>

## Token Optimization Strategies

1. **Pattern Reuse**: Identify common vibe→code patterns
2. **Context Compression**: Reduce repetitive explanations  
3. **Smart Routing**: Send requests to most efficient specialist
4. **Learning Integration**: Build on previous successful implementations

## Success Metrics

- **Speed**: Vibe to working app in minutes
- **Cost**: 50-85% token reduction vs standard Claude Code
- **Quality**: Professional-grade applications  
- **User Experience**: Non-coder friendly throughout

## Error Recovery

If any step fails:
1. Auto-rollback to last working state
2. Apply learned error patterns 
3. Route to recovery specialist
4. Provide user-friendly explanation

## Example Flow

```
User: "I want a simple website for my bakery with online ordering"

1. Vibe Capture ✓
2. Interpretation: E-commerce site, food service, small business
3. Routing: Frontend → UI specialist, Backend → API specialist  
4. Pattern Application: E-commerce template, payment integration pattern
5. Generation: React frontend + Node.js backend + Stripe payments
6. Validation: Automated testing with Playwright
7. Result: Working bakery website with ordering system

Token Usage: 2,847 tokens (68% reduction from baseline)
Time: 12 minutes
User Satisfaction: ⭐⭐⭐⭐⭐
```

## Integration Points

- **Command Files**: commands/*.md provide structured command processing
- **Agent System**: src/agents/ for specialist routing
- **Token Engine**: src/core/context-compression-engine.js for optimization
- **Health Monitor**: Tracks success rates and performance metrics