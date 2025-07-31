# Agent Specialist Routing Workflow

<workflow_meta>
  <name>agent-specialist-routing</name>
  <description>Intelligent routing system for matching tasks to specialist agents</description>
  <estimated_time>Instant routing decisions</estimated_time>
  <automation_level>fully_automated</automation_level>
</workflow_meta>

## Specialist Agent Directory

### 🎨 Frontend Specialist Agent
**Expertise:** UI/UX, Visual Design, User Experience
**Best For:**
- "Make it look better"
- "Change the colors/layout"
- "Add buttons/forms/navigation"
- "Mobile-friendly design"

**Token Efficiency:** High - focused on visual elements only

### ⚙️ Backend Specialist Agent  
**Expertise:** APIs, Databases, Server Logic, Security
**Best For:**
- "Save user data"
- "User login/registration"
- "Connect to payment system"
- "Handle file uploads"

**Token Efficiency:** High - ignores UI concerns

### 🗄️ Database Specialist Agent
**Expertise:** Data modeling, Storage, Queries, Performance
**Best For:**
- "Store customer information"
- "Search functionality"
- "Reports and analytics"
- "Data relationships"

**Token Efficiency:** Very High - laser-focused on data

### 🚀 Deployment Specialist Agent
**Expertise:** Hosting, Performance, Monitoring, Scaling
**Best For:**
- "Make it live"
- "It's too slow"
- "Add SSL certificate"
- "Monitor performance"

**Token Efficiency:** Very High - deployment-only focus

### 🧪 Testing Specialist Agent
**Expertise:** Quality Assurance, Bug Detection, User Journey Testing
**Best For:**
- "Test everything"
- "Check for bugs"
- "Make sure it works on phones"
- "Validate user flows"

**Token Efficiency:** High - testing scenarios only

### 🎯 Project Manager Agent
**Expertise:** Planning, Coordination, Progress Tracking
**Best For:**
- "What should I build next?"
- "Show my progress"
- "Plan my app"
- "Coordinate multiple features"

**Token Efficiency:** Medium - broader context needed

## Routing Decision Matrix

<routing_rules>
  <rule priority="1">
    <trigger>Visual/design keywords: "look", "color", "layout", "design", "pretty", "beautiful"</trigger>
    <route_to>Frontend Specialist</route_to>
    <confidence>95%</confidence>
  </rule>
  
  <rule priority="2">
    <trigger>Data keywords: "save", "store", "database", "users", "login", "register"</trigger>
    <route_to>Backend Specialist</route_to>
    <confidence>90%</confidence>
  </rule>
  
  <rule priority="3">
    <trigger>Deployment keywords: "live", "online", "deploy", "publish", "website", "domain"</trigger>
    <route_to>Deployment Specialist</route_to>
    <confidence>95%</confidence>
  </rule>
  
  <rule priority="4">
    <trigger>Testing keywords: "test", "bug", "broken", "error", "check", "works"</trigger>
    <route_to>Testing Specialist</route_to>
    <confidence>85%</confidence>
  </rule>
  
  <rule priority="5">
    <trigger>Planning keywords: "what next", "progress", "plan", "roadmap", "organize"</trigger>
    <route_to>Project Manager</route_to>
    <confidence>80%</confidence>
  </rule>
  
  <rule priority="fallback">
    <trigger>Ambiguous or multi-domain requests</trigger>
    <route_to>Project Manager</route_to>
    <action>Analyze and sub-route to specialists</action>
    <confidence>60%</confidence>
  </rule>
</routing_rules>

## Multi-Agent Coordination

### Complex Requests
When a request needs multiple specialists:

1. **Project Manager** analyzes and breaks down request
2. **Specialists** work on their domain in parallel
3. **Project Manager** coordinates integration
4. **Testing Specialist** validates final result

### Example: "Build me an online store"
```
Project Manager → Plans overall architecture
Frontend Specialist → Designs store interface  
Backend Specialist → Sets up payment processing
Database Specialist → Designs product catalog
Deployment Specialist → Publishes store
Testing Specialist → Validates complete user journey
```

## Learning Integration

### Success Pattern Recognition
- Track which agent combinations work best
- Learn user preferences for routing decisions
- Optimize based on successful project outcomes

### Mistake Prevention
- Remember which agents struggled with specific requests
- Avoid routing similar requests to agents that failed before
- Suggest better agent combinations based on past experience

### Token Optimization
- Cache specialist knowledge to avoid re-explaining domain concepts
- Use compressed communication between agents
- Share context efficiently without duplication

## Routing Confidence Indicators

### 🟢 High Confidence (90%+)
- Clear domain-specific keywords detected
- Single specialist can handle entire request
- Past successful routing for similar requests

### 🟡 Medium Confidence (70-89%)
- Mixed keywords from multiple domains
- Requires clarification or sub-routing
- Novel request type with limited history

### 🔴 Low Confidence (<70%)
- Ambiguous or unclear request
- Multiple possible interpretations
- Route to Project Manager for analysis

## Performance Metrics

### Routing Accuracy
- **Target**: 90%+ correct first-time routing
- **Current**: Baseline being established
- **Optimization**: Learn from user corrections

### Token Efficiency Gain
- **Target**: 50%+ reduction vs general agent
- **Method**: Specialist-focused context only
- **Measurement**: Tokens per successful completion

### User Satisfaction
- **Target**: 95%+ routing decisions feel "right"
- **Feedback**: Track user corrections and preferences
- **Adaptation**: Adjust routing rules based on user behavior