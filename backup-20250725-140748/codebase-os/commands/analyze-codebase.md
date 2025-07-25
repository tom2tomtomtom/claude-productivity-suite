---
name: analyze-codebase
description: Comprehensive codebase health analysis
---

Perform a deep analysis of the codebase health and generate a report.

## 1. Code Metrics Analysis

### 1.1 Complexity Metrics
- Calculate cyclomatic complexity for all functions
- Identify functions with complexity > 10
- Find deeply nested code (>4 levels)
- Detect long functions (>50 lines)
- Find files > 300 lines

### 1.2 Duplication Detection
- Find duplicate code blocks (>10 lines)
- Identify similar function patterns
- Detect copy-paste programming
- Find repeated string literals
- Identify similar API calls

### 1.3 Dependency Analysis
- List all dependencies and versions
- Find unused dependencies
- Detect outdated packages
- Check for security vulnerabilities
- Analyze bundle size impact

### 1.4 Code Smell Detection
- Long parameter lists (>4 params)
- God objects/components
- Dead code detection
- Circular dependencies
- Inappropriate intimacy between modules
## 2. Architecture Health

### 2.1 Structure Analysis
- Check folder organization
- Verify naming conventions
- Analyze import patterns
- Detect architectural violations
- Check separation of concerns

### 2.2 Pattern Consistency
- Identify inconsistent patterns
- Check component structure
- Verify service layer patterns
- Analyze data flow
- Check error handling patterns

## 3. Performance Analysis

### 3.1 Bundle Analysis
- Total bundle size
- Largest dependencies
- Code splitting opportunities
- Unused exports
- Tree-shaking potential

### 3.2 Runtime Performance
- Identify expensive operations
- Find unnecessary re-renders
- Detect memory leaks patterns
- Check for infinite loops risks
- Analyze API call patterns
## 4. Maintainability Score

Calculate overall health score (0-100):
- Code complexity: 25%
- Test coverage: 25%
- Documentation: 20%
- Dependencies health: 15%
- Performance: 15%

## 5. Generate Reports

Create reports in `.codebase-os/reports/`:
- `health-report-{date}.md` - Overall health summary
- `technical-debt.md` - Accumulated debt items
- `refactoring-opportunities.md` - Improvement suggestions
- `metrics-dashboard.json` - Raw metrics data

Store baseline for trend tracking.
