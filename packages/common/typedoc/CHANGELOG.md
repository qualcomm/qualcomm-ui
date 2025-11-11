# @qualcomm-ui/typedoc

## TBD

- breaking (cli): the CLI is now ESM only.
- chore: the following packages are now peerDependencies:
  - `@commander-js/extra-typings`,
  - `cosmiconfig`

## 2.4.1

April 16th, 2025

- fix (type-formatter): fix const enum formatting

## 2.4.0

April 15th, 2025

- feat (typedoc): add watch command and file watching functionality
- feat (type-parser): improve TypeParser initialization and option handling
- feat (config): add synchronous config loading and TypeScript config resolution
- feat (config): `outputFile` is now optional, defaults to `.typedoc/doc-props.json`
- feat (config): `typedocOptions.entryPoints` is now optional. If this property is omitted, entrypoints will be inferred from the tsconfig file

## 2.3.0

January 23rd, 2025

- feat (TypeParser): added support for Angular model input signals.

## 2.2.1

December 29th, 2024

- fix (InputSignal): `InputSignalWithTransform` is now handled properly.

## 2.2.0

December 22nd, 2024

- feat (TypeSerializer): added comment inheritance for class method arguments that resolve to a documented interface.

## 2.1.0

December 22nd, 2024

- feat (SerializedType): added `functionArgs` property with documented function parameters.
- feat (SerializedParameters): added a `referenceType` field that points to the resolved reference type.
- feat (TypeSerializer): improved the output of destructured class method parameters.
- fix (ParseTypes): fixed src file type resolution edge case.
- fix (config generator): corrected the documentation site link.

## 2.0.1

December 13th, 2024

- fix (printWidth): fixed incorrect printWidth setting in props builder.
- dev (printWidth): organized internal printWidth config.

## 2.0.0

December 4th, 2024

- breaking (Typedoc): Removed the `packageType` option from `BuildOptions` as it is no longer needed.
- breaking (ConfigTs): Removed the old config approach and its related functions, as configuration loading is now handled by `Cosmiconfig`.
- feat: Removed the `esbuild` external dependency from the package and build configuration. `esbuild` is no longer bundled for config file resolution.
- feat (TypedocCommon): Removed the `AngularUtils` and `ReactUtils` classes as they have been replaced with the `PropBuilder` class.
- feat (PackageJson): Added `cosmiconfig` to `devDependencies`. Configuration files are now resolved with this package instead of a custom solution using esbuild.
- feat (PropBuilder): Reworked the react-utils and angular-utils into a `PropBuilder` class to handle the creation of component properties. The parser can now handle mixed Angular and React types in the same configuration.
- feat (Cli): Changed the return type of the `build` action to a `Promise` with the value of the build result.
- feat (Config): Added a new `loadConfig` and `resolveConfig` functions using `cosmiconfig`.
- fix (PackageJson): Added the `--pool=threads` flag to the `test:unit:ci` script for `vitest` to fix CI test failures. This field was changed to `forks` by default in v2, which does not work in our Kubernetes cluster.
- dev (Build): Modified the `logLevel` to show `error` during watch mode.
- dev: Updated the `vitest` version to `^2.1.8`.
- dev: Added the `@angular/core` dependency to `devDependencies`.
- dev: Updated `@vitest/coverage-v8` and `@vitest/ui` to `^2.1.8`.

## 1.1.0

December 3rd, 2024

- feat (Build): Include `metafile` in build options for better insight into the build process.
- feat (Build): Removed `typedoc` exclusion from the CLI build to resolve issues with `npm`.
- feat (Turbo): Track changes in `scripts/*` directory for build invalidation.
- feat (Build): Update the ECMAScript target for the build from `es2017` to `es2020`.
- feat (Build): Ensure function `buildOrWatch` returns the result of `esbuild.build` when not in watch mode.
- fix (CLI): Add banner with shebang for CLI output file.

## 1.0.3

November 4th, 2024

- fix (TypeParser): removed extra log statement to reduce CLI clutter.

## 1.0.2

November 2nd, 2024

- fix (various): ESLint fixes to align with updated configuration.

## 1.0.1

October 30th, 2024

- fix: removed unused Typedoc plugins.

## 1.0.0

October 30th, 2024

- Public release.
