\# PREIshare repository map



> Onboarding map for first contribution planning. Built with AI-assisted inventory and human path verification.



\## Meta



\- Clone path: `C:\\Users\\11064469\\PREIShare-org-repo`

\- Date mapped: `2026-09-10`

\- Agent tool used: chat-assistant + manual listing

\- Mapper: Dorcas Ilunga / 11064469



\## 1. Overview



PREIshare is currently organized as a single-package web application.

The main product code is in `src/`.

Routes are in `src/routes/` and reusable UI components are in `src/components/`.

The project uses TypeScript, React, TanStack Start/Router, Vite, and Tailwind CSS.

Documentation is stored in `docs/`.

No Supabase, PostgreSQL, SQL migration, or environment files were found in the current clone.

I am not editing application code while building this map.



\## 2. Top-level inventory



| Path | Kind | Purpose | Verified |

|---|---|---|---|

| `src/` | app | Main application source code | yes |

| `docs/` | docs | Documentation and onboarding notes | yes |

| `.vscode/` | config | Editor settings | yes |

| `package.json` | config | Package manifest and scripts | yes |

| `package-lock.json` | config | npm dependency lockfile | yes |

| `.cursorrules` | config | AI coding rules | yes |

| `AGENTS.md` | config | AI agent workflow instructions | yes |

| `tsconfig.json` | config | TypeScript configuration | yes |

| `tsr.config.json` | config | TanStack Router configuration | yes |

| `vite.config.ts` | config | Vite configuration | yes |

| `README.md` | docs | Project information | yes |



\## 3. Frontend concerns



\- `src/router.tsx` sets up the TanStack Router.

\- `src/routes/` contains application routes.

\- `src/components/` contains reusable UI components.

\- `src/styles.css` contains application styles.

\- `src/routeTree.gen.ts` is generated and should not be edited manually.



\## 4. Backend / data concerns



No Supabase, PostgreSQL, SQL migration, or environment files were found.

`AGENTS.md` says the current blank app has no authentication or database integration.

Secrets should not be committed.



\## 5. Tooling and CI



\- `package.json` contains dev, build, preview, and route-generation scripts.

\- `.cursorrules` and `AGENTS.md` contain AI-agent guidance.

\- `.vscode/settings.json` protects the generated route tree.

\- `tsconfig.json`, `tsr.config.json`, and `vite.config.ts` contain project configuration.

\- No `.github/` directory or GitHub Actions configuration was found.



\## 6. Safe first-touch vs do-not-edit-yet



\### Safe first-touch



\- `docs/onboarding/` — documentation only and low risk.

\- `docs/onboarding/setup-log.md` — onboarding documentation.

\- `docs/onboarding/repo-map.md` — repository mapping documentation.



\### Do not edit yet



\- `src/routeTree.gen.ts` — generated file.

\- `package-lock.json` — shared dependency lockfile.

\- `.cursorrules` and `AGENTS.md` — shared AI/tooling configuration.



\## 7. Open questions for the team



\- What backend or data services will be added later?

\- What CI workflow will the team use?

\- Which application area should be used for the first feature contribution?



\## 8. How I will use this map next



\- Configure AI project rules and memory using the verified paths.

\- Choose my first contribution from safe first-touch areas.

\- Update this map if I discover that a path is incorrect.

