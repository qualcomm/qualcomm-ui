# @qualcomm-ui/mdx-docs-common

## 4.0.0

March 24th, 2025

- breaking (docs-plugin): update `SiteData` interface to use the new `PageDocProps` type, which requires an id for every prop type entry
- feat (docs-plugin): add new types `PagePropType`, `PagePropTypes`, and `PageDocProps` for extended documentation properties

## 3.0.4

- Updated dependencies: `@qualcomm-ui/typedoc-common`

## 3.0.1

December 12th, 2024

- Updated dependencies: `@qualcomm-ui/typedoc-common`

## 3.0.0

December 4th, 2024

- breaking (DocsPlugin): Changed the import from `QuiReactPropTypes` to `QuiPropTypes` and updated the `pageDocProps` type accordingly.

## 2.4.0

October 30th, 2024

- feat: `@qualcomm-ui/typedoc-common` is now a dependency.
- feat: Change import source of `QuiReactPropTypes` to use `@qualcomm-ui/typedoc-common`.
- feat: Add new file to re-export types from `@qualcomm-ui/typedoc-common` for backwards compatibility.

## 2.3.0

August 1st, 2024

- feat (NavItem): added the `separator` and `sectionTitle` properties.
- fix (NavItem): adjusted the `restricted` property for clarity.

## 2.2.3

July 10th, 2024

- Loosened the peer dependencies for `@qui` packages.

## 2.2.2

July 9th, 2024

- dev: updated tsconfigs.

## 2.2.1

June 28th, 2024

- fix (DocsFrontmatter): clarified the functionality of the `restricted` property.

## 2.2.0

June 26th, 2024

- feat (PageSectionContent): added `tagName` property.

## 2.1.0

June 26th, 2024

- feat: added search utilities.

## 2.0.0

June 23rd, 2024

- breaking: `IndexedPage` has been renamed to `PageSection` for clarity.
- breaking: removed `IndexedHtmlContent` type (was unused).
- feat: moved QUI TypeDoc types from internal package to this package in preparation for the public publishing of the typedoc parser.

## 1.2.0

June 19th, 2024

- feat: updated JSDoc types.
- feat: renamed `AppFrontmatter` to `DocsFrontmatter`. The `AppFrontmatter` type alias is still available.
- feat: added properties to `DocsFrontmatter`: `hidden`, `hidePageLinks`, `hideSideNav`.

## 1.1.0

June 10th, 2024

- feat: RouteMeta can now be provided as an array.

## 1.0.0

May 27th, 2024

- Initial release.
