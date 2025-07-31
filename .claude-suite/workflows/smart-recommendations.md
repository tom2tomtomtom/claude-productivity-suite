# Smart Command Recommendations

<workflow_meta>
  <name>smart-recommendations</name>
  <description>Intelligent command ordering recommendations for optimal non-coder experience</description>
  <automation_level>guided</automation_level>
</workflow_meta>

## 🎯 Recommended Command Sequences

### For Complete Beginners (Never Built An App)
```bash
# Step 1: Start with your idea
/build-my-app "your app idea here"

# Step 2: Check progress and understand what's happening  
/show-me-progress

# Step 3: If anything breaks, fix it automatically
/fix-whatever-is-broken

# Step 4: Make it look professional
/make-it-look-better

# Step 5: Test everything works
/test-everything

# Step 6: Put it online for others to use
/deploy-when-ready
```

### For Building Your Second App (Learning Mode)
```bash
# Step 1: See what the system learned about you
/intelligence-dashboard

# Step 2: Build using your learned patterns
/build-my-app "new app idea"

# Step 3: Apply optimizations from previous experience
/optimize-tokens

# Step 4: Continue with standard workflow
/show-me-progress → /make-it-look-better → /deploy-when-ready
```

### For Improving An Existing App
```bash
# Step 1: Understand current state
/analyze-codebase

# Step 2: Add your new feature
/add-this-feature "describe what you want to add"

# Step 3: Make sure everything still works
/test-everything

# Step 4: Deploy improvements
/deploy-when-ready
```

### When Things Go Wrong
```bash
# First, try automatic fix
/fix-whatever-is-broken

# If still having issues, get detailed help
/intelligence-dashboard

# For complex problems, route to right specialist
/route-to-specialist "describe the problem"

# Reset and try simpler approach if needed
/start-over-simpler
```

## 🧠 Intelligent Recommendations System

### Context-Aware Suggestions
The system analyzes your current situation and recommends the best next command:

#### New User Indicators
- **Detected**: First time using system, no previous projects
- **Recommended Start**: `/build-my-app` with detailed guidance
- **Next Steps**: Progress checking and visual feedback prioritized

#### Returning User Indicators  
- **Detected**: Previous successful projects, learned preferences
- **Recommended Start**: `/intelligence-dashboard` then optimized workflows
- **Next Steps**: Pattern reuse and efficiency optimization

#### Error State Indicators
- **Detected**: Previous command failed or user expressed confusion
- **Recommended Action**: `/fix-whatever-is-broken` with gentle explanation
- **Next Steps**: Simplified approach with more guidance

#### Feature Addition Indicators
- **Detected**: Existing project, want to add functionality
- **Recommended Action**: `/add-this-feature` with current context analysis
- **Next Steps**: Targeted testing and deployment

### Smart Workflow Branching

<recommendation_logic>
  <scenario name="first_time_user">
    <conditions>
      - No previous project history
      - New to development
      - Expressed uncertainty
    </conditions>
    <recommendations>
      1. "/build-my-app" - Start with their idea
      2. "/show-me-progress" - Build confidence with visibility
      3. "/make-it-look-better" - Early win with visual improvements
      4. "/deploy-when-ready" - Satisfaction from working result
    </recommendations>
  </scenario>

  <scenario name="learning_user">
    <conditions>
      - 1-3 previous projects
      - Some experience but still learning
      - Wants to improve efficiency
    </conditions>
    <recommendations>
      1. "/intelligence-dashboard" - Show system learning
      2. "/build-my-app" - Leverage learned patterns
      3. "/optimize-tokens" - Teach efficiency concepts
      4. Standard deployment workflow
    </recommendations>
  </scenario>

  <scenario name="error_recovery">
    <conditions>
      - Previous command failed
      - User expressed frustration
      - Multiple attempts unsuccessful
    </conditions>
    <recommendations>
      1. "/fix-whatever-is-broken" - Immediate problem solving
      2. "/start-over-simpler" - If complex approach failing
      3. "/route-to-specialist" - For persistent issues
      4. "/show-me-progress" - Rebuild confidence
    </recommendations>
  </scenario>

  <scenario name="feature_expansion">
    <conditions>
      - Existing working project
      - Want to add functionality
      - Basic app already deployed
    </conditions>
    <recommendations>
      1. "/analyze-codebase" - Understand current state
      2. "/add-this-feature" - Targeted feature addition
      3. "/test-everything" - Ensure stability
      4. "/deploy-when-ready" - Push improvements
    </recommendations>
  </scenario>
