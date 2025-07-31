# Fix Whatever Is Broken

<command_meta>
  <name>fix-whatever-is-broken</name>
  <description>Universal problem solver - automatically detects and fixes issues</description>
  <agent>testing-specialist</agent>
  <confidence>0.88</confidence>
  <token_estimate>600</token_estimate>
  <patterns>["error-detection", "auto-fix", "user-reassurance"]</patterns>
  <success_rate>0.94</success_rate>
</command_meta>

## Command Purpose

<purpose>
  <primary>Automatically detect and resolve any issues in the user's project</primary>
  <secondary>Provide clear, non-technical explanations of what was wrong</secondary>
  <tertiary>Learn from issues to prevent them in the future</tertiary>
</purpose>

## User Interaction Strategy

<interaction_style>
  <tone>reassuring, helpful, confident</tone>
  <approach>automatic detection and fixing with clear explanations</approach>
  <language_level>non-technical explanations</language_level>
</interaction_style>

## Diagnostic Process

<diagnostic_workflow>
  <step number="1" agent="testing-specialist" duration="30 seconds">
    <title>Scanning for Issues</title>
    <description>I'll check everything systematically to find any problems</description>
    <user_message>Don't worry! Let me scan everything and find what needs fixing...</user_message>
    <actions>
      - Check build process and dependencies
      - Validate code syntax and structure
      - Test functionality and user flows
      - Check responsive design
      - Verify deployment readiness
    </actions>
  </step>
  
  <step number="2" agent="testing-specialist" duration="1-2 min">
    <title>Analyzing Problems</title>
    <description>I'll understand what's causing each issue and plan the best fixes</description>
    <user_message>Found {{issue_count}} issues. Analyzing the best way to fix them...</user_message>
    <actions>
      - Categorize issues by severity
      - Identify root causes
      - Plan optimal fix sequence
      - Check for common patterns
    </actions>
  </step>
  
  <step number="3" agent="testing-specialist" duration="2-5 min">
    <title>Applying Fixes</title>
    <description>I'll fix each issue automatically and test the solutions</description>
    <user_message>Fixing issues automatically. This might take a few minutes...</user_message>
    <actions>
      - Apply fixes in order of priority
      - Test each fix before moving to next
      - Ensure fixes don't create new problems
      - Update code and configurations
    </actions>
  </step>
  
  <step number="4" agent="testing-specialist" duration="1 min">
    <title>Final Verification</title>
    <description>I'll test everything works perfectly now</description>
    <user_message>Running final tests to make sure everything works perfectly...</user_message>
    <actions>
      - Comprehensive functionality test
      - Cross-device compatibility check
      - Performance verification
      - Generate fix report
    </actions>
  </step>
</diagnostic_workflow>

## Issue Detection Categories

<issue_categories>
  <category name="build-errors" priority="critical" auto_fix="true">
    <description>Problems that prevent the app from building or running</description>
    <common_issues>
      - Missing dependencies
      - Syntax errors
      - Configuration problems
      - File path issues
    </common_issues>
    <fix_approach>immediate_resolution</fix_approach>
  </category>
  
  <category name="functional-bugs" priority="high" auto_fix="true">
    <description>Features that don't work as expected</description>
    <common_issues>
      - Broken links or navigation
      - Form submission problems
      - Image loading issues
      - JavaScript errors
    </common_issues>
    <fix_approach>targeted_repair</fix_approach>
  </category>
  
  <category name="design-issues" priority="medium" auto_fix="true">
    <description>Visual or layout problems</description>
    <common_issues>
      - Mobile responsiveness problems
      - Styling inconsistencies
      - Poor color contrast
      - Layout breaking on small screens
    </common_issues>
    <fix_approach>design_correction</fix_approach>
  </category>
  
  <category name="performance-issues" priority="medium" auto_fix="true">
    <description>App runs but could be faster or more efficient</description>
    <common_issues>
      - Large image files
      - Unused code
      - Inefficient loading
      - Memory leaks
    </common_issues>
    <fix_approach>optimization</fix_approach>
  </category>
  
  <category name="accessibility-issues" priority="low" auto_fix="true">
    <description>Problems that make the app harder to use for some people</description>
    <common_issues>
      - Missing alt text for images
      - Poor keyboard navigation
      - Insufficient color contrast
      - Missing form labels
    </common_issues>
    <fix_approach>accessibility_enhancement</fix_approach>
  </category>
</issue_categories>

## Auto-Fix Strategies

<fix_strategies>
  <strategy name="dependency-resolution">
    <description>Automatically install missing packages and resolve version conflicts</description>
    <pattern>[PATTERN:DEPENDENCY_FIX]</pattern>
    <success_rate>0.96</success_rate>
    <actions>
      - Scan package.json for missing dependencies
      - Install required packages automatically
      - Resolve version conflicts
      - Update lock files
    </actions>
  </strategy>
  
  <strategy name="syntax-correction">
    <description>Fix common syntax errors and code issues</description>
    <pattern>[PATTERN:SYNTAX_FIX]</pattern>
    <success_rate>0.91</success_rate>
    <actions>
      - Identify syntax errors
      - Apply standard corrections
      - Fix indentation and formatting
      - Validate corrections
    </actions>
  </strategy>
  
  <strategy name="responsive-design-fix">
    <description>Ensure app works perfectly on all devices</description>
    <pattern>[PATTERN:RESPONSIVE_FIX]</pattern>
    <success_rate>0.89</success_rate>
    <actions>
      - Test on multiple screen sizes
      - Fix layout breakpoints
      - Adjust mobile navigation
      - Optimize touch interactions
    </actions>
  </strategy>
  
  <strategy name="performance-optimization">
    <description>Make the app faster and more efficient</description>
    <pattern>[PATTERN:PERFORMANCE_FIX]</pattern>
    <success_rate>0.87</success_rate>
    <actions>
      - Compress images automatically
      - Remove unused code
      - Optimize loading sequences
      - Cache frequently used assets
    </actions>
  </strategy>
