# PREIshare Supabase Environment Setup Checklist

## Project Setup
- [ ] Create or select a Supabase project for PREIshare.
- [ ] Confirm that the PostgreSQL database is healthy.
- [ ] Save the database password in a secure password manager.
- [ ] Locate the Project URL, publishable key, and secret key in Supabase.

## Public Environment Variables
- [ ] Configure `VITE_SUPABASE_URL` with the Supabase Project URL.
- [ ] Configure `VITE_SUPABASE_PUBLISHABLE_KEY` with the publishable key.
- [ ] Confirm that only public values use the `VITE_` prefix.
- [ ] Enable RLS and appropriate policies before accessing private sponsor listings from the browser.

## Server-Only Environment Variables
- [ ] Configure `SUPABASE_SECRET_KEY` only where trusted server code can access it.
- [ ] Never use `VITE_` on server-only secrets.
- [ ] Never expose secret keys in browser components or client bundles.
- [ ] Use privileged keys only when required for trusted server operations.

## Local Configuration
- [ ] Copy `.env.example` to `.env.local`.
- [ ] Replace placeholders locally with the correct Supabase values.
- [ ] Keep real environment files outside Git history.
- [ ] Confirm `.gitignore` protects `.env`, `.env.local`, and other private environment files.

## PREIshare Requirements
- [ ] Use Supabase Auth for sponsor sign-in.
- [ ] Store property listings in PostgreSQL instead of relying only on mock data.
- [ ] Protect sponsor-specific listings with database RLS policies.
- [ ] Use authenticated requests so sponsors can access only authorized listings.
- [ ] Keep privileged credentials on the server.

## Final Security Review
- [ ] `.env.example` contains placeholders only.
- [ ] No real credentials appear in documentation or tracked files.
- [ ] No secret keys appear in browser code.
- [ ] Only approved setup files are staged for Git.
- [ ] Rotate any credentials accidentally committed to shared history.

This checklist documents configuration requirements. Authentication, listing tables, and RLS implementation will be completed in later development steps.