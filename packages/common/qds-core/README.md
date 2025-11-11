# @qualcomm-ui/qds-core

## Design Tokens

This library features a [utility script](./scripts/variable-parser.ts) that extracts design tokens from the [QDS Foundations Library](https://www.figma.com/design/jTaqbtJFlwmu8Ab8etvYeg) Figma file and assembles them into 6 separate CSS files:

- qualcomm (dark/light)
- snapdragon (dark/light)
- dragonwing (dark/light)

## Sync with latest

To sync with the latest version from Figma:

- ensure that your [Figma access token](https://www.figma.com/developers/api#access-tokens) is set via the `FIGMA_REST_TOKEN` environment variable.
- Run the following command from the repository root:

```shell
pnpm -C packages/common/qds-core extract-design-tokens
```

This will extract the design tokens, build the CSS, and write the output files to [./src/styles](./src/styles).
