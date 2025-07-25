# 📚 Best Practices for Claude Productivity Suite

This guide covers proven practices for getting the most out of the Claude Productivity Suite.

## 🎯 General Principles

### 1. Start with Planning
Never jump straight into coding. Always:
- Use `/plan-product` for new features
- Create specs with `/create-spec`
- Review with `/analyze-product` if working on existing code

### 2. Maintain Daily Habits
- Morning: `/monitor-quality` to check code health
- During coding: Regular `/clean-codebase`
- Evening: `/analyze-codebase --today-only`

### 3. Test Early and Often
- Don't wait until deployment to test
- Use `/test-core-flows` after each feature
- Run `/pre-deploy-check` before any commit

## 💡 Command-Specific Best Practices

### Planning Commands (Agent-OS)

#### `/plan-product`
**Do:**
- Be specific about requirements
- Include user stories
- Define success metrics
- Consider edge cases

**Don't:**
- Skip the planning phase
- Make vague descriptions
- Ignore technical constraints

#### `/create-spec`
**Do:**
- Include acceptance criteria
- Define all API endpoints
- Specify validation rules
- Document error cases

**Don't:**
- Leave ambiguity
- Skip database design
- Forget about security

#### `/execute-tasks`
**Do:**
- Follow the spec exactly
- Commit frequently
- Write tests as you go
- Document complex logic

**Don't:**
- Deviate without updating spec
- Commit broken code
- Skip error handling

### Quality Commands (Codebase-OS)

#### `/analyze-codebase`
**Do:**
- Run weekly at minimum
- Address critical issues immediately
- Track trends over time
- Set quality baselines

**Don't:**
- Ignore the warnings
- Let debt accumulate
- Skip the analysis

#### `/clean-codebase`
**Do:**
- Use `--safe-only` flag when unsure
- Review changes before committing
- Run after feature completion
- Clean before refactoring

**Don't:**
- Run on uncommitted changes
- Skip the review
- Clean production code without testing

#### `/refactor-smart`
**Do:**
- Have good test coverage first
- Refactor in small steps
- Commit after each refactor
- Verify functionality preserved

**Don't:**
- Refactor without tests
- Make huge changes at once
- Mix refactoring with features

### Testing Commands

#### `/fix-and-test`
**Do:**
- Reserve 45+ minutes
- Run in clean environment
- Fix issues as found
- Document any manual fixes needed

**Don't:**
- Rush through it
- Skip sections
- Ignore warnings

#### `/pre-deploy-check`
**Do:**
- Run before EVERY deployment
- Fix all critical issues
- Use for quick validation
- Part of your CI/CD pipeline

**Don't:**
- Skip because "it's a small change"
- Deploy with failing checks
- Ignore security warnings

## 🔄 Workflow Best Practices

### Daily Development Workflow
```bash
# Morning (5 minutes)
/monitor-quality          # Check overnight CI results
/clean-codebase --safe   # Clean up any mess

# Before starting new work (10 minutes)
/analyze-product         # Understand current state
/create-spec feature-x   # Define what you'll build

# During development
/execute-tasks           # Let Claude help build
# Make manual adjustments
/test-core-flows        # Verify as you go

# Before committing (5 minutes)
/pre-deploy-check       # Quick validation
git add . && git commit -m "feat: add feature X"

# End of day (10 minutes)
/analyze-codebase --today-only  # Review today's work
/monitor-quality                # Check trends
```

### Weekly Maintenance Routine
```bash
# Monday - Planning
/analyze-codebase               # Weekly health check
/plan-product weekly-goals      # Plan the week

# Wednesday - Mid-week cleanup
/clean-codebase                 # Remove accumulated cruft
/refactor-smart --top-3         # Fix top 3 issues

# Friday - Quality check
/fix-and-test                   # Comprehensive testing
/monitor-quality --report       # Generate weekly report
```

