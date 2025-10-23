---
description: Start implementing a specific phase (e.g., /start-phase 1)
---

You are tasked with **starting and implementing a specific Phase** of the AI Summary Generator project.

## Arguments

- `{{phase_number}}` - The phase number to start (1-8)

## Task Flow

### 1. Validation
- Verify the phase number is valid (1-8)
- Check if another phase is already in progress
- If so, warn the user and ask for confirmation to proceed

### 2. Read Phase Ticket
- Read `docs/ticket/phase/phase-0{{phase_number}}-*.md`
- Understand all requirements, checklist items, and acceptance criteria

### 3. Update Status to In Progress
- Update the phase ticket file: Change status from 🔴 to 🟡
- Update `docs/ticket/PROGRESS.md`: Move phase to "In Progress" section
- Update `docs/ticket/phase/PROGRESS.md`: Update phase status

### 4. Read Implementation Guide
- Read `docs/implementation/0{{phase_number}}-*.md` for detailed implementation instructions
- Follow the guide's step-by-step approach

### 5. Implementation
Based on the phase number, implement the required functionality:

**Phase 1**: Project Setup
- Run `npm install`
- Verify `.env.local` exists (ask user if not)
- Run `npm run db:generate`
- Run `npm run dev` to verify server starts
- Run `npm run type-check` and `npm run lint`

**Phase 2**: UI Implementation
- Create/update components in `src/components/`
- Implement pages in `src/app/`
- Add Tailwind CSS styling
- Ensure responsive design
- Run `npm run build` to verify no errors

**Phase 3**: AI Integration
- Create API route `src/app/api/summarize/route.ts`
- Implement article fetching logic
- Integrate OpenAI API
- Implement prompt engineering for summary and comments
- Test with real article URLs

**Phase 4**: Database Integration
- Verify `prisma/schema.prisma`
- Run `npm run db:migrate`
- Implement DB functions in `src/lib/db/`
- Create history API endpoint
- Test DB operations with Prisma Studio

**Phase 5**: Error Handling & UX
- Add error boundaries
- Implement loading states
- Add user feedback (toasts, animations)
- Enhance form validation
- Test error scenarios

**Phase 6**: Performance Optimization
- Run `npm run build` and analyze bundle
- Optimize imports and components
- Run Lighthouse audit
- Improve Core Web Vitals

**Phase 7**: Testing & QA
- Test on multiple browsers
- Test on multiple devices
- Run security checks
- Test all error scenarios
- Document any bugs found

**Phase 8**: Deployment
- Verify environment variables are documented
- Run final `npm run build`
- Deploy to Vercel
- Configure environment variables on Vercel
- Test production deployment

### 6. Localhost Verification
- **IMPORTANT**: Always ask user to verify functionality at localhost
- Display checklist of what to test
- **DO NOT** proceed to completion without user confirmation

Example:
```
✅ Phase X implementation is complete!

🔍 Please verify the following at http://localhost:3000:
- [ ] Server starts without errors
- [ ] UI displays correctly
- [ ] Feature X works as expected
- [ ] No console errors

localhostで動作確認済みですか？ (yes/no)
```

### 7. Create Git Commit
After user confirms localhost verification:

- Create a detailed commit message following this format:

```
feat(phase-X): implement [phase name]

[Detailed description of what was implemented]
- [Key change 1]
- [Key change 2]
- [Key change 3]

Closes: phase-0X-[phase-name]
実績時間: [actual time]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

- Use appropriate semantic type:
  - `feat()` for new features (Phase 2, 3, 4)
  - `chore()` for setup tasks (Phase 1)
  - `refactor()` for improvements (Phase 5, 6)
  - `test()` for testing (Phase 7)
  - `ci()` for deployment (Phase 8)

- Run: `git add .` and `git commit` with the message

### 8. Update Progress Files
- Update phase ticket with:
  - Status: 🟢 完了
  - Actual time spent
  - Completion timestamp
  - Git commit hash
- Update `docs/ticket/PROGRESS.md`
- Update `docs/ticket/phase/PROGRESS.md`

### 9. Final Report
Provide a completion report:
```
✅ Phase X: [Phase Name] - COMPLETED

📊 Summary:
- Duration: [actual] (estimated: [estimated])
- Files Changed: [number]
- Commit: [hash]

🎯 Next Steps:
Run `/next-phase` to continue with Phase [X+1]
```

## Important Notes

- **ALWAYS** require localhost verification before marking complete
- **NEVER** skip the git commit step
- **ALWAYS** update all progress files (ticket + PROGRESS.md files)
- Follow the implementation guide closely
- If blocked, document the blocker in the ticket and ask user for help
- Ensure all acceptance criteria are met before completion
