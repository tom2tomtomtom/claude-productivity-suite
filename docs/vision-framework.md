# Project Vision Architecture

Create these files in your project root under `.claude-suite/vision/`:

## 📁 Recommended Structure

```
.claude-suite/
└── vision/
    ├── README.md           # Quick reference overview
    ├── core-vision.md      # The main vision document
    ├── ui-patterns.md      # Visual and UX patterns
    ├── user-stories.md     # User journeys and scenarios
    ├── examples/           # Screenshots and references
    │   ├── good/          # Examples to follow
    │   └── avoid/         # Anti-patterns
    └── decisions-log.md    # Why we chose X over Y
```

## 🎨 Core Vision Document Template

```markdown
# [Project Name] Vision

## 🎯 Mission Statement
In one sentence: [What this project does and why it matters]

## 🌟 The Experience Vision

### First Impression (0-5 seconds)
When someone lands on our app, they immediately:
- See: [Visual description]
- Understand: [Value proposition]
- Feel: [Emotional response]
- Do: [Obvious first action]

### The Magic Moment
The "aha!" moment happens when: [Specific interaction that delivers core value]

### The Daily Experience
Returning users open the app because: [Habit-forming value]

## 🎭 Personality & Tone

### If this app was a person, it would be:
- Personality: [e.g., "Your encouraging workout buddy, not your drill sergeant"]
- Voice: [e.g., "Friendly professional, like a smart colleague"]
- Never: [e.g., "Never condescending or overly casual"]

## 🚫 What This Is NOT
- NOT another [common solution they don't want]
- NOT for [audience we're not serving]
- NOT trying to be [what we're avoiding]

## ✨ Core Principles
1. **[Principle 1]**: [How it guides decisions]
2. **[Principle 2]**: [How it guides decisions]
3. **[Principle 3]**: [How it guides decisions]

## 🎬 Success Scenarios

### Scenario 1: [User Type]
- Context: [When/where they use it]
- Goal: [What they're trying to achieve]
- Success: [What happens when it works]
- Emotion: [How they feel]

## 📊 Measurable Success
We know we've succeeded when:
- [ ] Users can [core action] in under [time]
- [ ] [X]% of users [key behavior]
- [ ] Users describe it as "[desired description]"
```

## 🖼️ UI Patterns Document

```markdown
# UI/UX Patterns Guide

## Visual Language

### Color Psychology
- Primary: [Color] = [Emotion/Purpose]
- Secondary: [Color] = [Usage]
- Success: [Color] = [When used]
- Warning: [Color] = [When used]

### Typography Hierarchy
- Headlines: [Feel - Bold/Elegant/Playful]
- Body: [Readability focus]
- UI Elements: [Clarity focus]

### Spacing & Rhythm
- Tight spacing = [When/Why]
- Breathing room = [When/Why]
- Visual rhythm: [Pattern]

## Interaction Patterns

### Buttons
- Primary CTA: [Style and behavior]
- Secondary: [Style and behavior]
- Hover state: [Must feel...]
- Click feedback: [Type of response]

### Forms
- Style: [Multi-step/Single/Conversational]
- Validation: [Inline/On submit]
- Success: [How to celebrate]
- Errors: [How to help, not frustrate]

### Navigation
- Pattern: [Tab/Sidebar/Minimal]
- Mobile: [How it adapts]
- Current state: [How users know where they are]

### Feedback & Loading
- Loading: [Skeleton/Spinner/Progress/Entertainment]
- Success: [Toast/Modal/Inline/Animation]
- Errors: [Helpful/Friendly/Clear next steps]

### Empty States
- First time: [Welcoming/Educational]
- No data: [Encouraging action]
- Error: [Helpful recovery]

## Reference Examples
- Buttons like: [Stripe] but [our twist]
- Forms like: [Typeform] but [faster]
- Navigation like: [Notion] but [simpler]
```

## 🔄 Making It Referenceable

### In Your Commands
```markdown
# When using Claude Code, reference vision:

"Check @.claude-suite/vision/core-vision.md for the personality"
"Follow UI patterns in @.claude-suite/vision/ui-patterns.md"
"See examples in @.claude-suite/vision/examples/good/"
```

### In Your Code
```javascript
// Component comments reference vision
/**
 * PrimaryButton Component
 * 
 * Implements the primary CTA pattern from:
 * @see .claude-suite/vision/ui-patterns.md#buttons
 * 
 * Key requirements:
 * - Must feel "satisfyingly clickable" (core-vision.md#personality)
 * - Hover state should "invite action" not demand it
 */
```

### In Your Prompts
```markdown
"Build the user dashboard following our vision:
- Check @.claude-suite/vision/core-vision.md for the overall experience
- Use patterns from @.claude-suite/vision/ui-patterns.md
- Reference @.claude-suite/vision/examples/good/dashboard.png
- Avoid patterns in @.claude-suite/vision/examples/avoid/"
```

## 🚀 Quick Setup Script

```bash
# Run this to create vision structure
mkdir -p .claude-suite/vision/examples/good
mkdir -p .claude-suite/vision/examples/avoid

# Create starter files
touch .claude-suite/vision/README.md
touch .claude-suite/vision/core-vision.md
touch .claude-suite/vision/ui-patterns.md
touch .claude-suite/vision/user-stories.md
touch .claude-suite/vision/decisions-log.md

echo "# Vision Quick Reference

- Core Vision: @.claude-suite/vision/core-vision.md
- UI Patterns: @.claude-suite/vision/ui-patterns.md
- User Stories: @.claude-suite/vision/user-stories.md
- Good Examples: @.claude-suite/vision/examples/good/
- Avoid These: @.claude-suite/vision/examples/avoid/
" > .claude-suite/vision/README.md
```

## 💡 Pro Tips

1. **Screenshot Everything**: Put inspirational screenshots in `examples/good/`
2. **Anti-patterns Too**: Screenshot what to avoid in `examples/avoid/`
3. **Link Liberally**: Use @.claude-suite/vision/ paths in all prompts
4. **Update As You Learn**: When you make a decision, log it
5. **Claude Memory**: Start each session with "Check @.claude-suite/vision/README.md first"
