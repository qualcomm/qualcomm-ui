import type {BuildOptions, ImportResolverFn} from "@qualcomm-ui/typescoop"

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
  const statement = `import type {${namespace ?? name}} from "${packageName}/${subModule}"`
  if (namespace) {
    return [statement, `// ${namespace}.${name}`].join("\n")
  } else {
    return statement
  }
}

// TODO: clean up.  Lots of holes with this approach, maybe pass the entire
// reference type to the resolver.
const pkgImportResolvers: Record<string, ImportResolverFn> = {
  "@qualcomm-ui/angular": (params) => {
    const {name, namespace, packageName, packagePath} = params
    // *
    const subModule = packagePath.split("/")[0]
    const statement = `import type {${namespace ?? name}} from "${packageName}/${subModule}"`
    if (namespace) {
      return [statement, `// ${namespace}.${name}`].join("\n")
    } else {
      return statement
    }
  },
  "@qualcomm-ui/angular-core": (params) => {
    const {name, namespace, packageName, packagePath} = params
    // *
    const subModule = packagePath.split("/")[0]
    const statement = `import type {${namespace ?? name}} from "${packageName}/${subModule}"`
    if (namespace) {
      return [statement, `// ${namespace}.${name}`].join("\n")
    } else {
      return statement
    }
  },
  "@qualcomm-ui/core": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/dom": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/qds-core": resolveTopLevelCodeSplitPackage,
  "@qualcomm-ui/utils": (opts) => {
    const [inner] = opts.typeArguments
    if (opts.name === "WithDataAttributes" && inner) {
      return opts.resolveImport(inner)
    }
    return resolveTopLevelCodeSplitPackage(opts)
  },
}

export default {
  importResolver: (params) => {
    const packageName = params.packageName
    return pkgImportResolvers[packageName]?.(params)
  },
  prettyJson: false,
  tsconfig: "tsconfig.typescoop.json",
} satisfies BuildOptions
