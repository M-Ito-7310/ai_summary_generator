---
description: Start working on an enhancement/improvement (e.g., /start-enhancement 1)
---

You are tasked with **starting and implementing an enhancement** for the AI Summary Generator project.

## Arguments

- `{{enhancement_number}}` - The enhancement ticket number (e.g., 1 for enhancement-001-*.md)

## Task Flow

### 1. Read Enhancement Ticket
- Find and read `docs/ticket/enhancement/enhancement-{{enhancement_number | pad:3}}-*.md`
- Understand what should be improved and why

### 2. Update Status
- Update enhancement ticket: Status from 🔴 to 🟡 進行中
- Update `docs/ticket/enhancement/PROGRESS.md`: Move to "In Progress" section
- Record start timestamp

### 3. Analyze Current State
- Examine current implementation
- Measure baseline metrics (if performance/UX improvement)
- Document current behavior

### 4. Create Improvement Plan

```
🔧 Enhancement Plan

Enhancement: [Enhancement Title]

Current State:
[Description of how it currently works]

Proposed Improvement:
[What will be improved and how]

Expected Impact:
- Performance: [expected improvement]
- UX: [expected improvement]
- Code Quality: [expected improvement]
- Maintainability: [expected improvement]

Implementation Steps:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Files to Modify:
- [file1.tsx] - [what will be improved]
- [file2.ts] - [what will be refactored]

Measurements:
- Before: [baseline metric]
- Target: [target metric]

Estimated Time: [Xh]

Proceed with this plan? (yes/no/revise)
```

### 5. Implement Enhancement (After Approval)

Based on enhancement type:

**Performance Enhancement**:
- Optimize algorithms
- Add memoization/caching
- Reduce re-renders
- Optimize bundle size
- Lazy load components

**UX Enhancement**:
- Improve animations
- Add feedback mechanisms
- Enhance accessibility
- Improve error messages
- Streamline workflows

**Code Quality Enhancement**:
- Refactor complex code
- Extract reusable components
- Improve type safety
- Add better error handling
- Improve code organization

**Security Enhancement**:
- Add input validation
- Improve authentication
- Fix security vulnerabilities
- Add rate limiting
- Improve data protection

### 6. Measure Improvements

Before and after metrics:

```
📊 Enhancement Metrics

Performance (if applicable):
- Load Time: [before]ms → [after]ms ([improvement]%)
- Bundle Size: [before]KB → [after]KB ([improvement]%)
- Lighthouse Score: [before] → [after]

UX (if applicable):
- User Steps: [before] → [after]
- Error Rate: [before]% → [after]%
- Accessibility Score: [before] → [after]

Code Quality (if applicable):
- Cyclomatic Complexity: [before] → [after]
- Type Coverage: [before]% → [after]%
- Lines of Code: [before] → [after]
```

### 7. Localhost Verification

```
✅ Enhancement implementation complete!

🔍 Please verify at http://localhost:3000:

Improvement Tests:
- [ ] [Improvement 1 is noticeable]
- [ ] [Improvement 2 is working]
- [ ] [Metrics show improvement]

Regression Tests:
- [ ] Existing functionality still works
- [ ] No new bugs introduced
- [ ] Performance hasn't degraded elsewhere

localhostで改善を確認しましたか？ (yes/no)
```

### 8. Create Git Commit (After Confirmation)

Choose appropriate commit type:
- `perf()` for performance improvements
- `refactor()` for code refactoring
- `style()` for UI/UX improvements
- `security()` for security enhancements
- `a11y()` for accessibility improvements

```
[type]([scope]): [enhancement title]

[Detailed description]
- Improved [aspect 1]
- Optimized [aspect 2]
- Enhanced [aspect 3]

Impact:
- [Metric 1]: [before] → [after] ([improvement]%)
- [Metric 2]: [before] → [after]

Closes: enhancement-{{enhancement_number | pad:3}}
実績時間: [actual time]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 9. Update Ticket File
- Status: 🟢 完了
- Actual time
- Completion timestamp
- Git commit hash
- Before/after metrics in Memo

### 10. Update PROGRESS.md Files
- Update `docs/ticket/enhancement/PROGRESS.md`
- Update `docs/ticket/PROGRESS.md`

### 11. Final Report

```
✅ Enhancement {{enhancement_number}} Complete!

🔧 [Enhancement Title]
⏱️ Time: [actual] (estimated: [estimated])
💾 Commit: [hash]

📊 Improvements:
[Bullet list of improvements with metrics]

🎯 Impact:
[Overall impact on the application]
```

## Important Notes

- **ALWAYS** measure before/after metrics
- **ALWAYS** test for regressions
- Choose appropriate git commit type
- Document the improvement impact
- Ensure the enhancement is noticeable
- Verify no performance degradation elsewhere
