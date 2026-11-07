// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  Node,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import {
  describeEmphasisResult,
  EMPHASIS_TYPE_RENAMES,
  type EmphasisComponent,
  type EmphasisPropsResult,
  getEmphasisStatus,
  type PropUsage,
  replaceEmphasisProps,
  type StringLiteralRange,
} from "../../shared/emphasis-props.js"
import {
  applyEdits,
  type Edit,
  parseSource,
  referencesModule,
  renameImportedNames,
} from "../../shared/source-edits.js"
import type {Codemod, CodemodFileResult} from "../../types.js"

/**
 * The affected components, keyed by module and then by their path from the
 * module's exports, e.g. `Slider.Root`.
 */
const REACT_COMPONENTS: Readonly<
  Record<string, Readonly<Record<string, EmphasisComponent>>>
> = {
  "@qualcomm-ui/react/breadcrumbs": {"Breadcrumbs.Root": "breadcrumbs"},
  "@qualcomm-ui/react/progress": {
    Progress: "progress",
    "Progress.Root": "progress",
  },
  "@qualcomm-ui/react/progress-ring": {
    ProgressRing: "progress-ring",
    "ProgressRing.Root": "progress-ring",
  },
  "@qualcomm-ui/react/segmented-control": {
    "SegmentedControl.Root": "segmented-control",
  },
  "@qualcomm-ui/react/slider": {Slider: "slider", "Slider.Root": "slider"},
  "@qualcomm-ui/react/tag": {Tag: "tag"},
}

interface ImportedBinding {
  module: string
  /** The export path the binding refers to. Empty for namespace imports. */
  path: string[]
}

function isAffectedModule(module: string): boolean {
  return (
    Object.hasOwn(REACT_COMPONENTS, module) ||
    Object.hasOwn(EMPHASIS_TYPE_RENAMES, module)
  )
}

function getComponentBindings(
  sourceFile: SourceFile,
): Map<string, ImportedBinding> {
  const bindings = new Map<string, ImportedBinding>()
  for (const decl of sourceFile.getImportDeclarations()) {
    const module = decl.getModuleSpecifierValue()
    if (!Object.hasOwn(REACT_COMPONENTS, module) || decl.isTypeOnly()) {
      continue
    }
    const namespace = decl.getNamespaceImport()?.getText()
    if (namespace) {
      bindings.set(namespace, {module, path: []})
    }
    for (const specifier of decl.getNamedImports()) {
      if (specifier.isTypeOnly()) {
        continue
      }
      const local = specifier.getAliasNode()?.getText() ?? specifier.getName()
      bindings.set(local, {module, path: [specifier.getName()]})
    }
  }
  return bindings
}

function resolveComponent(
  element: JsxOpeningElement | JsxSelfClosingElement,
  bindings: Map<string, ImportedBinding>,
): EmphasisComponent | undefined {
  const [local, ...rest] = element.getTagNameNode().getText().split(".")
  const binding = bindings.get(local)
  if (!binding) {
    return undefined
  }
  const path = [...binding.path, ...rest].join(".")
  const components = REACT_COMPONENTS[binding.module]
  return Object.hasOwn(components, path) ? components[path] : undefined
}

/**
 * Collects the string literals that an expression can evaluate to. Only
 * literals, conditionals, and fallbacks (`a ?? "primary"`) are followed.
 */
function collectStringLiterals(node: Node | undefined): StringLiteralRange[] {
  if (!node) {
    return []
  }
  if (
    Node.isStringLiteral(node) ||
    Node.isNoSubstitutionTemplateLiteral(node)
  ) {
    const text = node.getText()
    return [
      {
        end: node.getEnd() - 1,
        start: node.getStart() + 1,
        value: text.slice(1, -1),
      },
    ]
  }
  if (Node.isJsxExpression(node)) {
    return collectStringLiterals(node.getExpression())
  }
  if (
    Node.isParenthesizedExpression(node) ||
    Node.isAsExpression(node) ||
    Node.isSatisfiesExpression(node)
  ) {
    return collectStringLiterals(node.getExpression())
  }
  if (Node.isConditionalExpression(node)) {
    return [
      ...collectStringLiterals(node.getWhenTrue()),
      ...collectStringLiterals(node.getWhenFalse()),
    ]
  }
  if (Node.isBinaryExpression(node)) {
    switch (node.getOperatorToken().getKind()) {
      case SyntaxKind.QuestionQuestionToken:
      case SyntaxKind.BarBarToken:
        return [
          ...collectStringLiterals(node.getLeft()),
          ...collectStringLiterals(node.getRight()),
        ]
      case SyntaxKind.AmpersandAmpersandToken:
        return collectStringLiterals(node.getRight())
    }
  }
  return []
}

function getPropUsages(
  element: JsxOpeningElement | JsxSelfClosingElement,
): PropUsage[] {
  return element.getAttributes().flatMap((attribute) => {
    if (!Node.isJsxAttribute(attribute)) {
      return []
    }
    const nameNode = attribute.getNameNode()
    return [
      {
        name: nameNode.getText(),
        nameEnd: nameNode.getEnd(),
        nameStart: nameNode.getStart(),
        values: collectStringLiterals(attribute.getInitializer()),
      },
    ]
  })
}

/**
 * Replaces the deprecated `variant` prop of Slider and SegmentedControl with
 * `emphasis`, the deprecated `emphasis` values of the affected components, and
 * the deprecated variant type names from `@qualcomm-ui/qds-core`.
 */
export function transformReactEmphasisProps(
  content: string,
  filePath = "file.tsx",
): EmphasisPropsResult {
  const sourceFile = parseSource(content, filePath)
  if (!referencesModule(sourceFile, isAffectedModule)) {
    return {content, manual: [], replaced: 0, status: "skipped"}
  }

  const edits: Edit[] = []
  const manual: string[] = []
  let replaced = renameImportedNames(sourceFile, EMPHASIS_TYPE_RENAMES, edits)

  const bindings = getComponentBindings(sourceFile)
  if (bindings.size) {
    const elements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ]
    for (const element of elements) {
      const component = resolveComponent(element, bindings)
      if (!component) {
        continue
      }
      replaced += replaceEmphasisProps(
        component,
        getPropUsages(element),
        () =>
          `<${element.getTagNameNode().getText()}> on line ${element.getStartLineNumber()}`,
        edits,
        manual,
      )
    }
  }

  return {
    content: applyEdits(content, edits),
    manual,
    replaced,
    status: getEmphasisStatus(replaced, manual),
  }
}

export const reactEmphasisProps: Codemod<"@qualcomm-ui/react"> = {
  name: "emphasis-props",
  noMatchMessage:
    "no imports of the affected components or types found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}", {
      absolute: true,
      cwd,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/.react-router/**",
      ],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const file of files.sort()) {
      const original = await readFile(file, "utf-8")
      if (
        !original.includes("@qualcomm-ui/react/") &&
        !original.includes("@qualcomm-ui/qds-core/")
      ) {
        continue
      }
      const result = transformReactEmphasisProps(original, file)
      if (result.content !== original && !dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
      results.push({
        file,
        message: describeEmphasisResult(
          result,
          dryRun,
          "doesn't import an affected component or type, ignored",
        ),
        status: result.status,
      })
    }
    return results
  },
  title: "Replace the deprecated emphasis props and values",
  versions: {
    "@qualcomm-ui/react": {from: 1, to: 2},
  },
}
