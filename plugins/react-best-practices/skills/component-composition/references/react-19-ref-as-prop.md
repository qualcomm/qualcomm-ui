---
title: React 19 Ref as Prop
impact: MEDIUM
impactDescription: cleaner component definitions without forwardRef wrappers
tags:
  - react19
  - refs
  - forwardRef
---

# React 19 Ref as Prop

> **React 19+ only.** Skip this if the package supports React 18 or earlier.

## Rule

In React 19, `ref` is a regular prop for function components. Do not introduce new `forwardRef` wrappers when the component can accept and pass `ref` directly.

## Incorrect

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

## Correct

```tsx
function ComposerInput({ref, ...props}: Props & {ref?: React.Ref<TextInput>}) {
  return <TextInput ref={ref} {...props} />
}
```
