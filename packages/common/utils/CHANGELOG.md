# @qualcomm-ui/utils Changelog

## 1.4.0

Aug 18th, 2026

### Features

* [listbox]: add listbox core api and utilities ([e7502d6](https://github.com/qualcomm/qualcomm-ui/commit/e7502d6))

### Code Refactoring

* [filter]: prefer locale-aware substring matches ([6cd18e0](https://github.com/qualcomm/qualcomm-ui/commit/6cd18e0))

## 1.3.3

Aug 16th, 2026

### Bug Fixes

- [machine]: add type polyfill for TS 6 compat ([70acec1](https://github.com/qualcomm/qualcomm-ui/commit/70acec1))

### Code Refactoring

- [types]: support TS 6.0 ([4ed7651](https://github.com/qualcomm/qualcomm-ui/commit/4ed7651))

## 1.3.2

Jun 10th, 2026

### Styles

- apply lint updates ([6245b86](https://github.com/qualcomm/qualcomm-ui/commit/6245b86))

### Bug Fixes

- properly account for index in forEach refactor ([eaf76b1](https://github.com/qualcomm/qualcomm-ui/commit/eaf76b1))

### Code Refactoring

- support nodenext resolution ([a4055d1](https://github.com/qualcomm/qualcomm-ui/commit/a4055d1))

## 1.3.1

Jun 3rd, 2026

### Miscellaneous Chores

- clean up dependencies and remove legacy build scripts ([961e1bb](https://github.com/qualcomm/qualcomm-ui/commit/961e1bb))
- migrate to vite for library bundling ([2216473](https://github.com/qualcomm/qualcomm-ui/commit/2216473))

## 1.3.0

May 14th, 2026

### Features

- [file-upload]: add shared file upload primitives ([c6f26f5](https://github.com/qualcomm/qualcomm-ui/commit/c6f26f5))

## 1.2.4

May 1st, 2026

### Code Refactoring

- [tree]: use replaceChildren instead of manual node spread in expandBranches ([4dc7f37](https://github.com/qualcomm/qualcomm-ui/commit/4dc7f37))

## 1.2.3

Apr 19th, 2026

### Code Refactoring

- [anatomy]: update anatomy attributes ([b9cda23](https://github.com/qualcomm/qualcomm-ui/commit/b9cda23))

### Miscellaneous Chores

- upgrade prettier and eslint dependenies, fix resulting formatting issues ([332185a](https://github.com/qualcomm/qualcomm-ui/commit/332185a))

## 1.2.2

Apr 2nd, 2026

### Code Refactoring

- [machine]: support narrowed guards in createNarrowedMachine ([cf79dbf](https://github.com/qualcomm/qualcomm-ui/commit/cf79dbf))
- [attributes]: accept null in booleanDataAttr and booleanAriaAttr ([8c702bb](https://github.com/qualcomm/qualcomm-ui/commit/8c702bb))
- [object]: add maybeAccess and deprecate getIn ([f4cea5a](https://github.com/qualcomm/qualcomm-ui/commit/f4cea5a))

## 1.2.1

Mar 20th, 2026

### Bug Fixes

- [utils]: change booleanAriaAttr falseValue to use null instead of undefined ([23834ab](https://github.com/qualcomm/qualcomm-ui/commit/23834ab))

## 1.2.0

Mar 12th, 2026

### Features

- [utils]: add getIn helper for safe property access on union types ([c53da73](https://github.com/qualcomm/qualcomm-ui/commit/c53da73))
- [utils]: add narrowed machine action types and createNarrowedMachine ([0827a29](https://github.com/qualcomm/qualcomm-ui/commit/0827a29))

### Documentation

- [utils]: add NARROWED_ACTIONS.md explaining narrowed action event types ([0827a29](https://github.com/qualcomm/qualcomm-ui/commit/0827a29))

## 1.1.0

Dec 10th, 2025

### Features

- [attributes]: add ComponentDataAttributes utility type

## 1.0.4

Dec 1st, 2025

### Bug Fixes

- [merge-props]: loosen merged className type for union compatibility

## 1.0.3

Nov 13th, 2025

### Bug Fixes

- add stub ts files for npm ts badge

## 1.0.2

Nov 12th, 2025

### Bug Fixes

- react readme url

## 1.0.1

Nov 12th, 2025

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
