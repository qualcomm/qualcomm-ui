# @qualcomm-ui/core Changelog

## 1.7.0

Apr 7th, 2026

### Features

- [stepper]: add core stepper API ([83307f8](https://github.com/qualcomm/qualcomm-ui/commit/83307f8))

### Bug Fixes

- [input]: use type button on clear-trigger for form compatibility ([ebd0e9f](https://github.com/qualcomm/qualcomm-ui/commit/ebd0e9f))

## 1.6.2

Apr 2nd, 2026

### Code Refactoring

- [machine]: support narrowed guards in createNarrowedMachine ([cf79dbf](https://github.com/qualcomm/qualcomm-ui/commit/cf79dbf))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.6.1

Mar 25th, 2026

### Bug Fixes

- [focus-visible]: support focusVisible option in programmatic focus ([d605803](https://github.com/qualcomm/qualcomm-ui/commit/d605803))
- [select]: make disclosure indicator inert ([012754b](https://github.com/qualcomm/qualcomm-ui/commit/012754b))
- [select]: allow keyboard interaction on clear button ([c238b9a](https://github.com/qualcomm/qualcomm-ui/commit/c238b9a))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom]

## 1.6.0

Mar 20th, 2026

### Features

- [side-nav]: add filter-input bindings to core api ([6a6beff](https://github.com/qualcomm/qualcomm-ui/commit/6a6beff))

### Bug Fixes

- [tree]: pass null to booleanAriaAttr for omitted false value ([baf3117](https://github.com/qualcomm/qualcomm-ui/commit/baf3117))
- [accordion]: pass null to booleanAriaAttr for omitted false value ([9ecdc20](https://github.com/qualcomm/qualcomm-ui/commit/9ecdc20))
- [tree]: add aria-label to branch-trigger for expand/collapse state ([f3d9f92](https://github.com/qualcomm/qualcomm-ui/commit/f3d9f92))
- [side-nav]: change trigger bindings from button type to treeitem role ([6f82109](https://github.com/qualcomm/qualcomm-ui/commit/6f82109))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.5.0

Mar 12th, 2026

### Features

- [combobox]: add typed event definitions to ComboboxSchema ([623bdb8](https://github.com/qualcomm/qualcomm-ui/commit/623bdb8))

### Code Refactoring

- [toggle]: migrate toggle machine to use createNarrowedMachine ([ad0d6f7](https://github.com/qualcomm/qualcomm-ui/commit/ad0d6f7))
- [combobox]: use narrowed machine with inferred type guards for actions ([1d44b3f](https://github.com/qualcomm/qualcomm-ui/commit/1d44b3f))

### Bug Fixes

- [combobox]: rename input focus event src from 'trigger' to 'input-focus' ([cf2a258](https://github.com/qualcomm/qualcomm-ui/commit/cf2a258))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.4.1

Mar 10th, 2026

### Bug Fixes

- [select]: use indexed loop with null check for select options iteration ([6ed1c90](https://github.com/qualcomm/qualcomm-ui/commit/6ed1c90))

## 1.4.0

Feb 24th, 2026

### Features

- progress[-bar] disabled

## 1.3.0

Jan 30th, 2026

### Features

- [number-input]: add unit selector
- [radio]: hint at item level

### Bug Fixes

- [radio]: group hint + CSS fixes
- [switch]: hint text
- [checkbox]: hint text

## 1.2.1

Jan 23rd, 2026

### Code Refactoring

- improve logging and error handling
- remove async from sync functions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/utils]

## 1.2.0

Dec 24th, 2025

### Features

- add toggle api

## 1.1.0

Dec 11th, 2025

### Features

- [text-area]: add component

## 1.0.12

Dec 10th, 2025

### Bug Fixes

- [select]: prevent indicator from receiving focus on tab

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.0.11

Dec 5th, 2025

### Bug Fixes

- auto-hide form elements `hint` when invalid

## 1.0.10

Dec 1st, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.0.9

Dec 1st, 2025

### Bug Fixes

- [input]: use defaultValue instead of value to prevent cursor jump on change

## 1.0.8

Nov 25th, 2025

### Documentation

- [table]: update jsdoc comments

## 1.0.7

Nov 18th, 2025

### Code Refactoring

- deprecate core action-group api (unused)

## 1.0.6

Nov 17th, 2025

### Bug Fixes

- [text-input]: remove aria-describedby attribute when hint is absence
- [password-input]: remove aria-describedby attribute when hint is absence
- [inline-notification]: remove accessibility attributes when heading/description are absent
- [dialog]: remove aria-describedby attribute when description is absence

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom]

## 1.0.5

Nov 13th, 2025

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/utils]

## 1.0.4

Nov 13th, 2025

### Miscellaneous Chores

- provide empty default type for npm typescript badge

## 1.0.3

Nov 13th, 2025

### Bug Fixes

- combobox input element focus on click
- presence ssr, dialog ssr, collapsible ssr

## 1.0.2

Nov 12th, 2025

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/utils]

## 1.0.1

Nov 12th, 2025

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/utils]
