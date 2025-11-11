import type {BuildOptions, ImportResolverFn} from "@qualcomm-ui/typedoc"

/**
 * Assumes that each module's source code lives in individually-exported folders
 * that exist at the top of the source root, i.e. `src/*`.
 *
 * @example
 * Symbols exported from `@qualcomm-ui/core/menu` have a `packagePath` that always starts
 * with `src/menu/*`. This is true for every other module exported from the `@qualcomm-ui/core` package.
 */
const resolveTopLevelCodeSplitPackage: ImportResolverFn = (params) => {
  const {name, namespace, packageName, packagePath} = params
  // src/*
  const subModule = packagePath.split("/")[1]
  const statement = `import {${namespace ?? name}} from "${packageName}/${subModule}"`
  if (namespace) {
    return [statement, `// ${namespace}.${name}`].join("\n")
  } else {
    return statement
  }
}

// TODO: clean up.  Lots of holes with this approach, maybe pass the entire
// reference type to the resolver.
const pkgImportResolvers: Record<string, ImportResolverFn> = {
  "@qualcomm-ui/core": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/dom": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/qds-core": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/react": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/react-core": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/utils": (opts) => {
    return resolveTopLevelCodeSplitPackage(opts)
  },
  "@types/react": (params) => {
    const {name} = params
    return `import {${name}} from "react"`
  },
}

export default {
  documentationScope: "all",
  importResolver: (params) => {
    const packageName = params.packageName
    return pkgImportResolvers[packageName]?.(params)
  },
  moduleWhitelist: [
    "@qualcomm-ui/react",
    "@qualcomm-ui/react-core",
    "@qualcomm-ui/core",
    "@qualcomm-ui/dom",
    "@qualcomm-ui/qds-core",
    "@qualcomm-ui/utils",
  ],
  prettyJson: false,
  referenceLinks: {
    BindingRenderProp: "/render-props#binding-render-prop",
    RenderProp: "/render-props#render-prop",
  },
  typedocOptions: {
    gitRemote: "origin",
    gitRevision: "dev",
    tsconfig: "tsconfig.typedoc.json",
  },
} satisfies BuildOptions
