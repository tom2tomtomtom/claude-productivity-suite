---
description: Analyze Codebase and Generate Quality Tasks
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# Analyze Codebase (Enhanced with Task System)

<ai_meta>
  <parsing_rules>
    - Process XML blocks first for structured data
    - Execute analysis in priority order
    - Generate actionable tasks with clear outcomes
    - Reference documentation throughout
  </parsing_rules>
  <file_conventions>
    - encoding: UTF-8
    - line_endings: LF
    - indent: 2 spaces
    - markdown_headers: no indentation
  </file_conventions>
</ai_meta>

## Overview

<purpose>
  - Perform comprehensive codebase analysis
  - Generate prioritized task list for improvements
  - Create trackable quality improvement plan
  - Reference standards and best practices
</purpose>

<context>
  - Part of Claude Productivity Suite Codebase-OS
  - Enhanced with Agent-OS style task system
  - Creates tasks in .claude-suite/quality/
</context>

<prerequisites>
  - Access to codebase
  - Standards defined in ~/.claude-suite/standards/
  - Project context in .claude-suite/project/
</prerequisites>

<process_flow>

<step number="1" name="prepare_analysis">

### Step 1: Prepare Analysis Environment

<step_metadata>
  <action>create analysis structure</action>
  <purpose>organize findings and tasks</purpose>
</step_metadata>

<directory_structure>
  <create>
    - .claude-suite/quality/
    - .claude-suite/quality/YYYY-MM-DD-analysis/
    - .claude-suite/quality/reports/
  </create>
</directory_structure>

<instructions>
  ACTION: Create quality tracking structure
  DOCUMENT: Analysis timestamp
  PREPARE: Report templates
</instructions>

</step>

<step number="2" name="analyze_codebase">

### Step 2: Comprehensive Code Analysis

<step_metadata>
  <action>deep codebase analysis</action>
  <references>
    - @~/.claude-suite/standards/code-style.md
    - @~/.claude-suite/standards/best-practices.md
    - @.claude-suite/project/tech-stack.md
  </references>
</step_metadata>

