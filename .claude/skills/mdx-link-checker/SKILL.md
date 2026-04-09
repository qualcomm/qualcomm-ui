---
name: mdx-link-checker
description: Validate and fix links, terms blocks, and references in an MDX documentation page. Accepts a path to an MDX file.
argument-hint: <path-to-mdx-file>
---

# MDX Link Checker

Validate and fix links, references, and `::: terms` blocks in a single MDX documentation page.

**Target file**: `$ARGUMENTS`

## Procedure

### Phase 1: Setup

1. Resolve the target MDX file from `$ARGUMENTS`. If the argument is a component name (e.g., `breadcrumbs`), resolve it to the MDX file by searching both:
   - `packages/docs/react-docs/src/routes/components+/<name>+/_<name>.mdx`
   - `packages/docs/angular-docs/src/routes/components+/<name>+/_<name>.mdx`

   If both exist, ask the user which one to check. If the argument is a full path, use it directly.

2. Detect the framework from the file path:
   - Path contains `react-docs` → React
   - Path contains `angular-docs` → Angular

3. Run `pnpm doc-gen` to ensure TypeDoc output is up-to-date. This generates the prop/attribute anchors that the page links to.

4. Read the target MDX file.

### Phase 2: Collect Page Metadata

#### 2a. Build the anchor map (simulate ID assignment)

Headings and TypeDoc props share a single ID namespace per page. Headings claim IDs first, then props. When a prop name collides with an already-claimed heading slug, the prop gets a `-1` (or `-2`, etc.) suffix. This means `[emphasis](./#emphasis)` may point to a section heading, NOT the API prop.

To determine the correct anchor for each API prop, simulate the assignment:

1. **Slugify all headings in document order.** Apply the project's slugify rules:
   - Strip `<>` characters, then strip all non-`[a-zA-Z0-9_\s-]` characters, then trim
   - If the result contains a space: lowercase and replace spaces with hyphens (e.g., `Emphasis (color)` → cleaned to `Emphasis color` → `emphasis-color`)
   - Else if PascalCase (2+ capitals): insert hyphens at case boundaries, lowercase (e.g., `BreadcrumbsRoot` → `breadcrumbs-root`)
   - Else: just lowercase (e.g., `Emphasis` → `emphasis`, `Sizes` → `sizes`)
   - Deduplicate within the heading set: first occurrence gets the base slug, subsequent get `-1`, `-2`, etc.

2. **Collect all heading slugs** into an ordered set (the "claimed IDs").

3. **Identify all `<TypeDocProps name="..." />` entries in document order.** For each, find the corresponding TypeScript interface to get its prop names. Useful source locations:
   - React: grep for `export interface <Name>` in `packages/frameworks/react/src/<component>/`
   - Angular: grep for `export class <Name>` or `export interface <Name>` in `packages/frameworks/angular/src/<component>/`
   - QDS core: `packages/common/qds-core/src/<component>/`

4. **Assign prop IDs in document order** using the same collision logic: for each prop name, check if the ID is already claimed (by a heading or an earlier prop). If claimed, try `name-1`, `name-2`, etc. Record the actual assigned ID for each prop.

   Example: heading `### Emphasis` claims `emphasis`. Later, TypeDocProps for BreadcrumbsRootProps includes prop `emphasis` → assigned `emphasis-1`. So the correct link is `[emphasis](./#emphasis-1)`.

5. **Build a lookup table**: `propName → actualAnchor` for the entire page.

#### 2b. Build the component registry

List all component directories under:
- `packages/docs/react-docs/src/routes/components+/` → valid targets like `/components/tooltip`
- Also check `packages/docs/<framework>-docs/src/routes/patterns+/` → targets like `/patterns/controlled-state`
- And `packages/docs/<framework>-docs/src/routes/` for top-level pages like `/polymorphic-components`

#### 2c. Build the sub-component name list

Extract from the API section headings:
- React: names like `Breadcrumbs.Item`, `Breadcrumbs.ItemTrigger` (from `### \<Breadcrumbs.Item\>`)
- Angular: names like `q-breadcrumb-item`, `q-breadcrumb-item-trigger` (from `### q-breadcrumb-item`)

Map each to its heading anchor (already computed in 2a).

### Phase 3: Analyze

Scan the MDX content (excluding code blocks and the API section itself) for these issues:

#### 3a. `::: terms` format
Check every `::: terms` block. All keywords must be on a single line, separated by commas. Flag blocks where terms are on separate lines.

**Before:**
```
::: terms
solid button
bordered button
transparent button
:::
```

**After:**
```
::: terms
solid button, bordered button, transparent button
:::
```

#### 3b. Unlinked prop/input references
Find prop/input names mentioned in backticks (e.g., `` `emphasis` ``) that:
- Match a known prop name from the API section
- Are not already wrapped in a link
- Appear in prose (not in code blocks)

Use the **anchor lookup table from Phase 2a** to determine the correct anchor. Do NOT assume `#propName` — it may be `#propName-1` etc. if a heading claimed the base slug first.

Suggest linking to the actual API anchor: e.g., `[emphasis](./#emphasis-1)` when the heading `### Emphasis` already occupies `#emphasis`.

