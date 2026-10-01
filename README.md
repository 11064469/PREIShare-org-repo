# PREIshare Investor Dashboard Shell

PREIshare is an investor dashboard shell built with React, TypeScript, and TanStack Start. It provides dashboard pages for reviewing portfolio, deal, and profile examples. Current investor information is mock/sample data; live backend data and authentication are not implemented in this shell.

## Prerequisites

- Node.js
- npm

The project does not specify minimum Node.js or npm versions.

## Installation

From the repository root, install dependencies:

```bash
npm install
```

## Development

Start the development server with the `dev` script:

```bash
npm run dev
```

The server runs on port 3000. Open [http://localhost:3000](http://localhost:3000) and navigate to `/dashboard`.

## Production Build

Create a production build with the `build` script:

```bash
npm run build
```

## Routes

Dashboard routes are defined as files under `src/routes`:

| Route | Page |
| --- | --- |
| `/dashboard` | Dashboard Home |
| `/dashboard/portfolio` | Portfolio |
| `/dashboard/deals` | Deals |
| `/dashboard/profile` | Profile |

## Project Documentation

- [Sprint 3 handoff](docs/sprint3-handoff.md)
- [Architecture decisions](docs/architecture-decisions.md)
