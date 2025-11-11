// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

interface VariableTransformer {
  name: string
  renameTo: string
}

interface JsxWrapper {
  name: string
  wrapWith: string[]
}

export interface ImportTransformEntry {
  /**
   * Imports to move from the source package to the target package.
   * If not provided or empty, all imports will be moved.
   */
  imports?: Array<string | {name: string; renameTo: string}>
  /**
   * Remove these imports completely, they no longer exist.
   */
  importsToRemove?: string[]
  /**
   * Wrap JSX elements with parent elements. First element in array is outermost wrapper.
   * @example
   * ```ts
   * {name: "QTable", wrapWith: ["Table.Root", "Table.ScrollContainer"]}
   * // <QTable>...</QTable> becomes <Table.Root><Table.ScrollContainer><QTable>...</QTable></Table.ScrollContainer></Table.Root>
   * ```
   */
  jsxWrappers?: JsxWrapper[]
  /**
   * Source package from which imports will be moved
   */
  sourcePackage: string
  /**
   * Target package to which imports will be moved
   */
  targetPackage: string
  /**
   * Variables that are transformed separately from imports.
   *
   * @example
   * ```ts
   * {name: "QTr", renameTo: "Table.Row"}
   * ```
   */
  variableTransformers?: VariableTransformer[]
}
