# Multi-API Patterns

Use this reference when a component exposes both composite and simple APIs.

## Runner Pattern

`packages/frameworks/react/test-utils/runner.ts` accepts cases with `composite`, `simple`, and `testCase`. `runTests` invokes the same assertions against each renderer.

```tsx
const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Label</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox label="Label" />
    },
    testCase(getComponent) {
      test("toggles checked state from the label", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Label")).not.toBeChecked()
        await page.getByText("Label").click()
        await expect.element(page.getByLabelText("Label")).toBeChecked()
      })
    },
  },
]

describe("Checkbox", () => {
  runTests(tests)
})
```

## Good Examples

- `checkbox/checkbox.spec.tsx`: label click toggles checked state for composite and simple APIs.
- `switch/switch.spec.tsx`: checked state, Space key, callbacks, read-only no-op, focus changes, and form behavior.
- `text-input/text-input.spec.tsx`: label association, clear button behavior, controlled value updates, focus callbacks, and prop forwarding.
- `combobox/__tests__/*.spec.tsx`: separate behavior groups for open/close, keyboard, callbacks, collection, clear, and selection behavior.

## Guidance

- Share assertions when the public behavior should be identical.
- Pass props through the test renderer when a behavior needs callbacks or controlled state.
- Use public part props such as `labelProps`, `inputProps`, or `indicatorProps` for part-forwarding tests.
- Do not force parity when only one API exposes a public capability. Test that API directly and make the scope clear in the test name.
