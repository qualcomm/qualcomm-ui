# Vitest Browser Testing

Use this reference when a project uses Vitest Browser Mode for DOM, component, or integration tests.

## Imports And Core APIs

Follow the import paths used by the local project. Common setups expose:

- `page`: browser-style queries such as `getByRole`, `getByLabelText`, and `getByText`.
- `userEvent`: realistic keyboard, pointer, focus, and text input interactions.
- `expect.element(...)`: browser element assertions that wait for the DOM state.
- `expect.poll(...)`: polling for callback calls, form state, async side effects, or framework state.
- `vi`: spies, mocks, timers, and module mocking.
- A framework render helper, such as a React or Angular render function.

Do not change import style just because an example uses a different Vitest version. Match the surrounding test files.

## Querying

Prefer locators by stable user-facing surfaces:

1. `page.getByRole(..., {name})`
2. `page.getByLabelText(...)`
3. `page.getByText(...)`
4. `page.getByPlaceholderText(...)`
5. `page.getByTestId(...)` only for test-owned public hooks or otherwise inaccessible public parts

Avoid `querySelector` for behavior assertions. It usually means the test is coupled to DOM structure or internal attributes.

## Assertions

Use `await expect.element(locator)` for DOM assertions:

```ts
await expect.element(page.getByText("Saved")).toBeVisible()
await expect.element(page.getByText("Loading")).not.toBeInTheDocument()
await expect.element(page.getByRole("button", {name: "Save"})).toBeDisabled()
await expect.element(page.getByRole("textbox", {name: "Email"})).toHaveValue("a@example.com")
await expect.element(page.getByRole("tab", {name: "Details"})).toHaveAttribute("aria-selected", "true")
```

Use ARIA assertions when ARIA is the public accessibility contract. Avoid class, internal data attribute, or SVG assertions unless those are documented public contracts.

## Interactions

Drive behavior through user actions:

```ts
await page.getByRole("button", {name: "Save"}).click()
await page.getByRole("button", {name: "More"}).hover()
await userEvent.tab()
await userEvent.keyboard("{Enter}")
await userEvent.keyboard("{Escape}")
await userEvent.keyboard("{ArrowDown}")
await userEvent.keyboard("{Home}")
await userEvent.keyboard("{End}")
await userEvent.type(page.getByLabelText("Email"), "a@example.com")
```

Use forced clicks only when intentionally testing behavior around disabled or otherwise non-interactable elements, and make that scope explicit in the test name.

## Async And Callbacks

Use polling for effects that settle after browser or framework work:

```ts
await expect.poll(() => onChange).toHaveBeenCalledWith(expectedValue)
await expect.poll(() => formControl.valid).toBe(false)
```

Assert callbacks only after public user input or a documented public API call. Do not call internal handlers directly to make a spy pass.

## Helpers And Mocks

Small helpers are fine when they name repeated public interactions or assertions:

```ts
function getSaveButton() {
  return page.getByRole("button", {name: "Save"})
}
```

Mock external systems such as network, storage, timers, and platform APIs. Do not mock the component or unit under test when Vitest Browser can exercise the behavior directly.
