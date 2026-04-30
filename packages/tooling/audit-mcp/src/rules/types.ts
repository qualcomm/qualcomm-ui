// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JsxElement, JsxSelfClosingElement, Node, Project} from "ts-morph"

import type {RenderGraph} from "./render-graph"

export type RuleCategory =
  | "accessibility"
  | "composition"
  | "deprecated"
  | "imports"
  | "props-state"

export type RuleSeverity = "error" | "warning"

export interface FixEdit {
  /** Character offset in the file where the replacement ends. */
  end: number
  /** Absolute file path of the edit. */
  file: string
  /** Text to insert between `start` and `end`. */
  replacement: string
  /** Character offset in the file where the replacement begins. */
  start: number
}

export interface Violation {
  category: RuleCategory
  column: number
  file: string
  fixable: boolean
  line: number
  message: string
  /** Character offset in the source file of the end of the offending node. */
  nodeEnd: number
  /** Character offset in the source file of the offending node. */
  nodeStart: number
  ruleId: string
  severity: RuleSeverity
}

export type JsxHostNode = JsxElement | JsxSelfClosingElement

/**
 * Matcher for a QUI component's tag as it appears in source.
 *
 * Examples: "HeaderBar", "HeaderBar.Root", "Toast.ActionButton".
 * The matcher is compared against the canonical tag of an ancestor JSX element,
 * resolved through import aliases and the render graph.
 */
export type QuiComponentMatcher = string

export interface ViolationInput {
  /**
   * Whether a codemod is available. Defaults to false; set to true when `fix()` is
   * implemented.
   */
  fixable?: boolean
  /**
   * Human-readable message; should name the offending construct and the recommended
   * fix.
   */
  message: string
  /** The AST node whose source location represents the violation. */
  node: Node
}

export interface HasAncestorOptions {
  /**
   * When true, walks through user-defined wrapper components to see if their
   * transitive JSX root matches the target. Requires the render graph to have
   * resolved the wrapper.
   */
  followWrappers?: boolean
}

export interface RuleContext {
  /**
   * Returns true when `node` has an ancestor JSX element whose canonical QUI
   * tag matches one of the given tag matchers.
   *
   * Each matcher is a bare qualified name, e.g. `"HeaderBar"` or
   * `"HeaderBar.Root"`. The ancestor's import is required to be from a QUI
   * package for the match to register; non-QUI same-named components are
   * ignored.
   */
  hasAncestor(
    node: JsxHostNode,
    tags: QuiComponentMatcher | readonly QuiComponentMatcher[],
    options?: HasAncestorOptions,
  ): boolean
  /** The ts-morph project the audit is running against. */
  readonly project: Project
  /** Precomputed render graph for wrapper resolution. Built once per audit run. */
  readonly renderGraph: RenderGraph
  /**
   * Codemod helper: replace the opening (and closing, if any) tag name of the
   * given JSX element. Preserves attributes, children, and whitespace.
   */
  replaceTag(node: JsxHostNode, newTag: string): FixEdit[]
  /**
   * Canonical QUI tag name for a JSX element (e.g. `"HeaderBar"` or
   * `"HeaderBar.Root"`) if the element's root identifier resolves to a QUI
   * import. Returns `null` when the element is not a QUI component (either a
   * user-defined wrapper, a foreign-library component, or an intrinsic host
   * element like `<div>`).
   */
  resolveQuiTag(node: JsxHostNode): string | null
  /** Builds a structured violation object for the current rule. */
  violation(input: ViolationInput): Violation
}

/**
 * The unit of output from a rule check: a user-facing `Violation` plus the
 * optional codemod edits computed at check time. Keeping the edits bundled
 * with the violation avoids carrying non-serializable AST references on the
 * `Violation` itself (needed because violations travel across the MCP
 * boundary).
 */
export interface RuleFinding {
  /**
   * Edits to apply if the user accepts the auto-fix. Empty/undefined means no
   * codemod.
   */
  fix?: FixEdit[]
  violation: Violation
}

export interface QuiAuditRule {
  readonly category: RuleCategory
  check(context: RuleContext): RuleFinding[]
  /**
   * Whether the direct (single-file, no-type-info) case is also shipped in
   * `@qualcomm-ui/eslint-plugin-react`.
   */
  readonly eslintAvailable: boolean
  /**
   * Globally-unique rule id. Stable across versions; drives cross-package parity.
   */
  readonly id: string
  readonly severity: RuleSeverity
  /** Minimum `@qualcomm-ui/react` version this rule applies to (semver). */
  readonly since: string

  /** Short title, used in reports. */
  readonly title: string
}
