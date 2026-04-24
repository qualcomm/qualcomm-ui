import type {BuildOptions} from "@qualcomm-ui/typedoc"

export default {
  documentationScope: "all",
  prettyJson: true,
  typedocOptions: {
    tsconfig: "tsconfig.typedoc.json",
  },
} satisfies BuildOptions
