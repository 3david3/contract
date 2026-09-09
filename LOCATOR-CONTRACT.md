# UI Locator Contract

## Principle

> Locator QA owns **how to find it**. Automation QA owns **what to do with it**. DEV owns **how it is built**.

## Contract ownership

- **Team A - Locator QA:** owns locators, internal Page Objects, contract APIs, and contract-health tests.
- **Team B - Automation QA:** consumes the public contract API and writes business-level automation.
- **Development:** owns the application and provides stable automation hooks when required.

## Rules

1. Locator definitions are owned by Team A.
2. Internal Page Objects are owned by Team A.
3. Team B consumes contracts through the package root / Contract Registry.
4. Team B must not import internal `locators/*` or `pages/*` modules.
5. Team B must **not** create application-specific CSS/XPath selectors for UI covered by a contract.
6. Business assertions remain in Team B tests.
7. Contract-health tests may access internal locators because they are Team A tests.
8. Contract-health tests validate the UI contract in supported browsers.

## Locator strategy

Preferred order:

1. `getByRole()` with accessible names.
2. `getByLabel()` / `getByPlaceholder()` when semantically appropriate.
3. `getByTestId()` for stable application-owned automation hooks.
4. CSS selectors only when there is a documented reason.
5. XPath and structural selectors are strongly discouraged.

## Contract test responsibility

Every public capability exposed by a contract must have a corresponding contract-health test or validation path.

A contract failure means Team A investigates the locator/contract first. Team B should not bypass the contract by adding a raw selector.

## Production hardening
Run `npm run validate:framework` before pull requests. Framework-created test records use a unique `E2E Note |` prefix and are cleaned up after tests without targeting arbitrary user notes.