<analysis_categories>
  <code_quality>
    <metrics>
      - Complexity (functions > 10 cyclomatic)
      - File length (> 300 lines)
      - Function length (> 50 lines)
      - Nesting depth (> 4 levels)
    </metrics>
    <priority>high</priority>
  </code_quality>

  <code_style>
    <checks>
      - Naming conventions (@standards/code-style.md#naming)
      - Import organization
      - Consistent formatting
      - Comment quality
    </checks>
    <priority>medium</priority>
  </code_style>

  <technical_debt>
    <indicators>
      - TODO/FIXME comments
      - Duplicated code blocks
      - Deprecated API usage
      - Missing error handling
    </indicators>
    <priority>high</priority>
  </technical_debt>

  <security>
    <vulnerabilities>
      - Exposed secrets
      - SQL injection risks
      - XSS vulnerabilities
      - Outdated dependencies
    </vulnerabilities>
    <priority>critical</priority>
  </security>

  <performance>
    <bottlenecks>
      - N+1 queries
      - Unoptimized loops
      - Large bundle sizes
      - Missing caching
    </bottlenecks>
    <priority>medium</priority>
  </performance>

  <testing>
    <coverage>
      - Untested functions
      - Missing test files
      - Low coverage areas
      - Skipped tests
    </coverage>
    <priority>high</priority>
  </testing>
</analysis_categories>

<instructions>
  ACTION: Run all analysis categories
  REFERENCE: Check against standards
  COLLECT: Issues by category and priority
  QUANTIFY: Severity and impact
</instructions>

</step>

<step number="3" name="generate_report">

### Step 3: Generate Analysis Report

<step_metadata>
  <creates>analysis-report.md</creates>
  <location>.claude-suite/quality/YYYY-MM-DD-analysis/</location>
</step_metadata>

<report_template>
  # Codebase Analysis Report

  > Generated: [DATE]
  > Health Score: [SCORE]/100

  ## Executive Summary

  - **Critical Issues**: [COUNT]
  - **High Priority**: [COUNT]
  - **Medium Priority**: [COUNT]
  - **Low Priority**: [COUNT]

  ## Health Metrics

  ### Code Quality (Score: [X]/100)
  Checking against @~/.claude-suite/standards/code-style.md

  - Functions with high complexity: [COUNT]
  - Files exceeding size limits: [COUNT]
  - Deep nesting issues: [COUNT]

  ### Technical Debt (Score: [X]/100)
  Following @~/.claude-suite/standards/best-practices.md

  - TODOs/FIXMEs: [COUNT]
  - Duplicated code blocks: [COUNT]
  - Deprecated usage: [COUNT]

  ### Security (Score: [X]/100)
  - Vulnerabilities found: [COUNT]
  - Outdated dependencies: [COUNT]
  - Security hotspots: [COUNT]

  ### Testing (Score: [X]/100)
  - Overall coverage: [X]%
  - Untested functions: [COUNT]
  - Missing test files: [COUNT]

  ## Top Issues by Impact

  1. **[Issue Title]** (Critical)
     - Location: [File:Line]
     - Impact: [Description]
     - Fix effort: [Low/Medium/High]

  ## Recommendations

  Based on @~/.claude-suite/standards/best-practices.md:

  1. [Highest impact improvement]
  2. [Quick win improvement]
  3. [Long-term improvement]

  ## Next Steps

  See generated tasks in @.claude-suite/quality/YYYY-MM-DD-analysis/tasks.md
</report_template>

<instructions>
  ACTION: Create comprehensive report
  REFERENCE: Link to standards throughout
  PRIORITIZE: By impact and effort
  GENERATE: Actionable recommendations
</instructions>

</step>

<step number="4" name="generate_tasks">

### Step 4: Generate Task List

<step_metadata>
  <creates>tasks.md</creates>
  <follows>Agent-OS task format</follows>
</step_metadata>

<task_template>
  # Code Quality Improvement Tasks

  Generated from analysis in @.claude-suite/quality/YYYY-MM-DD-analysis/analysis-report.md

  > Created: [DATE]
  > Total Tasks: [COUNT]
  > Estimated Effort: [HOURS]

  ## Priority: Critical 🔴

  - [ ] 1. Fix Security Vulnerabilities
    - [ ] 1.1 Review security findings in @analysis-report.md#security
    - [ ] 1.2 Update dependencies with known vulnerabilities
    - [ ] 1.3 Fix SQL injection risk in [file]
    - [ ] 1.4 Remove exposed API keys from [file]
    - [ ] 1.5 Run security audit to verify fixes
    - [ ] 1.6 Document security improvements

  - [ ] 2. Resolve Critical Bugs
    - [ ] 2.1 Write tests for critical bug areas
    - [ ] 2.2 Fix [specific critical bug]
    - [ ] 2.3 Verify fixes don't break existing functionality
    - [ ] 2.4 Add regression tests

  ## Priority: High 🟠

  - [ ] 3. Improve Code Quality
    - [ ] 3.1 Review complexity issues from @analysis-report.md#code-quality
    - [ ] 3.2 Refactor [complex function] (complexity: [X])
      - Reference: @~/.claude-suite/standards/code-style.md#functions
    - [ ] 3.3 Split [large file] into modules
    - [ ] 3.4 Reduce nesting in [deeply nested code]
    - [ ] 3.5 Add missing error handling
    - [ ] 3.6 Verify all tests still pass

  - [ ] 4. Increase Test Coverage
    - [ ] 4.1 Review coverage gaps from @analysis-report.md#testing
    - [ ] 4.2 Write tests for [untested module]
    - [ ] 4.3 Add integration tests for [feature]
    - [ ] 4.4 Fix skipped tests
    - [ ] 4.5 Achieve [X]% coverage target

  ## Priority: Medium 🟡

  - [ ] 5. Clean Technical Debt
    - [ ] 5.1 Review debt items from @analysis-report.md#technical-debt
    - [ ] 5.2 Address TODO in [file:line]
    - [ ] 5.3 Remove duplicated code between [files]
    - [ ] 5.4 Update deprecated [API] usage
    - [ ] 5.5 Document debt resolution

  - [ ] 6. Standardize Code Style
    - [ ] 6.1 Apply standards from @~/.claude-suite/standards/code-style.md
    - [ ] 6.2 Fix naming convention violations
    - [ ] 6.3 Organize imports consistently
    - [ ] 6.4 Add missing JSDoc comments
    - [ ] 6.5 Run linter and fix all warnings

  ## Priority: Low 🟢

  - [ ] 7. Performance Optimizations
    - [ ] 7.1 Review bottlenecks from @analysis-report.md#performance
    - [ ] 7.2 Optimize [slow query]
    - [ ] 7.3 Implement caching for [expensive operation]
    - [ ] 7.4 Reduce bundle size
    - [ ] 7.5 Measure performance improvements

  ## Task Tracking

  - Total Tasks: [X]
  - Completed: [0]
  - In Progress: [0]
  - Blocked: [0]

  ## References

  - Analysis Report: @.claude-suite/quality/YYYY-MM-DD-analysis/analysis-report.md
  - Code Standards: @~/.claude-suite/standards/code-style.md
  - Best Practices: @~/.claude-suite/standards/best-practices.md
  - Project Context: @.claude-suite/project/
</task_template>

<task_generation_rules>
  <grouping>
    - Group by priority level
    - Order by impact within priority
    - Keep related tasks together
  </grouping>
  <subtasks>
    - First subtask: Review/analyze
    - Middle subtasks: Implementation
    - Final subtask: Verify/test
  </subtasks>
  <references>
    - Link to analysis report sections
    - Reference relevant standards
    - Include file locations
  </references>
</task_generation_rules>

<instructions>
  ACTION: Generate comprehensive task list
  STRUCTURE: Major tasks with subtasks
  REFERENCE: Link to findings and standards
  ESTIMATE: Effort for planning
</instructions>

</step>

<step number="5" name="create_quick_wins">

### Step 5: Identify Quick Wins

<step_metadata>
  <creates>quick-wins.md</creates>
  <purpose>immediate improvements</purpose>
</step_metadata>

<quick_wins_template>
  # Quick Wins - Start Here! 🚀

  These improvements can be done in under 30 minutes each:

  ## 🎯 Instant Impact

  1. **Remove Console Logs** (5 min)
     - Files: [List files with console.log]
     - Command: `/clean-codebase --console-only`

  2. **Fix Linting Errors** (10 min)
     - Count: [X] auto-fixable errors
     - Command: `npm run lint:fix`

  3. **Update Dependencies** (15 min)
     - Outdated: [X] packages
     - Command: `npm update`

  4. **Remove Unused Imports** (10 min)
     - Files affected: [X]
     - Tool: Your IDE's organize imports

  5. **Fix Naming Violations** (20 min)
     - Variables to rename: [List]
     - Reference: @~/.claude-suite/standards/code-style.md#naming

  ## 📊 Immediate Results

  Completing these will:
  - Improve health score by ~[X] points
  - Reduce warnings by [X]%
  - Make codebase cleaner for further work

  Start with these before tackling @tasks.md!
</quick_wins_template>

<instructions>
  ACTION: Identify low-effort, high-impact fixes
  PRIORITIZE: By immediate value
  ENABLE: Quick momentum building
</instructions>

</step>

<step number="6" name="setup_tracking">

### Step 6: Setup Progress Tracking

<step_metadata>
  <creates>progress.md</creates>
  <enables>task tracking</enables>
</step_metadata>

<progress_template>
  # Quality Improvement Progress

  > Started: [DATE]
  > Target Completion: [DATE]

  ## Overall Progress

  ```
  Total Tasks: [X]
  ███████████░░░░░░░░░ 55% Complete
  ```

  ## By Priority

  - Critical: [X/Y] ████████░░ 80%
  - High: [X/Y] ████░░░░░░ 40%
  - Medium: [X/Y] ██░░░░░░░░ 20%
  - Low: [X/Y] ░░░░░░░░░░ 0%

  ## Metrics Improvement

  | Metric | Start | Current | Target |
  |--------|-------|---------|--------|
  | Health Score | 65 | 72 | 85 |
  | Coverage | 45% | 52% | 80% |
  | Complexity | 15 | 12 | 8 |
  | Tech Debt | High | Medium | Low |

  ## Recent Completions

  - ✅ [DATE] Fixed critical security vulnerability
  - ✅ [DATE] Increased test coverage to 52%
  - ✅ [DATE] Refactored complex authentication logic

  ## Next Up

  See current focus in @tasks.md
</progress_template>

<instructions>
  ACTION: Create tracking system
  ENABLE: Progress visualization
  UPDATE: After task completion
</instructions>

</step>

<step number="7" name="execution_guidance">

### Step 7: Provide Execution Guidance

<step_metadata>
  <creates>README.md in quality folder</creates>
  <purpose>guide improvement process</purpose>
</step_metadata>

<guidance_template>
  # Code Quality Improvement Guide

  ## 📋 Your Quality Improvement Plan

  1. **Quick Wins** (@quick-wins.md)
     - Start here for immediate impact
     - Build momentum with easy fixes

  2. **Prioritized Tasks** (@tasks.md)
     - Work through by priority
     - Check off subtasks as completed

  3. **Track Progress** (@progress.md)
     - Update after each session
     - Celebrate improvements!

  ## 🔄 Workflow

  ### Daily Quality Time (30 min)
  ```
  1. Check @progress.md
  2. Pick next task from @tasks.md
  3. Complete subtasks in order
  4. Update progress
  5. Commit improvements
  ```

  ### Weekly Review
  ```
  1. Run /analyze-codebase again
  2. Compare new report to baseline
  3. Update @progress.md metrics
  4. Celebrate wins!
  ```

  ## 📊 Success Metrics

  You're succeeding when:
  - [ ] Health score improves each week
  - [ ] Critical issues resolved
  - [ ] Test coverage increasing
  - [ ] Team notices cleaner code

  ## 🔗 Resources

  - Standards: @~/.claude-suite/standards/
  - Original Analysis: @analysis-report.md
  - Task List: @tasks.md
  - Progress: @progress.md

  Let's make your codebase amazing! 💪
</guidance_template>

<instructions>
  ACTION: Create comprehensive guide
  ENABLE: Self-directed improvement
  MOTIVATE: Continuous progress
</instructions>

</step>

<step number="8" name="final_summary">

### Step 8: Present Results and Next Steps

<step_metadata>
  <action>summarize and guide</action>
  <purpose>enable immediate action</purpose>
</step_metadata>

<summary_template>
  ## ✅ Codebase Analysis Complete!

  I've analyzed your codebase and created a comprehensive improvement plan.

  ### 📊 Health Assessment

  **Overall Health Score: [SCORE]/100**

  - 🔴 Critical Issues: [COUNT] (fix immediately)
  - 🟠 High Priority: [COUNT] (fix this week)
  - 🟡 Medium Priority: [COUNT] (fix this month)
  - 🟢 Low Priority: [COUNT] (nice to have)

  ### 📁 Created for You

  Location: `.claude-suite/quality/[DATE]-analysis/`

  - **analysis-report.md** - Detailed findings
  - **tasks.md** - Prioritized task list with subtasks
  - **quick-wins.md** - Start here! (30 min fixes)
  - **progress.md** - Track your improvements
  - **README.md** - Your improvement guide

  ### 🚀 Next Steps

  1. **Right Now** (5 min):
     ```
     Check @.claude-suite/quality/[DATE]-analysis/quick-wins.md
     Pick one quick win and do it!
     ```

  2. **Today** (30 min):
     ```
     Review @.claude-suite/quality/[DATE]-analysis/tasks.md
     Start Task 1 (Critical priority)
     Check off completed subtasks
     ```

  3. **This Week**:
     ```
     Complete all Critical tasks
     Update @progress.md daily
     Run /monitor-quality to see improvements
     ```

  ### 💡 Pro Tips

  - Tasks reference standards: Follow the @ links
  - Each subtask builds on the previous
  - Update progress.md to stay motivated
  - Run analysis weekly to track improvement

  Ready to improve? Start with @quick-wins.md! 🎯
</summary_template>

<instructions>
  ACTION: Present clear summary
  ENABLE: Immediate action
  MOTIVATE: Show path to success
</instructions>

</step>

</process_flow>

## Error Handling

<error_scenarios>
  <scenario name="no_issues_found">
    <condition>Codebase is already high quality</condition>
    <action>Generate maintenance tasks and future-proofing suggestions</action>
  </scenario>
  
  <scenario name="overwhelming_issues">
    <condition>Too many issues to handle</condition>
    <action>Create phased approach with milestones</action>
  </scenario>
</error_scenarios>

## Integration with Other Commands

<workflow_integration>
  <clean_codebase>
    - Reference tasks.md for what to clean
    - Update progress.md after cleaning
  </clean_codebase>
  
  <monitor_quality>
    - Compare to baseline analysis
    - Track improvement trends
  </monitor_quality>
  
  <refactor_smart>
    - Use tasks.md as refactoring guide
    - Follow standards references
  </refactor_smart>
</workflow_integration>

## Execution Summary

<final_checklist>
  <verify>
    - [ ] Comprehensive analysis completed
    - [ ] Tasks generated with subtasks
    - [ ] All files reference standards
    - [ ] Quick wins identified
    - [ ] Progress tracking enabled
    - [ ] Clear next steps provided
  </verify>
</final_checklist>
