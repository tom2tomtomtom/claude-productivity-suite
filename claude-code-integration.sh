#!/bin/bash

# Claude Code Integration Setup
# This script sets up global command integration with auto-completion

echo "🚀 Setting up Claude Productivity Suite global integration..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Make the main script executable
chmod +x "$SCRIPT_DIR/claude-suite"

# Determine shell type and profile
if [[ $SHELL == *"zsh"* ]]; then
    PROFILE="$HOME/.zshrc"
    SHELL_TYPE="zsh"
elif [[ $SHELL == *"bash"* ]]; then
    PROFILE="$HOME/.bash_profile"
    SHELL_TYPE="bash"
else
    PROFILE="$HOME/.profile"
    SHELL_TYPE="sh"
fi

echo "📝 Setting up for $SHELL_TYPE shell..."

# Remove any existing Claude Suite configuration
grep -v "Claude Productivity Suite" "$PROFILE" > "$PROFILE.tmp" 2>/dev/null || touch "$PROFILE.tmp"
grep -v "claude-productivity-suite" "$PROFILE.tmp" > "$PROFILE.tmp2" 2>/dev/null
grep -v "claude-suite" "$PROFILE.tmp2" > "$PROFILE.tmp3" 2>/dev/null

# Add the new configuration
cat >> "$PROFILE.tmp3" << 'EOF'

# Claude Productivity Suite - Global Integration
export CLAUDE_SUITE_PATH="/Users/thomasdowuona-hyde/claude-productivity-suite"
export PATH="$CLAUDE_SUITE_PATH:$PATH"

# Claude Suite Command Aliases (type / and press tab for completion)
alias /build-my-app='claude-suite /build-my-app'
alias /fix-whatever-is-broken='claude-suite /fix-whatever-is-broken'
alias /make-it-look-better='claude-suite /make-it-look-better'
alias /deploy-when-ready='claude-suite /deploy-when-ready'
alias /show-me-progress='claude-suite /show-me-progress'
alias /optimize-tokens='claude-suite /optimize-tokens'
alias /intelligence-dashboard='claude-suite /intelligence-dashboard'
alias /help='claude-suite /help'
alias /version='claude-suite /version'

# Auto-completion for Claude Suite commands
if [[ $SHELL == *"zsh"* ]]; then
    # Zsh completion
    _claude_suite_complete() {
        local commands=(
            "/build-my-app:Transform your vibe into a working app"
            "/fix-whatever-is-broken:Automatically detect and fix all issues"
            "/make-it-look-better:Improve design and user experience"
            "/deploy-when-ready:Deploy your app to production"
            "/show-me-progress:Visual progress dashboard"
            "/optimize-tokens:Reduce AI costs with smart optimization"
            "/intelligence-dashboard:System performance and metrics"
            "/help:Show help message"
            "/version:Show version information"
        )
        _describe 'claude-suite commands' commands
    }
    
    compdef _claude_suite_complete claude-suite
    
    # Enable completion for aliases starting with /
    setopt COMPLETE_ALIASES
    
elif [[ $SHELL == *"bash"* ]]; then
    # Bash completion
    _claude_suite_complete() {
        local cur="${COMP_WORDS[COMP_CWORD]}"
        local commands="/build-my-app /fix-whatever-is-broken /make-it-look-better /deploy-when-ready /show-me-progress /optimize-tokens /intelligence-dashboard /help /version"
        COMPREPLY=($(compgen -W "$commands" -- "$cur"))
    }
    
    complete -F _claude_suite_complete claude-suite
fi

# Quick help function
claude-help() {
    echo "🚀 Claude Productivity Suite Commands:"
    echo "  /build-my-app \"description\"     - Transform your vibe into a working app"
    echo "  /fix-whatever-is-broken         - Automatically detect and fix all issues"
    echo "  /make-it-look-better            - Improve design and user experience"
    echo "  /deploy-when-ready              - Deploy your app to production"
    echo "  /show-me-progress               - Visual progress dashboard"
    echo "  /optimize-tokens                - Reduce AI costs with smart optimization"
    echo "  /intelligence-dashboard         - System performance and metrics"
    echo ""
    echo "💡 Just type / and press tab for auto-completion!"
}

EOF

# Replace the original profile with our updated version
mv "$PROFILE.tmp3" "$PROFILE"
rm -f "$PROFILE.tmp" "$PROFILE.tmp2" 2>/dev/null

echo "✅ Global integration complete!"
echo ""
echo "🎉 Setup successful! Here's what's now available:"
echo ""
echo "📋 COMMANDS (type / and press TAB for completion):"
echo "   /build-my-app \"your app idea\""
echo "   /fix-whatever-is-broken"
echo "   /make-it-look-better"
echo "   /deploy-when-ready"
echo "   /show-me-progress"
echo "   /optimize-tokens"
echo "   /intelligence-dashboard"
echo ""
echo "🔧 ACTIVATION:"
echo "   • New terminals: Commands work automatically"
echo "   • Current terminal: Run 'source $PROFILE'"
echo "   • Quick help: Type 'claude-help'"
echo ""
echo "💡 USAGE:"
echo "   1. Navigate to any directory"
echo "   2. Type / and press TAB to see all commands"
echo "   3. Use commands directly: /build-my-app \"todo app\""
echo ""