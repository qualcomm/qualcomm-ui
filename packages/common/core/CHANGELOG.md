# @qualcomm-ui/core Changelog

## 1.13.0

Aug 30th, 2026

### Features

* [date-picker]: improve screen reader announcements ([c6c1185](https://github.com/qualcomm/qualcomm-ui/commit/c6c1185))
* [date-picker]: focus trap ([3a63bd1](https://github.com/qualcomm/qualcomm-ui/commit/3a63bd1))
* [date-picker]: add the date picker state machine ([be92213](https://github.com/qualcomm/qualcomm-ui/commit/be92213))

### Bug Fixes

* proper positioning defaults in components and JSDoc ([cb9973e](https://github.com/qualcomm/qualcomm-ui/commit/cb9973e))

### Miscellaneous Chores

* **deps:** update dependencies [@qualcomm-ui/utils@1.5.0, @qualcomm-ui/dom@1.3.0]

## 1.12.0

Aug 18th, 2026

### Features

* [listbox]: add listbox core api and utilities ([e7502d6](https://github.com/qualcomm/qualcomm-ui/commit/e7502d6))
* [progress/progress-ring]: add shimmer effect ([b5ad06c](https://github.com/qualcomm/qualcomm-ui/commit/b5ad06c))

### Code Refactoring

* [progress/progress-ring]: consolidate `--percent` & `--progress` ([3d5e2e5](https://github.com/qualcomm/qualcomm-ui/commit/3d5e2e5))

### Miscellaneous Chores

* **deps:** update dependencies [@qualcomm-ui/dom@1.2.0, @qualcomm-ui/utils@1.4.0]

## 1.11.8

Aug 16th, 2026

### Code Refactoring

- [types]: support TS 6.0 ([4ed7651](https://github.com/qualcomm/qualcomm-ui/commit/4ed7651))

### Miscellaneous Chores

- [types]: support TS 6.0 ([cb71a86](https://github.com/qualcomm/qualcomm-ui/commit/cb71a86))
- **deps:** update dependencies [@qualcomm-ui/utils@1.3.3, @qualcomm-ui/dom@1.1.6]

## 1.11.7

Jul 28th, 2026

### Bug Fixes

- [tabs]: apply focus-visible state on the first tab event into the tab list ([ddadab3](https://github.com/qualcomm/qualcomm-ui/commit/ddadab3))
- [tabs]: remove dismiss buttons from tab order ([f3ece00](https://github.com/qualcomm/qualcomm-ui/commit/f3ece00))
- [tabs]: clear focus when leaving the tab list and focusing another tab list ([7ab71c0](https://github.com/qualcomm/qualcomm-ui/commit/7ab71c0))

## 1.11.6

Jul 1st, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom@1.1.5]

## 1.11.5

Jun 10th, 2026

### Code Refactoring

- support nodenext resolution ([5259f2e](https://github.com/qualcomm/qualcomm-ui/commit/5259f2e))

### Styles

- apply lint updates ([c37eff5](https://github.com/qualcomm/qualcomm-ui/commit/c37eff5))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils@1.3.2, @qualcomm-ui/dom@1.1.4]

## 1.11.4

Jun 5th, 2026

### Bug Fixes

- [menu]: prevent scroll in focus reclaim workaround ([2131276](https://github.com/qualcomm/qualcomm-ui/commit/2131276))

## 1.11.3

Jun 3rd, 2026

### Miscellaneous Chores

- clean up dependencies and remove legacy build scripts ([961e1bb](https://github.com/qualcomm/qualcomm-ui/commit/961e1bb))
- migrate to vite for library bundling ([2216473](https://github.com/qualcomm/qualcomm-ui/commit/2216473))
- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/utils]

## 1.11.2

Jun 1st, 2026

### Bug Fixes

- [menu]: drop default positioning gutter ([e615b70](https://github.com/qualcomm/qualcomm-ui/commit/e615b70))

## 1.11.1

May 29th, 2026

### Bug Fixes

- [segmented-control]: use own component context for size and orientation selectors ([a9cda21](https://github.com/qualcomm/qualcomm-ui/commit/a9cda21))

## 1.11.0

May 22nd, 2026

### Features

- [number-input]: support aria labels ([cf182d6](https://github.com/qualcomm/qualcomm-ui/commit/cf182d6))
- [select]: support aria labels ([e6f41e1](https://github.com/qualcomm/qualcomm-ui/commit/e6f41e1))
- [combobox]: support aria labels ([cfaa97b](https://github.com/qualcomm/qualcomm-ui/commit/cfaa97b))

## 1.10.0

May 14th, 2026

### Features

- [file-upload]: add shared file upload primitives ([c6f26f5](https://github.com/qualcomm/qualcomm-ui/commit/c6f26f5))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.9.4

May 7th, 2026

### Tests

- [table]: add regression tests ([8d93335](https://github.com/qualcomm/qualcomm-ui/commit/8d93335))

## 1.9.3

May 1st, 2026

### Bug Fixes

- [tree]: use booleanAriaAttr for aria-multiselectable in tree root bindings ([bf8f5e5](https://github.com/qualcomm/qualcomm-ui/commit/bf8f5e5))

### Code Refactoring

- [tree]: use replaceChildren instead of manual node spread in expandBranches ([4dc7f37](https://github.com/qualcomm/qualcomm-ui/commit/4dc7f37))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.9.2

May 1st, 2026

### Bug Fixes

- [tabs]: hide non-selected panels and rework icon sizing ([885e7da](https://github.com/qualcomm/qualcomm-ui/commit/885e7da))

## 1.9.1

Apr 29th, 2026

### Bug Fixes

- [menu]: support disabled state for all item variants ([a55faf1](https://github.com/qualcomm/qualcomm-ui/commit/a55faf1))

## 1.9.0

Apr 19th, 2026

### Features

- [menu]: menu button & icon menu button ([0508c4d](https://github.com/qualcomm/qualcomm-ui/commit/0508c4d))
- [floating-ui]: read gutter from CSS --gutter custom property ([0db5e35](https://github.com/qualcomm/qualcomm-ui/commit/0db5e35))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom]

## 1.8.0

Apr 19th, 2026

### Features

- export anatomy parts ([e10cade](https://github.com/qualcomm/qualcomm-ui/commit/e10cade))

### Code Refactoring

- [password-input]: update anatomy attributes ([e75e295](https://github.com/qualcomm/qualcomm-ui/commit/e75e295))
- [progress]: update anatomy attributes ([18f6dff](https://github.com/qualcomm/qualcomm-ui/commit/18f6dff))
- [select]: update anatomy attributes ([cc94ee2](https://github.com/qualcomm/qualcomm-ui/commit/cc94ee2))
- [fieldset]: update anatomy attributes ([69bfdd5](https://github.com/qualcomm/qualcomm-ui/commit/69bfdd5))
- [avatar]: update anatomy attributes ([966c634](https://github.com/qualcomm/qualcomm-ui/commit/966c634))
- [popover]: update anatomy attributes ([e6f0c47](https://github.com/qualcomm/qualcomm-ui/commit/e6f0c47))
- [tabs]: update anatomy attributes ([61b877d](https://github.com/qualcomm/qualcomm-ui/commit/61b877d))
- [dialog]: update anatomy attributes ([8d23993](https://github.com/qualcomm/qualcomm-ui/commit/8d23993))
- [field]: update anatomy attributes ([0d8ebc0](https://github.com/qualcomm/qualcomm-ui/commit/0d8ebc0))
- [segmented-control]: fix data-scope selector ([9e8b76b](https://github.com/qualcomm/qualcomm-ui/commit/9e8b76b))
- [accordion]: update anatomy attributes ([0290896](https://github.com/qualcomm/qualcomm-ui/commit/0290896))
- [radio]: update anatomy attributes ([58e841c](https://github.com/qualcomm/qualcomm-ui/commit/58e841c))
- [input]: update anatomy attributes ([c0e5817](https://github.com/qualcomm/qualcomm-ui/commit/c0e5817))
- [segmented-control]: update anatomy attributes ([a2e96b1](https://github.com/qualcomm/qualcomm-ui/commit/a2e96b1))
- [text-input]: update anatomy attributes ([ff6b36e](https://github.com/qualcomm/qualcomm-ui/commit/ff6b36e))
- [inline-notification]: update anatomy attributes ([cd66b21](https://github.com/qualcomm/qualcomm-ui/commit/cd66b21))
- [menu]: update anatomy attributes ([eef3675](https://github.com/qualcomm/qualcomm-ui/commit/eef3675))
- [tooltip]: update anatomy attributes ([bc8b32e](https://github.com/qualcomm/qualcomm-ui/commit/bc8b32e))
- [number-input]: update anatomy attributes ([1219ea2](https://github.com/qualcomm/qualcomm-ui/commit/1219ea2))
- [slider]: update anatomy attributes ([8531c67](https://github.com/qualcomm/qualcomm-ui/commit/8531c67))
- [collapsible]: update anatomy attributes ([654a327](https://github.com/qualcomm/qualcomm-ui/commit/654a327))
- [text-area]: update anatomy attributes ([328cc2e](https://github.com/qualcomm/qualcomm-ui/commit/328cc2e))
- [stepper]: update anatomy attributes ([4049c9f](https://github.com/qualcomm/qualcomm-ui/commit/4049c9f))
- [combobox]: update anatomy attributes ([c429e3a](https://github.com/qualcomm/qualcomm-ui/commit/c429e3a))
- [side-nav]: update anatomy attributes ([7fddcb6](https://github.com/qualcomm/qualcomm-ui/commit/7fddcb6))
- [pagination]: update anatomy attributes ([a362d07](https://github.com/qualcomm/qualcomm-ui/commit/a362d07))
- [switch]: update anatomy attributes ([44f938e](https://github.com/qualcomm/qualcomm-ui/commit/44f938e))
- [tree]: update anatomy attributes ([7a08d86](https://github.com/qualcomm/qualcomm-ui/commit/7a08d86))
- [toast]: update anatomy attributes ([c1cfa1e](https://github.com/qualcomm/qualcomm-ui/commit/c1cfa1e))
- [avatar]: fix data-scope selector ([7432bf6](https://github.com/qualcomm/qualcomm-ui/commit/7432bf6))
- [action-group]: update anatomy attributes ([799f080](https://github.com/qualcomm/qualcomm-ui/commit/799f080))
- [toggle]: update anatomy attributes ([c7334d7](https://github.com/qualcomm/qualcomm-ui/commit/c7334d7))
- [checkbox]: update anatomy attributes ([8a37bbd](https://github.com/qualcomm/qualcomm-ui/commit/8a37bbd))

### Bug Fixes

- [floating-ui]: parameterize arrow selector for namespaced anatomies ([2176a41](https://github.com/qualcomm/qualcomm-ui/commit/2176a41))

### Miscellaneous Chores

- upgrade prettier and eslint dependenies, fix resulting formatting issues ([332185a](https://github.com/qualcomm/qualcomm-ui/commit/332185a))
- unify direction type ([3f1c43e](https://github.com/qualcomm/qualcomm-ui/commit/3f1c43e))
- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/dom]

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
