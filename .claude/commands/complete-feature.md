---
description: Mark a feature as completed after verification (e.g., /complete-feature 1)
---

You are tasked with **marking a feature as completed** for the AI Summary Generator project.

## Arguments

- `{{feature_number}}` - The feature ticket number (e.g., 1 for feature-001-*.md)

## Task Flow

### 1. Validation
- Find and read `docs/ticket/feature/feature-{{feature_number | pad:3}}-*.md`
- Verify the feature status is 🟡 進行中
- If not in progress, inform user and exit

### 2. Check Acceptance Criteria

Read and verify ALL acceptance criteria from the ticket:

```
📋 Acceptance Criteria Check:

From ticket:
- [ ] [Criterion 1 from ticket]
- [ ] [Criterion 2 from ticket]
- [ ] [Criterion 3 from ticket]

Standard criteria:
- [ ] localhost で動作確認済み
- [ ] リントエラーがゼロ
- [ ] 型エラーがゼロ
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if applicable)

Are ALL criteria above met? (yes/no)
```

If any unchecked:
```
⚠️ Cannot complete - missing acceptance criteria:
[List unchecked items]

Please complete these items first, or use `/start-feature {{feature_number}}` to continue work.
```

### 3. Verify Implementation Completeness

Check:
- All files mentioned in implementation plan exist
- All checklist items in ticket are checked
- Feature works end-to-end
- No console errors
- Git commit exists

### 4. Run Quality Checks

```bash
npm run type-check
npm run lint
npm run build
```

If any fail, report to user and refuse completion.

### 5. Final User Confirmation

```
🔍 Final Feature Verification:

Feature: [Feature Title]

Deliverables:
✅ [Deliverable 1]
✅ [Deliverable 2]
✅ [Deliverable 3]

Quality Checks:
✅ TypeScript: No errors
✅ Lint: No errors
✅ Build: Successful
✅ Localhost: Verified working

Git Status:
✅ Changes committed
📝 Commit: [hash]

Confirm completion? (yes/no)
```

### 6. Calculate Time and Efficiency
- Start time from ticket
- Current time
- Calculate actual time spent
- Compare to estimate
- Calculate efficiency: (estimated / actual) * 100

### 7. Update Ticket File

Update the feature ticket with:
```markdown
**Status**: 🟢 完了
**Actual Time**: [Xh Ymin]
**Completed**: [YYYY-MM-DD HH:MM]
**Efficiency**: [X]%
**Git Commit**: [hash]

## 💭 Memo

### 完了サマリー
[Auto-generated summary of what was accomplished]

### 実装の詳細
[Key technical decisions and approach]

### テスト結果
- Localhost verification: ✅
- Type check: ✅
- Lint: ✅
- Build: ✅
```

### 8. Update PROGRESS.md Files

**Update `docs/ticket/feature/PROGRESS.md`**:
- Remove from "In Progress" section
- Add to "Completed" section with timestamp
- Update progress bar
- Update statistics

**Update `docs/ticket/PROGRESS.md`**:
- Increment completed feature count
- Update overall statistics
- Update progress percentage

### 9. Completion Report

```
🎉 Feature {{feature_number}} - COMPLETED!

✨ [Feature Title]

📊 Metrics:
- Estimated: [Xh]
- Actual: [Yh]
- Efficiency: [Z]%
- Files Changed: [N]

💡 What was delivered:
[Brief bullet list of deliverables]

🎯 Impact:
[How this feature improves the application]

📝 Git Commit: [hash]

📈 Project Progress:
- Features: [X]/[Total] completed ([%]%)
- Overall: [Phase progress]

🚀 Next Steps:
- Run `/list-tickets` to see remaining features
- Run `/check-progress` for overall status
- Run `/next-phase` if ready to advance
```

## Important Notes

- **NEVER** mark complete without full verification
- **ALWAYS** run type-check, lint, and build before completing
- **ALWAYS** verify git commit exists
- **ALWAYS** update both PROGRESS.md files
- Document key implementation details in Memo
- Calculate and record efficiency metrics
- Ensure all acceptance criteria are truly met

## Edge Cases

### If Quality Checks Fail
```
❌ Cannot complete feature - quality checks failed:

TypeScript errors: [X]
Lint errors: [Y]
Build errors: [Z]

Please fix these issues first, then try again.
```

### If No Git Commit
```
❌ No git commit found for this feature.

Please ensure changes are committed:
git add .
git commit -m "feat: [description]"

Then run `/complete-feature {{feature_number}}` again.
```

### If User Reports Issues
- Return to implementation
- Fix the issues
- Re-run verification process
- Don't force completion

## Success Criteria Summary

For a feature to be marked complete:
1. ✅ All acceptance criteria met
2. ✅ Localhost verification successful
3. ✅ Type check passes
4. ✅ Lint passes
5. ✅ Build successful
6. ✅ Git commit exists
7. ✅ User confirms completion
8. ✅ Documentation updated (if needed)