### Pre-Release Workflow
```bash
# 1. Feature freeze
/analyze-codebase --comprehensive

# 2. Quality improvement
/clean-codebase
/refactor-smart
/fix-common-issues

# 3. Testing
/fix-and-test
/test-core-flows

# 4. Performance
/analyze-codebase --performance
# Optimize based on results

# 5. Security
/analyze-codebase --security
/pre-deploy-check

# 6. Documentation
/analyze-product --generate-docs

# 7. Final check
/railway-deploy  # Or platform-specific
```

## 🛡️ Security Best Practices

### 1. Never Commit Secrets
- Always run `/pre-deploy-check` - it scans for exposed keys
- Use environment variables
- Add `.env` to `.gitignore`

### 2. Regular Security Audits
```bash
/analyze-codebase --security-focus
/fix-common-issues  # Fixes basic security issues
```

### 3. Dependency Management
```bash
/monitor-quality --dependencies
# Updates and patches vulnerabilities
```

## 🚀 Performance Best Practices

### 1. Monitor Bundle Size
```bash
/analyze-codebase --bundle-analysis
```
Keep under 5MB for web apps

### 2. Optimize Images
```bash
/clean-codebase --optimize-assets
```

### 3. Database Queries
```bash
/analyze-codebase --query-performance
/refactor-smart --optimize-queries
```

## 🤝 Team Collaboration

### 1. Shared Standards
- Commit your `.claude/commands/` to git
- Document your workflow
- Create team-specific commands

### 2. Code Reviews
```bash
# Before PR
/pre-deploy-check
/analyze-codebase --changes-only

# Address review comments
/refactor-smart --from-reviews
```

### 3. Onboarding New Developers
```bash
# Have them run
/analyze-product  # Understand the codebase
/help            # See available commands
/daily-dev       # Learn the workflow
```

## 📊 Metrics to Track

### Code Quality Score
- Target: >85
- Minimum: >75
- Critical: <70 requires immediate action

### Test Coverage
- Target: >80%
- Minimum: >70%
- Critical: <60% blocks deployment

### Technical Debt
- Monitor weekly with `/monitor-quality`
- Address when >20% of codebase
- Prevent with daily `/clean-codebase`

## 🎯 Common Pitfalls to Avoid

### 1. Skipping Planning
❌ Going straight to `/execute-tasks`
✅ Always start with `/plan-product`

### 2. Ignoring Quality Warnings
❌ "I'll fix it later"
✅ Address issues immediately with `/clean-codebase`

### 3. Big Bang Refactoring
❌ Refactoring everything at once
✅ Small, incremental improvements with `/refactor-smart`

### 4. Testing After Everything is Built
❌ Writing all tests at the end
✅ Test as you build with `/test-core-flows`

### 5. Not Using Daily Workflows
❌ Ad-hoc command usage
✅ Consistent `/daily-dev` workflow

## 💰 Cost Optimization

### 1. Use Appropriate Commands
- Quick checks: `/pre-deploy-check` (5 min)
- Daily work: `/test-core-flows` (15 min)
- Comprehensive: `/fix-and-test` (45+ min)

### 2. Clear Context Regularly
```bash
/clear  # In Claude Code
```

### 3. Batch Operations
Instead of multiple small commands, use workflows:
```bash
/daily-dev  # Combines multiple operations
```

## 🎉 Success Stories

### "From 50% to 95% Test Coverage"
```bash
Daily: /monitor-quality --coverage
Weekly: /create-spec test-scenarios
Result: Bugs dropped by 80%
```

### "Reduced Bundle Size by 60%"
```bash
/analyze-codebase --bundle-analysis
/refactor-smart --tree-shake
/clean-codebase --optimize
```

### "Cut Development Time in Half"
```bash
/plan-product  # Clear roadmap
/create-spec   # No ambiguity
/execute-tasks # Claude builds faster
```

## 📚 Remember

The Claude Productivity Suite is most powerful when used consistently. Make it part of your daily routine, and you'll see dramatic improvements in:
- Code quality
- Development speed
- Bug reduction
- Team productivity

Start small, be consistent, and let the tools guide you to better development practices!
