---
name: apply-qui-component-rules
description: Use when writing or modifying QUI React usage involving IconButton, InlineIconButton, HeaderBarActionIconButton, Avatar.Image, labels for TextInput/NumberInput/PasswordInput/Select/Combobox/Switch/Checkbox/Radio, interactive Card.Root, AlertBanner actions, Card.Root actions, HeaderBar.ActionBar, Menu.Trigger, or Select.Root checkbox indicators.
---

# Apply QUI Best Practices

## Required Reference

Before writing or modifying covered QUI component usage, read the bundled `references/component-rules.md` reference.

## Workflow

1. Identify touched JSX that matches a target context in the reference.
2. Apply only the matching covered contracts while writing or editing.
3. Ignore unrelated code unless it is inside a covered component context.
4. Before finishing, scan the changed JSX once against the shared reference.
