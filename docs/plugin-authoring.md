# Best-Practice Plugin Authoring

Use this guide when creating best-practice plugins such as `react-best-practices`, `typescript-best-practices`, or similar agentic guidance bundles.

The goal is targeted agent behavior without overloading the skill registry: agents should load one family-level router skill for a broad practice area, then load only the narrow rule references that match the current code and chat context.

## Core Model

Use one plugin per practice family and one router skill per practice family. Put specific rules, migrations, examples, and checks in references owned by that router skill.

```text
plugins/<family>-best-practices/
  .codex-plugin/
    plugin.json
  .claude-plugin/
    plugin.json
  skills/
    <family>-best-practices/
      SKILL.md
      agents/
        openai.yaml
      references/
        <specific-rule>.md
```

Use skill-local references by default. Use plugin-root `references/` only for guidance shared by multiple skills in the same plugin.

Example:

```text
plugins/react-best-practices/
  skills/
    react-best-practices/
      SKILL.md
      agents/
        openai.yaml
      references/
        react-19-api-changes.md
        effect-dependencies.md
        context-value-stability.md
        derived-state.md
        composition-slot-apis.md
```

Do not create dozens of granular skills such as `react-effects`, `react-context`, and `react-component-composition` unless they represent truly separate activation domains. For best-practice plugins, broad activation plus strict reference filtering is usually better than many tiny implicit skills.

## Activation Strategy

Default the router skill to implicit activation, but make the `description` concrete enough to activate for the family and avoid unrelated tasks.

`SKILL.md` frontmatter is the primary activation surface. The description must answer: should this family router load for this broad class of work?

Good router description:

```yaml
---
name: react-best-practices
description: Use when writing, editing, reviewing, or refactoring React components, hooks, context, refs, effects, rendering performance, data fetching, accessibility, or React version migrations.
---
```

Avoid descriptions like:

```yaml
description: Helps make React code better.
description: General React advice.
description: Improves application quality.
```

Those are too vague to activate predictably.

The router skill should activate broadly, then filter hard after inspecting the task and code. References do not control activation; the router decides which references to read.

## Skill Body

Keep the router `SKILL.md` short. It is a routing procedure, not the rulebook.

Recommended shape:

