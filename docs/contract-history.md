# Contract Execution History

> Generated automatically from the Locator Contract Monitor.

**Generated:** 2026-09-04T13:09:00.855Z  
**Purpose:** Give Team A (Locator QA), Team B (Automation QA), and DEV a shared view of contract health and coverage progress.

## Latest Result

No executions recorded yet.

## Coverage Trend

No executions yet.

## Execution History

| Date | Time | Tag | Chromium | Firefox | WebKit | Contract Coverage | Missing Capabilities | Overall |
|---|---|---|---|---|---|---:|---|---|
| — | — | — | — | — | — | 0% (0/0) | No executions yet | UNKNOWN |

## Test Tags

- **@QAlocators** — Team A owns locator/contract health and investigates UI behavior, locator failures, and contract regressions.
- **@QA** — Automation QA owns business/workflow validation using the public contract API.
- **@dev** — DEV-facing smoke/verification tests; useful when a build needs quick application-level feedback.

### Useful commands

`npx playwright test --grep @QAlocators`  
`npx playwright test --grep @QA`  
`npx playwright test --grep @dev`  

> The Locator Contract Monitor uses **@QAlocators** so Team A sees the same contract-health behavior that the monitor records.

## Test Data & Parallel Isolation
- Added unique note-data generation for parallel browser runs.
- Test note titles now include browser, worker index, and a short unique run ID.
- Locator contract APIs remain unchanged.
- Step 7 cleanup behavior remains unchanged.
