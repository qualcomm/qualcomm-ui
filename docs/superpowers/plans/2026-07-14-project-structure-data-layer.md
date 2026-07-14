# Project Structure Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the React project-structure guide establish the data layer as the sole owner of external data contracts and operations without repeating prohibitions throughout the other layer descriptions.

**Architecture:** Keep the page's existing Feature-Sliced Design structure and dependency hierarchy. State exclusive ownership in the detailed Data section, then describe Features, Entities, Shared, Pages, and Widgets through their positive responsibilities and their consumption of lower-layer exports.

**Tech Stack:** MDX, React docs site, QUI Docs authoring rules

---

### Task 1: Align the project-structure concept page

**Files:**
- Modify: `packages/docs/react-docs/src/routes/patterns+/project-structure.mdx`

- [x] **Step 1: Rewrite conflicting ownership guidance**

Keep the existing diagrams, layer order, dependency table, and slice-isolation content. Make these focused changes:

```mdx
- Describe `data` in the Layers summary as organizing access to external data by business domain.
- Restrict the `api/` segment to data-layer slices and add data-layer segments for external interfaces and schemas.
- Describe Features as business actions and workflows that consume data-layer queries and mutations.
- Describe Entities as domain concepts, local models, business rules, and UI.
- Remove CRUD and endpoint examples that assign external operations to Features or Entities.
- State once in the detailed Data section that all external interfaces, schemas, API methods, queries, and mutations live in the data layer.
- Describe Shared as generic transport infrastructure that data-layer slices use.
```

Also replace the opening paragraph with a reader-value statement and preserve the page as a concept page.

- [x] **Step 2: Check ownership terminology and formatting**

Run:

```bash
rg -n "API|external data|CRUD|queries|mutations|interfaces|schemas" packages/docs/react-docs/src/routes/patterns+/project-structure.mdx
git diff --check
```

Expected: Every endpoint-specific contract or operation is assigned to Data, other layers are described positively, and `git diff --check` prints no errors.

- [x] **Step 3: Check the configured docs port before building**

The current Vite configuration uses port `3100`. Run:

```bash
ss -ltn 'sport = :3100'
```

Expected: If the command reports a listener, skip the routine docs build because the docs site is already running. If it reports no listener, continue to Step 4.

- [x] **Step 4: Build the React docs site when the port is available**

Run only when port `3100` is available:

```bash
pnpm react-docs build:site
```

Expected: The React Router production build exits with status `0`.

- [x] **Step 5: Review against QUI Docs rules**

Confirm the page remains a single concept page, opens with reader value, retains valid frontmatter and `# {frontmatter.title}`, uses canonical `API` casing, introduces no weak headings or MDX formatting violations, and contains no unverified code snippets.

- [x] **Step 6: Commit the documentation update**

```bash
git add packages/docs/react-docs/src/routes/patterns+/project-structure.mdx docs/superpowers/plans/2026-07-14-project-structure-data-layer.md
git commit -m "docs: clarify project data layer ownership"
```
