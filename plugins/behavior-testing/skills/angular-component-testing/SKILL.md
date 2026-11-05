---
name: angular-component-testing
description: Use when writing, reviewing, or refactoring Angular component or directive tests, especially tests for inputs, outputs, host behavior, template probes, forms, accessibility, or signal-backed behavior.
---

# Angular Component Testing

Use this skill for Angular component and directive test writing and review. Component tests should prove public template/API behavior, not directive internals, fixture state, or signal plumbing.

## Required References

Before writing or reviewing Angular component or directive tests, read:

- `references/behavior-testing.md`
- `references/component-testing.md`
- `references/vitest-browser-testing.md` when the suite uses Vitest Browser Mode

## Angular Component Workflow

1. Identify selectors, inputs, outputs, host attributes/classes/styles that are documented behavior, content projection, forms integration, user interactions, and accessibility.
2. Drive behavior through templates and real interactions. Prefer Testing Library-style queries and user events over direct fixture state.
3. Assert emitted output payloads and form value/status only after public template or user interactions.
4. Test directive and signal helpers through template-visible behavior unless their documented public API has no DOM surface.

## Angular Component Rejections

In addition to the shared references, reject:

- `fixture.componentInstance`, private fields, internal signals, private methods, or directive instances when template-visible behavior can prove the same contract.
- Runtime object-shape checks such as `"set" in signal`, `typeof value.set`, or rendering `"writable"`/`"read-only"` solely to prove a returned signal's internals. Enforce type-only contracts with TypeScript, not DOM tests.
- Test-only diagnostic probes that expose implementation shape instead of behavior.

## Signal Helper Example

Use this rule when testing Angular helpers that return signals from directive or
component state. A small probe directive or component is fine when it exposes
public behavior through the template. It becomes a test smell when the probe
exists only to inspect the returned signal object's runtime shape.

This kind of probe is implementation-coupled:

```ts
@Directive({
  exportAs: "hostAttributeProbe",
  selector: "[hostAttributeProbe]",
})
class HostAttributeProbeDirective {
  readonly ariaLabel = hostAttribute("aria-label")
  readonly labelText = computed(() => this.ariaLabel() ?? "missing")
  readonly signalType = computed(() =>
    "set" in this.ariaLabel ? "writable" : "read-only",
  )
}
```

The `labelText` readout is useful because it proves behavior: the template
observes the host attribute value exposed by the helper. The `signalType`
readout is not useful because it proves only that the current returned object
lacks a `.set` property. That is a runtime shape assertion, not user-visible
behavior. It will fail if the helper is refactored to a different read-only
signal implementation while preserving the same public contract.

Prefer tests that assert the observable contract:

- The host attribute's initial value is exposed through the signal.
- Bound host attribute changes update the template-visible readout.
- Removing the host attribute produces the documented empty value, such as `null`.

Do not render `"writable"` or `"read-only"` solely to test whether a signal has
`.set`. If the public contract is read-only because the helper returns
`Signal<T>`, enforce that with TypeScript type checking or type-level tests, not
a DOM assertion.

## Self-Review Grep

Run this against changed Angular component test files and justify or rewrite every hit:

```shell
rg -n "fixture\\.componentInstance|querySelector|childNodes|data-.*part|data-state|toHaveClass|\\\"set\\\" in|typeof .*\\.set|signalType|getByTestId" <test-files>
```
