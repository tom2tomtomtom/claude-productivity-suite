#!/bin/bash

# Claude Commands Handler
# This script provides direct / command support

CLAUDE_SUITE_DIR="/Users/thomasdowuona-hyde/claude-productivity-suite"

# Function to handle Claude commands
claude_command() {
    local cmd="$1"
    shift
    
    case "$cmd" in
        "build-my-app"|"/build-my-app")
            "$CLAUDE_SUITE_DIR/claude-suite" "/build-my-app" "$@"
            ;;
        "fix-whatever-is-broken"|"/fix-whatever-is-broken")
            "$CLAUDE_SUITE_DIR/claude-suite" "/fix-whatever-is-broken" "$@"
            ;;
        "make-it-look-better"|"/make-it-look-better")
            "$CLAUDE_SUITE_DIR/claude-suite" "/make-it-look-better" "$@"
            ;;
        "deploy-when-ready"|"/deploy-when-ready")
            "$CLAUDE_SUITE_DIR/claude-suite" "/deploy-when-ready" "$@"
            ;;
        "show-me-progress"|"/show-me-progress")
            "$CLAUDE_SUITE_DIR/claude-suite" "/show-me-progress" "$@"
            ;;
        "optimize-tokens"|"/optimize-tokens")
            "$CLAUDE_SUITE_DIR/claude-suite" "/optimize-tokens" "$@"
            ;;
        "intelligence-dashboard"|"/intelligence-dashboard")
            "$CLAUDE_SUITE_DIR/claude-suite" "/intelligence-dashboard" "$@"
            ;;
        "help"|"/help")
            "$CLAUDE_SUITE_DIR/claude-suite" "/help" "$@"
            ;;
        "version"|"/version")
            "$CLAUDE_SUITE_DIR/claude-suite" "/version" "$@"
            ;;
        *)
            echo "🚀 Claude Productivity Suite Commands:"
            echo ""
            echo "Available commands:"
            echo "  /build-my-app \"description\"     - Transform your vibe into a working app"
            echo "  /fix-whatever-is-broken         - Automatically detect and fix all issues"
            echo "  /make-it-look-better            - Improve design and user experience"
            echo "  /deploy-when-ready              - Deploy your app to production"
            echo "  /show-me-progress               - Visual progress dashboard"
            echo "  /optimize-tokens                - Reduce AI costs with smart optimization"
            echo "  /intelligence-dashboard         - System performance and metrics"
            echo "  /help                           - Show help message"
            echo "  /version                        - Show version information"
            echo ""
            echo "💡 Usage: /build-my-app \"your app idea\""
            ;;
    esac
}

# Export the function
export -f claude_command

# Create global command aliases
alias /build-my-app='claude_command build-my-app'
alias /fix-whatever-is-broken='claude_command fix-whatever-is-broken'
alias /make-it-look-better='claude_command make-it-look-better'
alias /deploy-when-ready='claude_command deploy-when-ready'
alias /show-me-progress='claude_command show-me-progress'
alias /optimize-tokens='claude_command optimize-tokens'
alias /intelligence-dashboard='claude_command intelligence-dashboard'
alias /help='claude_command help'
alias /version='claude_command version'

# Helper function
claude-help() {
    claude_command help
}

echo "✅ Claude Productivity Suite commands activated!"
echo "💡 Type any /command to get started"