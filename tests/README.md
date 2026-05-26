# Tests

- `vitest`: unit tests, colocated with source (`Foo.test.ts` next to `Foo.ts`).
- `playwright`: end-to-end + accessibility, in `tests/e2e/`.

Run `npm test` for units, `npm run test:e2e` for E2E. CI runs both.

## Performance gates (target Core Web Vitals)

Run against production build (`npm run build && npm start`):

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

Lighthouse smoke: `npm run perf:lighthouse` writes `lighthouse-report.html`. Review before any merge to main.

Asset gates:
- Audio samples ≤ 200 KB each
- Hero image declares width/height
- Integration grid uses single SVG sprite
