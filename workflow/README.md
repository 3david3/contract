# Contract Work Queue

Team A owns the automation contract. Team B consumes it. Development owns the application build.

## Status definitions

- `NEW` — request created and not yet acknowledged.
- `ACKNOWLEDGED` — owner has accepted the request.
- `IN PROGRESS` — work has started.
- `VALIDATING` — implementation is complete and Team A is validating it.
- `COMPLETED` — acceptance criteria are met.

Dependency status:

- `READY` — dependency has been provided and is available, but not yet verified.
- `SOLID / VERIFIED` — dependency was received, validated, and confirmed usable.
- `AT RISK` — dependency exists or is expected, but the required-by date is approaching.
- `BLOCKED` — dependency is preventing progress.

Avoid a generic `WAITING` status. A dependency record must identify who is waiting, what they need, who provides it, when the wait started, and the impact.

## Priority

- `P0` — release/build blocker
- `P1` — required for next build
- `P2` — required this sprint
- `P3` — improvement/backlog

## Version traceability

Every request records the contract version it targets (`requestedAgainstVersion`) and, when completed, the version that contains the implementation (`implementedInVersion`).

## Commands

`npm run contracts:work-queue` generates `docs/contract-work-queue.md` from the JSON work queue, dependencies, and release schedule.
