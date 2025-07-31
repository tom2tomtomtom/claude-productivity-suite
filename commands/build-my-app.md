# Build My App

<command_meta>
  <name>build-my-app</name>
  <description>Build an app from natural language description - perfect for non-coders</description>
  <agent>project-manager</agent>
  <confidence>0.95</confidence>
  <token_estimate>800</token_estimate>
  <patterns>["app-template-selection", "user-requirements", "gentle-questions"]</patterns>
  <success_rate>0.92</success_rate>
</command_meta>

## User Interaction Strategy

<interaction_style>
  <tone>friendly, encouraging, non-technical</tone>
  <approach>gentle questions, clear explanations</approach>
  <language_level>beginner-friendly</language_level>
</interaction_style>

## Required Information

<questions>
  <question id="app-description" required="true" priority="1">
    <text>What would you like to build?</text>
    <example>"a website for my bakery" or "personal portfolio"</example>
    <help>Describe your idea in plain English - I'll handle all the technical details</help>
  </question>
  
  <question id="app-type" required="true" priority="2" condition="unclear-from-description">
    <text>What type of app is this?</text>
    <options>
      <option value="business-website">Business Website</option>
      <option value="online-store">Online Store</option>
      <option value="portfolio">Personal Portfolio</option>
      <option value="blog">Blog/News Site</option>
      <option value="landing-page">Simple Landing Page</option>
    </options>
    <help>This helps me choose the right features and layout</help>
  </question>
  
  <question id="target-users" required="true" priority="3">
    <text>Who will use this app?</text>
    <example>"my customers", "just me", "friends and family"</example>
    <help>Understanding your audience helps me design the right experience</help>
  </question>
  
  <question id="style-preference" required="false" priority="4">
    <text>Any style preferences?</text>
    <options>
      <option value="professional">Professional and clean</option>
      <option value="modern">Modern and stylish</option>
      <option value="warm">Warm and friendly</option>
      <option value="minimal">Simple and minimal</option>
      <option value="creative">Creative and unique</option>
    </options>
    <default>professional</default>
    <help>I can always change this later with '/make-it-look-better'</help>
  </question>
</questions>

## Workflow Steps

<workflow>
  <step number="1" agent="project-manager" duration="1-2 min">
    <title>Understanding Your Vision</title>
    <description>I'll ask a few friendly questions to understand exactly what you want</description>
    <user_message>Let me understand your vision with a few quick questions...</user_message>
    <actions>
      - Parse user description for app type and features
      - Ask only essential clarifying questions
      - Keep questions simple and non-technical
      - Show enthusiasm for their idea
    </actions>
  </step>
  
  <step number="2" agent="project-manager" duration="30 seconds">
    <title>Choosing the Perfect Template</title>
    <description>I'll select the best starting template for your app type</description>
    <user_message>Perfect! I know exactly what you need. Selecting the best approach...</user_message>
    <actions>
      - Match requirements to optimal template
      - Consider user experience level
      - Choose appropriate complexity level
      - Prepare customization plan
    </actions>
  </step>
  
  <step number="3" agent="frontend-specialist" duration="3-5 min">
    <title>Building Your App</title>
    <description>I'll build all the core features and pages you need</description>
    <user_message>Building your {{app_type}} with all the essential features...</user_message>
    <actions>
      - Apply selected template
      - Customize content and structure
      - Add requested features
      - Ensure responsive design
      - Test basic functionality
    </actions>
  </step>
  
  <step number="4" agent="frontend-specialist" duration="2-3 min">
    <title>Making It Look Professional</title>
    <description>I'll apply professional styling and ensure it works on all devices</description>
    <user_message>Adding professional styling and making it mobile-friendly...</user_message>
    <actions>
      - Apply {{style_preference}} styling
      - Ensure mobile responsiveness
      - Optimize images and assets
      - Add professional touches
      - Test across devices
    </actions>
  </step>
  
  <step number="5" agent="project-manager" duration="1 min">
    <title>Final Quality Check</title>
    <description>I'll test everything works perfectly and prepare your app</description>
    <user_message>Running final quality checks and preparing your app...</user_message>
    <actions>
      - Test all functionality
      - Verify responsive design
      - Check loading performance
      - Prepare deployment
      - Generate preview
    </actions>
  </step>
</workflow>

## Template Selection Logic