```md
---
name: <family>-best-practices
description: Use when <broad family task signals>.
---

# <Readable Skill Name>

## Routing Workflow

1. Inspect the user request and the touched files before loading references.
2. Identify matching rule references by trigger terms, imports, APIs, file paths, framework version, and changed behavior.
3. Read only the matching `references/*.md` files.
4. Apply only rules whose guard conditions match. Skip rules whose version, framework, or code-shape guard does not match.
5. Report which rules were applied or intentionally skipped when that affects the recommendation or code change.

## References

- Read `references/<rule>.md` when `<specific trigger>`.
- Read `references/<other-rule>.md` when `<specific trigger>`.

## Output

Keep recommendations tied to loaded rules. Do not apply broad taste preferences that are not represented by a matching rule.
```

The router's first job is to avoid false positives. It must be allowed to load, inspect, and then do nothing if no reference applies.

## Rule References

References are where the narrow guidance lives. Prefer one reference per concrete rule, migration, or review check.

Reference files should be compact and operational:

````md
---
title: React 19 API Changes
impact: MEDIUM
impactDescription: cleaner component definitions and context usage
tags:
  - react19
  - refs
  - context
  - hooks
---

# React 19 API Changes

> **React 19+ only.** Skip this for React 18 or earlier.

## Trigger

Use only for React 19+ code touching `forwardRef`, `ref`, `useContext`, or `use`.

## Incorrect

\```tsx
const value = useContext(MyContext)
\```

## Correct

\```tsx
const value = use(MyContext)
\```

## Skip When

- The package supports React 18.
- The touched code is unrelated to refs or context reads.

## Verify

- Remove unused imports.
- Run the narrowest relevant typecheck, lint, or test.
````

Use frontmatter metadata for indexing and UI display if useful, but keep it schema-valid. For example, `tags` must be a YAML array, not comma-separated text.

There are two valid reference locations:

- Plugin-root references, such as `references/<topic>.md`, are shared source-of-truth material for multiple skills in the same plugin.
- Skill-local references, such as `skills/<skill-name>/references/<topic>.md`, are owned by one skill and should not be reused implicitly by other skills.

Prefer plugin-root references when two or more skills must apply the same rules, principles, examples, or rejection criteria. Prefer skill-local references when the guidance is specific to one activation concern.

For best-practice router skills, prefer skill-local references:

```text
skills/react-best-practices/references/
  effect-dependencies.md
  react-19-api-changes.md
  context-value-stability.md
```

For shared references:

```text
plugins/qui-docs/
  references/
    principles.md
    rules.md
  skills/
    write-docs/
      SKILL.md
    review-docs/
      SKILL.md
```

Split a reference when it becomes hard to scan or when the agent should load one part without another. Keep reference trees shallow: either one level below the plugin root or one level below the skill. Avoid deep trees.

Reference files should be compact and operational:

```md
# Effect Dependencies

Use this reference when reviewing dependency arrays, stale closures, or values captured by effects.

## Rules

- Prefer deriving values during render before synchronizing them in an effect.
- Include every reactive value read by the effect unless the value is intentionally stable.

## Checks

- Does the effect subscribe, schedule, fetch, or synchronize with an external system?
- Can the effect be deleted by deriving the value during render?

## Example

<one focused example>
```

Do not duplicate large blocks of content across references. If two skills need the same guidance, either keep the shared guidance short in both skills or create a plugin-root shared reference and make each skill explicitly link to it.

Each `SKILL.md` must make reference ownership clear. If a skill reads plugin-root references, say that the files live at the plugin root. If a skill reads skill-local references, use paths relative to that skill directory.

## Codex Wiring

Every plugin needs `.codex-plugin/plugin.json`.

Minimal shape:

```json
{
  "name": "<plugin-name>",
  "version": "0.1.0",
  "description": "<short plugin description>",
  "author": {
    "name": "Qualcomm UI Maintainers",
    "url": "https://github.com/qualcomm/qualcomm-ui"
  },
  "homepage": "https://github.com/qualcomm/qualcomm-ui",
  "repository": "https://github.com/qualcomm/qualcomm-ui",
  "license": "BSD-3-Clause-Clear",
  "keywords": ["codex", "<family>", "best-practices", "agentic"],
  "skills": "./skills/",
  "interface": {
    "displayName": "<Plugin Display Name>",
    "shortDescription": "<short UI description>",
    "longDescription": "<one sentence describing the plugin>",
    "developerName": "Qualcomm UI Maintainers",
    "category": "Developer Tools",
    "capabilities": ["Read", "Write", "Review"],
    "websiteURL": "https://github.com/qualcomm/qualcomm-ui",
    "defaultPrompt": ["Use $<family>-best-practices to review <family> code."],
    "brandColor": "#2A2AEA"
  }
}
```

Each skill should include `agents/openai.yaml`:

```yaml
interface:
  display_name: "<Skill Display Name>"
  short_description: "<25-64 character UI description>"
  default_prompt: "Use $<family>-best-practices to review <family> code."

policy:
  allow_implicit_invocation: true
```

Set `allow_implicit_invocation: true` for the router skill. Set it to `false` only for secondary skills that should never load unless named explicitly.

Add the plugin to `.agents/plugins/marketplace.json` for Codex marketplace availability:

```json
{
  "name": "<plugin-name>",
  "source": {
    "source": "git-subdir",
    "url": "qualcomm/qualcomm-ui",
    "path": "./plugins/<plugin-name>"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Developer Tools",
  "interface": {
    "displayName": "<Plugin Display Name>"
  }
}
```

## Claude Code Wiring

Every plugin should also include `.claude-plugin/plugin.json` so the same plugin can be installed for Claude Code while sharing the same skills and references.

Use the repo's existing Claude plugin manifest shape:

```json
{
  "name": "<plugin-name>",
  "description": "<short plugin description>",
  "version": "0.1.0",
  "author": {
    "name": "Qualcomm UI Maintainers",
    "url": "https://github.com/qualcomm/qualcomm-ui"
  },
  "homepage": "https://github.com/qualcomm/qualcomm-ui",
  "repository": "https://github.com/qualcomm/qualcomm-ui",
  "license": "BSD-3-Clause-Clear",
  "keywords": ["claude-code", "<family>", "best-practices", "agentic"]
}
```

Do not duplicate skill instructions for Claude Code. The platform-specific manifests differ, but the skills should remain shared:

```text
.codex-plugin/plugin.json
.claude-plugin/plugin.json
references/*.md
skills/<skill-name>/SKILL.md
skills/<skill-name>/references/*.md
```

If a skill needs platform-specific UI metadata, keep it under `skills/<skill-name>/agents/`. Do not put product-specific instructions in the skill body unless the skill's behavior actually differs by product.

Add the plugin to `.claude-plugin/marketplace.json` for Claude Code marketplace availability:

```json
{
  "name": "<plugin-name>",
  "source": {
    "source": "git-subdir",
    "url": "qualcomm/qualcomm-ui",
    "path": "plugins/<plugin-name>"
  },
  "description": "<short plugin description>",
  "category": "Developer Tools",
  "keywords": ["claude-code", "<family>", "best-practices", "agentic"]
}
```

When adding a new plugin, update both marketplace indexes:

- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`

Append new entries unless intentionally reordering marketplace display order.

## Naming

Plugin names:

- Use `<family>-best-practices`.
- Use lowercase hyphen-case.
- Keep the folder name and manifest `name` identical.

Skill names:

- The primary router skill should usually match the plugin name: `react-best-practices`, `typescript-best-practices`.
- Add secondary skills only for truly separate activation domains, not for every rule.
- If a secondary skill is needed, prefix it with the family when the name could collide globally.

Reference names:

- Name the concrete rule, migration, or check: `react-19-api-changes.md`, `effect-dependencies.md`, `context-value-stability.md`.
- Avoid catch-all references such as `quality.md`, `clean-code.md`, or `components.md`.

## Authoring Checklist

For each plugin:

- Create both `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json`.
- Point Codex manifest `skills` to `./skills/`.
- Register the plugin in `.agents/plugins/marketplace.json`.
- Register the plugin in `.claude-plugin/marketplace.json`.
- Keep plugin metadata product-neutral except for keywords and UI fields.

For each skill:

- Use a router `description` that starts with `Use when`.
- Include enough concrete APIs, file types, task phrases, or framework concerns to activate for the family without activating for unrelated work.
- Set `policy.allow_implicit_invocation: true` in `agents/openai.yaml`.
- Add a routing workflow that inspects code before loading references.
- Keep `SKILL.md` short and procedural; it should route, not teach every rule.
- Move detailed rules, examples, migrations, and checklists into plugin-root or skill-local `references/`.
- Explicitly state whether referenced files are plugin-root or skill-local.

For each reference:

- State the exact trigger and any version or framework guard.
- Provide actionable rules, skip criteria, and verification checks.
- Include incorrect/correct examples when they materially improve agent behavior.
- Keep frontmatter schema-valid; array fields such as `tags` must be YAML arrays.
- Avoid narrative history, broad essays, and duplicated content.
- Keep shared references at the plugin root only when multiple skills link to them or when they define plugin-wide policy.

## Validation

Run syntax checks after editing manifests:

```bash
python3 -m json.tool plugins/<plugin-name>/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/<plugin-name>/.claude-plugin/plugin.json >/dev/null
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null
python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
```

Validate YAML when `agents/openai.yaml` files are added or changed:

```bash
ruby -e 'require "yaml"; ARGV.each { |path| YAML.load_file(path) }' plugins/<plugin-name>/skills/*/agents/openai.yaml
```

Run whitespace checks before finishing:

```bash
git diff --check
```

Review activation quality manually with representative prompts:

- A broad prompt that should activate the router skill.
- A rule-specific prompt that should cause the router to read a specific reference.
- A neighboring prompt where the router may activate but should skip all references after inspection.
- A generic implementation prompt that should not activate unrelated plugin skills.

If a router activates too often, make its description more concrete. If the router activates correctly but applies too many rules, tighten reference triggers and skip criteria.
