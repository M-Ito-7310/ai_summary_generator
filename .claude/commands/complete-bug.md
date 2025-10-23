---
description: Mark a bug as completed after verification (e.g., /complete-bug 1)
---

You are tasked with **marking a bug as completed** for the AI Summary Generator project.

## Arguments

- `{{bug_number}}` - The bug ticket number (e.g., 1 for bug-001-*.md)

## Task Flow

### 1. Validation
- Find and read `docs/ticket/bug/bug-{{bug_number | pad:3}}-*.md`
- Verify the bug status is 🟡 進行中
- If not in progress, inform user and exit

### 2. Check Completion Criteria

Verify all items in the Acceptance Criteria are checked:
- [ ] localhost で動作確認済み
- [ ] Bug is fixed
- [ ] No regressions
- [ ] Tests pass
- [ ] リントエラーがゼロ
- [ ] 型エラーがゼロ

If any are unchecked:
```
⚠️ Cannot complete - missing acceptance criteria:
- [ ] [Unchecked item 1]
- [ ] [Unchecked item 2]

Please complete these items first, or use `/start-bug {{bug_number}}` to continue work.
```

### 3. Final Verification

Ask user for final confirmation:
```
🔍 Final Verification Checklist:

- [ ] Bug is completely fixed at localhost
- [ ] No new issues were introduced
- [ ] All related functionality works correctly
- [ ] Code changes are committed to git

All items above are complete? (yes/no)
```

### 4. Calculate Time Spent
- Compare start timestamp to current time
- Record actual time spent

### 5. Create Git Commit (if not already done)

Check git status. If there are uncommitted changes:
```
fix([scope]): [bug title]

[Description of fix]

Closes: bug-{{bug_number | pad:3}}
実績時間: [actual time]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 6. Update Ticket File
- Status: 🔴 未着手 → 🟢 完了
- Actual Time: [calculated time]
- Completion timestamp: [current date/time]
- Git commit hash: [from git log]
- Add completion notes to Memo section

### 7. Update PROGRESS.md Files
- Update `docs/ticket/bug/PROGRESS.md`:
  - Remove from "In Progress"
  - Add to "Completed" section
  - Update statistics
- Update `docs/ticket/PROGRESS.md`:
  - Increment completed bug count
  - Update overall statistics

### 8. Completion Report

```
✅ Bug {{bug_number}} - COMPLETED!

🐛 [Bug Title]
⏱️ Time: [actual] / [estimated] ([efficiency]%)
📝 Commit: [hash]

📊 Summary:
- Issue: [Brief description]
- Solution: [How it was fixed]
- Files Changed: [number]

🎉 Project Progress Updated:
- Bugs Fixed: [X]/[Total]
- Remaining Bugs: [Y]

🎯 Next Steps:
Run `/list-tickets` to see remaining work
```

## Important Notes

- **NEVER** mark complete without user confirmation
- **ALWAYS** verify all acceptance criteria are met
- **ALWAYS** ensure git commit exists
- Update both bug-specific and master PROGRESS.md
- Calculate efficiency: (estimated / actual) * 100
- Archive ticket details properly for future reference

## Edge Cases

### If Git Commit Missing
- Create the commit before marking complete
- Use standard bug fix commit format

### If Localhost Not Verified
- Refuse to complete
- Remind user to test at localhost first

### If Status is Not "In Progress"
- Cannot complete a bug that's not started
- Guide user to use `/start-bug` first
