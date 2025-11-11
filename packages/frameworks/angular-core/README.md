# @qualcomm-ui/angular-core

## Angular Library

This module uses ng-packagr to bundle the Angular dependencies into a library that's consumable by other projects.

### Entrypoints

- ng-packagr requires a primary entrypoint for every library. This is a fundamental limitation.
- This package defines every export within a secondary entrypoint, i.e. `@qualcomm-ui/angular-core/signals`.
- ng-packagr also requires a very specific folder structure (flat).

**Nuances and workarounds:**

- An empty primary entrypoint is defined in `src/index.ts`. This prevents ng-packagr from complaining about a missing primary entrypoint.
- Every secondary entrypoint is defined as a top-level folder in `src/`.
  - The name of the folder is the name of the secondary entrypoint.
    - Ex: a folder at `./src/signals` will expose its modules via `@qualcomm-ui/angular-core/signals`.
  - There is a single `index.ts` file in each folder that serves as the public API of the entrypoint (it exports all the public modules for the entrypoint).
  - A tsconfig path alias is used to make each secondary entrypoints available to other secondary entrypoints.
    - When importing other secondary entrypoints, use the alias. DO NOT use relative paths, otherwise it will create a separate bundle for the imported entrypoint.
    - the ng-packagr build process will fail if circular dependencies are detected.
