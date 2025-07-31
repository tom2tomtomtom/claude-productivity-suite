# Daily Development Workflow

<workflow_meta>
  <name>daily-dev</name>
  <description>Standard daily development workflow for Claude Productivity Suite</description>
  <estimated_time>30 minutes</estimated_time>
  <target_users>developers, maintainers</target_users>
</workflow_meta>

## Overview

Daily development workflow optimized for Claude Productivity Suite development with focus on .md XML command integration and agent specialist system completion.

## Workflow Steps

<workflow_steps>
  <step number="1" name="system_health_check">
    <command>@analyze-codebase</command>
    <condition>always</condition>
    <description>Check system health and identify any issues</description>
    <implementation>src/core/health-monitor.js</implementation>
  </step>
  
  <step number="2" name="command_integration_check">
    <command>@check-md-xml-integration</command>
    <condition>always</condition>
    <description>Verify .md XML command files are working together</description>
    <focus_area>commands/*.md integration with core system</focus_area>
  </step>
  
  <step number="3" name="agent_system_progress">
    <command>@review-agent-specialists</command>
    <condition>always</condition>
    <description>Review progress on agent specialist implementation</description>
    <current_status>30% complete - mix of implemented and planned</current_status>
  </step>
  
  <step number="4" name="token_optimization_review">
    <command>@analyze-token-patterns</command>
    <condition>always</condition>
    <description>Review token usage patterns and optimization opportunities</description>
    <target>50-85% reduction achievement</target>
  </step>
  
  <step number="5" name="vibe_coding_testing">
    <command>@test-vibe-coding</command>
    <condition>if_changes_made</condition>
    <description>Test the vibe coding pipeline with sample inputs</description>
    <test_cases>
      - Simple app request
      - Complex app with multiple features
      - Edge case vibe descriptions
    </test_cases>
  </step>
  
  <step number="6" name="quality_checks">
    <command>@run-tests</command>
    <condition>if_changes_made</condition>
    <description>Run full test suite including Playwright tests</description>
    <commands>
      - npm run test (Playwright)
      - npm run lint (ESLint)  
      - npm run build (Build verification)
    </commands>
  </step>
  
  <step number="7" name="documentation_sync">
    <command>@sync-documentation</command>
    <condition>if_changes_made</condition>
    <description>Ensure documentation reflects current implementation</description>
    <files>
      - .claude-suite/project/roadmap.md
      - .claude-suite/project/tech-stack.md
      - README files
    </files>
  </step>
</workflow_steps>

## Current Development Priorities

1. **Complete .md XML Integration** (70% done)
   - Focus: Making command files work seamlessly together
   - Files: commands/*.md need unified processing

2. **Finish Agent Specialists** (30% done)
   - Mix of implemented and planned specialists
   - Need to complete routing logic

3. **Optimize Vibe Coding Pipeline** (50% done)
   - Improve natural language interpretation
   - Enhance pattern matching

## Success Metrics

- All tests passing ✅
- Token optimization patterns working ✅  
- Vibe coding produces working apps ✅
- Agent routing functioning correctly ✅
- Documentation current and accurate ✅

## Error Handling

If any step fails:
1. **System Health Issues**: Use health monitor to diagnose
2. **Test Failures**: Review and fix before proceeding  
3. **Integration Problems**: Focus on .md XML command coordination
4. **Agent Routing Issues**: Debug specialist assignment logic

## Tools and Commands

```bash
# Start development session
npm run dev

# Run tests
npm run test
npm run lint
npm run build

# Health check
node src/index.js health

# Interactive testing
node src/index.js start
```

## Integration Focus Areas

- **Command Processing**: Ensure commands/*.md work with core system
- **Agent Coordination**: Complete specialist implementation
- **Token Efficiency**: Monitor and improve cost optimization
- **User Experience**: Maintain non-coder friendly interface