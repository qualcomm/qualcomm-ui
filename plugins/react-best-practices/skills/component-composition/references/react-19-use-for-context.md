---
title: React 19 use() for Context
impact: MEDIUM
impactDescription: more flexible context reads with use()
tags:
  - react19
  - context
  - hooks
  - use
  - useContext
---

# React 19 use() for Context

> **React 19+ only.** Skip this if the package supports React 18 or earlier.

## Rule

In React 19, prefer `use(Context)` for context reads in new or migrated code. `use()` can be called conditionally, unlike `useContext()`.

## Incorrect

```tsx
const value = useContext(MyContext)
```

## Correct

```tsx
const value = use(MyContext)
```