</recommendation_logic>

## 📋 Guided Workflow Templates

### Template: Complete Beginner Journey
```
🎯 GOAL: Build your first app from idea to live website

RECOMMENDED PATH:
┌─ Step 1: /build-my-app "your idea"
│  ├─ EXPECT: System asks clarifying questions
│  └─ RESULT: Development begins with clear explanation
│
├─ Step 2: /show-me-progress  
│  ├─ EXPECT: Visual progress dashboard
│  └─ RESULT: Understanding of what's being built
│
├─ Step 3: /make-it-look-better
│  ├─ EXPECT: Visual improvements applied
│  └─ RESULT: Professional-looking app
│
├─ Step 4: /test-everything
│  ├─ EXPECT: Automated testing with results
│  └─ RESULT: Confidence app works correctly
│
└─ Step 5: /deploy-when-ready
   ├─ EXPECT: App published with live URL
   └─ RESULT: Working app others can use

ESTIMATED TIME: 30-60 minutes
SUCCESS RATE: 95% for simple apps
```

### Template: Quick Feature Addition
```
🎯 GOAL: Add new feature to existing app

RECOMMENDED PATH:
┌─ Step 1: /add-this-feature "describe feature"
│  ├─ EXPECT: Feature analysis and planning
│  └─ RESULT: Clear implementation approach
│
├─ Step 2: Monitor automatic implementation
│  ├─ EXPECT: Real-time progress updates
│  └─ RESULT: Feature built and integrated
│
├─ Step 3: /test-everything
│  ├─ EXPECT: Comprehensive testing of new feature
│  └─ RESULT: Verified working functionality
│
└─ Step 4: /deploy-when-ready
   ├─ EXPECT: Updated app deployed
   └─ RESULT: Live app with new feature

ESTIMATED TIME: 15-30 minutes
SUCCESS RATE: 90% for standard features
```

## 🔄 Adaptive Recommendations

### Learning From User Behavior
- **Track Command Success**: Which sequences work best for each user
- **Identify Patterns**: Common failure points and successful approaches
- **Personalize Flow**: Adapt recommendations to user's learning style
- **Optimize Experience**: Reduce friction and increase success rates

### Dynamic Adjustment
- **Real-time Analysis**: Adjust recommendations based on current session
- **Context Awareness**: Consider project type, user experience, time constraints
- **Error Adaptation**: Modify approach when standard recommendations fail
- **Success Reinforcement**: Repeat successful patterns for similar users

### Confidence Indicators
- **🟢 High Confidence (90%+)**: Clear user intent, proven workflow path
- **🟡 Medium Confidence (70-89%)**: Multiple good options, user choice needed
- **🔴 Low Confidence (<70%)**: Unclear intent, request clarification

## 💡 Smart Suggestions in Action

### Example Interaction
```
USER: "I want to build something but I'm not sure what"

SYSTEM RECOMMENDATION:
🎯 Perfect! Let's start with some inspiration.

NEXT COMMAND: /build-my-app "something simple like a personal website or small business page"

Why this first? 
✓ Gets you building immediately
✓ Simple enough to ensure success
✓ Teaches the process for future projects

Would you prefer to:
1. Build a personal website to learn the basics
2. Create something for a hobby or interest
3. Start with a simple business idea

Just say what sounds interesting and I'll handle the rest!
```

### Contextual Guidance
```
USER: [After first app is built] "This is great! What should I do now?"

SYSTEM RECOMMENDATION:
🎉 Awesome! You've got your first working app. Here's what I recommend:

NEXT COMMAND: /make-it-look-better

Why this next?
✓ Quick visual win that feels satisfying
✓ Teaches you about design improvements
✓ Makes your app more professional

After that, we'll do:
→ /test-everything (make sure it all works)
→ /deploy-when-ready (put it online for others!)

Ready to make it look amazing?
```