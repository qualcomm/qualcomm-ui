import type {BuildOptions} from "@qualcomm-ui/typedoc"

export default {
  documentationScope: "all",
  typedocOptions: {
    tsconfig: "tsconfig.typedoc.json",
  },
} satisfies BuildOptions
