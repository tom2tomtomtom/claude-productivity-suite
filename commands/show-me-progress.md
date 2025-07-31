# Show Me Progress

<command_meta>
  <name>show-me-progress</name>
  <description>Visual progress dashboard showing what's been built and next steps</description>
  <agent>project-manager</agent>  
  <confidence>0.97</confidence>
  <token_estimate>400</token_estimate>
  <patterns>["progress-visualization", "status-summary", "next-steps-guidance"]</patterns>
  <success_rate>0.98</success_rate>
</command_meta>

## Command Purpose

<purpose>
  <primary>Provide clear, visual overview of project progress and accomplishments</primary>
  <secondary>Help users understand what they've built and feel proud of progress</secondary>
  <tertiary>Guide users toward logical next steps in their development journey</tertiary>
</purpose>

## User Interaction Strategy

<interaction_style>
  <tone>encouraging, celebratory, clear</tone>
  <approach>visual progress indicators with plain English explanations</approach>
  <language_level>focus on accomplishments and user-facing benefits</language_level>
</interaction_style>

## Progress Analysis Workflow

<workflow>
  <step number="1" agent="project-manager" duration="15 seconds">
    <title>Analyzing Project State</title>
    <description>I'll examine everything that's been built so far</description>
    <user_message>Let me check everything you've accomplished so far...</user_message>
    <actions>
      - Scan project structure and files
      - Identify completed features
      - Check functionality status
      - Assess design and styling state
      - Evaluate deployment readiness
    </actions>
  </step>
</workflow>

## Progress Categories

<progress_categories>
  <category name="core_functionality" weight="40">
    <description>Essential features that make your app work</description>
    <indicators>
      - App structure and navigation
      - Main features and pages
      - User interactions
      - Content management
    </indicators>
  </category>
  
  <category name="visual_design" weight="25">
    <description>How your app looks and feels to users</description>
    <indicators>
      - Color scheme and branding
      - Typography and layout
      - Mobile responsiveness
      - Visual polish and effects
    </indicators>
  </category>
  
  <category name="quality_assurance" weight="20">
    <description>Testing and reliability of your app</description>
    <indicators>
      - Functionality testing
      - Cross-device compatibility
      - Performance optimization
      - Error handling
    </indicators>
  </category>
  
  <category name="deployment_readiness" weight="15">
    <description>Preparation for going live</description>
    <indicators>
      - Production optimization
      - Security configuration
      - Performance benchmarks
      - Launch readiness
    </indicators>
  </category>
</progress_categories>

## Progress Display Templates

<progress_templates>
  <template name="early_stage" condition="overall_progress < 30">
    <title>🌱 Great Start! Your App is Taking Shape</title>
    <message>You're in the early stages of building something awesome!</message>
    <visualization>
      **Progress Overview**
      ```
      Overall Progress: [██░░░░░░░░] {{overall_percentage}}%
      
      🏗️  Core Features:    [{{core_bar}}] {{core_percentage}}%
      🎨  Visual Design:    [{{design_bar}}] {{design_percentage}}%
      🧪  Quality Check:    [{{quality_bar}}] {{quality_percentage}}%
      🚀  Launch Ready:     [{{launch_bar}}] {{launch_percentage}}%
      ```
    </visualization>
  </template>
  
  <template name="mid_stage" condition="overall_progress >= 30 && overall_progress < 70">
    <title>🚧 Looking Good! Your App is Coming Together</title>
    <message>Excellent progress! You're building something really solid.</message>
    <visualization>
      **Progress Overview**
      ```
      Overall Progress: [██████░░░░] {{overall_percentage}}%
      
      🏗️  Core Features:    [{{core_bar}}] {{core_percentage}}%
      🎨  Visual Design:    [{{design_bar}}] {{design_percentage}}%
      🧪  Quality Check:    [{{quality_bar}}] {{quality_percentage}}%
      🚀  Launch Ready:     [{{launch_bar}}] {{launch_percentage}}%
      ```
    </visualization>
  </template>
  
  <template name="advanced_stage" condition="overall_progress >= 70 && overall_progress < 95">
    <title>⭐ Almost There! Your App is Nearly Complete</title>
    <message>Fantastic work! You're so close to having a fully finished app.</message>
    <visualization>
      **Progress Overview**
      ```
      Overall Progress: [████████░░] {{overall_percentage}}%
      
      🏗️  Core Features:    [{{core_bar}}] {{core_percentage}}%
      🎨  Visual Design:    [{{design_bar}}] {{design_percentage}}%
      🧪  Quality Check:    [{{quality_bar}}] {{quality_percentage}}%
      🚀  Launch Ready:     [{{launch_bar}}] {{launch_percentage}}%
      ```
    </visualization>
  </template>
  
  <template name="complete_stage" condition="overall_progress >= 95">
    <title>🎉 Congratulations! Your App is Complete</title>
    <message>Amazing achievement! You've built a complete, professional app.</message>
    <visualization>
      **Progress Overview**
      ```
      Overall Progress: [██████████] {{overall_percentage}}%
      
      🏗️  Core Features:    [{{core_bar}}] {{core_percentage}}%
      🎨  Visual Design:    [{{design_bar}}] {{design_percentage}}%
      🧪  Quality Check:    [{{quality_bar}}] {{quality_percentage}}%
      🚀  Launch Ready:     [{{launch_bar}}] {{launch_percentage}}%
      ```
    </visualization>
  </template>
