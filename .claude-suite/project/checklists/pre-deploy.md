# Pre-Deployment Checklist

<validation_gates>
  <gate name="code_quality">
    <checks>
      - [ ] No ESLint errors (npm run lint)
      - [ ] All files properly formatted
      - [ ] No console.log statements in production code
      - [ ] No TODO comments in critical paths
      - [ ] All functions properly documented
    </checks>
  </gate>

  <gate name="tests">
    <checks>
      - [ ] All unit tests pass (npm run test:unit)
      - [ ] All Playwright E2E tests pass (npm run test)
      - [ ] Build process successful (npm run build)
      - [ ] No skipped or disabled tests
      - [ ] Test coverage adequate for new features
    </checks>
  </gate>

  <gate name="vibe_coding_functionality">
    <checks>
      - [ ] Natural language interpretation working
      - [ ] Agent routing functioning correctly
      - [ ] Token optimization patterns active
      - [ ] .md XML command integration functional
      - [ ] Sample vibe → app pipeline works end-to-end
    </checks>
  </gate>

  <gate name="agent_specialists">
    <checks>
      - [ ] Base agent system functional
      - [ ] Implemented specialists working correctly
      - [ ] Planned specialists properly documented
      - [ ] Routing logic distributes tasks appropriately
      - [ ] Agent communication protocols working
    </checks>
  </gate>

  <gate name="cost_optimization">
    <checks>
      - [ ] Token usage tracking active
      - [ ] Pattern recognition reducing token usage
      - [ ] Context compression working
      - [ ] Target 50-85% reduction being achieved
      - [ ] Cost analytics providing useful data
    </checks>
  </gate>

  <gate name="user_experience">
    <checks>
      - [ ] CLI interface responsive and intuitive  
      - [ ] Error messages non-coder friendly
      - [ ] Progress feedback clear and encouraging
      - [ ] Help system accessible and useful
      - [ ] Session management preserving context
    </checks>
  </gate>

  <gate name="documentation">
    <checks>
      - [ ] .claude-suite/project/ documentation current
      - [ ] Roadmap reflects actual implementation status  
      - [ ] Tech stack documentation accurate
      - [ ] Workflow documentation matches code
      - [ ] README files updated
    </checks>
  </gate>

  <gate name="integration">
    <checks>
      - [ ] Command files (commands/*.md) processing correctly
      - [ ] Intelligence system components coordinating
      - [ ] Health monitoring providing accurate status
      - [ ] Session persistence working across restarts
      - [ ] Recovery system handling errors gracefully
    </checks>
  </gate>
</validation_gates>

## Critical Success Factors

### 1. Vibe Coding Pipeline
The core value proposition must work:
```
User vibe → AI interpretation → Agent routing → Code generation → Working app
```

### 2. Cost Effectiveness  
Token usage must be optimized:
- Pattern reuse reducing repetitive processing
- Context compression maintaining quality
- Smart routing minimizing unnecessary operations

### 3. Non-Coder Experience
Interface must remain accessible:
- Natural language commands working
- Error recovery transparent and helpful
- Progress feedback encouraging and clear

## Performance Benchmarks

- **Vibe Processing Time**: < 30 seconds for interpretation
- **Simple App Generation**: < 5 minutes end-to-end
- **Token Efficiency**: 50%+ reduction from baseline
- **Error Recovery Rate**: 90%+ automatic resolution
- **User Satisfaction**: Clear, encouraging feedback

## Pre-Deploy Command Sequence

```bash
# 1. Code quality
npm run lint
npm run format

# 2. Testing
npm run test:unit
npm run test
npm run build

# 3. System health
node src/index.js health

# 4. Integration test
node src/index.js start
# Test sample vibe: "build me a simple todo app"

# 5. Documentation check
# Verify .claude-suite/project/ files are current
```

## Deployment Readiness Criteria

✅ **Ready to Deploy** when:
- All validation gates pass
- Sample vibe coding works end-to-end
- Token optimization active and effective
- Documentation current and accurate
- No critical errors in health monitoring

🚫 **Not Ready** if:
- Core vibe coding pipeline fails
- Token usage not optimized
- Agent routing not functional
- Critical tests failing
- User experience broken or confusing