**Link format**: Preserve backticks around the link text. Write `` [`emphasis`](./#emphasis-1) ``, not `[emphasis](./#emphasis-1)`. Backticks inside link brackets render correctly (monospace + link color).

**Rules:**
- Only link the **first** occurrence of each prop per page
- Always use the anchor from the lookup table, never guess
- If a prop appears in multiple sub-components and has different suffixed anchors, use the one from the most relevant sub-component (typically the root component)

#### 3c. Unlinked sub-component references
Find sub-component names mentioned in prose that are not linked to their API section:
- React: `` `Breadcrumbs.ItemTrigger` `` → `` [`Breadcrumbs.ItemTrigger`](./#breadcrumbsitemtrigger) ``
- Angular: `` `q-breadcrumb-item-trigger` `` → `` [`q-breadcrumb-item-trigger`](./#q-breadcrumb-item-trigger) ``

Derive the anchor from the `### heading` text: lowercase, strip `\<` and `\>`, remove dots and spaces, keep hyphens.

**Link format**: Preserve backticks. Write `` [`q-select-content`](./#q-select-content) ``.

**Rules:**
- Only link the **first** occurrence per page
- Do not link sub-component names that appear in code blocks

#### 3d. Unlinked cross-component references
Find component names mentioned in prose (e.g., "Tooltip", "Menu", "Dialog") that:
- Match a known component page from the registry
- Are not already linked
- Are not the current page's own component

Suggest linking: `[Tooltip](/components/tooltip)`.

**Rules:**
- Only link the **first** occurrence per page
- Match whole words only (don't match "Button" inside "ButtonGroup")
- Both the PascalCase component name (React) and the display title from frontmatter are valid matches

#### 3e. ARIA/HTML global attributes
Find references to ARIA attributes or well-known HTML attributes in backticks that could benefit from an MDN link. Only flag **non-obvious** ones on **first** occurrence:

**Link these** (less well-known, MDN adds value):
- `aria-current`, `aria-live`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-describedby`, `aria-labelledby`, `aria-orientation`, `aria-activedescendant`, `aria-selected`, `aria-checked`, `aria-pressed`, `aria-modal`, `aria-roledescription`, `role`

**Skip these** (universally known, linking adds noise):
- `aria-label`, `aria-hidden`, `href`, `id`, `class`, `style`, `disabled`, `type`, `name`, `value`, `placeholder`, `tabindex`

MDN URL pattern:
- ARIA attributes: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/<attr>`
- ARIA roles: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/<role>_role`

#### 3f. Broken or invalid links
Check all existing links in the page:
- **Same-page anchors** (`./#foo`): verify `foo` exists in the full anchor set (heading slugs + assigned prop IDs from Phase 2a). A common error: `[emphasis](./#emphasis)` where the heading claimed `#emphasis` and the API prop is actually at `#emphasis-1` — flag this as "links to section heading, not API prop" and suggest the correct anchor.
- **Cross-page links** (`/components/foo`, `/patterns/foo`): verify the target directory/file exists
- **External links**: skip validation (out of scope)

### Phase 4: Report (Dry Run)

Present findings grouped by category.

**`::: terms` fixes are reported as a single summary line** (e.g., "15 blocks will be merged to single comma-separated lines") — no per-block listing needed since the fix is mechanical. Apply these silently alongside the other fixes.

For all other categories, show each issue with:
- Line number
- Current text
- Suggested replacement

Example format:

```
## Findings

### ::: terms format
15 blocks will be merged to single comma-separated lines.

### Broken links (2 issues)
- Line 54: [aria-label](./#aria-label) → links to section heading, API prop is at ./#aria-label-1
- Line 94: [selectCollection](./#ListCollection) → anchor does not exist, should be ./#list-collection

### Unlinked sub-components (2 issues)
- Line 59: `q-select-trigger` → [q-select-trigger](./#q-select-trigger)
- Line 166: `q-select-error-text` → [q-select-error-text](./#q-select-error-text)

### No issues found in:
- Unlinked props
- Cross-component references
- ARIA attributes
```

### Phase 5: Apply

Ask the user: **"Apply all fixes, or review individually?"**

Options:
- **Apply all** — apply every suggested fix
- **Review each** — walk through each fix, asking for confirmation. For prop links, specifically note: "This links to the API prop entry. If you'd prefer to link to the section heading instead, skip this and adjust manually."
- **Skip** — exit without changes

Apply approved fixes using the Edit tool. After applying, read back the file and show a summary of changes made.

## Edge Cases

- **Heading/prop anchor collisions**: These are expected and handled by Phase 2a. The anchor map is the source of truth. When suggesting a prop link, always use the actual assigned anchor (e.g., `#emphasis-1`), never assume the base name.
- **Existing links pointing to heading instead of prop**: If a page already has `[emphasis](./#emphasis)` but the prop is at `#emphasis-1`, flag it as a broken link in 3f with the correction.
- If `pnpm doc-gen` fails, warn the user but continue with best-effort analysis (prop anchors may be stale).
- Code blocks (fenced with triple backticks) and inline code in JSX attributes should be excluded from analysis. Only scan prose text.
- The `## API` section itself should not be scanned for missing links — it's auto-generated content.
