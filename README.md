# QUI

QUI is a collection of high-quality, reusable UI components that can be used to build beautiful and responsive web applications. It features a cross-framework core layer for unification of styling and behavior, as well as framework adapters for React and Angular.

- [React documentation](https://react-next.qui.aws.qualcomm.com/)
- [Angular documentation](https://angular-next.qui.qualcomm.com/)

## Branches

**main**: Primary development branch. Contributors should develop submissions based on this branch, and submit pull requests to this branch.

## Requirements

- [Node.js](https://nodejs.org/en) `^20.19.0 || ^22.12.0 || ^24.0.0`
- [pnpm](https://pnpm.io/installation#using-corepack)
    - Do not install pnpm globally. Use [Corepack](https://pnpm.io/installation#using-corepack)
    - Use corepack to install the version in the root `package.json` `packageManager` field:
        - `corepack enable pnpm` (you only need to do this once for the version of node that you're using)

## Installation Instructions

```shell
pnpm i
```

## Usage

- `pnpm dev` will run the dev script in every package except for documentation sites. I recommend using the filter option with `...`:
    - `pnpm dev --filter @qui/react...`
    - `pnpm dev --filter @qui/angular...`
- `pnpm react-docs dev` will start the React documentation site.
- `pnpm angular-docs dev` will start the Angular documentation site.
- `pnpm doc-gen` will generate the TypeScript JSON documentation for all packages.

## Development

TODO: insert link to contribution documentation

## Getting in Contact

* [Report an Issue on GitHub](../../issues)
* [Open a Discussion on GitHub](../../discussions)

## License

*QUI* is licensed under the [BSD-3-Clause-Clear License](https://spdx.org/licenses/BSD-3-Clause-Clear.html). See [LICENSE.txt](LICENSE.txt) for the full license text.

