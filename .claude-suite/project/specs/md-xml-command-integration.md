# .md XML Command Files Integration Spec

> **Spec ID**: SPEC-001  
> **Created**: 2025-07-31  
> **Status**: Phase 1 - Current Development  
> **Priority**: High  
> **Completion**: 70% → 100%  

## Overview

Complete the seamless integration between .md XML command files and the core Claude Productivity Suite system, enabling unified command processing for vibe coding workflows.

## Problem Statement

Currently, the system has:
- ✅ Command files in `commands/*.md` with structured definitions
- ✅ Core command processing in `src/core/command-processor.js`
- ❌ **Gap**: Commands work in isolation but don't integrate as unified process
- ❌ **Issue**: Manual coordination required between command files and core system

## Success Criteria

### Primary Goals
- [ ] All commands/*.md files process seamlessly with core system
- [ ] Single command can trigger multi-step workflows defined in .md files
- [ ] XML metadata in .md files drives intelligent routing
- [ ] Command chaining works automatically
- [ ] Error handling integrated across command pipeline

### Success Metrics
- **Integration Rate**: 100% of commands/*.md files work with core system
- **Processing Speed**: < 2 seconds for command interpretation
- **Error Rate**: < 5% command processing failures
- **User Experience**: No manual coordination required

## Technical Architecture

### Current State (70% Complete)
```
commands/*.md files (isolated)
     ↓
Manual interpretation
     ↓
src/core/command-processor.js (separate)
```

### Target State (100% Complete)
```
User Input → Command Parser → .md XML Resolver → Core Processor → Integrated Response
```

## Implementation Plan

### Phase 1A: .md XML Parser Enhancement
**Files**: `src/core/markdown-processor.js` (exists), `src/core/xml-metadata-parser.js` (new)

```javascript
// Enhanced markdown processor
class MarkdownProcessor {
  parseCommandFile(filePath) {
    return {
      metadata: extractXMLMetadata(),
      content: parseMarkdownContent(), 
      workflow: parseWorkflowSteps(),
      routing: parseAgentRouting()
    };
  }
  
  resolveCommandChain(commandName) {
    // Parse commands/*.md for workflow chains
    // Return complete execution plan
  }
}
```

### Phase 1B: Command Integration Layer
**Files**: `src/core/command-integrator.js` (new)

```javascript
class CommandIntegrator {
  constructor() {
    this.mdProcessor = new MarkdownProcessor();
    this.commandProcessor = new CommandProcessor();
  }
  
  async executeCommand(userInput, sessionContext) {
    // 1. Parse user input
    // 2. Resolve against commands/*.md
    // 3. Build execution workflow
    // 4. Execute with core processor
    // 5. Handle responses and chaining
  }
}
```

### Phase 1C: Workflow Execution Engine
**Files**: `src/core/workflow-executor.js` (new)

```javascript
class WorkflowExecutor {
  async executeWorkflow(workflowSteps, context) {
    for (const step of workflowSteps) {
      const result = await this.executeStep(step, context);
      context = this.updateContext(context, result);
      
      if (step.condition && !this.evaluateCondition(step.condition, context)) {
        continue; // Skip conditional steps
      }
    }
  }
}
```

## Detailed Requirements

### 1. XML Metadata Processing
**Location**: commands/*.md files

```xml
<command_meta>
  <name>build-my-app</name>
  <type>vibe-coding</type>
  <routing>intelligent</routing>
  <cost_optimization>true</cost_optimization>
  <workflow_chain>true</workflow_chain>
</command_meta>
```

**Requirements**:
- Parse XML metadata from all .md files
- Validate metadata structure
- Use metadata for intelligent routing
- Support conditional execution

### 2. Workflow Chain Processing
**Example**: `commands/build-my-app.md`

```xml
<workflow_steps>
  <step number="1" name="vibe_interpretation">
    <command>@interpret-vibe</command>
    <condition>user_input_natural_language</condition>
  </step>
  <step number="2" name="agent_routing">
    <command>@route-to-specialist</command>
    <condition>after_interpretation</condition>
  </step>
</workflow_steps>
```

**Requirements**:
- Sequential step execution
- Conditional step evaluation
- Context passing between steps
- Error handling at each step

### 3. Integration with Core System
**Integration Points**:
- `src/index.js:116-130` parseInput() - Route to .md processor
- `src/core/command-processor.js` - Execute resolved workflows
- `src/core/intelligent-router.js` - Use .md routing metadata

## Implementation Tasks

### Task 1: Enhanced Markdown Processing
- [ ] Extend `src/core/markdown-processor.js` with XML parsing
- [ ] Add workflow step extraction
- [ ] Add metadata validation
- [ ] Add error handling for malformed .md files

### Task 2: Command Integration Layer
- [ ] Create `src/core/command-integrator.js`
- [ ] Integrate with existing `parseInput()` in main
- [ ] Add command resolution logic
- [ ] Add workflow building logic

### Task 3: Workflow Execution Engine
- [ ] Create `src/core/workflow-executor.js`
- [ ] Add step-by-step execution
- [ ] Add conditional evaluation
- [ ] Add context management between steps

### Task 4: Core System Integration
- [ ] Update `src/index.js` to use command integrator
- [ ] Update command processor to handle workflows
- [ ] Add workflow state tracking to session manager
- [ ] Add workflow metrics to health monitor

### Task 5: Testing & Validation
- [ ] Test all existing commands/*.md files
- [ ] Add Playwright tests for workflow chains
- [ ] Test error handling and recovery
- [ ] Validate performance meets < 2 second target

## Testing Strategy

### Unit Tests
```javascript
describe('CommandIntegrator', () => {
  test('parses build-my-app.md correctly', () => {
    // Test .md file parsing
  });
  
  test('builds workflow from parsed metadata', () => {
    // Test workflow construction
  });
  
  test('handles malformed .md files gracefully', () => {
    // Test error handling
  });
});
```

### Integration Tests
```javascript
describe('Full Workflow Integration', () => {
  test('vibe coding workflow end-to-end', async () => {
    const result = await integrator.executeCommand(
      '/build-my-app "simple todo app"',
      sessionContext
    );
    expect(result.success).toBe(true);
    expect(result.workflowCompleted).toBe(true);
  });
});
```

### Playwright E2E Tests
```javascript
test('command integration works in CLI', async ({ page }) => {
  // Test complete user journey with integrated commands
});
```

## Success Validation

### Acceptance Criteria
1. **All Commands Work**: Every .md file in commands/ processes correctly
2. **Workflow Chaining**: Multi-step workflows execute automatically  
3. **Error Recovery**: Failed steps don't break entire workflow
4. **Performance**: Command processing stays under 2 seconds
5. **User Experience**: No visible change for users, just better reliability

### Performance Benchmarks
- **Command Parse Time**: < 100ms per .md file
- **Workflow Build Time**: < 200ms for complex workflows
- **Execution Time**: < 2 seconds total user experience
- **Memory Usage**: < 50MB additional for workflow engine

## Dependencies

### Internal Dependencies
- `src/core/command-processor.js` - Core command processing
- `src/core/intelligent-router.js` - Agent routing
- `src/core/session-manager.js` - Context management
- `commands/*.md` - Command definitions

### External Dependencies
- No new external dependencies required
- Uses existing Node.js XML parsing capabilities

## Risk Mitigation

### Technical Risks
- **Risk**: Complex workflows may be slow
- **Mitigation**: Add workflow caching and optimization
- **Fallback**: Degrade to simple command processing

- **Risk**: .md file parsing errors break system
- **Mitigation**: Comprehensive validation and fallback processing
- **Fallback**: Skip problematic .md files, log for debugging

### User Experience Risks  
- **Risk**: Integration changes break existing workflows
- **Mitigation**: Extensive testing with current command set
- **Fallback**: Feature flag to disable integration if needed

## Completion Timeline

- **Week 1**: Enhanced markdown processing and XML parsing
- **Week 2**: Command integration layer and workflow engine
- **Week 3**: Core system integration and testing
- **Week 4**: Performance optimization and final validation

**Target Completion**: 2 weeks from start

## Success Impact

### For Vibe Coders
- Seamless command experience
- More reliable workflow execution
- Better error handling and recovery

### For System
- Foundation for advanced workflows
- Better command coordination
- Improved maintainability

### For Development
- Easier to add new commands
- Consistent command behavior
- Better debugging and monitoring