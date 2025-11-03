# @qualcomm-ui/eslint-config-angular

## 7.0.0

October 8th, 2025

- breaking: separated plugin declarations from rules
- breaking: updated dependencies and min peerDependency versions

## 6.0.0

May 6th, 2025

- Breaking: updated dependencies to support eslint v9.

## 5.0.0

January 23rd, 2025

- breaking (Angular): the minimum required Angular eslint version is now v19.
- feat (Angular): added rules to enforce input, output, and query signals.

## 4.0.0

November 20th, 2024

- breaking (Angular): the minimum required Angular eslint are now v18

## 3.2.0

November 2nd, 2024

- feat: update dependencies: `eslint-config-prettier` and `eslint-plugin-mdx`.

## 3.1.0

April 9th, 2024

- `@Component()` classes may now end with `Directive`.

## 3.0.0

March 11th, 2024

- breaking (prettier): Updated prettier peerDependency version to v3.

## 2.1.0

January 10th, 2024

- Added `template-attribute-order` opt-in config which enforces a predictable attribute order. Usage:

  ```typescript
    {
      extends: [
        "@qualcomm-ui/eslint-config-angular/template-attribute-order",
      ],
      files: ["*.html"],
    },
  ```

## 2.0.0

November 10th, 2023

- Updated dependencies.

## 1.2.0

### Minor Changes

- Changed the @angular-eslint/no-input-rename to 'warn' until [this bug](https://github.com/angular-eslint/angular-eslint/issues/1446) is fixed.

## 1.1.0

- Disabled attribute-order rule pending fix. [See this](https://github.com/angular-eslint/angular-eslint/issues/1197).

## 1.0.0

June 1st, 2023

- First major release.
- Separate TypeScript/Template settings.

## 0.0.1

### Patch Changes

- angular eslint config
