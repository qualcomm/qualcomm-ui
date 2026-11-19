// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type PackageType = "angular" | "react" | "node"

export type LogMode = "info" | "quiet"

export type DocumentationScope = "only-public" | "all"

/**
 * A named type referenced by a documented property.
 */
export interface ImportReference {
  name: string

  /**
   * @example
   * for `JSX.FocusEventHandler`, the namespace will be `JSX` and the {@link name}
   * will be `FocusEventHandler`
   */
  namespace?: string

  /**
   * The name of the nearest `package.json` to the file that declares the type.
   */
  packageName: string

  /**
   * The path of the declaring file, relative to its package root.
   *
   * @example "src/menu/menu.types.ts"
   */
  packagePath: string

  qualifiedName: string

  /**
   * One entry per type argument of the reference. Entries are `undefined` when
   * the argument is not a named type.
   */
  typeArguments: (ImportReference | undefined)[]
}

export interface ImportResolverParams extends ImportReference {
  /**
   * Resolves the import of another reference, such as one of the
   * {@link typeArguments}, with the configured resolver.
   */
  resolveImport: (reference: ImportReference) => Promise<string | undefined>
}

export type ImportResolverFn = (
  opts: ImportResolverParams,
) => Promise<string | undefined> | string | undefined

/**
 * Limits for printing small documented object types inline in place of their
 * name.
 */
export interface InlineObjectOptions {
  /**
   * Objects whose inline form is longer than this many characters keep their
   * name.
   *
   * @default 100
   */
  maxLength?: number

  /**
   * Objects with more members than this keep their name.
   *
   * @default 6
   */
  maxMembers?: number
}

/**
 * @public
 */
export interface BuildOptions {
  /**
   * Controls which exported entities are documented.
   *
   * @option `all`: every exported type will be processed. This will increase the size of the JSON model.
   * @option `only-public`: entities must be marked with an `@public` JSDoc tag to be processed into type documentation.
   *
   * @default 'all'
   */
  documentationScope?: DocumentationScope

  /**
   * Files or directories whose exports are documented. Defaults to the files
   * included by the {@link tsconfig}.
   */
  entryPoints?: string[]

  /**
   * Used to generate type info popups for resolved symbols.
   */
  importResolver?: ImportResolverFn

  /**
   * Limits for printing small documented object types, such as
   * `{end: DateValue; start: DateValue}`, inline in place of their name.
   */
  inlineObjects?: InlineObjectOptions

  /**
   * The log level for runtime logs.
   *
   * @default 'info'
   */
  logMode?: LogMode

  /**
   * Include all entities from these modules regardless of {@link
   * documentationScope}. This field does nothing when {@link documentationScope} is
   * set to `all`, as every module considered public in that case.
   *
   * @example ["@qualcomm-ui/react", "@qualcomm-ui/react-core"]
   */
  moduleWhitelist?: string[]

  /**
   * The relative file path for the resolved interfaces. The output contains
   * formatted API data featuring expanded pretty types, links to named types,
   * and more.
   *
   * @default ".typescoop/type-data.json"
   */
  outputFile?: string

  /**
   * Whether to prettify the output JSON to make it human-readable.
   */
  prettyJson?: boolean

  /**
   * Map of type names to their corresponding page pathname on the docs site.
   */
  referenceLinks?: Record<string, string>

  /**
   * The tsconfig that defines the compiler options and, unless
   * {@link entryPoints} is set, the files to document.
   */
  tsconfig?: string
}

export interface ResolvedBuildOptions extends BuildOptions {
  outputFile: string
}
