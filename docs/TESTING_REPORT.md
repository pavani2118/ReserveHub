# ReserveHub Testing Report

**Execution date:** 13 October 2026  
**Scope:** Safe automated verification of the existing ReserveHub application. No UI, business rule, authentication behavior, database schema, migration file, or existing data was changed.

## 1. Test cases

| Area | Test case | Expected result | Actual result | Status |
|---|---|---|---|---|
| Reservation validation | Valid future reservation up to 8 hours | Accepted | Accepted by `reservationSchema` | PASS |
| Reservation validation | End time equal to or before start time | Rejected | Rejected with end-time validation error | PASS |
| Reservation validation | Reservation starts in the past | Rejected | Rejected with future-time validation error | PASS |
| Reservation validation | Duration greater than 8 hours | Rejected | Rejected with maximum-duration validation error | PASS |
| Reservation validation | Invalid resource UUID or short purpose | Rejected | Rejected by Zod validation | PASS |
| Reservation service | Missing resource | Rejected with not-found business error | Rejected with HTTP-equivalent 404 business error | PASS |
| Reservation service | Inactive resource | Rejected | Rejected with unavailable-resource business error | PASS |
| Reservation service | Existing overlapping confirmed booking | Rejected as conflict | Rejected with conflict business error | PASS |
| Reservation service | Adjacent slot | Accepted | Accepted when the overlap query finds no intersection | PASS |
| Reservation service | PostgreSQL exclusion violation | Rejected as conflict | `23P01` is mapped to a conflict business error | PASS |
| Authentication | Unauthenticated cancellation request | Rejected | Returns the sign-in-required result | PASS |
| Authentication | Invalid login input | Rejected | Login schema rejects malformed email and empty password | PASS |
| Authorization | Member access to administrator-only surfaces | Rejected/redirected | `requireAdmin` redirects members to `/` | PASS |
| Authorization | Administrator access | Accepted | `requireAdmin` returns the administrator record | PASS |
| Cancellation | Member cancels own confirmed reservation | Cancelled | Updates only the member-owned confirmed reservation | PASS |
| Cancellation | Member attempts another user's reservation | Rejected | Scoped update returns access-denied result when no row matches | PASS |
| Cancellation | Administrator cancellation | Cancelled | Administrator update is not restricted by `userId` | PASS |
| Cancellation | Slot reuse after cancellation | Database behavior supports reuse | Confirmed-only exclusion constraint excludes cancelled rows | PASS |
| Database | Migration history | Local migrations and database agree | `prisma migrate status` reports database up to date | PASS |
| Database | Valid reservation-time constraint | `endTime > startTime` exists | `reservation_valid_time` exists as a PostgreSQL CHECK constraint | PASS |
| Database | Double-booking prevention | Confirmed reservations cannot overlap per resource | `reservation_prevent_overlap` exists as a PostgreSQL GiST exclusion constraint | PASS |
| TypeScript | `npx tsc --noEmit` | No type errors | Completed successfully | PASS |
| Production build | `npm run build` | Build succeeds | Completed successfully | PASS |
| ESLint | `npm run lint` | No lint errors | Completed successfully with no warnings or errors | PASS |

## 2. Automated test execution evidence

The test runner was added as an isolated development dependency and executed with:

```text
npm test

Test Files  5 passed (5)
Tests       22 passed (22)
```

Test files:

- `tests/reservation-validator.test.ts` — reservation date, time, duration, UUID, and purpose validation.
- `tests/reservation-service.test.ts` — resource existence/status, overlap handling, adjacent slots, and database conflict mapping.
- `tests/access-and-cancellation.test.ts` — authentication, ownership, administrator cancellation, and cancellation failure behavior.
- `tests/admin-access.test.ts` — unauthenticated, member, and administrator access to `requireAdmin`.
- `tests/resource-and-auth-validators.test.ts` — login and resource input validation.

The tests use mocks for Prisma, Auth.js, Next.js cache revalidation, and redirects. No test creates, updates, cancels, or deletes records in the development database.

## 3. Database verification evidence

Read-only command:

```text
npx prisma migrate status --config prisma7.config.ts
```

Result:

```text
2 migrations found in prisma/migrations
Database schema is up to date!
```

The read-only PostgreSQL catalog query confirmed:

- `reservation_valid_time`: `CHECK ("endTime" > "startTime")`
- `reservation_prevent_overlap`: `EXCLUDE USING gist` on `resourceId` and the half-open `tstzrange(startTime, endTime, '[)')`, filtered to `CONFIRMED` reservations.

No migration checksum mismatch was reported. No reset, push, truncation, seed, migration application, or other destructive database command was run.

## 4. Issues identified and fixes made

### Test infrastructure added

- Added Vitest configuration in `vitest.config.ts`.
- Added the `test` npm script.
- Added Vitest to development dependencies.
- Added isolated unit tests under `tests/`.

### Lint fixes

- Escaped the two apostrophes flagged by `react/no-unescaped-entities` using JSX entities, preserving the rendered text and UI.
- Removed the unused `roleName` variable from `AppShell`.
- Explicitly marked the required but unused server-action parameters as intentionally unused in `cancelReservationAction`.
- `npm run lint` now completes with no warnings or errors.

### Validation boundary limitation

The eight-hour rule is enforced by the public reservation API's Zod validation before `createReservation` is called. The service has its own date-order/future guard but does not duplicate the eight-hour check. The current tests therefore verify the public validation contract and do not claim an independent service-layer eight-hour defense.

## 5. Remaining limitations

- A dedicated PostgreSQL test database was not configured in the repository, so no integration test inserted test records or exercised the live reservation transaction. The live development database was only inspected with read-only migration and catalog queries.
- Browser-level verification of administrator login, dashboard rendering, resource CRUD, reservation history, and the full cancellation UI flow was not automated in this pass. The production build confirms these routes compile, while authorization and core service behavior are covered with unit tests.
- Dependency installation reported npm audit findings. No automatic audit fix was run because it could introduce unreviewed dependency changes.

## 6. Final verification summary

The codebase still compiles and builds successfully. The tested server-side behavior supports administrator-only resource management, authenticated reservation creation, active-resource checks, overlap prevention, cancellation ownership, reservation history queries, and cancelled-slot reuse at the database-constraint level. No existing reservations, resources, user accounts, or migration files were modified.
