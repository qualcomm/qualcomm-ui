# @qualcomm-ui/claude-plugin

Claude Code plugin bundle for the QUI best-practices skill family.

## Status

**Scaffold only.** The three skills described in the spec
(`docs/superpowers/specs/2026-04-27-qui-best-practices-skill-design.md`,
section _Skills_) have not been authored yet:

- `qui-best-practices` — auto-activating priming + post-write self-audit
- `qui-audit` — on-demand, read-only
- `qui-fix` — on-demand, write-allowed

When authored, skill markdown files go under `skills/<skill-name>/SKILL.md`
with the plugin manifest at `.claude-plugin/plugin.json`.

## Why this package exists today

Reserves the package name in the workspace, signals the intended shape to
future contributors, and keeps the spec's distribution story (`/plugin install
@qualcomm-ui/claude-plugin`) grounded in a real directory.

## Related packages

- `@qualcomm-ui/audit-mcp` — stdio MCP server + audit engine the skills call
  into. Lives at `packages/tooling/audit-mcp/`.
- `@qualcomm-ui/eslint-plugin-react` — ESLint rules covering the single-file
  direct case of each audit rule. Lives at
  `packages/configs/eslint-plugin-react/`.
