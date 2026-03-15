# AGENT.md — StudyFlow Mission Plan

> This file is the primary instruction set for the Agentic AI working on this project.
> Read this file fully before taking any action. All rules here are non-negotiable.

---

## 🎯 Project Identity

| Field            | Value                                                                 |
|------------------|-----------------------------------------------------------------------|
| **Project Name** | StudyFlow                                                             |
| **Tagline**      | AI-powered academic time management for school & university students  |
| **Version**      | 1.0.0                                                                 |
| **Type**         | Full-stack Web Application                                            |
| **Status**       | Active Development                                                    |

---

## 🧠 What This Project Does

StudyFlow helps students manage their academic workload by:

1. **Subject & Topic Management** — Students add subjects and break them into topics/chapters.
2. **Progress Tracking** — Each subject and topic has a completion percentage (0–100%).
3. **Exam Schedule** — Students enter exam dates, times, and details.
4. **AI Schedule Generation** — AI analyzes progress + exam dates and generates a personalized study calendar.
5. **Calendar View** — Daily, weekly, monthly views of the generated study plan.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode — no `any` types allowed)
- **Styling:** Tailwind CSS only — no inline styles, no CSS modules, no styled-components
- **UI Components:** shadcn/ui — use existing components before building custom ones
- **Icons:** lucide-react only
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand for global state, React Query (TanStack) for server state
- **Calendar:** react-big-calendar for schedule display

### Backend
- **Runtime:** Next.js API Routes (App Router — use `route.ts` files)
- **ORM:** Prisma
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **File Storage:** Supabase Storage
- **AI Integration:** Google Gemini 2.0 Flash API (free tier)

### DevOps
- **Package Manager:** pnpm (never npm or yarn)
- **Linting:** ESLint + Prettier (run before every commit)
- **Environment:** `.env.local` for secrets — never hardcode API keys

---

## 📐 Architecture Rules

### General
- Use **Constructor Injection** for all service classes — never instantiate dependencies inside a class.
- All business logic lives in `/lib/services/` — API routes only handle request/response.
- All database queries go through Prisma — no raw SQL unless absolutely necessary.
- Never expose Supabase service role key to the client side.

### File & Folder Conventions
```
/app                  → Next.js pages and API routes
/app/api              → API route handlers (route.ts)
/components           → Reusable React components
/components/ui        → shadcn/ui base components (do not modify)
/components/features  → Feature-specific components (subjects, schedule, exams)
/lib                  → Utilities, helpers, constants
/lib/services         → Business logic services
/lib/validators       → Zod schemas for all forms and API inputs
/lib/ai               → Gemini API integration logic
/prisma               → schema.prisma and migrations
/hooks                → Custom React hooks
/store                → Zustand stores
/types                → Shared TypeScript types and interfaces
```

### Naming Conventions

| Item              | Convention         | Example                        |
|-------------------|--------------------|--------------------------------|
| Components        | PascalCase         | `SubjectCard.tsx`              |
| API routes        | kebab-case folders | `/api/subjects/route.ts`       |
| Services          | PascalCase + Svc   | `ScheduleService.ts`           |
| Hooks             | camelCase + use    | `useSubjects.ts`               |
| Zod schemas       | camelCase + Schema | `createSubjectSchema`          |
| DB models         | PascalCase         | `Subject`, `Topic`, `ExamDate` |
| Env variables     | UPPER_SNAKE_CASE   | `GEMINI_API_KEY`               |

---

## 🔒 Rules the Agent Must Always Follow

1. **Always use Tailwind CSS** — never write raw CSS or inline styles.
2. **TypeScript strict mode** — no `any`, no `// @ts-ignore`.
3. **Validate all inputs** — every API route must use a Zod schema before touching the database.
4. **Use pnpm** — never run `npm install` or `yarn add`.
5. **Constructor Injection** — services receive their dependencies via constructor parameters.
6. **Never expose secrets** — API keys and DB URLs stay in `.env.local` and server-side code only.
7. **Mobile-first design** — all UI must work on screens 375px and above.
8. **Student emails** — validate using the SKILL.md `validateStudentEmail` rule.
9. **Error handling** — every async function must have try/catch; API routes must return proper HTTP status codes.
10. **Database migrations** — always run `pnpm prisma migrate dev` after schema changes, never edit the DB directly.

---

## 🤖 AI Agent Behavior

- When creating a new feature, always check if a shadcn/ui component exists before building from scratch.
- When generating the study schedule, use the logic defined in `/lib/ai/scheduleGenerator.ts`.
- When in doubt about a UI pattern, follow the existing component style in `/components/features/`.
- Always run `pnpm lint` and `pnpm type-check` after making changes.
- If a migration is needed, run it automatically (terminal_access is enabled).
- If a new package is needed, add it with `pnpm add` and note it in your response.
- Always read `AGENT.md`, `SKILL.md`, and `prisma/schema.prisma` at the start of each session.
