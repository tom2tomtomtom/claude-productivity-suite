#!/bin/bash

# Claude Productivity Suite Installer
# This script installs all components with a single command

set -e  # Exit on error

echo "🚀 Claude Productivity Suite - Global Installer"
echo "============================================="
echo ""
echo "This will install commands globally for ALL your projects."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check for Claude Code
    if ! command -v claude &> /dev/null; then
        echo "❌ Claude Code not found. Please install it first:"
        echo "   npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install it first."
        exit 1
    fi
    
    echo "✅ All prerequisites met!"
    echo ""
}
# Create directory structure
setup_directories() {
    echo "📁 Setting up directory structure..."
    
    # Global directories
    mkdir -p ~/.claude-suite/{agent-os,codebase-os,testing}
    mkdir -p ~/.claude-suite/reports
    mkdir -p ~/.claude-suite/templates
    
    # Global Claude directories (available everywhere)
    mkdir -p ~/.claude/commands/{agent-os,codebase-os,testing,workflows}
    
    echo "✅ Directories created!"
    echo ""
}

# Install Agent-OS
install_agent_os() {
    echo "🤖 Installing Agent-OS..."
    cp -r agent-os/* ~/.claude-suite/agent-os/
    
    # Copy commands to global Claude directory
    for cmd in agent-os/instructions/*.md; do
        if [ -f "$cmd" ]; then
            filename=$(basename "$cmd")
            cp "$cmd" "$HOME/.claude/commands/agent-os/$filename"
            echo "   Installed: /agent-os/$filename"
        fi
    done
    
    echo "✅ Agent-OS installed!"
}
# Install Codebase-OS
install_codebase_os() {
    echo "🧹 Installing Codebase-OS..."
    cp -r codebase-os/* ~/.claude-suite/codebase-os/
    
    # Copy commands to global Claude directory
    for cmd in codebase-os/commands/*.md; do
        if [ -f "$cmd" ]; then
            filename=$(basename "$cmd")
            cp "$cmd" "$HOME/.claude/commands/codebase-os/$filename"
            echo "   Installed: /codebase-os/$filename"
        fi
    done
    
    echo "✅ Codebase-OS installed!"
}

# Install Testing Suite
install_testing_suite() {
    echo "🧪 Installing Testing Suite..."
    cp -r testing-suite/* ~/.claude-suite/testing/
    
    # Copy commands to global Claude directory
    for cmd in testing-suite/commands/*.md; do
        if [ -f "$cmd" ]; then
            filename=$(basename "$cmd")
            cp "$cmd" "$HOME/.claude/commands/testing/$filename"
            echo "   Installed: /testing/$filename"
        fi
    done
    
    # Install Playwright if not present
    if ! npm list playwright &> /dev/null; then
        echo "📦 Installing Playwright..."
        npm install -D @playwright/test
        npx playwright install
    fi
    
    echo "✅ Testing Suite installed!"
}
# Install workflows
install_workflows() {
    echo "🔄 Installing workflows..."
    
    for workflow in workflows/*.md; do
        if [ -f "$workflow" ]; then
            filename=$(basename "$workflow")
            cp "$workflow" "$HOME/.claude/commands/workflows/$filename"
            echo "   Installed: /workflows/$filename"
        fi
    done
    
    echo "✅ Workflows installed!"
}

# Main installation
main() {
    check_prerequisites
    setup_directories
    install_agent_os
    install_codebase_os
    install_testing_suite
    install_workflows
    
    echo ""
    echo "🎉 Installation Complete!"
    echo "========================"
    echo ""
    echo "📚 Quick Start:"
    echo "1. Run 'claude' to start Claude Code"
    echo "2. Type '/help' to see all available commands"
    echo "3. Start with '/plan-product' for new projects"
    echo ""
    echo "🔧 Customize your setup:"
    echo "- Edit ~/.claude-suite/*/standards/ for your preferences"
    echo "- Add custom commands to .claude/commands/"
    echo "- Check docs/ for detailed guides"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main installation
main
