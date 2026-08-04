---
name: audit-qui-component-rules
description: Use when reviewing or final-checking QUI React usage involving IconButton, InlineIconButton, HeaderBarActionIconButton, Avatar.Image, labels for TextInput/NumberInput/PasswordInput/Select/Combobox/Switch/Checkbox/Radio, interactive Card.Root, AlertBanner actions, Card.Root actions, HeaderBar.ActionBar, Menu.Trigger, or Select.Root checkbox indicators.
---

# Audit QUI Best Practices

## Required Reference

Before reviewing covered QUI component usage, read the bundled `references/component-rules.md` reference.

## Review Workflow

1. Identify imports and JSX that match a target context in the reference.
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
