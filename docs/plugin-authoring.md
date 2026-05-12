# Best-Practice Plugin Authoring

Use this guide when creating best-practice plugins such as `react-best-practices`, `typescript-best-practices`, or similar agentic guidance bundles.

The goal is targeted agent behavior: agents should load a skill implicitly when a task contains concrete signals for that concern, then load deeper references only when needed.

## Core Model

Use one plugin per practice family and one skill per activation concern.

```text
plugins/<family>-best-practices/
  .codex-plugin/
    plugin.json
  .claude-plugin/
    plugin.json
  references/
    <shared-topic>.md
  skills/
    <family>-<concern>/
      SKILL.md
      agents/
        openai.yaml
      references/
        <specific-topic>.md
```

Use plugin-root `references/` for guidance shared by multiple skills. Use
`skills/<skill-name>/references/` for guidance that belongs to one skill only.

Examples:

```text
plugins/react-best-practices/
  skills/
    react-effects/
    react-rendering-performance/
    react-component-api-design/
    react-data-fetching/
    react-accessibility/
```

Do not create a single broad skill such as `react-best-practices` for dozens of topics. Broad skills force one description to cover unrelated triggers and make implicit activation noisy.

## Activation Strategy

Default each concern skill to implicit activation, but make the `description` narrow and concrete.

`SKILL.md` frontmatter is the primary activation surface. The description must answer: should this skill load for this exact task?

Good descriptions:

```yaml
---
name: react-effects
description: Use when React code involves useEffect, useLayoutEffect, dependency arrays, stale closures, subscriptions, timers, event listeners, or effect-driven state synchronization.
---
```

```yaml
---
name: react-rendering-performance
description: Use when React code has unnecessary rerenders, expensive render work, unstable object or function props, React.memo, useMemo, useCallback, or context provider value identity.
---
```

Avoid descriptions like:

```yaml
description: Use when writing good React code.
description: React best practices for better applications.
description: Helps review React components for quality.
```

Those are too broad for implicit loading.

## Skill Body

Keep each `SKILL.md` short. Put activation terms in frontmatter, not in a "when to use" section that only appears after activation.

Recommended shape:

```md
---
name: <family>-<concern>
description: Use when <specific task signals>.
---

# <Readable Skill Name>

## Scope Check

Use this skill only for `<concern>`.

## Workflow

1. Inspect the relevant code path before making recommendations.
2. Identify the specific concern: `<subtopic examples>`.
3. Load only the references needed for that concern.
4. Apply the guidance in the smallest code change that addresses the issue.
5. Verify with the narrowest relevant test, lint, build, or runtime check.

## References

- Read `references/<topic>.md` when `<specific condition>`.
- Read `references/<other-topic>.md` when `<specific condition>`.

## Output

Call out tradeoffs only when the guidance changes API shape, runtime behavior, accessibility, or performance characteristics.
```

The scope check matters. It gives the agent permission to stop using the skill when implicit activation was close but wrong.

## References

Use references for depth after a skill activates. References do not control activation.

There are two valid reference locations:

- Plugin-root references, such as `references/<topic>.md`, are shared source-of-truth material for multiple skills in the same plugin.
- Skill-local references, such as `skills/<skill-name>/references/<topic>.md`, are owned by one skill and should not be reused implicitly by other skills.

Prefer plugin-root references when two or more skills must apply the same rules, principles, examples, or rejection criteria. Prefer skill-local references when the guidance is specific to one activation concern.

Prefer one reference per concern or sub-concern:

```text
skills/react-effects/references/
  dependencies.md
  cleanup.md
  stale-closures.md
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
    "defaultPrompt": ["Use $<skill-name> to review <specific concern>."],
    "brandColor": "#2A2AEA"
  }
}
```

Each skill should include `agents/openai.yaml`:

```yaml
interface:
  display_name: "<Skill Display Name>"
  short_description: "<25-64 character UI description>"
  default_prompt: "Use $<skill-name> to review <specific concern>."

policy:
  allow_implicit_invocation: true
```

Set `allow_implicit_invocation: false` only for subjective or broad advisory skills where automatic loading would be distracting.

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

- Prefix with the family when the name could collide globally: `react-effects`, `typescript-type-design`.
- Name the concern, not the quality goal: `react-effects` is better than `better-effects`.
- Avoid catch-all names: `react-quality`, `react-clean-code`, `react-best-practices`.

Reference names:

- Name the sub-concern: `dependencies.md`, `stale-closures.md`, `context-rerenders.md`.

## Authoring Checklist

For each plugin:

- Create both `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json`.
- Point Codex manifest `skills` to `./skills/`.
- Register the plugin in `.agents/plugins/marketplace.json`.
- Register the plugin in `.claude-plugin/marketplace.json`.
- Keep plugin metadata product-neutral except for keywords and UI fields.

For each skill:

- Use a narrow `description` that starts with `Use when`.
- Include concrete symptoms, APIs, file types, or task phrases in the description.
- Set `policy.allow_implicit_invocation: true` in `agents/openai.yaml`.
- Add a scope check.
- Keep `SKILL.md` short and procedural.
- Move detailed rules, examples, and checklists into plugin-root or skill-local `references/`.
- Explicitly state whether referenced files are plugin-root or skill-local.

For each reference:

- State when to read it.
- Provide actionable rules and checks.
- Include one focused example only when it materially improves agent behavior.
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

- A prompt that should activate the skill.
- A neighboring prompt that should activate a different skill.
- A generic implementation prompt that should not activate unrelated skills.

If a description activates too often, make it more concrete. If it misses obvious cases, add the missing symptom or API name.
