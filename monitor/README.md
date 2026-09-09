# Contract Monitor

The Contract Monitor is a separate Node process. It does **not** use `setInterval()` inside Playwright tests.

## Run continuously every 5 minutes

```bash
npm run monitor:contracts
```

## Run one check

```bash
npm run monitor:contracts:once
```

Each check runs the Notes locator contract against Chromium, Firefox, and WebKit and appends a record to:

```text
monitor/contract-results/history.json
```

The history records:

- date/time
- contract version
- browser result for Chromium, Firefox, and WebKit
- implemented contract capabilities
- total contract capabilities
- coverage percentage
- missing contract capabilities
- overall status

## Important

Install browsers before running the monitor:

```bash
npx playwright install chromium firefox webkit
```

The monitor is intentionally local for the PoC. A later CI/CD implementation can invoke the same `--once` command without changing the contract architecture.


## Test ownership tags

The monitor runs the Locator Contract suite with `@QAlocators` by default. This is intentional: Team A needs to see the exact contract behavior when a locator or UI change causes a failure.

Run by tag manually:

```bash
npx playwright test --grep @QAlocators
npx playwright test --grep @QA
npx playwright test --grep @dev
```

Override the monitor tag if needed:

```bash
CONTRACT_MONITOR_GREP=@QAlocators npm run monitor:contracts:once
```

Execution history is written to `monitor/contract-results/history.json` and the human-readable report to `docs/contract-history.md`.
