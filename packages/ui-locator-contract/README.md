# @company/ui-locator-contract

QA-owned Playwright UI contract.

## Ownership

- **Team A - Locator QA**: locator definitions, internal Page Objects, locator quality, contract releases.
- **Team B - Automation QA**: consumes the public contract API and writes business/workflow assertions.
- **DEV**: application code and stable automation hooks when required by the UI contract.

## Consumer rule

Team B imports only from the package root and uses the Contract Registry:

```ts
import { contracts } from '@company/ui-locator-contract';

const notes = contracts.notes(page);

await notes.open();
await notes.createNote({
  category: 'Work',
  title: 'Shopping List',
  description: 'Milk, eggs, bread',
});
```

Consumers must not import internal `locators/` or `pages/` modules and must not create application-specific selectors for UI covered by the contract.

## Contract version

The public contract version is tracked independently from the npm package version. Example: `1.256`.

## Contract principle

> Locator QA owns **how to find it**. Automation QA owns **what to do with it**. DEV owns **how it is built**.
