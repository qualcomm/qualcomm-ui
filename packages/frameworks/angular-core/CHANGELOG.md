# @qualcomm-ui/angular-core Changelog

## 3.3.0

Sep 2nd, 2026

### Features

* [select]: add item group support ([323ce37](https://github.com/qualcomm/qualcomm-ui/commit/323ce37))

## 3.2.0

Aug 30th, 2026

### Features

* [date-picker]: add the Angular date picker ([bee0c27](https://github.com/qualcomm/qualcomm-ui/commit/bee0c27))

### Bug Fixes

* [machine]: keep the api context view instead of rebuilding it ([3998313](https://github.com/qualcomm/qualcomm-ui/commit/3998313))
* proper positioning defaults in components and JSDoc ([cb9973e](https://github.com/qualcomm/qualcomm-ui/commit/cb9973e))
* [angular-core]: drop accessSignal falsy guard ([c099586](https://github.com/qualcomm/qualcomm-ui/commit/c099586))
* [machine]: only clear an element id when it is still the registered one ([19d0b82](https://github.com/qualcomm/qualcomm-ui/commit/19d0b82))
* [forms]: flush the pending value when a child part reports blur ([1b8fc61](https://github.com/qualcomm/qualcomm-ui/commit/1b8fc61))

### Miscellaneous Chores

* **deps:** update dependencies [@qualcomm-ui/core@1.13.0, @qualcomm-ui/utils@1.5.0, @qualcomm-ui/dom@1.3.0]

## 3.1.0

Aug 18th, 2026

### Features

* [listbox]: add listbox core api and utilities ([e7502d6](https://github.com/qualcomm/qualcomm-ui/commit/e7502d6))

### Miscellaneous Chores

* **deps:** update dependencies [@qualcomm-ui/core@1.12.0, @qualcomm-ui/dom@1.2.0, @qualcomm-ui/utils@1.4.0]

## 3.0.0

Aug 16th, 2026

### BREAKING CHANGES

- migrate to TS 6.0, update lucide-angular to @lucide/angular ([fb20318](https://github.com/qualcomm/qualcomm-ui/commit/fb20318))

### Code Refactoring

- [types]: support TS 6.0 ([4ed7651](https://github.com/qualcomm/qualcomm-ui/commit/4ed7651))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils@1.3.3, @qualcomm-ui/core@1.11.8, @qualcomm-ui/dom@1.1.6]

## 2.4.8

Aug 6th, 2026

### Bug Fixes

- [track-bindings]: handle spaces in class property ([46baae6](https://github.com/qualcomm/qualcomm-ui/commit/46baae6))

## 2.4.7

Jul 28th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core@1.11.7]

## 2.4.6

Jul 1st, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom@1.1.5, @qualcomm-ui/core@1.11.6]

## 2.4.5

Jun 10th, 2026

### Styles

- apply lint updates ([2e1d59d](https://github.com/qualcomm/qualcomm-ui/commit/2e1d59d))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils@1.3.2, @qualcomm-ui/dom@1.1.4, @qualcomm-ui/core@1.11.5]

## 2.4.4

Jun 5th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core@1.11.4]

## 2.4.3

Jun 3rd, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/dom, @qualcomm-ui/utils]

## 2.4.2

Jun 1st, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.4.1

May 29th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.4.0

May 22nd, 2026

### Features

- [text-input]: support aria labels ([cc0b8b6](https://github.com/qualcomm/qualcomm-ui/commit/cc0b8b6))
- [checkbox]: support aria labels ([c2e484c](https://github.com/qualcomm/qualcomm-ui/commit/c2e484c))
- [password-input]: support aria labels ([3fb240c](https://github.com/qualcomm/qualcomm-ui/commit/3fb240c))
- [number-input]: support aria labels ([cf182d6](https://github.com/qualcomm/qualcomm-ui/commit/cf182d6))
- [switch]: support aria labels ([0eb172a](https://github.com/qualcomm/qualcomm-ui/commit/0eb172a))
- [radio]: support aria labels ([b603e42](https://github.com/qualcomm/qualcomm-ui/commit/b603e42))
- [select]: support aria labels ([e6f41e1](https://github.com/qualcomm/qualcomm-ui/commit/e6f41e1))
- [combobox]: support aria labels ([cfaa97b](https://github.com/qualcomm/qualcomm-ui/commit/cfaa97b))

### Bug Fixes

- [angular-core/use-id]: hash collision ([dd06a6e](https://github.com/qualcomm/qualcomm-ui/commit/dd06a6e))

### Miscellaneous Chores

- update pnpm and test dependencies ([b175d6a](https://github.com/qualcomm/qualcomm-ui/commit/b175d6a))
- **deps:** update dependencies [@qualcomm-ui/core]

## 2.3.0

May 14th, 2026

### Features

- [file-upload]: add framework core bindings ([fcec116](https://github.com/qualcomm/qualcomm-ui/commit/fcec116))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.2.2

May 7th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.2.1

May 1st, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.2.0

May 1st, 2026

### Features

- [angular/menu]: add item-description + checkbox/radio item-control directives ([94a59a2](https://github.com/qualcomm/qualcomm-ui/commit/94a59a2))

### Bug Fixes

- [angular-core/popover]: make defaultOpen a boolean attribute ([e7d7d22](https://github.com/qualcomm/qualcomm-ui/commit/e7d7d22))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.1.3

Apr 29th, 2026

### Bug Fixes

- [menu]: support disabled state for all item variants ([a55faf1](https://github.com/qualcomm/qualcomm-ui/commit/a55faf1))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.1.2

Apr 19th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/core]

## 2.1.1

Apr 19th, 2026

### Miscellaneous Chores

- upgrade prettier and eslint dependenies, fix resulting formatting issues ([332185a](https://github.com/qualcomm/qualcomm-ui/commit/332185a))
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.1.0

Apr 7th, 2026

### Features

- [stepper]: add angular stepper component ([16856bf](https://github.com/qualcomm/qualcomm-ui/commit/16856bf))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 2.0.4

Apr 2nd, 2026

### Miscellaneous Chores

- upgrade to vite v8 and bump dependencies ([18596c5](https://github.com/qualcomm/qualcomm-ui/commit/18596c5))
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.0.3

Mar 25th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/dom]

## 2.0.2

Mar 20th, 2026

### Bug Fixes

- [side-nav]: add missing tree bindings for accessibility ([1039fef](https://github.com/qualcomm/qualcomm-ui/commit/1039fef))

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.0.1

Mar 12th, 2026

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 2.0.0

Mar 10th, 2026

### BREAKING CHANGES

- [angular-core]: bump peer dependency minimums for angular to >=21.2 and update typescript/lucide ranges ([f28d14c](https://github.com/qualcomm/qualcomm-ui/commit/f28d14c))

### Code Refactoring

- [angular-core]: remove @testing-library/angular from tsconfig types and add test utils path ([710816d](https://github.com/qualcomm/qualcomm-ui/commit/710816d))

### Miscellaneous Chores

- [angular-core]: upgrade @testing-library/angular to v19 and remove unused test deps ([8e0bf63](https://github.com/qualcomm/qualcomm-ui/commit/8e0bf63))
- **deps:** update dependencies [@qualcomm-ui/core]

### Tests

- [angular-core]: add spec for accessSignal utility ([a8219c3](https://github.com/qualcomm/qualcomm-ui/commit/a8219c3))

## 1.6.0

Feb 24th, 2026

### Features

- progress[-bar] disabled

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.5.0

Jan 30th, 2026

### Features

- [radio]: hint at item level

### Bug Fixes

- [radio]: group hint + CSS fixes
- [switch]: hint text
- [checkbox]: hint text

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.4.2

Jan 23rd, 2026

### Code Refactoring

- replace Function type usage
- remove async from sync functions
- [types]: use accurate function types

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/dom, @qualcomm-ui/utils]

## 1.4.1

Dec 24th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.4.0

Dec 11th, 2025

### Features

- [text-area]: add component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.3.3

Dec 10th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/utils, @qualcomm-ui/dom]

## 1.3.2

Dec 5th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.3.1

Dec 4th, 2025

### Miscellaneous Chores

- [peer-dependencies]: loosen `@angular/*` version range restrictions

## 1.3.0

Dec 3rd, 2025

### Features

- [side-nav]: add side-nav component

## 1.2.0

Dec 1st, 2025

### Features

- [tree]: add core tree directives

### Bug Fixes

- [merge-props]: loosen merged className type for union compatibility

### Code Refactoring

- [merge-props]: use shared implementation from utils package
- [core-tooltip]: loosen member variable access modifiers

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils, @qualcomm-ui/core, @qualcomm-ui/dom]

## 1.1.1

Dec 1st, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.1.0

Nov 30th, 2025

### Features

- wire highlightMatchingText in angular combobox

## 1.0.6

Nov 25th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core]

## 1.0.5

Nov 18th, 2025

### Miscellaneous Chores

- [pagination]: use updated qds api
- **deps:** update dependencies [@qualcomm-ui/core]

## 1.0.4

Nov 17th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom, @qualcomm-ui/core]

## 1.0.3

Nov 15th, 2025

### Build System

- use fesm format

## 1.0.2

Nov 14th, 2025

### Bug Fixes

- document getRootNode for SSR machine actions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/dom]

## 1.0.1

Nov 13th, 2025

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/qds-core]
