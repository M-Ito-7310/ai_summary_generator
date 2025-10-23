---
description: Display overall project status dashboard aggregating all progress files
---

You are tasked with **displaying the overall project status dashboard** for the AI Summary Generator project.

## Task Flow

### 1. Read All PROGRESS.md Files

- `docs/ticket/PROGRESS.md` (master)
- `docs/ticket/phase/PROGRESS.md`
- `docs/ticket/feature/PROGRESS.md`
- `docs/ticket/bug/PROGRESS.md`
- `docs/ticket/enhancement/PROGRESS.md`

### 2. Aggregate Statistics

Collect:
- Overall progress percentage
- Current milestone
- Work in progress
- Total counts by category
- Time statistics
- Priority breakdown

### 3. Display Dashboard

```
🚀 AI SUMMARY GENERATOR - PROJECT STATUS DASHBOARD
═══════════════════════════════════════════════════

📅 Last Updated: [timestamp]
🎯 Current Milestone: MVP完成 (Phase 1-4)

---

## 📊 OVERALL PROGRESS

Project Completion: [████░░░░░░] 35%

Phases:     [██████░░░░] 60% (3/8 completed)
Features:   [███░░░░░░░] 25% (1/4 completed)
Bugs:       [████████░░] 33% (1/3 fixed)
Enhance:    [███░░░░░░░] 33% (1/3 completed)

---

## 🔄 CURRENTLY IN PROGRESS

⏳ Active Work (4 items):

1. 🟡 Phase 03: AI統合 (Critical, 3/5h elapsed)
   Status: OpenAI API integration 60% complete

2. 🟡 Feature 002: User authentication (High, 2/4h elapsed)
   Status: Backend complete, frontend in progress

3. 🟡 Bug 005: Form validation (Medium, 10/20min elapsed)
   Status: Root cause identified, fixing

4. 🟡 Enhancement 001: Search performance (Low, 1/2h elapsed)
   Status: Implementing indexed search

**Total Active Time**: 6h / 11.3h estimated

---

## 📋 WORK BREAKDOWN

### Phases (8 total)
- ✅ Completed: 2 (Phase 01, 02)
- 🟡 In Progress: 1 (Phase 03)
- 🔴 Not Started: 5
- ⚫ Blocked: 0

Next: Phase 04 - データベース統合 (3h)

### Features (4 total)
- ✅ Completed: 1
- 🟡 In Progress: 1
- 🔴 Not Started: 2
- ⚫ Blocked: 0

Next: Feature 001 - Export to PDF (2h, Critical)

### Bugs (3 total)
- ✅ Fixed: 1
- 🟡 In Progress: 1
- 🔴 Not Started: 1
- ⚫ Blocked: 0

Next: Bug 003 - Form submission (30min, Critical)

### Enhancements (3 total)
- ✅ Completed: 1
- 🟡 In Progress: 1
- 🔴 Not Started: 1
- ⚫ Blocked: 0

Next: Enhancement 002 - Keyboard shortcuts (1h, Low)

---

## ⏱️ TIME TRACKING

### Phases
- Estimated: 24h
- Actual (completed): 6.5h
- Remaining: 17.5h
- Efficiency: 92%

### Features
- Estimated: 8h
- Actual (completed): 1h
- Remaining: 7h
- Efficiency: 100%

### Bugs
- Estimated: 70min
- Actual (completed): 15min
- Remaining: 55min
- Efficiency: 133%

### Enhancements
- Estimated: 5h
- Actual (completed): 1.5h
- Remaining: 3.5h
- Efficiency: 133%

**Overall Project:**
- Total Estimated: 37.2h
- Total Actual: 9.15h (25% complete)
- Projected Total: 35.8h (based on 104% avg efficiency)
- Remaining: ~26.6h

---

## 🎯 PRIORITY OVERVIEW

🔴 **CRITICAL** (6 items):
- 4 Phases (01, 02, 03, 08)
- 1 Feature
- 1 Bug
→ 2 completed, 1 in progress, 3 pending

🟠 **HIGH** (5 items):
- 3 Phases (04, 05, 07)
- 1 Feature
- 1 Bug
→ 0 completed, 1 in progress, 4 pending

🟡 **MEDIUM** (3 items):
- 1 Phase (06)
- 1 Bug
- 1 Enhancement
→ 0 completed, 2 in progress, 1 pending

🟢 **LOW** (1 item):
- 1 Enhancement
→ 0 completed, 1 in progress, 0 pending

---

## 🏆 MILESTONES

### Milestone 1: MVP完成 (Phase 1-4)
Progress: [██████░░░░] 75% (3/4 phases)
Status: 🟡 In Progress
ETA: ~8h remaining

### Milestone 2: 品質向上 (Phase 5-7)
Progress: [░░░░░░░░░░] 0% (0/3 phases)
Status: 🔴 Not Started
ETA: ~8h

### Milestone 3: プレリリース (Phase 8)
Progress: [░░░░░░░░░░] 0% (0/1 phase)
Status: 🔴 Not Started
ETA: ~2h

---

## ⚠️ BLOCKERS & RISKS

[If any blockers exist, list them here]

Currently: No blockers 🎉

---

## 🎯 RECOMMENDED NEXT ACTIONS

### Immediate (Next Session):
1. **Complete Phase 03** (2h remaining)
   - Critical for MVP
   - Blocks Phase 04

2. **Fix Bug 003: Form submission** (30min, Critical)
   - Affecting user experience

### Short Term (This Week):
3. **Complete Feature 002** (2h remaining)
4. **Start Phase 04: Database Integration** (3h)
5. **Complete MVP Milestone** (Phase 1-4)

### Commands to Run:
```bash
/start-phase 3        # Continue Phase 3
/start-bug 3          # Fix critical bug
/check-progress       # Detailed progress view
/list-tickets         # See all tickets
```

---

## 📈 VELOCITY & PREDICTIONS

Based on completed work:
- Average efficiency: 104%
- Avg time per phase: 3.25h
- Avg time per feature: 1h
- Avg time per bug: 15min
- Avg time per enhancement: 1.5h

**Projected Completion:**
- MVP (Milestone 1): ~8h remaining
- Full Release (All phases): ~26.6h remaining
- At 4h/day: ~7 working days
- At 8h/day: ~3.5 working days

---

**🤖 Auto-generated status dashboard**
**Report generated: [timestamp]**
```

## Important Notes

- **Read-only command** - no file modifications
- Aggregate data from all PROGRESS.md files
- Calculate accurate percentages and statistics
- Provide velocity-based predictions
- Highlight blockers and risks prominently
- Give actionable, prioritized recommendations
- Show both time-based and count-based progress
- Include efficiency metrics for better estimation

## Visual Elements

- Use progress bars: [████░░░░░░]
- Use emoji indicators: 🟡 🔴 🟢 ⚫
- Use icons: 🎯 📊 ⏱️ 🏆 ⚠️
- Group information logically
- Make it scannable with clear headers
