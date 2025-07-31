# Tech Stack

> Created: 2025-07-30
> Environment: Development

## Core Framework
**Claude Productivity Suite** - AI-powered development framework
- **Purpose**: Simplify coding workflows for non-coders
- **Architecture**: Modular specialist agents with learning capabilities
- **Design**: Documentation-driven with intelligent routing

## Intelligence Layer
**AI Learning System**
- **Pattern Recognition**: Learn successful development patterns
- **Token Optimization**: Smart compression and context management  
- **Mistake Learning**: Error pattern recognition and prevention
- **Agent Routing**: Intelligent task-to-specialist matching

## Agent Specialists
**Modular Expert System**
- **Agent-OS**: Core agent management framework
- **Specialist Domains**: Frontend, Backend, Database, Deployment, Testing
- **Communication**: Activity broadcasting and status updates
- **Recovery**: Automatic error handling and rollback

## Testing & Quality
**Playwright 1.54.1**
- **Purpose**: End-to-end testing automation
- **Integration**: Built into deployment workflows
- **Coverage**: User journey validation for non-coder built apps

## Development Environment
**Node.js Ecosystem**
- **Package Management**: npm with lock file for consistency
- **Runtime**: Node.js 18+ compatibility
- **Platform**: Cross-platform (macOS, Linux, Windows)

## Key Dependencies
- **@playwright/test**: 1.54.1 - E2E testing framework
- **fsevents**: 2.3.2 - File system monitoring (macOS)

## Architecture Decisions

### Documentation-First Approach
- All workflows defined in Markdown for clarity
- Non-coders can read and understand system behavior
- Easy to modify and extend without code changes

### Modular Agent System
- Specialist agents for different domains
- Smart routing based on task requirements
- Learning from successful patterns

### Token Efficiency Focus
- Pattern-based compression to reduce costs
- Context-aware communication
- Intelligent caching of successful solutions