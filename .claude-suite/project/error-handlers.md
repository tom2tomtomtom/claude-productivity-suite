# Error Handling Configuration

<error_scenarios>
  <scenario name="non_coder_confusion">
    <condition>User expresses confusion, frustration, or doesn't understand what's happening</condition>
    <action>
      1. Switch to ultra-simple language and explanations
      2. Break down complex processes into tiny steps
      3. Provide visual progress indicators
      4. Ask clarifying questions in plain English
      5. Offer to start over with simpler approach
    </action>
    <prevention>
      - Use more explanatory language from the start
      - Check understanding before proceeding
      - Provide context for every action
    </prevention>
  </scenario>

  <scenario name="repeated_same_mistake">
    <condition>User encounters the same error pattern multiple times</condition>
    <action>
      1. Recognize the pattern from mistake learning database
      2. Explain why this keeps happening in simple terms
      3. Implement automatic prevention for this specific mistake
      4. Update user's learning profile to avoid this pattern
      5. Suggest workflow changes to prevent recurrence
    </action>
    <prevention>
      - Proactively check for known mistake patterns
      - Warn user before actions that commonly fail
      - Implement guardrails for frequent error conditions
    </prevention>
  </scenario>

  <scenario name="wrong_agent_routing">
    <condition>Task routed to specialist agent that can't handle the request properly</condition>
    <action>
      1. Recognize routing mismatch quickly (within 2 exchanges)
      2. Apologize and explain the misrouting clearly
      3. Re-route to correct specialist agent
      4. Update routing confidence for similar future requests
      5. Ensure context transfers smoothly to new agent
    </action>
    <prevention>
      - Improve routing confidence algorithms
      - Add confirmation step for low-confidence routing
      - Learn from routing corrections
    </prevention>
  </scenario>

  <scenario name="token_budget_exceeded">
    <condition>Session approaching token limits, risking expensive overrun</condition>
    <action>
      1. Immediately notify user of approaching cost limit
      2. Apply learned pattern compression (target 50-85% reduction)
      3. Offer to continue with optimized approach
      4. Save current state to project memory
      5. Provide clear continuation instructions
    </action>
    <implementation>src/core/context-compression-engine.js</implementation>
    <prevention>
      - Monitor token usage proactively throughout session
      - Use compression techniques more aggressively
      - Apply vibe coding patterns to reduce repetition
      - Warn at 75% of typical session limit
    </prevention>
  </scenario>

  <scenario name="vibe_interpretation_failure">
    <condition>AI cannot understand user's natural language vibe description</condition>
    <action>
      1. Ask clarifying questions in non-technical language
      2. Provide examples of successful vibe descriptions
      3. Offer to break down complex requests into smaller parts
      4. Fall back to guided command selection
    </action>
    <implementation>src/index.js:132-155 interpretNaturalLanguage()</implementation>
    <prevention>
      - Build library of successful vibe → code patterns
      - Learn user's communication style over time
      - Provide better examples and guidance upfront
    </prevention>
  </scenario>

  <scenario name="md_xml_integration_failure">
    <condition>.md XML command files not processing correctly with core system</condition>
    <action>
      1. Validate command file structure and syntax
      2. Fall back to direct processing bypassing .md XML
      3. Log integration issue for system improvement
      4. Continue with alternative processing approach
    </action>
    <implementation>commands/*.md integration (70% complete)</implementation>
    <prevention>
      - Complete the .md XML integration system
      - Add validation for command file structure
      - Test integration points more thoroughly
    </prevention>
  </scenario>

  <scenario name="specialist_agent_unavailable">
    <condition>Required specialist agent not implemented yet (30% complete system)</condition>
    <action>
      1. Explain current implementation status honestly
      2. Offer general-purpose alternative approach
      3. Provide realistic timeline for specialist completion
      4. Ask if user wants to proceed or wait for specialist
    </action>
    <implementation>src/agents/ - mix of implemented and planned</implementation>
    <prevention>
      - Prioritize completing most-needed specialists first
      - Provide clear roadmap for specialist completion
      - Improve general-purpose fallback capabilities
    </prevention>
  </scenario>

  <scenario name="build_failures">
    <condition>Application build process fails repeatedly</condition>
    <action>
      1. Categorize failure type (dependency, syntax, configuration, etc.)
      2. Check against common failure patterns database
      3. Apply known solutions automatically if available
      4. Explain problem and solution in non-technical terms
      5. Update failure pattern database with new solutions
    </action>
    <prevention>
      - Validate dependencies before starting builds
      - Use tested configuration patterns
      - Pre-check common failure conditions
    </prevention>
  </scenario>

  <scenario name="deployment_problems">
    <condition>App builds locally but fails when deployed/published</condition>
    <action>
      1. Compare local vs deployment environments
      2. Check for environment-specific issues
      3. Validate deployment configuration step by step
      4. Provide clear diagnostic information in simple terms  
      5. Offer alternative deployment approaches if needed
    </action>
    <prevention>
      - Use deployment patterns known to work reliably
      - Test deployment process in staging environment first
      - Validate environment compatibility early
    </prevention>
  </scenario>

  <scenario name="feature_mismatch">
    <condition>Built feature doesn't match user's vision or expectations</condition>
    <action>
      1. Ask specific questions to understand the gap
      2. Show current implementation vs desired outcome
      3. Offer multiple approaches to fix the mismatch
      4. Learn user preferences for future similar features
      5. Update user profile with style and preference notes
    </action>
    <prevention>
      - Ask more detailed clarifying questions upfront
      - Show previews or mockups before building
      - Check user satisfaction at key milestone
    </prevention>
  </scenario>

  <scenario name="dependency_conflicts">
    <condition>Required packages/libraries conflict with each other</condition>
    <action>
      1. Identify conflicting dependencies clearly
      2. Research alternative solutions that avoid conflicts
      3. Explain the conflict in simple terms
      4. Implement resolution automatically if possible
      5. Update dependency pattern knowledge
    </action>
    <prevention>
      - Use dependency combinations known to work well together
      - Check for conflicts before adding new dependencies
      - Maintain tested dependency pattern library
    </prevention>
  </scenario>

  <scenario name="user_overwhelm">
    <condition>User expresses feeling overwhelmed by too much information or too many choices</condition>
    <action>
      1. Immediately simplify language and reduce information density
      2. Focus on just the next single step
      3. Hide technical details completely
      4. Offer to handle complexity automatically
      5. Check understanding before each small step
    </action>
    <prevention>
      - Default to simpler explanations and fewer options
      - Progressive disclosure of complexity
      - Always lead with the simplest possible approach
    </prevention>
  </scenario>

  <scenario name="context_loss">
    <condition>System loses track of what user is building or current project state</condition>
    <action>
      1. Acknowledge the context loss honestly
      2. Quickly scan available project files and history
      3. Ask user to confirm current project understanding
      4. Rebuild context from available evidence
      5. Implement better context preservation for future
    </action>
    <prevention>
      - Save project state more frequently
      - Use persistent project files for critical context
      - Implement session recovery mechanisms
    </prevention>
  </scenario>
</error_scenarios>

## Learning Integration

### Mistake Pattern Database
- **Structure**: Error type → User context → Solution → Success rate
- **Learning**: Each error resolution updates the database
- **Prediction**: Proactively suggest solutions for similar patterns
- **Personalization**: Track user-specific error tendencies

### Error Recovery Metrics
- **First-Time Fix Rate**: Target 80%+ of errors resolved on first attempt
- **User Satisfaction**: Post-error experience should feel helpful, not frustrating  
- **Learning Effectiveness**: Repeated same errors should decrease over time
- **Context Preservation**: User shouldn't need to repeat information after errors

### Escalation Paths

#### Level 1: Automatic Resolution
- Apply known solutions immediately
- No user intervention required
- Success rate > 90% for pattern

#### Level 2: Guided Resolution  
- Present solution options in simple terms
- User chooses preferred approach
- Learn from user preferences

#### Level 3: Expert Handoff
- Complex issues beyond automatic resolution
- Route to appropriate specialist agent
- Maintain context through handoff

#### Level 4: Graceful Degradation
- Acknowledge limitation honestly
- Preserve user's work and progress
- Provide alternative approaches or next steps

## Communication Principles for Error Handling

### Always
- ✅ Use simple, non-technical language
- ✅ Acknowledge the problem clearly
- ✅ Explain what you're doing to fix it
- ✅ Show progress during resolution
- ✅ Confirm when problem is resolved

### Never
- ❌ Use technical jargon or error codes
- ❌ Blame the user for the error
- ❌ Leave user wondering what's happening
- ❌ Make user repeat information unnecessarily
- ❌ Give up without suggesting alternatives