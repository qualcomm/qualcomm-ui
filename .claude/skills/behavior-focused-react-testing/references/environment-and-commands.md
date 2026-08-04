# Environment And Commands

Use this reference for `@qualcomm-ui/react` imports, browser-mode APIs, and test commands.

## Test Environment

- React package tests use Vitest browser mode with Chromium/Playwright and `vitest-browser-react`.
- Current repo imports use `from "vitest/browser"`, not `@vitest/browser/context`.
- Browser element assertions generally use `await expect.element(locator)`.
- Async callback assertions commonly use `expect.poll`.
- Test IDs are configured as `data-test-id` in `packages/frameworks/react/vitest.config.ts` and `packages/frameworks/react-test-utils/src/get-react-test-config.ts`.

## Standard Imports

Most React component specs use this shape:

```tsx
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"
```

When a component has matching composite and simple APIs:

```tsx
import {type MultiComponentTestCase, runTests} from "~test-utils/runner"
```

Some older tests import only the type from `@qualcomm-ui/react-test-utils` and manually loop over cases. Prefer `~test-utils/runner` inside `packages/frameworks/react`.

## Commands

Run a targeted React test from the repo root:

```shell
pnpm react test src/<component>/<component>.spec.tsx
```

Use the CI-style runner when matching CI behavior matters:

```shell
pnpm react test:react:ci src/<component>/<component>.spec.tsx
```
