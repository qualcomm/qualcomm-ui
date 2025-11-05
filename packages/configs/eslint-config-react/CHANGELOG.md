# @qualcomm-ui/eslint-config-react

## 9.0.0

Oct 8th, 2025

- updated react-hooks dependencies
- added reactCompiler config
- breaking: separated plugin declarations from rules

## 8.0.0

May 6th, 2025

- Breaking: updated dependencies to support eslint v9.

## 7.0.0

January 2nd, 2025

- breaking: the `recommended` config has been merged into the main config to align with React 19 conventions. The `recommended` config is now deprecated.
- breaking: updated `eslint-plugin-react-hooks` from v4 to v5 which may introduce breaking changes in specific situations.

## 6.0.0

June 16th, 2024

- breaking: updated minimum eslint version to 8.57.0.
- feat: added optional "recommended" config which enforces no React default exports.

## 5.0.0

February 29th, 2024

- breaking: Adjusted `react/jsx-curly-brace-presence` rule. Brackets are now removed from string properties.

## 4.0.0

January 4th, 2024

- Removed dependency on `@qualcomm-ui/eslint-config-typescript`

## 3.1.0

November 10th, 2023

- Updated dependencies.

## 3.0.0

November 6th, 2023

- Added `react/self-closing-comp` and set to `["error", {component: true, html: false}]`

## 2.0.1

### Patch Changes

- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@3.0.0

## 2.0.0

- Added `react/jsx-boolean-value` and set to `["error", "never"]`

## 1.1.0

- Moved eslint to peerDependencies.

### Patch Changes

- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@1.3.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@1.2.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@1.1.0

## 1.0.0

### Major Changes

- react eslint release

## 0.0.2

### Patch Changes

- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@1.0.0

## 0.0.1

### Patch Changes

- added react eslint config
- Updated dependencies
  - @qualcomm-ui/eslint-config-typescript@0.0.7
