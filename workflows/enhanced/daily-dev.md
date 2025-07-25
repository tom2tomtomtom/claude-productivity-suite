---
name: daily-dev
description: Enhanced Daily Development Workflow
estimated_time: 30 minutes
encoding: UTF-8
---

# Daily Development Workflow (Enhanced)

<workflow_meta>
  <description>Comprehensive daily development workflow with quality gates</description>
  <estimated_time>30-45 minutes</estimated_time>
  <prerequisites>
    - Git repository
    - All development tools installed
    - Previous day's work committed
  </prerequisites>
</workflow_meta>

## Workflow Overview

<purpose>
  - Start each day with clean, analyzed codebase
  - Identify and fix issues early
  - Maintain code quality continuously
  - Prepare for smooth deployments
</purpose>

<workflow_steps>

<step number="1" name="morning_sync">
  <command>git pull origin main</command>
  <purpose>Sync with latest changes</purpose>
  <condition>always</condition>
</step>

<step number="2" name="analyze_codebase">
  <command>@codebase-os/commands/analyze-codebase-v2.md</command>
  <purpose>Deep analysis of code health</purpose>
  <condition>always</condition>
  <expected_output>
    - Code quality metrics
    - Technical debt assessment
    - Security vulnerability scan
    - Performance bottlenecks
  </expected_output>
</step>

<step number="3" name="clean_if_needed">
  <command>@codebase-os/commands/clean-codebase-v2.md</command>
  <purpose>Fix identified issues</purpose>
  <condition>if_issues_found</condition>
  <decision_tree>
    IF critical_issues:
      EXECUTE immediately
    ELIF high_priority_issues > 5:
      EXECUTE with user confirmation
    ELSE:
      SKIP with note for later
  </decision_tree>
</step>

<step number="4" name="run_tests">
  <command>npm test</command>
  <purpose>Ensure nothing broken</purpose>
