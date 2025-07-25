# Getting Started with Claude Productivity Suite

Welcome! This guide will help you get up and running in just a few minutes.

## Prerequisites

Before you begin, ensure you have:
- Node.js installed (v14 or higher)
- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- Git installed
- A Claude.ai account

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/claude-productivity-suite.git
   cd claude-productivity-suite
   ```

2. **Run the installer**
   ```bash
   ./install.sh
   ```

3. **Verify installation**
   ```bash
   claude
   /help
   ```

## Your First Commands

### 1. Planning a New Feature
```
/plan-product user-authentication
```
This creates a structured plan for implementing user authentication.

### 2. Analyzing Your Codebase
```
/analyze-codebase
```
Get a comprehensive health report of your code.

### 3. Pre-deployment Check
```
/pre-deploy-check
```
Ensure your code is ready for production in 5 minutes.

## Daily Workflow

We recommend starting each day with:
```
/daily-dev
```
This runs a complete workflow from code health check to end-of-day reporting.

## Customization

Edit these files to match your preferences:
- `~/.claude-suite/agent-os/standards/` - Development standards
- `~/.claude-suite/codebase-os/standards/` - Quality metrics
- `.claude/commands/` - Add your own commands

## Getting Help

- Type `/help` in Claude Code for command list
- Check `docs/` folder for detailed guides
- Join our Discord community
- Report issues on GitHub

Happy coding! 🚀
