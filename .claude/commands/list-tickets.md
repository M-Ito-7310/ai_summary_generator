---
description: Display all tickets organized by category and status with priority ordering
---

You are tasked with **displaying all tickets** for the AI Summary Generator project.

## Task Flow

### 1. Read All Ticket Files

Scan these directories:
- `docs/ticket/phase/*.md` (excluding PROGRESS.md)
- `docs/ticket/feature/*.md` (excluding PROGRESS.md, README.md)
- `docs/ticket/bug/*.md` (excluding PROGRESS.md, README.md)
- `docs/ticket/enhancement/*.md` (excluding PROGRESS.md, README.md)

### 2. Parse Each Ticket

Extract:
- Ticket ID and title
- Status (🔴未着手/🟡進行中/🟢完了/⚫ブロック)
- Priority (Critical/High/Medium/Low)
- Estimated time
- Actual time (if completed)

### 3. Organize Tickets

Group by:
1. Category (Phase, Feature, Bug, Enhancement)
2. Status (In Progress → Not Started → Completed)
3. Priority (Critical → High → Medium → Low)

### 4. Display Output

```
📋 AI Summary Generator - All Tickets
═══════════════════════════════════════

## 🔄 IN PROGRESS (Currently Working)

### Phases
🟡 Phase 03: AI統合 (Critical, 3/5h)
   [docs/ticket/phase/phase-03-ai-integration.md]

### Features
🟡 Feature 002: User authentication (High, 2/4h)
   [docs/ticket/feature/feature-002-user-authentication.md]

---

## ⏳ NOT STARTED (Priority Order)

### 🔴 CRITICAL

**Phases:**
- Phase 04: データベース統合 (Est: 3h)
- Phase 08: Vercelデプロイ (Est: 2h)

**Features:**
- Feature 001: Export to PDF (Est: 2h)

**Bugs:**
- Bug 003: Form submission error (Est: 30min)

### 🟠 HIGH

**Phases:**
- Phase 05: エラーハンドリング (Est: 3h)

**Features:**
- Feature 005: Dark mode toggle (Est: 1.5h)

**Bugs:**
- Bug 001: Validation error (Est: 20min)

### 🟡 MEDIUM

**Enhancements:**
- Enhancement 001: Improve search performance (Est: 2h)

### 🟢 LOW

**Enhancements:**
- Enhancement 002: Add keyboard shortcuts (Est: 1h)

---

## ✅ COMPLETED

<details>
<summary>View completed tickets (5 total)</summary>

**Phases:**
✅ Phase 01: プロジェクトセットアップ (2h, efficiency: 100%)
✅ Phase 02: UI実装 (4.5h, efficiency: 89%)

**Features:**
✅ Feature 003: URL validation (1h, efficiency: 100%)

**Bugs:**
✅ Bug 002: Login redirect issue (15min, efficiency: 150%)

**Enhancements:**
✅ Enhancement 003: Optimize bundle size (1.5h, efficiency: 133%)

</details>

---

## 📊 SUMMARY

Total Tickets: 15

By Category:
- Phases: 3 in progress, 4 pending, 1 completed (8 total)
- Features: 1 in progress, 2 pending, 1 completed (4 total)
- Bugs: 0 in progress, 2 pending, 1 completed (3 total)
- Enhancements: 0 in progress, 2 pending, 1 completed (3 total)

By Status:
- 🟡 In Progress: 4 (26.7%)
- 🔴 Not Started: 8 (53.3%)
- 🟢 Completed: 3 (20%)
- ⚫ Blocked: 0 (0%)

By Priority:
- 🔴 Critical: 5
- 🟠 High: 3
- 🟡 Medium: 2
- 🟢 Low: 1

Time Tracking:
- Total Estimated: 35h
- Total Actual (completed): 9.15h
- Average Efficiency: 112%

---

## 🎯 RECOMMENDED NEXT ACTIONS

1. **Complete In-Progress Work First:**
   - Finish Phase 03: AI統合 (2h remaining)
   - Finish Feature 002: User authentication (2h remaining)

2. **Then Start Critical Items:**
   - Phase 04: データベース統合
   - Bug 003: Form submission error

3. **Commands:**
   - `/start-phase 4` - Start next critical phase
   - `/start-bug 3` - Fix critical bug
   - `/check-progress` - View detailed progress

---

**🤖 Auto-generated ticket list**
**Last Updated: [timestamp]**
```

## Formatting Guidelines

- Use emoji status indicators consistently
- Show file paths as clickable links
- Group logically (category → status → priority)
- Use collapsible sections for completed items
- Provide summary statistics
- Give actionable recommendations
- Keep output scannable and organized

## Important Notes

- **Read-only command** - don't modify any files
- Sort by priority within each section
- Show estimated AND actual time for completed items
- Calculate efficiency percentages for completed work
- Highlight blockers prominently if any exist
- Provide useful "next action" recommendations based on current state
