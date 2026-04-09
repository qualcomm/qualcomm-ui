# @qualcomm-ui/angular Changelog

## 2.3.0

Apr 7th, 2026

### Features

- [stepper]: add angular stepper component ([16856bf](https://github.com/qualcomm/qualcomm-ui/commit/16856bf))

### Tests

- [stepper]: add stepper tests ([bc6da98](https://github.com/qualcomm/qualcomm-ui/commit/bc6da98))

### Miscellaneous Chores

- simplify angular test configuration ([50dd356](https://github.com/qualcomm/qualcomm-ui/commit/50dd356))
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 2.2.2

Apr 6th, 2026

### Bug Fixes

- update changelog links ([78aca35](https://github.com/qualcomm/qualcomm-ui/commit/78aca35))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 2.2.1

Apr 2nd, 2026

### Miscellaneous Chores

- [angular]: configure tsconfigPaths project in vitest ([77da531](https://github.com/qualcomm/qualcomm-ui/commit/77da531))
- upgrade to vite v8 and bump dependencies ([18596c5](https://github.com/qualcomm/qualcomm-ui/commit/18596c5))
- **deps:** update dependencies [@qualcomm-ui/angular-core, @qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/qds-core]

## 2.2.0

Mar 30th, 2026

### Features

- [icon-button]: add shape prop ([9c93d49](https://github.com/qualcomm/qualcomm-ui/commit/9c93d49))

### Bug Fixes

- [badge]: update tokens and apply text-box cap-to-baseline ([9804845](https://github.com/qualcomm/qualcomm-ui/commit/9804845))
- [alert-banner]: use compact icon button for close action ([74d1316](https://github.com/qualcomm/qualcomm-ui/commit/74d1316))
- [tag]: update tokens and apply text-box cap-to-baseline ([3f94cdf](https://github.com/qualcomm/qualcomm-ui/commit/3f94cdf))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 2.1.1

Mar 25th, 2026

### Bug Fixes

- [select]: make disclosure indicator inert ([012754b](https://github.com/qualcomm/qualcomm-ui/commit/012754b))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 2.1.0

Mar 24th, 2026

### Features

- [tag]: deprecate radius prop in favor of shape and add new colors ([b6aa6ae](https://github.com/qualcomm/qualcomm-ui/commit/b6aa6ae))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 2.0.2

Mar 20th, 2026

### Bug Fixes

- [side-nav]: set filter input wrapper element role to treeitem ([68efb90](https://github.com/qualcomm/qualcomm-ui/commit/68efb90))
- [side-nav]: set divider role to presentation and remove aria-orientation ([2d8d54e](https://github.com/qualcomm/qualcomm-ui/commit/2d8d54e))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/angular-core, @qualcomm-ui/utils, @qualcomm-ui/qds-core]

## 2.0.1

Mar 12th, 2026

### Tests

- [combobox]: add regression tests ([c60ba2f](https://github.com/qualcomm/qualcomm-ui/commit/c60ba2f))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 2.0.0

Mar 10th, 2026

### BREAKING CHANGES

- [angular]: bump peer dependency minimums for angular to >=21.2 and update typescript/lucide ranges ([530268d](https://github.com/qualcomm/qualcomm-ui/commit/530268d))

### Bug Fixes

- [angular]: update monorepo angular-core dist path pattern in tsconfig.lib.json ([52c65ad](https://github.com/qualcomm/qualcomm-ui/commit/52c65ad))

### Code Refactoring

- [angular]: remove @testing-library/angular from tsconfig types and add types.d.ts file reference ([5d730e8](https://github.com/qualcomm/qualcomm-ui/commit/5d730e8))

### Miscellaneous Chores

- [angular]: upgrade @testing-library/angular to v19 and remove unused test deps ([c6015fc](https://github.com/qualcomm/qualcomm-ui/commit/c6015fc))
- **deps:** update dependencies [@qualcomm-ui/angular-core, @qualcomm-ui/core, @qualcomm-ui/qds-core]

## 1.20.0

Feb 26th, 2026

### Features

- [tokens]: add persistent disabled state tokens for black/white variants
- [tokens]: add track-default and disabled-handle/track-fill tokens
- [tokens]: update design tokens to latest version

### Styles

- [tokens]: simplify neutral color scale from 10 to 5 levels

### Code Refactoring

- [slider]: simplify disabled state styling with new tokens

### Bug Fixes

- [switch]: use interactive icon tokens for thumb states

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.19.0

Feb 24th, 2026

### Features

- progress[-bar] disabled

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/angular-core]

## 1.18.0

Feb 13th, 2026

### Features

- feat(link): add `brand` and `white-persistent` emphasis

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.17.0

Feb 11th, 2026

### Features

- alert banner
- [select]: add checkbox option

### Bug Fixes

- [avatar]: `variant` should be `emphasis`
- inline notification

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.16.0

Jan 30th, 2026

### Features

- [radio]: hint at item level

### Bug Fixes

- [radio]: group hint + CSS fixes
- [switch]: hint text
- [checkbox]: hint text

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.15.1

Jan 29th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.15.0

Jan 27th, 2026

### Features

- [tag]: add color emphasis and update CSS

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.14.0

Jan 23rd, 2026

### Features

- [header-bar]: add padding prop

### Code Refactoring

- [types]: use accurate function types

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/angular-core, @qualcomm-ui/qds-core, @qualcomm-ui/utils]

## 1.13.1

Jan 19th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.13.0

Jan 17th, 2026

### Features

- add lg switch size

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.12.0

Jan 15th, 2026

### Features

- add indented radio group variant

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.11.4

Dec 24th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.11.3

Dec 22nd, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.11.2

Dec 18th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.11.1

Dec 15th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.11.0

Dec 11th, 2025

### Features

- [text-area]: add component

### Bug Fixes

- [slider]: show error indicator icon when invalid

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/angular-core]

## 1.10.1

Dec 10th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.10.0

Dec 8th, 2025

### Features

- [menu]: add menu-item label directive

### Bug Fixes

- [header-bar-action-icon-button]: track bindings after init

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.9.2

Dec 5th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.9.1

Dec 4th, 2025

### Miscellaneous Chores

- [peer-dependencies]: loosen `@angular/*` version range restrictions
- **deps:** update dependencies [@qualcomm-ui/angular-core]

## 1.9.0

Dec 3rd, 2025

### Features

- [side-nav]: add side-nav component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/angular-core, @qualcomm-ui/qds-core]

## 1.8.1

Dec 3rd, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/angular-core, @qualcomm-ui/utils]

## 1.8.0

Dec 1st, 2025

### Features

- [tree]: add tree module

### Code Refactoring

- [merge-props]: use shared implementation from utils package

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/angular-core, @qualcomm-ui/qds-core, @qualcomm-ui/core]

## 1.7.2

Dec 1st, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.7.1

Nov 30th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.7.0

Nov 30th, 2025

### Features

- angular header-bar

### Bug Fixes

- context token providers in nav-item
- use buttons QDS props rather than extending them

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.6.0

Nov 30th, 2025

### Features

- wire highlightMatchingText in angular combobox

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/angular-core]

## 1.5.0

Nov 25th, 2025

### Features

- [table-column-filter-action]: loosen type guards, add inputs for filter state

### Documentation

- [table-row-expand-button]: adjust jsdoc comment
- [table-row-expand-button]: add missing jsdoc comment

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/angular-core]

## 1.4.0

Nov 24th, 2025

### Features

- add badge component

### Bug Fixes

- remove useless context, fix doc

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.3.3

Nov 23rd, 2025

### Bug Fixes

- [icon]: use correct docs site url in error message

## 1.3.2

Nov 21st, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/angular-core]

## 1.3.1

Nov 19th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core]

## 1.3.0

Nov 18th, 2025

### Features

- [pagination]: add page-buttons-directive shortcut

### Miscellaneous Chores

- [pagination]: use updated qds api
- **deps:** update dependencies [@qualcomm-ui/angular-core, @qualcomm-ui/qds-core, @qualcomm-ui/core]

### Bug Fixes

- [table-pagination]: add missing provider

## 1.2.1

Nov 17th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.2.0

Nov 17th, 2025

### Features

- [theme]: simplified theme provider setup and cookie parsing
- [TableRowExpandButton]: add isExpanded prop for row expansion state updates
- [theme]: add theme provider with CSR and SSR theme support
- add preload directive for disabling transitions until after view init

### Bug Fixes

- [combobox]: add missing ssr guards
- [password-input-visibility-trigger]: add preload styles
- [transitions]: disable element transition styles until after view init

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/angular-core]

## 1.1.1

Nov 15th, 2025

### Build System

- use fesm format

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/angular-core]

## 1.1.0

Nov 14th, 2025

### Features

- add kbd shortcut component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/angular-core]

## 1.0.2

Nov 14th, 2025

### Bug Fixes

- document getRootNode for SSR machine actions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/qds-core, @qualcomm-ui/angular-core]

## 1.0.1

Nov 13th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/angular-core, @qualcomm-ui/core, @qualcomm-ui/qds-core]
