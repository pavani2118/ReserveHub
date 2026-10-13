# ReserveHub

**A Resource Reservation Management System** built with Next.js (App Router), TypeScript, PostgreSQL and Prisma.

ReserveHub helps organisations manage shared facilities and resources, coordinate reservations and prevent double-booking. It provides a centralised workflow for administrators and authenticated members, including resource management, booking history and role-aware access.

> Developed for the PrimeWave Lab Software Engineering Internship Technical Assessment (October 2026).

## Key Features

- **Credential-based authentication** with administrator (`ADMIN`) and member (`MEMBER`) roles.
- **Administrator dashboard** with active resource, confirmed booking and registered user counts.
- **Resource management** for administrators: create, edit, activate and deactivate resources.
- **Reservation management** with start/end times, a booking purpose and reservation history.
- **Double-booking prevention** through application validation and a PostgreSQL exclusion constraint.
- **Booking validation** for future times, correct time ordering and a maximum duration of eight hours.
- **Reservation cancellation** with reuse of cancelled booking slots.
- **Responsive user interface** using a Graphite + Indigo design.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Full-stack framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL |
| Database access | Prisma 7 with PostgreSQL adapter |
| Authentication | Auth.js / NextAuth (Credentials), bcryptjs |
| Input validation | Zod |
| Automated unit testing | Vitest |
| Version control | Git and GitHub |

## Requirements

- Node.js version compatible with Next.js 16 (Node.js 20.9 or later)
- npm
- Running PostgreSQL server
- Git (to clone the repository)

## Local Development Setup

### 1. Clone and install

```bash
git clone https://github.com/pavani2118/ReserveHub.git
cd ReserveHub
npm install
```

### 2. Create the database and configure environment variables

Create an empty PostgreSQL database named `reservehub_db`, or use another database name and update the connection string accordingly.

Copy `.env.example` to `.env` and provide your own credentials:

```env
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@localhost:5432/reservehub_db?schema=public"
AUTH_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"

# Used only when running the local admin account setup script
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="REPLACE_WITH_A_STRONG_PASSWORD_OF_AT_LEAST_12_CHARACTERS"
```

Generate an Auth.js secret locally, for example:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Security:** Never commit `.env`, real database credentials or administrator passwords. URL-encode reserved characters in the database password when including it in `DATABASE_URL`. The admin values above are placeholders, not working credentials.

### 3. Apply database migrations and generate the Prisma Client

```bash
npx prisma migrate deploy
npx prisma generate
```

The migrations create the application tables and database-level reservation constraints. The PostgreSQL role must have sufficient privileges to enable the `btree_gist` extension required by the booking overlap exclusion constraint.

**Do not run `prisma migrate reset` against a database containing data you want to keep.**

### 4. Create an administrator account

The administrator setup script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables and requires a password of at least 12 characters. Set those variables in your local `.env` as shown above, then run:

```bash
npx tsx scripts/create-admin.ts
```

The script creates a new `ADMIN` account. If that email already exists, it reports an error instead of replacing the account. Do not publish the account credentials.

### 5. Start the application

```bash
npm run dev
```

Open `http://localhost:3000`, or the alternative port displayed by Next.js, and sign in with the administrator credentials you configured.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimised production build |
| `npm run start` | Run an existing production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run automated tests using Vitest |
| `npx tsc --noEmit` | Check TypeScript types without generating output |
| `npx prisma migrate status` | View database migration status |
| `npx prisma generate` | Generate the Prisma Client |

## Application Pages and API

| Route | Purpose |
| --- | --- |
| `/` | Public landing page |
| `/login` | User sign-in |
| `/dashboard` | Administrator dashboard |
| `/resources` | Administrator resource management |
| `/resources/[id]/edit` | Edit a resource |
| `/reservations` | Create and review reservations |
| `GET /api/health` | Application and database health check |
| `POST /api/reservations` | Authenticated reservation creation |
| `/api/auth/[...nextauth]` | Authentication endpoints |

## Database Design

The application has three core entities: **User**, **Resource** and **Reservation**.

- One user can make many reservations.
- One resource can have many reservations over time.
- Every reservation belongs to exactly one user and one resource.
- User roles are `ADMIN` and `MEMBER`.
- Reservation statuses are `CONFIRMED` and `CANCELLED`.

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

