# ReserveHub

**A Resource Reservation Management System** built with Next.js (App Router), TypeScript, PostgreSQL and Prisma.

ReserveHub helps an organisation manage shared facilities and resources, coordinate reservations, and prevent double-booking. The application provides a centralised workflow for administrators and authenticated users, with role-aware access and reservation history.

> Built for the PrimeWave Lab Software Engineering Internship Technical Assessment (October 2026).

## Key features

- **Credential-based authentication** with role-aware sessions (Administrator and Member).
- **Admin dashboard** showing active resources, confirmed reservations and registered users.
- **Resource management** for administrators: create, edit, activate and deactivate resources.
- **Resource reservations** with start/end date and time, purpose and booking history.
- **Double-booking prevention** using time-overlap validation and a PostgreSQL exclusion constraint to handle competing writes.
- **Booking policies**: future start time, end after start, and maximum duration of eight hours.
- **Reservation cancellation** and reuse of cancelled time slots.
- **Responsive interface** with a Graphite + Indigo design.

## Technology stack

| Layer | Technology |
| --- | --- |
| Full-stack framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL |
| Database access | Prisma 7 with PostgreSQL adapter |
| Authentication | Auth.js / NextAuth (credentials), bcryptjs |
| Validation | Zod |
| Version control | Git and GitHub |

## Requirements

- A recent Node.js version compatible with Next.js 16
- npm
- A running PostgreSQL instance
- Git (optional for local use)

## Local development setup

**1. Clone and install**

```bash
git clone https://github.com/pavani2118/ReserveHub.git
cd ReserveHub
npm install
```

**2. Create the database and configure environment variables**

Create an empty PostgreSQL database named `reservehub_db` (or another name of your choosing).

Copy `.env.example` to `.env` and supply your own secure values:

```env
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@localhost:5432/reservehub_db?schema=public"
AUTH_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
```

Generate a new secret locally, for example:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Never commit `.env`, real database credentials, or account passwords.** If your password includes special URL characters, URL-encode it in `DATABASE_URL`.

**3. Apply database migrations and generate the Prisma Client**

```bash
npx prisma migrate deploy
npx prisma generate
```

The migrations create the data model and reservation integrity constraints. The PostgreSQL `btree_gist` extension is used by the exclusion constraint; the PostgreSQL role used during setup needs sufficient permissions to create it.

**4. Create an initial administrator account**

An administrator account is required for resource management. Review `scripts/create-admin.ts` before running it and ensure it obtains credentials securely (for example, from environment variables) rather than containing a hard-coded production password.

```bash
npx tsx scripts/create-admin.ts
```

If your script expects specific environment variable names, configure them as described in that script. Do not publish any administrator credentials.

**5. Start the application**

```bash
npm run dev
```

Open `http://localhost:3000` (or the port shown in the terminal), then sign in using the account you created.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Create production build |
| `npm run start` | Start a built application |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx prisma migrate status` | Check migration status |
| `npx prisma generate` | Generate Prisma client |

## Application pages and API

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/login` | Sign in |
| `/dashboard` | Administrator dashboard |
| `/resources` | Administrator resource management |
| `/resources/[id]/edit` | Edit an existing resource |
| `/reservations` | Booking form and reservation history |
| `GET /api/health` | Application and database health check |
| `POST /api/reservations` | Create a reservation (authenticated) |
| `/api/auth/[...nextauth]` | Authentication endpoints |

## Database design

The main entities are **User**, **Resource**, and **Reservation**.

- One user can make many reservations.
- One resource can have many reservations.
- Each reservation belongs to exactly one user and one resource.
- Roles: `ADMIN`, `MEMBER`.
- Reservation statuses: `CONFIRMED`, `CANCELLED`.

```mermaid
erDiagram
    User ||--o{ Reservation : creates
    Resource ||--o{ Reservation : receives
    User {
        uuid id PK
        string name
        string email UK
        string passwordHash
        enum role
        datetime createdAt
        datetime updatedAt
    }
    Resource {
        uuid id PK
        string name
        string description
        string location
        int capacity
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    Reservation {
        uuid id PK
        uuid userId FK
        uuid resourceId FK
        datetime startTime
        datetime endTime
        string purpose
        enum status
        datetime createdAt
        datetime updatedAt
    }
```

For an editable ER diagram, see `docs/ReserveHub-ER.dbml` in the repository (if added).

## Reservation rules and engineering decisions

1. **No overlapping confirmed reservations for the same resource.** Application-level checks return a helpful conflict message; a PostgreSQL exclusion constraint adds protection against simultaneous requests.
2. **Adjacent bookings are allowed.** A reservation ending at 11:00 does not prevent another reservation starting at 11:00 (`[start, end)` time intervals).
3. **Cancelled bookings free their time slots.** Cancelled reservations remain in history for traceability.
4. **Resource availability is enforced server-side.** Deactivated resources cannot be used for new reservations; the booking form also lists only active resources.
5. **Reservation duration is limited to eight hours.** This is an application policy rather than a requirement mandated by the assessment.
6. **Authorisation is enforced on the server.** Admin operations require an administrator role; users must be authenticated to book.

## Manual validation performed during development

The following checks were observed during local development:

- Unauthenticated reservation API request returns **401 Unauthorized**.
- Overlapping reservation is rejected; adjacent booking is allowed.
- Cancellation frees a previously reserved slot for reuse.
- Deactivated resources are removed from the booking dropdown.
- Nine-hour reservation is rejected by both the form and a direct authenticated API request (**400 Bad Request**).
- TypeScript checks and a Next.js production build completed successfully **before the final UI theme update**.

> Before submitting, re-run `npx tsc --noEmit` and `npm run build` against the final Graphite + Indigo UI, and manually verify that the principal pages still work. Concurrency testing, full Member-role access-control testing, automated tests, and a migration-history consistency review should not be represented as completed unless separately verified.

## Project structure

```text
prisma/                Prisma schema and SQL migrations
scripts/               Local setup utilities (including admin setup)
src/
  actions/             Server actions
  app/                 Next.js pages and API routes
  auth.ts              Authentication configuration
  components/          UI and form components
  lib/                 Prisma setup, validators and auth helpers
  services/            Resource and reservation business logic
  types/               Shared TypeScript types
```

## Security and operational notes

- Passwords are stored as hashes, not plaintext.
- `.env` is excluded from version control.
- PostgreSQL constraints are used as a defence-in-depth measure for reservation conflicts.
- The built-in bootstrap administrator script is a local setup utility; do not expose real credentials or secrets in source control.
- This assessment project is intended to run locally. Production hosting, operational monitoring, password recovery and rate limiting are outside the verified scope of this submission.

## Assessment deliverables

- GitHub repository containing the complete source code and setup instructions.
- Shareable ER diagram of the database entities and relationships.
- A 3–5 minute screen recording that demonstrates the application and design choices.

## Author

Created as a Software Engineering Internship technical assessment project.
