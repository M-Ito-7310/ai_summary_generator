# Phase 01: Project Setup - Implementation Guide

**Phase**: 01 - プロジェクトセットアップ
**Estimated Time**: 2 hours
**Prerequisites**: Node.js 18+, npm 9+, Git

---

## Overview

This phase establishes the foundation for the AI Summary Generator project by:
- Installing all necessary dependencies
- Configuring environment variables
- Setting up the database connection
- Verifying the development environment works correctly

---

## Step 1: Verify Prerequisites

### Check Node.js and npm versions

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

If versions are too old, install the latest LTS version from [nodejs.org](https://nodejs.org)

---

## Step 2: Install Dependencies

### Install all packages

```bash
npm install
```

This installs:
- **next**: Next.js framework
- **react** & **react-dom**: React library
- **typescript**: TypeScript compiler
- **tailwindcss**: CSS framework
- **@prisma/client**: Database client
- **openai**: OpenAI API client
- And many more...

### Verify installation

```bash
# Check that node_modules was created
ls node_modules | wc -l  # Should show 100+ packages

# Verify package-lock.json was created
ls -la package-lock.json
```

---

## Step 3: Environment Variables Setup

### Create .env.local file

```bash
cp .env.local.example .env.local
```

### Edit .env.local

Open `.env.local` and configure:

```env
# OpenAI API Key
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Neon PostgreSQL Database URLs
# Get from: https://console.neon.tech
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting API Keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/
2. Sign in or create account
3. Navigate to API Keys
4. Create new secret key
5. Copy and paste into `.env.local`

**Neon PostgreSQL:**
1. Go to https://neon.tech/
2. Sign in or create account
3. Create new project
4. Copy connection string from dashboard
5. Paste into `DATABASE_URL` and `DIRECT_URL`

### Verify .env.local

```bash
# Check file exists and has content
cat .env.local

# Verify no syntax errors (should have no output)
grep "=" .env.local | grep -v "^#" | grep -v "="
```

---

## Step 4: Prisma Setup

### Generate Prisma Client

```bash
npm run db:generate
```

This reads `prisma/schema.prisma` and generates the TypeScript client.

**Expected Output:**
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

### Verify Prisma Client

```bash
# Check that Prisma Client was generated
ls node_modules/@prisma/client
```

### Push Schema to Database (Optional)

If you want to create tables now:

```bash
npm run db:push
```

This creates tables in your Neon database based on `prisma/schema.prisma`.

---

## Step 5: Start Development Server

### Start the server

```bash
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 15.x.x
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 2.1s
```

### Verify server is running

Open browser and navigate to: http://localhost:3000

You should see the Next.js default welcome page or your app's home page.

### Check for errors

In the terminal where `npm run dev` is running:
- ✅ No red error messages
- ✅ No "Failed to compile" messages
- ✅ Server starts successfully

In the browser console (F12):
- ✅ No console errors
- ✅ Page loads correctly

---

## Step 6: Code Quality Checks

### Run TypeScript type checking

```bash
npm run type-check
```

**Expected Output:**
```
tsc --noEmit
# (No output means no errors)
```

If there are type errors, fix them before proceeding.

### Run ESLint

```bash
npm run lint
```

**Expected Output:**
```
✔ No ESLint warnings or errors
```

If there are linting errors, fix them with:
```bash
npm run lint -- --fix
```

### Run Prettier (optional)

```bash
npm run format
```

This formats all code according to `.prettierrc.json`.

---

## Step 7: Verify Project Structure

Your project should have this structure:

```
ai-summary-generator/
├── .claude/                 # Claude Code configuration
│   ├── commands/           # Custom slash commands
│   └── settings.local.json
├── docs/                    # Documentation
│   ├── idea/               # Project planning
│   ├── implementation/     # Implementation guides
│   └── ticket/            # Ticket management
├── node_modules/           # Dependencies
├── prisma/                 # Database
│   └── schema.prisma
├── public/                 # Static files
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # React components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── .env.local            # Environment variables (not in git)
├── .env.local.example    # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Step 8: Test Hot Reload

### Verify hot reload works

1. Keep `npm run dev` running
2. Open `src/app/page.tsx`
3. Make a small change (e.g., edit text)
4. Save the file
5. Browser should auto-refresh with changes

**Expected:** Changes appear immediately without manual refresh.

---

## Step 9: Database Connection Test (Optional)

### Test Prisma connection

Create a test file `test-db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing database connection...')
  await prisma.$connect()
  console.log('✅ Database connected successfully!')
  await prisma.$disconnect()
}

main().catch(console.error)
```

Run it:
```bash
npx tsx test-db.ts
```

Expected output:
```
Testing database connection...
✅ Database connected successfully!
```

Delete the test file after verification.

---

## Common Issues and Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: `.env.local` not loaded

**Solution:**
- Ensure file is named exactly `.env.local` (not `.env.local.txt`)
- Restart dev server after creating/editing `.env.local`
- Verify file is in project root (same level as `package.json`)

### Issue: Prisma Client not generating

**Solution:**
```bash
# Ensure schema file exists
ls prisma/schema.prisma

# Force regenerate
npx prisma generate
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
PORT=3001 npm run dev
```

### Issue: Database connection fails

**Solution:**
- Verify `DATABASE_URL` in `.env.local` is correct
- Check Neon dashboard to ensure database is active
- Verify network connection
- Check for typos in connection string

---

## Acceptance Criteria Checklist

Before marking this phase complete, verify:

- [ ] `npm install` completed successfully
- [ ] `.env.local` exists and is configured correctly
- [ ] All required environment variables are set
- [ ] Prisma Client is generated (`npm run db:generate`)
- [ ] Development server starts without errors (`npm run dev`)
- [ ] http://localhost:3000 loads in browser
- [ ] No console errors in browser
- [ ] TypeScript check passes (`npm run type-check`)
- [ ] Lint check passes (`npm run lint`)
- [ ] Hot reload works when editing files
- [ ] Database connection works (if tested)

---

## Next Steps

Once this phase is complete:
1. Run `/check-progress` to verify status
2. Run `/next-phase` to start Phase 02: UI Implementation
3. Proceed to [02-ui-implementation.md](./02-ui-implementation.md)

---

**Congratulations! Your development environment is ready! 🎉**
