---
description: Start implementing a new feature (e.g., /start-feature 1)
---

You are tasked with **starting and implementing a new feature** for the AI Summary Generator project.

## Arguments

- `{{feature_number}}` - The feature ticket number (e.g., 1 for feature-001-*.md)

## Task Flow

### 1. Read Feature Ticket
- Find and read `docs/ticket/feature/feature-{{feature_number | pad:3}}-*.md`
- Understand the user story, requirements, and acceptance criteria

### 2. Update Status
- Update feature ticket: Status from 🔴 to 🟡 進行中
- Update `docs/ticket/feature/PROGRESS.md`: Move to "In Progress" section
- Record start timestamp

### 3. Analyze Requirements
- Review the user story: "As a [X], I want [Y] so that [Z]"
- Identify all acceptance criteria
- List affected files and components

### 4. Design Implementation Plan

Create a detailed plan:

```
✨ Feature Implementation Plan

Feature: [Feature Title]

User Story:
As a [user type], I want [goal] so that [benefit]

Implementation Approach:
1. [Step 1 - e.g., Create new component]
2. [Step 2 - e.g., Add API endpoint]
3. [Step 3 - e.g., Integrate with UI]

Files to Create/Modify:
📁 New Files:
- [path/to/new/file1.tsx]
- [path/to/new/file2.ts]

📝 Modified Files:
- [path/to/existing/file1.tsx] - [what will change]
- [path/to/existing/file2.ts] - [what will change]

Dependencies:
- [Any new packages needed]

Estimated Time: [Xh]

Proceed with this implementation? (yes/no/revise)
```

### 5. Implement Feature (After User Approval)

Follow the implementation plan:
- Create new files as needed
- Modify existing files
- Follow coding standards and best practices
- Add appropriate error handling
- Add form validation if applicable
- Ensure type safety (TypeScript)
- Add comments for complex logic

### 6. Testing During Implementation
- Run `npm run type-check` frequently
- Run `npm run lint` to catch issues early
- Test functionality as you build
- Handle edge cases

### 7. Localhost Verification
**CRITICAL**: Comprehensive localhost testing

```
✅ Feature implementation complete!

🔍 Please test at http://localhost:3000:

Functional Tests:
- [ ] [Test case 1 from test plan]
- [ ] [Test case 2 from test plan]
- [ ] [Test case 3 from test plan]

Edge Cases:
- [ ] [Edge case 1]
- [ ] [Edge case 2]

Integration:
- [ ] Feature integrates with existing functionality
- [ ] No existing features are broken
- [ ] No console errors

localhostで全ての機能が正常に動作することを確認しましたか？ (yes/no)
```

### 8. Do NOT proceed without user confirmation

If user says no:
- Ask what issues they found
- Fix the issues
- Return to step 7

### 9. Create Git Commit (After Confirmation)

```
feat([scope]): [feature title in imperative mood]

[Detailed description of the feature]
- Added [component/functionality 1]
- Implemented [component/functionality 2]
- Integrated [component/functionality 3]

User Story:
As a [user], I want [goal] so that [benefit]

Closes: feature-{{feature_number | pad:3}}
実績時間: [actual time in hours]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

Scope examples: `ui`, `api`, `db`, `search`, `export`

Run: `git add . && git commit -m "$(cat <<'EOF' ...)`

### 10. Update Ticket File
- Status: 🟢 完了
- Actual time: [time spent]
- Completion timestamp
- Git commit hash
- Implementation notes in Memo section

### 11. Update PROGRESS.md Files
- Update `docs/ticket/feature/PROGRESS.md`: Move to Completed section
- Update `docs/ticket/PROGRESS.md`: Increment completed count

### 12. Final Report

```
✅ Feature {{feature_number}} Implemented!

✨ [Feature Title]
⏱️ Time: [actual] (estimated: [estimated])
💾 Commit: [hash]

📋 What was added:
[Bullet list of new functionality]

🎯 Impact:
[How this improves the application]

📸 Files Created: [X]
📝 Files Modified: [Y]
```

## Important Notes

- **ALWAYS** get user approval on implementation plan
- **ALWAYS** require comprehensive localhost testing
- **NEVER** skip git commit
- Ensure the feature meets all acceptance criteria
- Test integration with existing features
- Document any architectural decisions in Memo
- Use semantic commit messages (feat)
- Update PROGRESS.md files immediately

## Feature-Specific Guidelines

### UI Features
- Ensure responsive design
- Test on multiple screen sizes
- Add loading states
- Add error states
- Follow design system

### API Features
- Add input validation
- Add error handling
- Add rate limiting if needed
- Document API in code comments
- Test with various inputs

### Database Features
- Create/update Prisma schema
- Run migrations
- Add indexes if needed
- Test CRUD operations
- Use Prisma Studio to verify
