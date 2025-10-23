---
description: Start working on a bug fix (e.g., /start-bug 1)
---

You are tasked with **starting and fixing a bug** for the AI Summary Generator project.

## Arguments

- `{{bug_number}}` - The bug ticket number (e.g., 1 for bug-001-*.md)

## Task Flow

### 1. Read Bug Ticket
- Find and read `docs/ticket/bug/bug-{{bug_number | pad:3}}-*.md`
- Understand the issue, steps to reproduce, expected vs actual behavior

### 2. Update Status
- Update bug ticket: Status from 🔴 to 🟡 進行中
- Update `docs/ticket/bug/PROGRESS.md`: Move to "In Progress" section
- Record start timestamp

### 3. Reproduce the Issue
- Follow "Steps to Reproduce" from the ticket
- Verify you can reproduce the issue locally
- Document findings in the ticket's Memo section

### 4. Analyze Root Cause
- Use debugging tools, logs, code inspection
- Identify the root cause of the bug
- Document analysis in the Memo section

### 5. Propose Solution
Present the proposed fix to the user:

```
🐛 Bug Analysis Complete

Root Cause:
[Explanation of what's causing the bug]

Proposed Solution:
[Detailed explanation of the fix]

Files to Change:
- [file1.ts] - [what will change]
- [file2.tsx] - [what will change]

Estimated Fix Time: [X minutes]

Proceed with this solution? (yes/no)
```

### 6. Implement Fix (After User Approval)
- Make the necessary code changes
- Follow best practices and coding standards
- Add comments explaining the fix
- Update any related tests
- Run `npm run type-check` and `npm run lint`

### 7. Localhost Verification
**CRITICAL**: Ask user to verify the fix at localhost

```
✅ Bug fix implemented!

🔍 Please verify at http://localhost:3000:
- [ ] Bug is fixed (follow original reproduction steps)
- [ ] No new issues introduced
- [ ] Related functionality still works
- [ ] No console errors

localhostでバグが修正されたことを確認しましたか？ (yes/no)
```

### 8. Do NOT proceed without user confirmation

If user says no:
- Ask what's wrong
- Iterate on the fix
- Return to step 7

### 9. Create Git Commit (After Confirmation)

```
fix([scope]): [brief description of fix]

[Detailed explanation]
- Fixed [specific issue]
- Root cause was [explanation]
- Solution: [how it was fixed]

Closes: bug-{{bug_number | pad:3}}
実績時間: [actual time in minutes]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

Scope examples: `ui`, `api`, `db`, `auth`, `validation`

Run: `git add . && git commit -m "$(cat <<'EOF' ...)`

### 10. Update Ticket File
- Status: 🟢 完了
- Actual time: [time spent]
- Completion timestamp
- Git commit hash
- Solution summary in Memo section

### 11. Update PROGRESS.md Files
- Update `docs/ticket/bug/PROGRESS.md`: Move to Completed section
- Update `docs/ticket/PROGRESS.md`: Increment completed count

### 12. Final Report

```
✅ Bug {{bug_number}} Fixed!

🐛 Issue: [Bug title]
⏱️ Time: [actual] (estimated: [estimated])
💾 Commit: [hash]

📋 Summary:
[Brief summary of the fix]

🎯 Impact:
[What areas were affected by this fix]
```

## Important Notes

- **ALWAYS** require localhost verification before marking complete
- **NEVER** skip git commit
- **ALWAYS** document root cause and solution in the ticket
- Use appropriate git commit scope
- Ensure no regressions are introduced
- Update PROGRESS.md files immediately after completion
