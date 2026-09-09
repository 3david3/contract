# Framework Contribution Guide

## Ownership
- **Locator QA / Team A:** selectors, internal Page Objects, public locator contracts.
- **Automation QA / Team B:** tests, workflows, assertions, fixtures and test data.
- **DEV:** Application behavior and stable automation hooks.

## Rules
1. Tests consume `@company/ui-locator-contract` from its public package entry point.
2. Do not add hard-coded credentials, tokens, or private keys.
3. Use `uniqueNote`/test-data factories for created records.
4. Do not delete arbitrary user data; lifecycle cleanup must target framework-created data only.
5. Add a tag when a test is intended for `@dev`, `@QA`, or `@QAlocators`.
6. Run `npm run quality:gate` before opening a pull request.
7. For locator changes, update contract documentation/work queues as appropriate.
