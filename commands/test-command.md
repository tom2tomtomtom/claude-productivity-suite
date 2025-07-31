# Test Command

<command_meta>
  <name>test-command</name>
  <type>testing</type>
  <routing>intelligent</routing>
  <cost_optimization>true</cost_optimization>
  <workflow_chain>true</workflow_chain>
</command_meta>

This is a test command to verify .md XML processing functionality.

## Overview

This command demonstrates the workflow step processing and XML metadata extraction.

<workflow_steps>
  <step number="1" name="initialize_test">
    <command>@initialize-test</command>
    <condition>always</condition>
    <description>Initialize the test environment</description>
  </step>
  
  <step number="2" name="execute_test">
    <command>@execute-test</command>
    <condition>after_initialize_test</condition>
    <description>Execute the main test logic</description>
  </step>
  
  <step number="3" name="validate_results">
    <command>@validate-results</command>
    <condition>after_execute_test</condition>
    <description>Validate test results and report outcome</description>
  </step>
</workflow_steps>

## Success Criteria

The test should complete all workflow steps successfully and demonstrate:
- XML metadata parsing
- Workflow step execution
- Condition evaluation
- Command integration

<validation_gates>
  <gate name="basic_functionality">
    <checks>
      - [ ] XML metadata parsed correctly
      - [ ] Workflow steps identified
      - [ ] Conditions evaluated properly
      - [ ] Integration working
    </checks>
  </gate>
</validation_gates>