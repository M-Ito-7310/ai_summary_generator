---
description: Display detailed project progress including phases, tickets, and statistics
---

You are tasked with displaying the **comprehensive project progress** for the AI Summary Generator project.

## Task

1. **Read the master progress file**:
   - Read `docs/ticket/PROGRESS.md`

2. **Display detailed progress including**:
   - Overall progress bar and percentage
   - Current milestone status
   - Current work in progress
   - All phases with their status (🔴未着手/🟡進行中/🟢完了)
   - Priority-ordered awaiting work
   - Statistics (completed vs total, time tracking)

3. **Read category progress files**:
   - Read `docs/ticket/feature/PROGRESS.md`
   - Read `docs/ticket/bug/PROGRESS.md`
   - Read `docs/ticket/enhancement/PROGRESS.md`

4. **Show ticket summaries**:
   - Total tickets per category
   - In-progress tickets
   - Completed tickets

5. **Provide recommendations**:
   - Suggest next action (e.g., "Run `/start-phase 1`" or "Complete Phase X first")
   - Highlight any blockers
   - Show time estimates for upcoming work

6. **Format output** in a clear, organized manner with:
   - Visual progress bars
   - Emoji status indicators
   - Bulleted lists
   - Clear section headers

## Output Example

```
🚀 AI Summary Generator - Project Progress
═══════════════════════════════════════════

📊 Overall Progress
Progress: [██░░░░░░░░] 20% (2/8 Phases Complete)

Current Status: 🟡 In Progress
Current Phase: Phase 03 - AI Integration
Next Milestone: MVP完成 (Phase 1-4)

🔄 Currently Working On
• Phase 03: AI統合 (🟡 進行中, 3/5h elapsed)
  - Implementing OpenAI API integration
  - [View Details](docs/ticket/phase/phase-03-ai-integration.md)

✅ Recently Completed
• Phase 01: プロジェクトセットアップ (🟢 完了, 2h)
• Phase 02: UI実装 (🟢 完了, 4.5h)

⏳ Upcoming Work
🔴 Phase 04: データベース統合 (High, Est: 3h)
🔴 Phase 05: エラーハンドリング＆UX改善 (High, Est: 3h)

📈 Statistics
• Phases: 2/8 completed (25%)
• Features: 0/0 completed
• Bugs: 0/0 fixed
• Enhancements: 0/0 completed
• Time: 6.5h actual / 6h estimated (108% efficiency)

🎯 Next Actions
1. Complete Phase 03 (estimated 2h remaining)
2. Run `/next-phase` when ready for Phase 04
3. Test all functionality at localhost

⚠️ Blockers
None
```

## Important Notes

- **DO NOT** make any changes to files - this is a read-only command
- Show visual progress bars using ASCII characters: █ for completed, ░ for remaining
- Use emoji status indicators: 🔴 未着手, 🟡 進行中, 🟢 完了
- Include clickable file links for user convenience
- Provide actionable next steps
- Keep output concise but comprehensive
