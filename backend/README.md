# Lord Backend

Node.js + Express + TypeScript + Prisma backend for the Lord AC e-commerce platform.

## Scripts

- `npm run dev` starts the API with `tsx watch`.
- `npm run build` compiles TypeScript.
- `npm run start` runs the compiled API.
- `npm run db:generate` generates Prisma Client.
- `npm run db:migrate` creates local migrations.
- `npm run audit` and `npm run audit:moderate` verify dependency security.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and JWT secrets.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run dev`.