- [View interactive ER diagram](https://dbdiagram.io/d/6ace3294e308025ea5e05a66)
- [View editable DBML diagram source](docs/ReserveHub-ER.dbml)

## Reservation Rules and Engineering Decisions

1. **Prevent overlapping confirmed reservations.** The application checks conflicts before insertion; a PostgreSQL GiST exclusion constraint provides an additional database-level guarantee for competing writes.
2. **Allow adjacent reservations.** A booking ending at 11:00 does not prevent the next booking from starting at 11:00, because time ranges use half-open intervals: `[start, end)`.
3. **Keep cancelled reservations in history.** A cancelled reservation releases its slot while preserving its record.
4. **Block inactive resources.** The reservation form lists active resources; the service also checks resource status on the server.
5. **Limit reservations to eight hours.** This project-specific policy is enforced by API validation and the reservation form.
6. **Enforce permissions on the server.** Resource management operations require an administrator; reservation creation requires authentication; cancellation applies ownership restrictions for members.

## Project Verification

### Automated Testing

ReserveHub uses **Vitest** for automated tests. The testing run recorded on **13 October 2026** reported:

- **22 tests passed across 5 test files.**
- Reservation date/time validation, maximum duration, invalid identifiers and booking purpose checks.
- Resource existence, inactive-resource rejection, conflict detection and adjacent-slot handling.
- PostgreSQL conflict error mapping to an application-level conflict response.
- Mocked authentication, administrator access and cancellation ownership checks.

The automated suite primarily uses **mocks** for Prisma, authentication, redirects and Next.js cache behaviour. It is **not** a complete browser end-to-end or live database integration test suite.

Run the suite with:

```bash
npm test
```

See [the detailed Testing Report](docs/TESTING_REPORT.md) for test cases, evidence and limitations.

### Manual and Database Verification

The following were observed during development or recorded in the testing report:

- An unauthenticated reservation request returned **HTTP 401**.
- Overlapping confirmed bookings were rejected while adjacent bookings were accepted.
- A cancelled time slot could be reserved again.
- Deactivated resources were removed from the reservation dropdown.
- A nine-hour booking was rejected both by the form and by a direct authenticated API request (**HTTP 400**).
- PostgreSQL `reservation_valid_time` (CHECK) and `reservation_prevent_overlap` (GiST exclusion) constraints were confirmed by read-only catalogue queries.
- Prisma migration status reported that the database schema was up to date.
- TypeScript validation and a production build completed successfully in the reported final testing run.

**Important limitations:** A dedicated integration-test database and automated browser end-to-end tests were not part of the reported run. Live simultaneous-request/concurrency behaviour and all user-facing Member flows should not be described as fully integration-tested. For current results, rerun the test suite and quality checks after any further changes.

### Quality Checks

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

The testing report initially recorded two JSX apostrophe lint errors and three unused-variable warnings. The JSX text has subsequently been corrected in the repository; verify the current ESLint result with `npm run lint` rather than assuming it passes.

## Project Structure

```text
prisma/                   Prisma schema and SQL migrations
scripts/                  Local administrator setup utility
docs/                     ER diagram source and testing report
tests/                    Automated test files
src/
  actions/                Server actions
  app/                    App Router pages and API handlers
  auth.ts                 Auth.js configuration
  components/             Reusable UI, tables and forms
  lib/                    Prisma client, validation and auth helpers
  services/               Reservation and resource business logic
  types/                  Shared TypeScript types
```

## Security and Operational Notes

- Passwords are hashed with bcryptjs before storage.
- `.env` is excluded from Git; `.env.example` contains only configuration placeholders.
- The reservation exclusion constraint helps protect data integrity even when concurrent requests reach the database.
- Account setup scripts are intended for local development and must not expose real credentials.
- Production hosting, password recovery, rate limiting and comprehensive operational monitoring are outside the verified scope of this assessment project.

## Assessment Deliverables

- **GitHub repository:** [pavani2118/ReserveHub](https://github.com/pavani2118/ReserveHub)
- **ER diagram:** [ReserveHub database diagram](https://dbdiagram.io/d/6ace3294e308025ea5e05a66)
- **Testing report:** [docs/TESTING_REPORT.md](docs/TESTING_REPORT.md)
- **Demonstration video:** To be recorded and shared separately (3–5 minutes)

## Author

Developed as a Software Engineering Internship Technical Assessment project.
