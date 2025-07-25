# Claude Productivity Suite v2.0 Migration Guide

## Overview

Version 2.0 brings significant enhancements inspired by Agent-OS patterns, providing better structure, clarity, and maintainability for your development workflows.

## Key Improvements

### 1. Three-Layer Context System

Inspired by Agent-OS, we now use a three-layer context system:

```
Standards Layer (Global)
    ↓
Project Layer (Product-specific)  
    ↓
Specs Layer (Feature-specific)
```

- **Standards**: Global development standards that apply across all projects
- **Project**: Product-specific documentation and configuration
- **Specs**: Individual feature specifications with detailed tasks

### 2. XML-Structured Instructions

All commands now use a structured XML format for better clarity:

```xml
<step number="1" name="analyze_codebase">
  <step_metadata>
    <action>deep analysis</action>
    <purpose>identify issues</purpose>
  </step_metadata>
  
  <instructions>
    ACTION: Analyze code
    DOCUMENT: Findings
    REPORT: Summary
  </instructions>
</step>
```

### 3. Enhanced Error Handling

Every command now includes comprehensive error scenarios:

```xml
<error_scenarios>
  <scenario name="missing_dependencies">
    <condition>Required packages not installed</condition>
    <action>List missing dependencies</action>
    <recovery>Offer automatic installation</recovery>
  </scenario>
</error_scenarios>
```

### 4. Workflow Composition

Commands can now be chained together in workflows:

```xml
<workflow_steps>
  <step number="1">
    <command>@analyze-codebase</command>
    <condition>always</condition>
  </step>
  
  <step number="2">
    <command>@clean-codebase</command>
    <condition>if_issues_found</condition>
  </step>
</workflow_steps>
```

### 5. Validation Checklists

Pre-deployment and quality checks now use structured validation:

```xml
<validation_gates>
  <gate name="code_quality">
    <checks>
      - [ ] No ESLint errors
      - [ ] Code coverage > 80%
      - [ ] No console.logs
    </checks>
  </gate>
</validation_gates>
```

### 6. Cross-Reference System

Use the @ prefix to reference any file in the system:
- `@.claude-suite/project/roadmap.md`
- `@.claude-suite/standards/code-style.md`

## Migration Steps

### Automatic Migration

Run the migration script:
```bash
./migrate-to-v2.sh
```

This will:
1. Backup your current configuration
2. Create the new directory structure
3. Install enhanced commands
4. Set up command redirects for compatibility

### Manual Migration

If you prefer manual migration:

1. **Create Standards Directory**
   ```bash
   mkdir -p standards
   mkdir -p ~/.claude-suite/standards
   ```

2. **Copy Standard Files**
   ```bash
   cp standards/*.md ~/.claude-suite/standards/
   ```

3. **Update Commands**
   Replace references to old commands with v2 versions:
   - `analyze-product` → `analyze-product-v2`
   - `create-spec` → `create-spec-v2`
   - `clean-codebase` → `clean-codebase-v2`

## Backward Compatibility

- All original commands still work
- They automatically redirect to v2 versions
- Existing workflows continue to function
- No breaking changes to command syntax

## New Features to Try

### 1. Enhanced Analysis
```bash
/analyze-product
```
Now provides:
- Three-layer context setup
- Automatic standards detection
- Comprehensive project documentation

### 2. Smart Code Cleanup
```bash
/clean-codebase
```
Features:
- Priority-based issue fixing
- Automatic rollback on failure
- Detailed cleanup report

### 3. Daily Workflow
```bash
/daily-dev
```
Includes:
- Morning sync
- Automatic analysis
- Conditional cleanup
- Pre-deployment readiness

## Best Practices

### 1. Start with Standards
Define your global standards once:
- `~/.claude-suite/standards/tech-stack.md`
- `~/.claude-suite/standards/code-style.md`
- `~/.claude-suite/standards/best-practices.md`

### 2. Document Decisions
Track important decisions in:
- `.claude-suite/project/decisions.md`

### 3. Use Workflows
Leverage workflow composition for repetitive tasks:
- Daily development routine
- Pre-deployment validation
- Emergency fixes

### 4. Customize Per Project
Override global standards when needed:
- `.claude-suite/project/code-style.md`
- `.claude-suite/project/tech-stack.md`

## Troubleshooting

### Command Not Found
If a command isn't recognized:
1. Run `./install.sh` to reinstall
2. Check `~/.claude/commands/` for proper symlinks
3. Use `/help-v2` to see available commands

### Standards Not Loading
If standards aren't applied:
1. Verify `~/.claude-suite/standards/` exists
2. Check symlinks in project directory
3. Look for override files in `.claude-suite/project/`

### Migration Issues
If migration fails:
1. Check the backup directory
2. Manually copy files as needed
3. Report issues on GitHub

## Support

- **Documentation**: Check individual command files
- **Examples**: See `examples/` directory
- **Issues**: Report on GitHub
- **Updates**: Watch repository for new features

## What's Next

Future enhancements planned:
- Visual workflow editor
- Command marketplace
- Team collaboration features
- AI-powered command suggestions
- Performance analytics

Thank you for upgrading to v2.0! 🚀
