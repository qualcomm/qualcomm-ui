---
name: component-composition
description: Use when writing, editing, reviewing, or refactoring React component APIs that involve composition, children, slots, compound components, wrapper components, render props, controlled or uncontrolled state, refs, or component API surface design.
---

# Component Composition

Use this skill as the router for React component composition guidance. Do not apply broad component design opinions by default; inspect the task and code first, then load only the rule references that match.

## Routing Workflow

1. Inspect the user request and the touched React component files before loading references.
2. Identify matching rule references by trigger terms, imports, APIs, file paths, React version, and changed component API behavior.
3. Read only the matching `references/*.md` files.
4. Apply only rules whose version, framework, or code-shape constraints match.
5. If no reference applies, proceed with normal codebase patterns and do not invent composition rules.

## References

- `references/react-19-ref-as-prop.md`: when React19+, use `ref` as a prop instead of `forwardRef`
- `references/react-19-use-for-context.md`: when React 19+,  use `use()` instead of `useContext()`

## Output

When a reference applies, state the rule name if it materially affects the recommendation or code change. Keep recommendations tied to loaded references.
