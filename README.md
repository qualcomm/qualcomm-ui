![NPM Downloads](https://img.shields.io/npm/dw/%40qualcomm-ui%2Fcore)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/qualcomm/qualcomm-ui)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-pr-closed/qualcomm/qualcomm-ui)
<a href="https://github.com/qualcomm/qualcomm-ui/actions/workflows/code-quality.yml">
<img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/qualcomm/qualcomm-ui/code-quality.yml">
</a>

<a target="_blank" href="https://react.qui.qualcomm.com" style="text-decoration: none">
  <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Freact.qui.qualcomm.com&up_message=online&label=React%20Docs">
</a>

<a target="_blank" href="https://angular.qui.qualcomm.com" style="text-decoration: none">
  <img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fangular.qui.qualcomm.com&up_message=online&label=Angular%20Docs">
</a>

# Qualcomm UI (QUI)

QUI is a collection of high-quality, reusable UI components that can be used to build beautiful and responsive web applications. It features a cross-framework core layer for unification of styling and behavior, as well as framework adapters for React and Angular.

- [React documentation](https://react.qui.qualcomm.com/)
- [Angular documentation](https://angular.qui.qualcomm.com/)

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

- It's generally a good idea to run `pnpm build` if you've just pulled from the main branch.
- `pnpm dev` will run the dev script in every package except for documentation sites. I recommend using the filter option with `...`:
  - `pnpm dev --filter @qualcomm-ui/react...`
  - `pnpm dev --filter @qualcomm-ui/angular...`
- `pnpm react-docs dev` will start the React documentation site.
- `pnpm angular-docs dev` will start the Angular documentation site.
- `pnpm doc-gen` will generate the TypeScript JSON documentation for all packages.

## Development

TODO: add contribution guidelines

## Getting in Contact

- [Report an Issue on GitHub](../../issues)
- [Open a Discussion on GitHub](../../discussions)

## License

_QUI_ is licensed under the [BSD-3-Clause-Clear License](https://spdx.org/licenses/BSD-3-Clause-Clear.html). See [LICENSE.txt](LICENSE.txt) for the full license text.
