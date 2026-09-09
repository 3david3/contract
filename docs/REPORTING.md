# Reporting and Flake Detection

Playwright produces HTML, JSON, and JUnit output in CI. Failure traces, screenshots, and videos are retained according to `playwright.config.ts`.

Run `npm run report:flake` after a JSON run to identify tests that required more than one attempt.
