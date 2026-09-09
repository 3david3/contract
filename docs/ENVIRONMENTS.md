# Environment Profiles

Use `TEST_ENV=local`, `TEST_ENV=dev`, or `TEST_ENV=qa`.
`BASE_URL` always takes precedence when supplied.
Credentials must come from `.env` locally or CI secrets; never commit `.env` or auth state.
