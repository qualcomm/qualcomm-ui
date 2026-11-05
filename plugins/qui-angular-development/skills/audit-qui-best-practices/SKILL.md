---
name: audit-qui-component-rules
description: Use when reviewing or final-checking QUI Angular template usage involving q-icon-button, q-inline-icon-button, q-header-bar-action-icon-button, q-avatar-image, labels for q-text-input/q-number-input/q-password-input/q-select/q-combobox/q-switch/q-checkbox/q-radio, interactive q-card, q-alert-banner actions, q-card actions, q-header-bar-action-bar, q-menu-trigger, or q-select-root checkbox indicators.
---

# Audit QUI Best Practices

## Required Reference

Before reviewing covered QUI Angular template usage, read the bundled `references/component-rules.md` reference.

## Review Workflow

1. Identify Angular template selectors that match a target context in the reference.
2. Treat every matching issue as a finding.
3. Do not add findings for non-covered components, general design preferences, or code outside the shared reference.

## Output

Lead with findings ordered by severity. Include file and line references for every actionable issue.

Use this shape:

```text
Findings
- [P1] <component rule name>: <issue>. <file:line>
  <what the component contract requires>

Open Questions
- \<only if needed\>

Residual Risk
- \<only if relevant\>
```

If there are no issues, say that clearly and include any remaining verification gaps.
