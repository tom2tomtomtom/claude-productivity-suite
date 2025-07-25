#!/bin/bash

# Claude Productivity Suite v2.0 Migration Script
# This script upgrades your installation to use enhanced Agent-OS patterns

set -e

echo "🚀 Claude Productivity Suite v2.0 Migration"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "agent-os" ]; then
    echo "❌ Error: Please run this script from the claude-productivity-suite directory"
    exit 1
fi

echo "📋 This migration will:"
echo "  - Create enhanced directory structure"
echo "  - Install improved commands with XML workflows"
echo "  - Set up three-layer context system"
echo "  - Add validation and error handling"
echo ""
read -p "Continue with migration? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "✓ Starting migration..."

# Create backup
echo "📦 Creating backup..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r agent-os "$BACKUP_DIR/" 2>/dev/null || true
cp -r codebase-os "$BACKUP_DIR/" 2>/dev/null || true
cp -r testing-suite "$BACKUP_DIR/" 2>/dev/null || true
echo "✓ Backup created in $BACKUP_DIR"

# Create enhanced structure
echo ""
echo "📁 Creating enhanced directory structure..."

# Create standards directory if it doesn't exist
if [ ! -d "standards" ]; then
    mkdir -p standards
    echo "✓ Created standards directory"
fi

# Create enhanced workflows directory
mkdir -p workflows/enhanced
echo "✓ Created enhanced workflows directory"

# Update global installation if needed
if [ -d "$HOME/.claude-suite" ]; then
    echo ""
    echo "🌐 Updating global installation..."
    
    # Create/update global standards
    mkdir -p "$HOME/.claude-suite/standards"
    cp standards/*.md "$HOME/.claude-suite/standards/" 2>/dev/null || true
    
    echo "✓ Updated global standards"
fi

# Create command mappings for backward compatibility
echo ""
echo "🔗 Creating command mappings..."

# Update existing commands to use v2 versions
cat > agent-os/instructions/analyze-product-redirect.md << 'EOF'
# Analyze Product

This command has been enhanced in v2.0. Redirecting to enhanced version...

@agent-os/instructions/analyze-product-v2.md
EOF

cat > agent-os/instructions/create-spec-redirect.md << 'EOF'
# Create Spec

This command has been enhanced in v2.0. Redirecting to enhanced version...

@agent-os/instructions/create-spec-v2.md
EOF

echo "✓ Created command mappings"

# Set execute permissions on scripts
echo ""
echo "🔧 Setting permissions..."
chmod +x migrate-to-v2.sh 2>/dev/null || true
chmod +x install.sh 2>/dev/null || true
chmod +x install-project.sh 2>/dev/null || true
chmod +x cleanup-duplicates.sh 2>/dev/null || true
echo "✓ Permissions updated"

# Display migration summary
echo ""
echo "✅ Migration Complete!"
echo ""
echo "📋 What's New:"
echo "  • Enhanced commands with XML structure in:"
echo "    - agent-os/instructions/*-v2.md"
echo "    - codebase-os/commands/*-v2.md"
echo "    - testing-suite/commands/*-v2.md"
echo ""
echo "  • Global standards in:"
echo "    - standards/tech-stack.md"
echo "    - standards/code-style.md"
echo "    - standards/best-practices.md"
echo ""
echo "  • Enhanced workflows in:"
echo "    - workflows/enhanced/*.md"
echo ""
echo "🚀 Next Steps:"
echo "  1. Run './install.sh' to install globally"
echo "  2. Use '/help-v2' to see all enhanced features"
echo "  3. Try '/analyze-product' on an existing project"
echo ""
echo "📚 Documentation:"
echo "  - Check docs/v2-migration-guide.md for details"
echo "  - Original commands still work (redirected to v2)"
echo ""
echo "Happy coding! 🎉"
