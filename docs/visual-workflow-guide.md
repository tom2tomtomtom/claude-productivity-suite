# 📊 Visual Workflow Guide

## The Claude Productivity Suite Development Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLAUDE PRODUCTIVITY SUITE                       │
│                  Development Workflow System                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AGENT-OS      │     │  CODEBASE-OS    │     │ TESTING SUITE   │
│   (Planning)    │     │  (Maintenance)  │     │ (Validation)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                         │
         ▼                       ▼                         ▼
    Sets Track            Keeps on Track           Validates Quality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔄 Daily Development Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                        DAILY WORKFLOW                             │
└─────────────────────────────────────────────────────────────────┘

🌅 MORNING (5 min)
┌─────────────────┐
│ /monitor-quality │ ──▶ Check code health trends
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ /clean-codebase │ ──▶ Remove any overnight issues
└─────────────────┘

💻 DEVELOPMENT (Active)
┌─────────────────┐
│ /plan-product   │ ──▶ Plan new features
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ /create-spec    │ ──▶ Define exact requirements  
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ /execute-tasks  │ ──▶ Build the code
└─────────────────┘

🧪 VALIDATION (Before commits)
┌─────────────────┐
│ /pre-deploy-    │ ──▶ Quick safety check (5 min)
│    check        │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ git commit      │ ──▶ Save your work
└─────────────────┘

🌆 END OF DAY (10 min)
┌─────────────────┐
│ /analyze-       │ ──▶ Review today's changes
│  codebase       │
└─────────────────┘
```

## 🚀 Feature Development Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW FEATURE WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: PLANNING
┌─────────────────┐
│ /plan-product   │
│  "user-auth"    │
└────────┬────────┘
         │
         ▼
    ┌────────────────────────┐
    │ Generates:             │
    │ • Technical approach   │
    │ • Timeline             │
    │ • Risk assessment      │
    └────────────────────────┘
         │
         ▼
┌─────────────────┐
│ /create-spec    │
│  "login-flow"   │
└────────┬────────┘
         │
         ▼
    ┌────────────────────────┐
    │ Generates:             │
    │ • API endpoints        │
    │ • Database schema      │
    │ • Validation rules     │
    └────────────────────────┘

PHASE 2: BUILDING
┌─────────────────┐
│ /execute-tasks  │ ◀─── Builds according to spec
└────────┬────────┘
         │
         ├──▶ Backend API
         ├──▶ Frontend UI  
         ├──▶ Database
         └──▶ Tests
         
PHASE 3: QUALITY CONTROL
┌─────────────────┐
│ /test-core-     │ ──▶ Test critical paths
│    flows        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /refactor-smart │ ──▶ Improve code structure
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /clean-codebase │ ──▶ Final cleanup
└─────────────────┘
```

## 📈 Code Quality Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUALITY TRACKING SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

/monitor-quality tracks:

    Code Health Score
    100 ┤
     90 ┤    ╭─────╮
     80 ┤───╯       ╰──────  ← Target Zone (80-100)
     70 ┤                    
     60 ┤                  ⚠️ Warning Zone
     50 ┤
        └─────────────────────▶
         Mon  Tue  Wed  Thu  Fri

    Complexity Trend
     20 ┤         ╱╲
     15 ┤    ╱╲  ╱  ╲  
     10 ┤───╯──╲╱────╲───── ← Max Allowed
      5 ┤              ╲╱
        └─────────────────────▶
         Week 1    Week 2   Week 3

    Test Coverage
    100 ┤
     90 ┤         ╭────────
     80 ┤────────╯          ← Minimum Required
     70 ┤
        └─────────────────────▶
```

## 🔄 Course Correction Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                   DRIFT DETECTION & CORRECTION                    │
└─────────────────────────────────────────────────────────────────┘

Daily Check:
┌─────────────────┐
│ /monitor-quality│
└────────┬────────┘
         │
         ▼
    ╔═══════════╗
    ║ Drift?    ║
    ╚═══╤═══╤═══╝
        │   │
      No│   │Yes
        │   │
        ▼   ▼
    Continue  Assess Severity
              │
    ┌─────────┴─────────┬─────────────┐
    ▼                   ▼             ▼
Small (<20%)       Medium (20-50%)   Large (>50%)
    │                   │             │
    ▼                   ▼             ▼
/clean-codebase    /refactor-smart   /plan-product
                   /create-spec        --revision
                    (update)
```

## 🎯 Command Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHICH COMMAND TO USE?                         │
└─────────────────────────────────────────────────────────────────┘

Starting a new project?
    │
    ├─▶ YES ──▶ /plan-product
    │
    └─▶ NO ──▶ Working on existing code?
                    │
                    ├─▶ YES ──▶ /analyze-product first
                    │
                    └─▶ NO ──▶ Just checking quality?
                                    │
                                    ├─▶ YES ──▶ /analyze-codebase
                                    │
                                    └─▶ NO ──▶ Ready to deploy?
                                                    │
                                                    ├─▶ YES ──▶ Time available?
                                                    │             │
                                                    │             ├─▶ <5 min: /pre-deploy-check
                                                    │             ├─▶ 15 min: /test-core-flows
                                                    │             └─▶ 45+ min: /fix-and-test
                                                    │
                                                    └─▶ NO ──▶ /help
```

## 🚦 Status Indicators

When running commands, you'll see these indicators:

```
✅ Success     - Operation completed successfully
⚠️  Warning    - Non-critical issues found
❌ Error       - Critical issues need attention
🔄 Processing  - Operation in progress
📊 Analysis    - Gathering metrics
🧹 Cleaning    - Removing unnecessary code
🔧 Fixing      - Applying corrections
🧪 Testing     - Running test suites
```

## 💡 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUICK COMMANDS                             │
├─────────────────────────────────────────────────────────────────┤
│ Planning         │ Quality          │ Testing                   │
├─────────────────┼─────────────────┼───────────────────────────┤
│ /plan-product   │ /analyze-code   │ /pre-deploy-check (5m)    │
│ /create-spec    │ /clean-code     │ /test-core-flows (15m)    │
│ /execute-tasks  │ /refactor-smart │ /fix-and-test (45m+)      │
│ /analyze-prod   │ /monitor-qual   │ /railway-deploy           │
├─────────────────┴─────────────────┴───────────────────────────┤
│ Workflows: /daily-dev, /pre-deploy, /help                      │
└─────────────────────────────────────────────────────────────────┘
```

Save this guide and reference it as you develop!
