---
description: Automatically advance to the next phase after completing current work
---

You are tasked with **automatically advancing to the next phase** of the AI Summary Generator project.

## Task Flow

### 1. Check Current Status
- Read `docs/ticket/PROGRESS.md`
- Identify the current phase in progress
- Identify completed phases

### 2. Validation

Check the following conditions:

**If no phase is in progress AND no phases are completed**:
- Output: "No phases have been started yet. Run `/start-phase 1` to begin Phase 01."
- Exit

**If a phase is currently in progress**:
- Output: "Phase X is currently in progress. Please complete it first using `/start-phase X` or run `/check-progress` to see status."
- Exit

**If all phases are completed**:
- Output: "🎉 Congratulations! All phases are complete. The project is ready for production!"
- Show deployment URL if available
- Exit

### 3. Determine Next Phase

If validation passes:
- Identify the highest completed phase number
- Next phase = highest completed + 1

Example:
- If Phase 1, 2, 3 are completed → Next is Phase 4
- If no phases are completed → Next is Phase 1

### 4. Confirm with User

Display:
```
📋 Phase X Completed Successfully!

🎯 Next Phase:
Phase [X+1]: [Phase Name]
Priority: [Critical/High/Medium]
Estimated Time: [Xh]

Ready to start Phase [X+1]?

[Brief description of what Phase X+1 will accomplish]

Type 'yes' to continue, or 'no' to cancel.
```

### 5. Execute Start Phase

If user confirms (yes):
- Automatically execute `/start-phase [next_phase_number]`
- This will trigger the full phase implementation workflow

If user declines (no):
- Output: "Understood. Run `/start-phase [next_phase_number]` when you're ready to continue."
- Exit

## Important Notes

- **DO NOT** start a new phase if one is already in progress
- **ALWAYS** confirm with the user before starting the next phase
- Provide a clear summary of what the next phase will accomplish
- If the user wants to skip phases or work out of order, suggest using `/start-phase X` directly
- This command is designed for linear progression through phases

## Output Example

```
✅ Phase 02: UI実装 - Completed!

🎯 Next Phase:
Phase 03: AI統合
Priority: Critical
Estimated Time: 5h

This phase will:
- Integrate OpenAI API for summarization
- Implement article content extraction
- Create 3-pattern comment generation
- Add comprehensive error handling

Ready to start Phase 03? (yes/no)
```
