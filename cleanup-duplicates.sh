#!/bin/bash

# Claude Productivity Suite - Duplicate Command Cleanup
# This script removes duplicate commands from the root commands directory

echo "🧹 Claude Command Cleanup"
echo "========================"
echo ""
echo "This will remove duplicate commands from ~/.claude/commands/"
echo "keeping only the organized versions in subdirectories."
echo ""

# Check if there are any .md files in the root commands directory
if ls ~/.claude/commands/*.md 1> /dev/null 2>&1; then
    echo "Found duplicate commands in root directory:"
    ls ~/.claude/commands/*.md 2>/dev/null | while read file; do
        echo "  - $(basename "$file")"
    done
    
    echo ""
    echo "Remove these duplicates? (y/n)"
    read -r response
    
    if [ "$response" = "y" ]; then
        # Remove only the .md files in root, not subdirectories
        rm ~/.claude/commands/*.md 2>/dev/null
        echo "✅ Duplicates removed!"
    else
        echo "Cleanup cancelled."
    fi
else
    echo "✅ No duplicates found! Your commands are properly organized."
fi

echo ""
echo "📁 Current command structure:"
echo ""
find ~/.claude/commands -name "*.md" -type f | sort | while read file; do
    # Extract the relative path after "commands/"
    relative_path=${file#*/.claude/commands/}
    echo "  /$relative_path"
done

echo ""
echo "✨ Cleanup complete!"
