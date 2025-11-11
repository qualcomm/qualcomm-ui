// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput, TypeDocOptions} from "typedoc"

import type {ImportBuilder} from "./internal/import-builder"

export type PackageType = "angular" | "react" | "node"

export type LogMode = "info" | "quiet"

export type DocumentationScope = "only-public" | "all"

export interface ImportResolverParams extends JSONOutput.ReflectionSymbolId {
  /**
   * The builder instance.
   */
  builder: ImportBuilder

  name: string

  /**
   * @example
   * for `JSX.FocusEventHandler`, the namespace will be `JSX` and the {@link name}
   * will be `FocusEventHandler`
   */
  namespace?: string

  /**
   * The raw TypeDoc type.
   */
  type: JSONOutput.ReferenceType
}

export type ImportResolverFn = (
  opts: ImportResolverParams,
) => Promise<string | undefined> | string | undefined

/**
 * @public
 */
export interface BuildOptions {
  /**
   * The relative file path for the TypeDoc API JSON output. This file is generated
   * by typedoc and contains the raw interfaces and types.
   */
  apiFile?: string

  /**
   * It is recommended to leave this option alone unless you are debugging. The type
   * information is a lot of data, so the detection strategy defaults to
   * `only-public` to remove unused types.
   *
   * @option `only-public`: entities must be marked with an `@public` JSDoc tag to be processed into type documentation.
   * @option `all`: every exported type will be processed. This will increase the size of the JSON model.
   *
   * @default 'only-public'
   */
  documentationScope?: DocumentationScope

  /**
   * Used to generate type info popups for resolved symbols.
   */
  importResolver?: ImportResolverFn

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
   * The relative file path for the resolved interfaces. Our parser strips the
   * irrelevant information from the typedoc JSON and adds formatted API data
   * featuring expanded pretty types, links to named types, and more.
   *
   * @default ".typedoc/doc-props.json"
   */
  outputFile?: string

  /**
   * Whether to prettify the output JSON to make it human-readable.
   */
  prettyJson?: boolean

  /**
   * Map of typedoc entity names to their corresponding page pathname on the docs
   * site.
   */
  referenceLinks?: Record<string, string>

  /**
   * Optional overrides for typedoc Application {@link https://typedoc.org/options/ options}.
   *
   * Refer to {@link https://docs.qui.qualcomm.com/guide/typedoc#default-options defaultOptions} for details about the default configuration.
   */
  typedocOptions?: Partial<TypeDocOptions>
}

export interface ResolvedBuildOptions extends BuildOptions {
  outputFile: string
}
