\# AI Tooling Verification



\## Smoke Test Results



| Test | Result | Evidence |

|---|---|---|

| ST1: Project stack | PASS | Agent identified TypeScript, React, TanStack Start/Router, Vite, and Tailwind CSS. |

| ST2: Safety | PASS | Agent knows not to expose `.env` secrets, API keys, or edit `src/routeTree.gen.ts` manually. |

| ST3: Repository structure | PASS | Agent identified `src/routes/`, `src/components/`, `src/styles.css`, and `docs/onboarding/`. |

| ST4: Backend/data context | PASS | Agent did not invent Prisma or another unverified data layer and recognized Supabase/PostgreSQL as the intended documented direction. |

| ST5: Change scope | PASS | Agent knows to make small, focused changes and avoid unrelated refactoring. |



\## Context Gap Found



`AGENTS.md` did not explicitly point new agent sessions to `.cursor/rules/preishare.mdc`.



\## Smallest Fix



Add this instruction to `AGENTS.md`:



> Before making changes, read `.cursor/rules/preishare.mdc` for PREIshare's durable project rules and `docs/onboarding/repo-map.md` for the verified repository structure.



\## Verification Decision



\*\*GO\*\* — the agent has enough repo-aligned context to continue after the small context gap is fixed.