</progress_templates>

## Accomplishment Highlighting

<accomplishments>
  <highlight_completed>
    **✅ What You've Accomplished:**
    {{#each completed_features}}
    • **{{this.name}}** - {{this.description}}
    {{/each}}
    
    {{#if major_milestones}}
    **🏆 Major Milestones Reached:**
    {{#each major_milestones}}
    • {{this.title}} - {{this.impact}}
    {{/each}}
    {{/if}}
  </highlight_completed>
  
  <technical_summary>
    **🔧 Technical Foundation:**
    • **App Type**: {{app_type}}
    • **Pages Created**: {{page_count}}
    • **Features Built**: {{feature_count}}
    • **Design Style**: {{design_style}}
    • **Mobile Ready**: {{mobile_status}}
    
    **📊 Quality Metrics:**
    • **Functionality**: {{functionality_score}}/100
    • **Design**: {{design_score}}/100  
    • **Performance**: {{performance_score}}/100
    • **Mobile Experience**: {{mobile_score}}/100
  </technical_summary>
</accomplishments>

## Smart Next Steps Recommendations

<next_steps_logic>
  <recommendation condition="core_functionality < 70">
    <priority>high</priority>
    <command>/build-my-app</command>
    <reason>Continue building core features</reason>
    <benefit>Get your app's essential functionality working</benefit>
  </recommendation>
  
  <recommendation condition="core_functionality >= 70 && visual_design < 60">
    <priority>high</priority>
    <command>/make-it-look-better</command>
    <reason>Enhance visual design and user experience</reason>
    <benefit>Make your app look professional and polished</benefit>
  </recommendation>
  
  <recommendation condition="visual_design >= 60 && quality_assurance < 70">
    <priority>medium</priority>
    <command>/test-everything</command>
    <reason>Run comprehensive testing</reason>
    <benefit>Ensure everything works perfectly</benefit>
  </recommendation>
  
  <recommendation condition="quality_assurance >= 70 && deployment_readiness < 80">
    <priority>high</priority>
    <command>/deploy-when-ready</command>
    <reason>Launch your app to the world</reason>
    <benefit>Make your app accessible to users</benefit>
  </recommendation>
  
  <recommendation condition="overall_progress >= 80">
    <priority>medium</priority>
    <command>/add-this-feature</command>
    <reason>Add advanced features or enhancements</reason>
    <benefit>Take your app to the next level</benefit>
  </recommendation>
</next_steps_logic>

## Success Response Template

<success_response>
  <progress_header>
    {{progress_template_title}}
    
    {{progress_visualization}}
  </progress_header>
  
  <accomplishments_section>
    {{accomplishments_summary}}
    
    **🎯 What This Means:**
    You've created {{achievement_description}}. This is {{progress_encouragement}}.
    
    {{#if live_url}}
    **🌐 Your Live App**: {{live_url}}
    {{/if}}
  </accomplishments_section>
  
  <detailed_breakdown>
    **📋 Detailed Breakdown:**
    
    {{#each progress_details}}
    **{{this.category}}** ({{this.percentage}}% complete)
    {{#each this.items}}
    {{#if this.completed}}✅{{else}}⏳{{/if}} {{this.name}} - {{this.status}}
    {{/each}}
    
    {{/each}}
  </detailed_breakdown>
  
  <next_steps>
    **🚀 Recommended Next Steps:**
    
    {{#each smart_recommendations}}
    **{{@index + 1}}. {{this.command}}**
    • **Why**: {{this.reason}}
    • **Benefit**: {{this.benefit}}
    • **Impact**: {{this.impact}}
    
    {{/each}}
    
    **💡 Quick Wins Available:**
    {{#each quick_wins}}
    • {{this.command}} - {{this.description}} ({{this.time_estimate}})
    {{/each}}
  </next_steps>
  
  <encouragement>
    **🌟 Keep Going!**
    
    {{encouragement_message}}
    
    {{#if progress_comparison}}
    **📈 Your Progress Journey:**
    {{progress_comparison}}
    {{/if}}
    
    Every step you take is building something valuable. You should be proud of what you've accomplished!
  </encouragement>
</success_response>

## Progress Calculation Logic

<calculation_logic>
  <core_functionality_score>
    <factor name="basic_structure" weight="25">App has navigation and basic layout</factor>
    <factor name="main_features" weight="40">Primary functionality is working</factor>
    <factor name="content_populated" weight="20">Content and data are in place</factor>
    <factor name="user_interactions" weight="15">Forms, buttons, and interactions work</factor>
  </core_functionality_score>
  
  <visual_design_score>
    <factor name="color_scheme" weight="25">Professional colors applied</factor>
    <factor name="typography" weight="20">Good fonts and text styling</factor>
    <factor name="layout_quality" weight="25">Well-organized, visually appealing layout</factor>
    <factor name="mobile_responsive" weight="30">Works well on all devices</factor>
  </visual_design_score>
  
  <quality_assurance_score>
    <factor name="functionality_tested" weight="40">All features work as expected</factor>
    <factor name="cross_browser" weight="20">Works in different browsers</factor>
    <factor name="performance" weight="25">Loads quickly and runs smoothly</factor>
    <factor name="error_handling" weight="15">Graceful error management</factor>
  </quality_assurance_score>
  
  <deployment_readiness_score>
    <factor name="optimization" weight="30">Files optimized for production</factor>
    <factor name="security" weight="25">Basic security measures in place</factor>
    <factor name="hosting_ready" weight="25">Prepared for deployment</factor>
    <factor name="monitoring" weight="20">Analytics and monitoring setup</factor>
  </deployment_readiness_score>
</calculation_logic>

## Milestone Recognition

<milestones>
  <milestone name="first_build" trigger="core_functionality >= 30">
    <title>🎯 First Build Complete!</title>
    <message>Your app is taking real shape now. You've got the foundation in place!</message>
    <celebration>This is a huge step - you've gone from idea to working app structure.</celebration>
  </milestone>
  
  <milestone name="functional_app" trigger="core_functionality >= 70">
    <title>⚡ Functional App Achieved!</title>
    <message>All your main features are working. Users could actually use this!</message>
    <celebration>This is major! You now have a working application that does what you envisioned.</celebration>
  </milestone>
  
  <milestone name="professional_design" trigger="visual_design >= 80">
    <title>🎨 Professional Design Achieved!</title>
    <message>Your app looks amazing and professional. Design-wise, you're ready for prime time!</message>
    <celebration>Visual impact achieved! Your app now looks like it was made by a professional team.</celebration>
  </milestone>
  
  <milestone name="launch_ready" trigger="deployment_readiness >= 80">
    <title>🚀 Launch Ready!</title>
    <message>Your app is ready to go live! Everything is optimized and prepared for users.</message>
    <celebration>This is it! You've built something ready for the world to see and use.</celebration>
  </milestone>
  
  <milestone name="complete_success" trigger="overall_progress >= 95">
    <title>🏆 Complete Success!</title>
    <message>You've built a complete, professional, live application. This is a major achievement!</message>
    <celebration>Incredible accomplishment! You've taken an idea and turned it into reality.</celebration>
  </milestone>
</milestones>

## Pattern Optimization

<optimization_patterns>
  <pattern name="progress-visualization" token_savings="110">
    <description>Standard progress bar and status display formatting</description>
    <reference>[PATTERN:PROGRESS_VISUALIZATION]</reference>
  </pattern>
  
  <pattern name="status-summary" token_savings="90">
    <description>Accomplishment highlighting and technical summary</description>
    <reference>[PATTERN:STATUS_SUMMARY]</reference>
  </pattern>
  
  <pattern name="next-steps-guidance" token_savings="75">
    <description>Smart recommendation system based on project state</description>
    <reference>[PATTERN:NEXT_STEPS_GUIDANCE]</reference>
  </pattern>
</optimization_patterns>