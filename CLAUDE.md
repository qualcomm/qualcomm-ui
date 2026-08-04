# GLOBAL CODING STANDARDS

## Agent Instructions

Read and follow these standards before executing task-list work. They supersede conflicting lower-priority guidance.

## Operating Principles

- Prioritize correctness and clarity over agreeability.
- Examine the existing codebase before coding: study local patterns, architecture, and constraints, then follow them consistently.
- Be direct: give one focused recommendation, explain the reasoning concisely, and call out quality issues.
- Ask first when requirements, edge cases, error handling, or performance expectations are ambiguous.

## Code Standards

- Assume TypeScript strict mode.
- Prefix Node.js modules with `node:` and use named imports.
- Prefer promise APIs such as `node:fs/promises` over synchronous equivalents.
- Handle errors appropriately or explicitly state assumptions.
- Follow language and project conventions.
- Consider security implications, including input validation and sanitization.
- Prefer built-in solutions over external libraries unless there is clear justification.

## Comments

- Keep JSDoc documentation comments.
- Remove inline comments that merely restate obvious code.
- Add comments only when they explain non-obvious business logic, edge cases, browser behavior, or architectural decisions.

Keep comments like this:

```ts
/**
 * Safari has historically had inconsistent behavior with programmatically
 * focusing hidden or visually obscured form elements.
 */
if (isSafari()) {
  element.focus()
}
```

Remove comments like this:

```ts
// Increment the counter
counter += 1

// Check if user is present
if (!user) {
  return
}
```

## Repository Structure

Code is organized into shared core packages, framework core packages, QDS framework packages, and docs:

- `packages/common/core`: shared, framework-agnostic component logic.
- `packages/common/dom`: DOM utilities and helpers.
- `packages/common/utils`: shared general-purpose utilities.
- `packages/common/qds-core`: QDS design tokens, styles, and design-system primitives.
- `packages/frameworks/<framework>-core`: core library logic for each component.
- `packages/frameworks/<framework>`: QDS-specific component wrappers and abstractions, including CSS classes and QDS properties from `packages/common/qds-core`.
- `packages/docs/<framework>-docs`: library usage documentation for the framework.

For component behavior changes, inspect the lowest relevant layer first. Shared behavior may belong in `packages/common/core`; framework-specific behavior belongs in `packages/frameworks/<framework>-core`; QDS styling and public design-system affordances belong in `packages/frameworks/<framework>`.

Component docs live under the framework docs package:

- MDX: `packages/docs/<framework>-docs/src/routes/components+/<component>+/_<component>.mdx`
- Demos: `packages/docs/<framework>-docs/src/routes/components+/<component>+/demos/*`

Examples:

- Button docs: `packages/docs/angular-docs/src/routes/components+/button+/_button.mdx`
- Button demos: `packages/docs/angular-docs/src/routes/components+/button+/demos/*.ts`

When translating examples between frameworks, inspect the component code first. Interfaces are similar but not identical; Angular controlled state often uses Angular Forms.

## Project Workflow

- Run package-level tasks through package scripts. Check the root `package.json` for an alias and use `pnpm <alias> <script>` when available. Otherwise use `pnpm -C <relative/path/to/package> <script>`.
  - Do not use generic tool invocations such as `pnpm exec vitest` unless no package script exists.
- Design tokens live in `packages/common/qds-core/src/styles`; use `qualcomm-dark.css` as a reference.
- The Tailwind plugin lives in `packages/common/tailwind-plugin`.
- Match the project's formatting configuration and surrounding style.

## Documentation

- Do not speak like an AI. Avoid emojis, EM-dashes, and fake enthusiasm.
- Match the existing documentation tone.
- Always use the docs agent.

## Testing

- Use the testing skills to write tests.

## Response Format

1. Ask questions first if anything is ambiguous.
2. State assumptions clearly.
3. Provide one well-reasoned solution with brief explanation.
4. Mention alternatives only when they involve significant tradeoffs.
5. Identify potential issues with the approach.

## What Not To Do

- Do not introduce new patterns without understanding why existing ones exist.
- Do not agree just to be helpful if something breaks consistency.
- Do not ignore established abstractions in favor of simpler-looking alternatives.
- Do not overengineer when the project favors simpler approaches.
