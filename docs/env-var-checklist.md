# PREIshare Environment Variable Checklist

## 1. Purpose

Environment variables let the application connect to the intended Supabase project without hardcoding configuration into source files. Public Supabase configuration can be used by the browser. Privileged credentials, if a trusted server operation requires them, must remain server-only.

The PREIshare sponsor requirements require server/database enforcement of sponsor access. A public Supabase key is not an authorization control: Supabase Auth must identify the user, and PostgreSQL row-level security (RLS) must enforce which sponsor-owned data the request can access. The current sponsor-scoped Supabase helpers use the public URL and publishable key with the authenticated request; a secret/service-role key is not required for those normal operations and must not be used for them.

## 2. Variables and exposure

| Variable | Safe in browser? | Purpose and handling |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes; public configuration | The Supabase project URL. The `VITE_` prefix makes it available to browser code. It does not grant data access by itself. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes; public configuration | The Supabase publishable key used by the browser client. Treat it as public, not as a password or authorization boundary. Auth and RLS must protect private data. |
| `SUPABASE_SECRET_KEY` | **No; server-only and optional** | A privileged key for trusted server operations only, if such an operation is actually required. Never add a `VITE_` prefix, import it into browser code, or use it for ordinary sponsor-scoped listing reads or writes. Privileged access may bypass RLS. |

`.env.example` contains illustrative placeholders only. Replace them only in a private local or deployment environment; never put real project values, passwords, tokens, or keys in this document or the example template.

## 3. Create a local `.env.local`

From the repository root, copy the example template:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` locally and replace the public placeholders with the values for the intended Supabase project. Keep the optional `SUPABASE_SECRET_KEY` unset unless a trusted server-only operation has a confirmed need for it. Do not paste real values into source files, documentation, chat, or commits.

Restart the development server after changing environment variables so the application reloads its configuration.

## 4. Keep privileged keys out of browser code

- Browser code may use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Never read `SUPABASE_SECRET_KEY` from React components, route UI, browser utilities, or any module included in a client bundle.
- Do not pass a secret through component props, loader data, server-function return values, HTML, or browser-visible error messages.
- Keep server-only operations in server-only modules and access privileged configuration only inside trusted server execution, if required.
- Do not use a privileged key for ordinary sponsor-scoped operations. Use a user-authenticated Supabase request and keep PostgreSQL RLS enabled so the database checks ownership.
- Never rely on a public key or React-side filtering to authorize access. Verify the authenticated user on the server and enforce sponsor ownership in PostgreSQL policies.

## 5. Git safety checks

The repository `.gitignore` ignores `.env` and `.env.*`, and has an explicit exception to keep `.env.example` trackable. Do not remove these rules or force-add real environment files.

Before staging changes, inspect the candidate files and check tracking/ignore behavior:

```powershell
git status --short
git check-ignore -v .env.local .env.production
git ls-files -- .env .env.local .env.production .env.example
```

Expected: real environment files are ignored and are not listed as tracked files; `.env.example` is permitted to be tracked. Git ignore rules do not remove secrets already committed in repository history. If a real credential was committed or exposed, rotate it and follow the project's incident/remediation process.

## 6. Vercel Production environment

1. In the Vercel project, open **Settings → Environment Variables**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with the values for the intended Supabase project. Set their availability for **Production** (and configure Preview/Development separately only when those environments are intended to use them).
3. Add `SUPABASE_SECRET_KEY` only if a reviewed trusted server-side operation needs it. Keep the name exactly server-only, do not prefix it with `VITE_`, and restrict its environment scope to the environments that require it.
4. Do not put secret keys in build-time client configuration, Vercel client-visible settings, source code, or browser-exposed variables. Confirm the application accesses any privileged value only in server-only runtime code.
5. Redeploy after changing environment variables. Verify the deployed application uses the expected project and review generated browser assets for accidental secret exposure.

The current sponsor-scoped Auth and listing operations do not require `SUPABASE_SECRET_KEY`; do not configure it merely because the placeholder appears in `.env.example`.

## 7. Future security verification checklist

- [ ] `.env.example` contains placeholders only and no real project values.
- [ ] `.env.local`, `.env.production`, and other real `.env.*` files are ignored and are not tracked.
- [ ] Browser code uses only the Supabase URL and publishable key.
- [ ] No server-only module or secret key is imported into a browser-facing route, shared component, or client utility.
- [ ] Any optional privileged key has a documented server-only use and is not used for normal sponsor-scoped listing operations.
- [ ] Signup/login establishes an authenticated user identity; invalid credentials do not grant access.
- [ ] Signed-out requests cannot read protected dashboard information.
- [ ] PostgreSQL RLS is enabled and policies enforce approved sponsor ownership for listing operations.
- [ ] With two distinct Auth users and ordinary user-scoped sessions, one sponsor cannot access the other's private listing.
- [ ] Production build/deployed browser assets contain no database passwords or privileged credentials.
- [ ] Git-tracked files and, separately, Git history are reviewed for real credentials; rotate any credential confirmed exposed.
- [ ] Verification results distinguish source inspection from live Auth, database, RLS, and deployment testing.
