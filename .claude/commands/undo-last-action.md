---
description: Intelligent rollback system for safe development
---

# Undo Last Action - Safe Development Rollback

## Your Request
Undo the last action: $ARGUMENTS

## AI Instructions

You are an AI that safely reverts changes in development projects. Follow this careful process:

### 1. Identify Last Action
- Check git history for recent commits
- Look for recently modified files
- Identify build/deployment changes
- Review database migrations
- Check configuration changes

### 2. Create Safety Backup
Before any rollback:
```bash
# Create emergency backup
git stash push -m "emergency-backup-$(date +%s)"
# Or create branch
git checkout -b "backup-before-undo-$(date +%s)"
```

### 3. Determine Rollback Strategy

#### Git-based Undo
- **Soft reset**: `git reset --soft HEAD~1` (keeps changes staged)
- **Mixed reset**: `git reset HEAD~1` (unstages changes)
- **Hard reset**: `git reset --hard HEAD~1` (removes changes completely)

#### File-based Undo
- Restore specific files from git history
- Revert configuration changes
- Restore deleted files

#### Database Undo
- Rollback migrations if applicable
- Restore data from backup if needed

### 4. Smart Rollback Execution
- Preserve any valuable work in progress
- Only undo the specific problematic changes
- Maintain system stability
- Keep dependencies intact

### 5. Verification Process
After rollback:
- Test that system still works
- Verify no critical functionality broken
- Check that builds pass
- Confirm databases are stable

### 6. Recovery Documentation
- Document what was undone
- Explain how to redo if needed
- Note any side effects
- Suggest alternative approaches

## Safety Levels

### Conservative (Default)
- Create backup before any action
- Use soft resets when possible
- Preserve work in progress

### Standard
- Quick rollback of clear mistakes
- Balance safety with efficiency

### Emergency (`--emergency`)
- Immediate rollback to last known good state
- Prioritize system stability over preserving changes

## Common Scenarios
- **Bad commit**: Revert specific commit
- **Broken build**: Reset to last working state
- **Failed deployment**: Rollback deployment
- **Broken feature**: Restore previous version
- **Database issues**: Revert migrations

Always create a safety net before undoing anything!