</fix_strategies>

## Success Response Templates

<success_responses>
  <response condition="no-issues-found">
    <message>✅ Great news! Everything looks perfect.</message>
    <details>
      I've thoroughly checked your app and couldn't find any issues. Your app is:
      
      • Building and running correctly
      • All features working as expected  
      • Looking good on all devices
      • Loading quickly and efficiently
      • Ready for users!
      
      Your app is in excellent shape. Keep up the great work!
    </details>
    <next_suggestion>/show-me-progress</next_suggestion>
  </response>
  
  <response condition="issues-fixed">
    <message>🔧 Fixed {{issue_count}} issues! Your app should work smoothly now.</message>
    <details>
      Here's what I fixed for you:
      
      {{#each fixed_issues}}
      ✅ **{{this.category}}**: {{this.description}}
         └─ **Solution**: {{this.fix_explanation}}
      {{/each}}
      
      Everything is working perfectly now! Your app is:
      • ✅ Building without errors
      • ✅ All features functional
      • ✅ Mobile-friendly design
      • ✅ Fast loading performance
    </details>
    <next_suggestion>/test-everything</next_suggestion>
  </response>
  
  <response condition="partial-fix">
    <message>🔧 Fixed {{fixed_count}} out of {{total_count}} issues.</message>
    <details>
      **Successfully Fixed:**
      {{#each fixed_issues}}
      ✅ {{this.description}}
      {{/each}}
      
      **Still Working On:**
      {{#each remaining_issues}}
      🔄 {{this.description}} - {{this.status}}
      {{/each}}
      
      The major issues are resolved and your app is much better now. I'll keep working on the remaining items automatically.
    </details>
    <next_suggestion>/fix-whatever-is-broken</next_suggestion>
  </response>
</success_responses>

## Learning Integration

<learning_system>
  <mistake_tracking>
    <track>Common error patterns by user type</track>
    <track>Fix success rates by issue category</track>
    <track>Time to resolution for different problems</track>
    <track>User satisfaction with fix explanations</track>
  </mistake_tracking>
  
  <pattern_improvement>
    <improve>Update fix strategies based on success rates</improve>
    <improve>Add new common issues to detection system</improve>
    <improve>Refine user explanations based on feedback</improve>
    <improve>Optimize fix ordering for better results</improve>
  </pattern_improvement>
</learning_system>

## Error Handling

<error_scenarios>
  <scenario name="cannot-detect-issues">
    <condition>Unable to scan project or detect problems</condition>
    <response>
      I'm having trouble scanning your project. This might be because:
      
      • The project structure is unusual
      • Some files might be locked or inaccessible
      • The project might be in an incomplete state
      
      Let me try a different approach. Could you tell me what specific problem you're experiencing? For example:
      • "The app won't load"
      • "Something looks wrong on mobile"
      • "I'm getting an error message"
      
      This will help me focus on the right area to fix.
    </response>
  </scenario>
  
  <scenario name="fix-failed">
    <condition>Attempted fix didn't work or caused new problems</condition>
    <response>
      I tried to fix the issue but it didn't work as expected. Don't worry - this happens sometimes with complex problems.
      
      Let me try a different approach:
      • I'll use a more conservative fix method
      • Or I can restore everything to the previous working state
      • Then we can try a step-by-step approach
      
      Would you like me to:
      1. Try a simpler fix approach
      2. Restore to the previous version and start over
      3. Get more specific about what's not working
    </response>
  </scenario>
  
  <scenario name="too-many-issues">
    <condition>Found overwhelming number of problems</condition>
    <response>
      I found quite a few issues, but don't worry! This is actually pretty normal for projects in development.
      
      Here's my plan:
      1. **First**: Fix the critical issues that prevent your app from working
      2. **Then**: Address the important functionality problems  
      3. **Finally**: Polish up the smaller details
      
      I'll work through them systematically. The most important thing is getting your app working again, then we'll make it perfect!
    </response>
  </scenario>
</error_scenarios>

## Pattern Optimization

<optimization_patterns>
  <pattern name="error-detection" token_savings="140">
    <description>Standard error scanning and categorization process</description>
    <reference>[PATTERN:ERROR_DETECTION_SCAN]</reference>
  </pattern>
  
  <pattern name="auto-fix" token_savings="200">
    <description>Common fix strategies and implementation approaches</description>
    <reference>[PATTERN:AUTO_FIX_STRATEGIES]</reference>
  </pattern>
  
  <pattern name="user-reassurance" token_savings="85">
    <description>Calming, confident communication during problem-solving</description>
    <reference>[PATTERN:REASSURING_COMMUNICATION]</reference>
  </pattern>
</optimization_patterns>