<template_mapping>
  <mapping condition="app-type=business-website">
    <template>business-website.md</template>
    <features>["homepage", "about", "services", "contact", "gallery"]</features>
    <estimated_time>8-12 minutes</estimated_time>
  </mapping>
  
  <mapping condition="app-type=online-store">
    <template>online-store.md</template>
    <features>["product-catalog", "shopping-cart", "checkout", "user-accounts"]</features>
    <estimated_time>12-18 minutes</estimated_time>
  </mapping>
  
  <mapping condition="app-type=portfolio">
    <template>portfolio.md</template>
    <features>["project-showcase", "about-me", "contact", "resume"]</features>
    <estimated_time>6-10 minutes</estimated_time>
  </mapping>
  
  <mapping condition="app-type=blog">
    <template>blog.md</template>
    <features>["post-listing", "individual-posts", "categories", "about"]</features>
    <estimated_time>8-12 minutes</estimated_time>
  </mapping>
  
  <mapping condition="app-type=landing-page">
    <template>landing-page.md</template>
    <features>["hero-section", "benefits", "call-to-action", "contact"]</features>
    <estimated_time>4-6 minutes</estimated_time>
  </mapping>
</template_mapping>

## Success Response Template

<success_response>
  <message>🎉 Your {{app_type}} is built and ready!</message>
  
  <summary>
    I've created your {{app_type}} with all the essential features:
    {{#each features}}
    • {{this}}
    {{/each}}
    
    Your app is:
    ✅ Professional-looking and polished
    ✅ Mobile-friendly (works on phones, tablets, computers)
    ✅ Fast-loading and optimized
    ✅ Ready to customize further
  </summary>
  
  <next_steps>
    <immediate>
      <command>/make-it-look-better</command>
      <reason>Add advanced styling and visual polish</reason>
      <benefit>Make your app look even more professional and unique</benefit>
    </immediate>
    
    <alternatives>
      <option>
        <command>/show-me-progress</command>
        <reason>See detailed breakdown of what was built</reason>
      </option>
      <option>
        <command>/add-this-feature "describe what you want"</command>
        <reason>Add specific functionality you thought of</reason>
      </option>
      <option>
        <command>/test-everything</command>
        <reason>Run comprehensive tests to ensure everything works</reason>
      </option>
    </alternatives>
  </next_steps>
  
  <completion_status>70</completion_status>
  
  <user_friendly_explanation>
    <what_happened>
      I built your complete {{app_type}} from scratch, including all the pages and features you need. Everything is connected and working together smoothly.
    </what_happened>
    
    <technical_simple>
      Think of it like I constructed a house: I built the foundation (structure), added the rooms (pages), connected the plumbing and electricity (functionality), and gave it a nice coat of paint (styling).
    </technical_simple>
    
    <what_you_can_expect>
      • Your app works perfectly on phones, tablets, and computers
      • Visitors will find it professional and trustworthy
      • All the essential features are ready to use
      • You can easily add more features later
    </what_you_can_expect>
  </user_friendly_explanation>
</success_response>

## Error Handling

<error_scenarios>
  <scenario name="unclear-description">
    <condition>User description is too vague or confusing</condition>
    <response>
      I'd love to help build your app! Could you tell me a bit more about what you have in mind? 
      
      For example:
      • "A website for my restaurant with menu and contact info"
      • "Personal portfolio to show my photography work"  
      • "Online store to sell handmade jewelry"
      
      Even a simple description helps me understand what you need!
    </response>
  </scenario>
  
  <scenario name="too-complex">
    <condition>Request seems very complex for a beginner</condition>
    <response>
      That sounds like an amazing project! It's a bit complex, so let me suggest we start with a simpler version first, then add features step by step.
      
      How about we begin with the core features and build from there? This way you'll see progress quickly and we can perfect each part.
    </response>
  </scenario>
  
  <scenario name="technical-jargon">
    <condition>User uses technical terms they might not understand</condition>
    <response>
      I can definitely help with that! Let me handle all the technical details - you just focus on what you want your app to do for your users.
      
      Tell me more about the experience you want to create, and I'll take care of making it happen.
    </response>
  </scenario>
</error_scenarios>

## Pattern Optimization

<optimization_patterns>
  <pattern name="app-template-selection" token_savings="180">
    <description>Reuse template selection logic instead of explaining from scratch</description>
    <reference>[PATTERN:APP_TEMPLATE_SELECTION]</reference>
  </pattern>
  
  <pattern name="user-requirements" token_savings="95">
    <description>Standard requirement gathering flow</description>
    <reference>[PATTERN:USER_REQUIREMENTS_FLOW]</reference>
  </pattern>
  
  <pattern name="gentle-questions" token_savings="120">
    <description>Non-intimidating question asking approach</description>
    <reference>[PATTERN:GENTLE_QUESTIONING]</reference>
  </pattern>
</optimization_patterns>