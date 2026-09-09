# Test Data Strategy

1. Generate data through factories.
2. Prefix framework-owned notes with `E2E Note |`.
3. Never delete arbitrary user notes from lifecycle hooks.
4. Retain notes below 24 total records.
5. At 24 or more total records, delete only framework-owned notes.
6. Prefer API setup/cleanup when an equivalent endpoint exists; validate business behavior through the UI contract.
