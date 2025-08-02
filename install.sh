#!/bin/bash

# Claude Productivity Suite Installer
echo "🚀 Installing Claude Productivity Suite..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Make the main script executable
chmod +x "$SCRIPT_DIR/claude-suite"

# Add to PATH in shell profile
CLAUDE_SUITE_PATH="$SCRIPT_DIR"

# Check which shell profile to update
if [[ $SHELL == *"zsh"* ]]; then
    PROFILE="$HOME/.zshrc"
elif [[ $SHELL == *"bash"* ]]; then
    PROFILE="$HOME/.bash_profile"
else
    PROFILE="$HOME/.profile"
fi

# Add to PATH if not already there
if ! grep -q "claude-productivity-suite" "$PROFILE" 2>/dev/null; then
    echo "" >> "$PROFILE"
    echo "# Claude Productivity Suite" >> "$PROFILE"
    echo "export PATH=\"$CLAUDE_SUITE_PATH:\$PATH\"" >> "$PROFILE"
    echo "✅ Added to PATH in $PROFILE"
else
    echo "✅ Already in PATH"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To use immediately in this session:"
echo "  export PATH=\"$CLAUDE_SUITE_PATH:\$PATH\""
echo ""
echo "Or restart your terminal and use:"
echo "  claude-suite help"
echo "  claude-suite build-app \"your app idea\""
echo ""