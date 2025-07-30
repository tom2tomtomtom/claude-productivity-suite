---
name: create-vision
description: Create clear, referenceable vision documents for your project
---

# Create Vision Documents

Set up a comprehensive vision system that Claude Code can always reference.

## What This Command Does

1. **Creates Vision Structure**
   ```
   .claude-suite/vision/
   ├── README.md           # Quick reference
   ├── core-vision.md      # Main vision
   ├── ui-patterns.md      # Visual patterns
   ├── user-stories.md     # User journeys
   ├── examples/           # Visual references
   │   ├── good/          # Follow these
   │   └── avoid/         # Don't do these
   └── decisions-log.md    # Decision history
   ```

2. **Gathers Vision Information**
   - Project mission and goals
   - Target users and their needs
   - Visual and UX preferences
   - Technical constraints
   - Success metrics

3. **Creates Referenceable Documents**
   - All files use @.claude-suite/vision/ paths
   - Cross-referenced and linked
   - Easy for Claude Code to follow

## How to Use

1. Run `/create-vision` in your project
2. Answer the guided questions
3. Add screenshots to examples folders
4. Reference in all Claude commands:
   ```
   "Build this following @.claude-suite/vision/core-vision.md"
   ```

## Vision Components

### Core Vision
- One-sentence mission
- The experience vision
- Personality and tone
- What this is NOT
- Success scenarios

### UI Patterns
- Visual language
- Color psychology
- Interaction patterns
- Reference examples
- Animation preferences

### User Stories
- User types and contexts
- Core user journeys
- Edge cases
- Success metrics

### Examples
- Screenshots of good patterns
- Anti-patterns to avoid
- Competitive references
- Inspiration sources

## Best Practices

1. **Be Visual**: Add screenshots and examples
2. **Be Specific**: "Buttons like Stripe but friendlier"
3. **Be Emotional**: "Should feel encouraging, not demanding"
4. **Be Decisive**: "Never use modals for simple confirmations"

## After Creation

Your vision is referenceable:
- In prompts: `@.claude-suite/vision/core-vision.md`
- In code comments: `@see vision/ui-patterns.md`
- In decisions: Updates logged automatically

Ready to create your vision? Let's make your project crystal clear!
