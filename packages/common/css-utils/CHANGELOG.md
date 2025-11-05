# @qualcomm-ui/css-utils

## 2.3.1

June 30th, 2025

- fix: PostCSS plugin configuration fixed, no longer duplicates CSS in watch mode.

## 2.3.0

June 22nd, 2025

- feat: add configuration parameter for supplying chokidar watch options.

## 2.2.0

June 21st, 2025

- feat: added `changed-only` log mode.
- feat: `aggregate-only` log mode no longer logs the changed files.

## 2.1.0

May 20th, 2025

- feat: `name` and `workingDir` are now optional in `CssUtilsConfig`.
- fix: `watchOptions.buildOnInit` and `watchOptions.cache` now default to `true`.

## 2.0.0

May 20th, 2025

- breaking: `WatchCssOptions.srcRoot` has been removed.
- breaking: `BuildCssOptions` has been renamed to `CssBuilderConfig`.
- breaking: removed `WatchCssOptions`. Moved all watch mode configuration to `CssBuilderConfig.watchOptions`.
- feat: added cli with config file resolution.

## 1.1.1

May 9th, 2025

- fix: filepath operations now account for Windows path separators.

## 1.1.0

November 2nd, 2024

- feat: the package's dependencies are now bundled into the built JS.
- fix: remove devDependencies from package.json before publishing.
- fix (package.json): removed the `exports` field in favor of main/module/types.

## 1.0.3

July 10th, 2024

- Loosened the peer dependencies for `@qualcomm-ui` packages.

## 1.0.2

June 23rd, 2024

- dev: updated tsconfigs.

## 1.0.1

May 26th, 2024

- fix: added missing `postcss-scss` dependency.
- fix: the watch script now factors in the `ignore` property for each file group.
- fix: source file changes (non-css) will no longer trigger a CSS build in `vite build -w` mode.

## 1.0.0

May 22nd, 2024

- Initial release.
