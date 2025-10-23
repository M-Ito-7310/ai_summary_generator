---
description: Mark an enhancement as completed (e.g., /complete-enhancement 1)
---

You are tasked with **marking an enhancement as completed** for the AI Summary Generator project.

## Arguments

- `{{enhancement_number}}` - The enhancement ticket number

## Task Flow

### 1. Validation
- Read `docs/ticket/enhancement/enhancement-{{enhancement_number | pad:3}}-*.md`
- Verify status is 🟡 進行中

### 2. Verify Metrics

Check that before/after metrics are documented:

```
📊 Enhancement Verification

Documented Improvements:
- [Metric 1]: [before] → [after] ([improvement]%)
- [Metric 2]: [before] → [after] ([improvement]%)

Are improvements measurable and documented? (yes/no)
```

### 3. Acceptance Criteria Check

```
📋 Acceptance Criteria:
- [ ] Improvement is implemented
- [ ] Metrics show positive impact
- [ ] No regressions introduced
- [ ] localhost で確認済み
- [ ] リントエラーがゼロ
- [ ] 型エラーがゼロ

All met? (yes/no)
```

### 4. Quality Checks

Run:
- `npm run type-check`
- `npm run lint`
- `npm run build`

### 5. User Confirmation

```
🔍 Final Enhancement Verification:

Enhancement: [Title]

Improvements Delivered:
✅ [Improvement 1]
✅ [Improvement 2]

Quality: ✅ All checks pass
Git: ✅ Committed ([hash])

Confirm completion? (yes/no)
```

### 6. Update Files

Update ticket and PROGRESS.md files with:
- Status: 🟢 完了
- Metrics
- Completion details

### 7. Completion Report

```
🎉 Enhancement {{enhancement_number}} - COMPLETED!

🔧 [Title]
⏱️ Time: [actual]/[estimated]
💾 Commit: [hash]

📊 Improvements:
[List with metrics]

🎯 Next: `/list-tickets`
```

## Important Notes

- Verify measurable improvements
- Ensure no regressions
- Document all metrics
- Update PROGRESS.md files
