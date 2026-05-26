# Tests

- `vitest`: unit tests, colocated with source (`Foo.test.ts` next to `Foo.ts`).
- `playwright`: end-to-end + accessibility, in `tests/e2e/`.

Run `npm test` for units, `npm run test:e2e` for E2E. CI runs both.
