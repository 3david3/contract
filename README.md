# Playwright Contract Framework — Final

This framework uses a QA-owned UI locator contract, API service layer, unique test-data factories, environment profiles, CI browser matrix, failure diagnostics, reporting, and security/quality gates.

## Quick start

Add those 2 files .env and .gitignore:

  .env    Example: 
  
```
  TEST_USER_EMAIL=email@yahoo.com
  TEST_USER_PASSWORD= p a s s w o r d
  BASE_URL=https://example.com

```





.gitignore

```
node_modules/
dist/
.env
.env.staging
.env.production
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
playwright/.auth/
reports/
.auth/
.DS_Store
```



______________________________________________________________________
  
Commands

```bash
npm ci
npm install
npx playwright install
npm run validate:framework
npx playwright test validate_table.spec.ts --headed
```

## Tags

```bash
npm run test:dev
npm run test:qa
npm run test:qalocators
```

## Browsers

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:matrix
```

## Cleanup rule

Framework-created notes remain until the total record count reaches **threshold**. For instance at 24 or more, only `E2E Note |` notes are deleted. Nothing is deleted below 24. ( 24 is a variable and can be updated in the file src/test-data/cleanup.ts Variable name = NOTE_CLEANUP_THRESHOLD

## Architecture

- `packages/ui-locator-contract`: QA-owned selectors and public UI contracts
- `src/api`: API clients/models
- `src/test-data`: factories
- `src/config`: environment handling
- `src/reporting`: diagnostics/reporting helpers
- `tests`: business and contract tests
