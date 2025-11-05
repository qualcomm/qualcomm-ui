# @qualcomm-ui/eslint-config-typescript

## 12.0.0

October 8th, 2025

- removed `configGroups` output. Configs are now stored on the `configs` property
- grouped common configs into `recommended`
- individual configs are now available directly via `configs.<name>`

## 11.0.0

July 21st, 2025

- breaking (style-guide): added comment-spacing rules via `@stylistic/eslint-plugin`.

## 10.1.1

July 9th, 2025

- fix (config): the `typeCheckedStrictPerformance` config group now contains the `performance` config as expected.

## 10.1.0

- feat: replaced `no-duplicate-imports` with `import/no-duplicates`. This error is now autofixed.
- feat: added `configGroups` output for applying groups of configurations.

## 10.0.0

May 6th, 2025

- Breaking: updated dependencies to support eslint v9.

## 9.0.0

- breaking: renamed `no-interface-prefix` to `strict-naming-convention`.
- feat: added `strict-performance` config.
- chore: update dependencies.

## 8.1.0

September 13th, 2024

- Added the `no-interface-prefix` config, which should be adopted for new projects.

## 8.0.0

June 16th, 2024

- breaking: updated minimum eslint version to 8.57.0
- updated @typescript-eslint dependencies.

## 7.0.0

March 11th, 2024

- breaking (prettier): Updated prettier peerDependency version to v3.

## 6.2.1

February 9th, 2024

- Removed `no-object-constructor` rule which was causing eslint runtime errors when set to `"error"`.

## 6.2.0

February 5th, 2024

- Removed the interface rules for the `@typescript-eslint/naming-convention` to account for API responses from external sources (i.e. those that are out of our control).

## 6.1.0

January 22nd, 2024

- The `@typescript-eslint/naming-convention` rule has been loosened to allow for `I` prefix on interfaces. Many of our teams were using this approach.

## 6.0.1

January 10th, 2024

- Fixed the `import-order` order detection for deeply nested internal modules.

## 6.0.0

January 9th, 2024

The eslint configuration has been divided into three separate modules:

- @qualcomm-ui/eslint-config-typescript/naming-convention
  - Enforces the naming style of the TypeScript conventions.
- @qualcomm-ui/eslint-config-typescript/recommended
  - Additional configuration options but more opinionated; rbower's recommended setup.
- @qualcomm-ui/eslint-config-typescript/style-guide
  - Style guide enforcing the TypeScript conventions.

## 5.0.0

January 4th, 2024

Added the following rules:

- `"@typescript-eslint/explicit-member-accessibility"`
- `no-useless-concat`

## 4.0.0

November 10th, 2023

- Updated dependencies.

## 3.0.0

### Major Changes

- disabling no-undef

## 2.0.0

- eqeqeq rule adjusted to allow for `==` check on null values.

## 1.3.0

June 1st, 2023

- Moved eslint to peerDependencies.
- Added comment-length plugin.

## 1.2.0

### Minor Changes

- Added object-shorthand rule

## 1.1.0

### Minor Changes

- import order adjustment

## 1.0.0

### Major Changes

- typescript eslint config major release

## 0.0.7

### Patch Changes

- added react eslint config

## 0.0.6

### Patch Changes

- adjusting eslint config\

## 0.0.5

### Patch Changes

- fixed config

## 0.0.4

### Patch Changes

- fixed rules config

## 0.0.3

### Patch Changes

- fixed eslint config env

## 0.0.2

### Patch Changes

- fixed env

## 0.0.1

### Patch Changes

- initial configuration
