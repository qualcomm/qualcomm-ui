# @qualcomm-ui/codemod Changelog

## 1.1.0

Oct 30th, 2026

### Features

- add docs-context-names codemod ([985cad4](https://github.com/qualcomm/qualcomm-ui-utils/commit/985cad4))

### Tests

- update not-found-route expected message ([dc684a3](https://github.com/qualcomm/qualcomm-ui-utils/commit/dc684a3))

### Build System

- migrate package tsconfigs to nodenext and project references ([a565528](https://github.com/qualcomm/qualcomm-ui-utils/commit/a565528))

## 1.0.0

Oct 30th, 2026

### BREAKING CHANGES

- update codemod for latest qui-docs migration ([b8733ca](https://github.com/qualcomm/qualcomm-ui-utils/commit/b8733ca))

## 0.3.0

Jul 8th, 2026

### Features

- align with updated NextGen tailwind plugin ([058174f](https://github.com/qualcomm/qualcomm-ui-utils/commit/058174f))

### Tests

- fix node.js types ([d2ea7bb](https://github.com/qualcomm/qualcomm-ui-utils/commit/d2ea7bb))

## 0.2.4

Jun 23rd, 2026

### Build System

- support TypeScript 6.0 ([fccb8c7](https://github.com/qualcomm/qualcomm-ui-utils/commit/fccb8c7))

## 0.2.3

Jun 11th, 2026

### Code Refactoring

- support NodeNext moduleResolution ([b335d31](https://github.com/qualcomm/qualcomm-ui-utils/commit/b335d31))

## 0.2.2

Jun 7th, 2026

### Miscellaneous Chores

- update vite dependencies ([901d353](https://github.com/qualcomm/qualcomm-ui-utils/commit/901d353))

## 0.2.1 (2026/01/23)

### Code Refactoring

- improve logging and error handling
- remove async from sync functions

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/utils]

## 0.2.0 (2025/12/11)

### Features

- [codemod]: add qui-docs migration

### Bug Fixes

- [tailwind]: adjust replaced classNames

## 0.1.0

- initial experimental release with support for migrating the following legacy packages:
  - `@qui/tailwind-plugin` (limited to class strings and CSS `@apply`)
  - `@qui/react-router-utils`
