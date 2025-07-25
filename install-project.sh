#!/bin/bash

# Claude Productivity Suite - Project Installation
# This script installs commands for a specific project only

set -e

echo "🚀 Claude Productivity Suite - Project Installer"
echo "=============================================="
echo ""
echo "This will install commands in the current project only."
echo "Commands will be available only in this project."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in a git repository or project directory
if [ ! -d ".git" ] && [ ! -f "package.json" ] && [ ! -f "Gemfile" ] && [ ! -f "requirements.txt" ]; then
    echo "⚠️  Warning: This doesn't appear to be a project directory."
    echo "   Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "Installation cancelled."
        exit 0
    fi
fi

# Create project-specific directories
echo "📁 Creating project directories..."
mkdir -p .claude/commands/{agent-os,codebase-os,testing,workflows}

# Copy commands from the suite
echo "📋 Installing commands..."

# Agent-OS commands
for cmd in "$SCRIPT_DIR"/agent-os/instructions/*.md; do
    if [ -f "$cmd" ]; then
        cp "$cmd" .claude/commands/agent-os/
    fi
done

# Codebase-OS commands  
for cmd in "$SCRIPT_DIR"/codebase-os/commands/*.md; do
    if [ -f "$cmd" ]; then
        cp "$cmd" .claude/commands/codebase-os/
    fi
done

# Testing commands
for cmd in "$SCRIPT_DIR"/testing-suite/commands/*.md; do
    if [ -f "$cmd" ]; then
        cp "$cmd" .claude/commands/testing/
    fi
done

# Workflows
for cmd in "$SCRIPT_DIR"/workflows/*.md; do
    if [ -f "$cmd" ]; then
        cp "$cmd" .claude/commands/workflows/
    fi
done

# Add .claude to .gitignore if it exists
if [ -f ".gitignore" ]; then
    if ! grep -q "^.claude/commands/$" .gitignore; then
        echo "" >> .gitignore
        echo "# Claude commands (uncomment to track with git)" >> .gitignore
        echo "# .claude/commands/" >> .gitignore
    fi
fi

echo ""
echo "✅ Project installation complete!"
echo ""
echo "📚 Commands are now available in this project."
echo "   Run 'claude' and type '/help' to see all commands."
echo ""
echo "💡 To share commands with your team:"
echo "   Remove the # from '.claude/commands/' in .gitignore"
echo "   Then commit the .claude directory to git"
