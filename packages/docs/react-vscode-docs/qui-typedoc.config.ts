import type {BuildOptions} from "@qualcomm-ui/typedoc"

export default {
  documentationScope: "all",
  moduleWhitelist: [
    "@qualcomm-ui/react-vscode",
    "@qualcomm-ui/react-core",
    "@qualcomm-ui/core",
    "@qualcomm-ui/dom",
    "@qualcomm-ui/utils",
  ],
  prettyJson: false,
  typedocOptions: {
    gitRemote: "origin",
    gitRevision: "main",
    tsconfig: "tsconfig.typedoc.json",
  },
} satisfies BuildOptions
