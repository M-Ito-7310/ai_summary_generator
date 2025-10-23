---
description: Create a new ticket (bug/feature/enhancement) with automatic categorization and numbering
---

You are tasked with **creating a new ticket** for the AI Summary Generator project.

## Task Flow

### 1. Gather Information from User

Ask the user the following questions (if not already provided in their message):

1. **What type of ticket is this?**
   - Bug 🐛 (something is broken)
   - Feature ✨ (new functionality)
   - Enhancement 🔧 (improvement to existing functionality)

2. **What is the title/summary?** (short, descriptive)

3. **What is the detailed description?**
   - For bugs: What's broken? Steps to reproduce? Expected vs actual behavior?
   - For features: What should it do? Why is it needed? User story?
   - For enhancements: What should be improved? Why? Expected impact?

4. **What is the priority?**
   - Critical 🔴 (blocks other work, production issue)
   - High 🟠 (important, should be done soon)
   - Medium 🟡 (normal priority)
   - Low 🟢 (nice to have)

5. **Estimated time?** (in hours for features/enhancements, minutes for bugs)

### 2. Auto-Detect Category (if possible)

If user provides a description, try to auto-categorize:
- Keywords like "fix", "error", "broken", "doesn't work" → Bug
- Keywords like "add", "new", "create", "implement" → Feature
- Keywords like "improve", "optimize", "refactor", "enhance" → Enhancement

Confirm with user: "This sounds like a [category]. Is that correct?"

### 3. Auto-Number the Ticket

- Read existing tickets in the appropriate category folder
- Find the highest number (e.g., if `feature-003-*.md` exists, next is 004)
- Use 3-digit zero-padded format: 001, 002, 003, etc.

### 4. Create Ticket File

Create a new file in the appropriate directory:
- Bugs: `docs/ticket/bug/bug-XXX-short-title.md`
- Features: `docs/ticket/feature/feature-XXX-short-title.md`
- Enhancements: `docs/ticket/enhancement/enhancement-XXX-short-title.md`

### 5. Ticket Template

Use the following template structure:

```markdown
# [Category] XXX: [Title]

**Status**: 🔴 未着手
**Priority**: [Critical/High/Medium/Low]
**Estimated Time**: [Xh or Xmin]
**Actual Time**: -
**Created**: [YYYY-MM-DD]
**Assigned**: AI Agent

---

## 📝 Description

[Detailed description from user]

[For bugs, include:]
### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

[For features, include:]
### User Story
As a [user type], I want [goal] so that [benefit].

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## ✅ Checklist

[Auto-generate appropriate checklist items based on the ticket type]

For bugs:
- [ ] Reproduce the issue
- [ ] Identify root cause
- [ ] Implement fix
- [ ] Test fix locally
- [ ] Verify no regression
- [ ] Update tests if needed

For features:
- [ ] Design component/API structure
- [ ] Implement core functionality
- [ ] Add error handling
- [ ] Implement UI (if applicable)
- [ ] Add validation
- [ ] Test functionality
- [ ] Update documentation

For enhancements:
- [ ] Analyze current implementation
- [ ] Identify improvement opportunities
- [ ] Implement improvements
- [ ] Measure impact (performance, UX, etc.)
- [ ] Test changes
- [ ] Document changes

---

## 🧪 Test Plan

[Auto-generate basic test plan]

1. **Functional Test**
   - [Test item 1]
   - [Test item 2]

2. **Edge Cases**
   - [Edge case 1]
   - [Edge case 2]

3. **Regression Test**
   - Ensure existing functionality still works

---

## 📌 Acceptance Criteria

- [ ] [Criterion from description]
- [ ] localhost で動作確認済み
- [ ] リントエラーがゼロ
- [ ] 型エラーがゼロ
- [ ] Tests pass (if applicable)

---

## 📎 Related

- **Related Phase**: [phase-XX if applicable]
- **Related Tickets**: [other tickets if applicable]

---

## 💭 Memo

### 作業ログ
<!-- Work notes will be added here during implementation -->

### 解決策
<!-- Solution details will be added here -->

### 完了時のGitコミットハッシュ
<!-- Git commit hash will be added here -->

---

**Created**: [Date]
**Last Updated**: [Date]
```

### 6. Update PROGRESS.md

Update the appropriate category PROGRESS.md file:
- `docs/ticket/bug/PROGRESS.md`
- `docs/ticket/feature/PROGRESS.md`
- `docs/ticket/enhancement/PROGRESS.md`

Add the new ticket to the "Awaiting Work" section under the correct priority.

### 7. Update Master PROGRESS.md

Update `docs/ticket/PROGRESS.md`:
- Increment the ticket count for the appropriate category

### 8. Confirmation Message

Output:
```
✅ Ticket Created Successfully!

📋 [Category] XXX: [Title]
Priority: [Priority]
Estimated: [Time]

📄 File: docs/ticket/[category]/[category]-XXX-[slug].md

🎯 Next Steps:
- Run `/list-tickets` to see all tickets
- Run `/start-[category] XXX` to begin work on this ticket
- Run `/check-progress` to see updated project status

[Display brief summary of the ticket]
```

## Important Notes

- **ALWAYS** use 3-digit zero-padded numbering (001, 002, ...)
- **ALWAYS** update both the ticket file and PROGRESS.md files
- Create descriptive but concise file names (slug format)
- Auto-generate appropriate checklists based on ticket type
- Use emoji status indicators consistently: 🔴 未着手
- Include all required sections in the template
- Make the ticket actionable with clear acceptance criteria

## Slug Format for Filenames

Convert title to slug:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Max 50 characters

Example: "Fix Login Form Validation" → "fix-login-form-validation"
