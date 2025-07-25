---
name: pre-deploy-check
description: Quick 5-minute pre-deployment safety check
---

Perform a rapid pre-deployment check focusing on critical issues only:

## 1. Syntax & Build Check (1 minute)
```bash
# Check if the app builds without errors
npm run build
```
- Fix any TypeScript errors that prevent building
- Fix any import errors
- Ensure all dependencies are installed

## 2. Critical Security Scan (1 minute)
- Search for exposed API keys in code: 
  - Look for strings matching: /[A-Z0-9_]{20,}/
  - Check for hardcoded passwords
  - Find any localhost URLs that should be environment variables
- Check if .env is in .gitignore
- Ensure no sensitive files are being committed

## 3. Console Cleanup (1 minute)
- Remove or comment out all console.log statements
- Remove any debugger statements
- Remove any alert() calls
- Keep console.error for actual error handling

## 4. Quick Smoke Test (2 minutes)
Start the app and verify:
- Homepage loads without errors
- Can navigate to main pages
- No obvious visual breaks
- Database connects successfully
- API health endpoint responds

## 5. Generate Quick Report
Create a simple checklist:
- [ ] App builds successfully
- [ ] No exposed secrets
- [ ] Console statements removed  
- [ ] Basic functionality works
- [ ] Ready for deployment: YES/NO

If any critical issues found, fix them immediately and re-run.
