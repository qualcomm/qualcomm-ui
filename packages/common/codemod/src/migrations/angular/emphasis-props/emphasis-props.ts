// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type AST,
  ASTWithSource,
  Binary,
  BindingType,
  Conditional,
  Interpolation,
  LiteralPrimitive,
  NonNullAssert,
  ParenthesizedExpression,
  parseTemplate,
  type TmplAstElement,
  TmplAstRecursiveVisitor,
  tmplAstVisitAll,
} from "@angular/compiler"
import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {Node, type SourceFile, SyntaxKind} from "ts-morph"

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
  getLineNumber,
  parseSource,
  referencesModule,
  renameImportedNames,
} from "../../shared/source-edits.js"
import type {Codemod, CodemodFileResult} from "../../types.js"

/** Affected components matched by element name, e.g. `<q-slider>`. */
const ELEMENT_SELECTORS: Readonly<Record<string, EmphasisComponent>> = {
  "q-slider": "slider",
}

/** Affected components matched by attribute, e.g. `<div q-slider-root>`. */
const ATTRIBUTE_SELECTORS: Readonly<Record<string, EmphasisComponent>> = {
  "q-breadcrumbs-root": "breadcrumbs",
  "q-progress": "progress",
  "q-progress-ring": "progress-ring",
  "q-progress-ring-root": "progress-ring",
  "q-progress-root": "progress",
  "q-segmented-control": "segmented-control",
  "q-slider-root": "slider",
  "q-tag": "tag",
}

const SELECTOR_NAMES = [
  ...Object.keys(ELEMENT_SELECTORS),
  ...Object.keys(ATTRIBUTE_SELECTORS),
]

function mentionsSelector(text: string): boolean {
  return SELECTOR_NAMES.some((name) => text.includes(name))
}

function resolveComponent(
  element: TmplAstElement,
): EmphasisComponent | undefined {
  if (Object.hasOwn(ELEMENT_SELECTORS, element.name)) {
    return ELEMENT_SELECTORS[element.name]
  }
  const attribute = element.attributes.find(({name}) =>
    Object.hasOwn(ATTRIBUTE_SELECTORS, name),
  )
  return attribute && ATTRIBUTE_SELECTORS[attribute.name]
}

/**
 * Collects the string literals that a binding expression can evaluate to. Only
 * literals, conditionals, and fallbacks (`a ?? 'primary'`) are followed.
 * Offsets are relative to the template.
 */
function collectStringLiterals(
  ast: AST,
  template: string,
): StringLiteralRange[] {
  if (ast instanceof ASTWithSource) {
    return ast.ast ? collectStringLiterals(ast.ast, template) : []
  }
  if (ast instanceof LiteralPrimitive) {
    if (typeof ast.value !== "string") {
      return []
    }
    const start = ast.sourceSpan.start + 1
    const end = ast.sourceSpan.end - 1
    return [{end, start, value: template.slice(start, end)}]
  }
  if (ast instanceof ParenthesizedExpression || ast instanceof NonNullAssert) {
    return collectStringLiterals(ast.expression, template)
  }
  if (ast instanceof Conditional) {
    return [
      ...collectStringLiterals(ast.trueExp, template),
      ...collectStringLiterals(ast.falseExp, template),
    ]
  }
  if (ast instanceof Binary) {
    switch (ast.operation) {
      case "??":
      case "||":
        return [
          ...collectStringLiterals(ast.left, template),
          ...collectStringLiterals(ast.right, template),
        ]
      case "&&":
        return collectStringLiterals(ast.right, template)
    }
  }
  // `variant="{{ 'primary' }}"`, with nothing around the interpolation.
  if (
    ast instanceof Interpolation &&
    ast.expressions.length === 1 &&
    ast.strings.every((text) => !text.trim())
  ) {
    return collectStringLiterals(ast.expressions[0], template)
  }
  return []
}

function getPropUsages(element: TmplAstElement, template: string): PropUsage[] {
  const usages: PropUsage[] = []
  for (const {keySpan, name, valueSpan} of element.attributes) {
    if (!keySpan) {
      continue
    }
    const values: StringLiteralRange[] = []
    if (valueSpan) {
      const start = valueSpan.start.offset
      const end = valueSpan.end.offset
      values.push({end, start, value: template.slice(start, end)})
    }
    usages.push({
      name,
      nameEnd: keySpan.end.offset,
      nameStart: keySpan.start.offset,
      values,
    })
  }
  for (const {keySpan, name, type, value} of element.inputs) {
    // `[attr.variant]` and `[class.x]` don't bind to the directive's inputs.
    if (type !== BindingType.Property || !keySpan) {
      continue
    }
    usages.push({
      name,
      nameEnd: keySpan.end.offset,
      nameStart: keySpan.start.offset,
      values: collectStringLiterals(value, template),
    })
  }
  return usages
}

class AffectedElementVisitor extends TmplAstRecursiveVisitor {
  readonly elements: [TmplAstElement, EmphasisComponent][] = []

  // Structural directives (`*ngIf`) wrap their element in a template node that
  // copies the element's attributes, so only element nodes are inspected.
  override visitElement(element: TmplAstElement): void {
    const component = resolveComponent(element)
    if (component) {
      this.elements.push([element, component])
    }
    super.visitElement(element)
  }
}

/**
 * Collects the edits for a template, offset by its position in the file.
 * Returns the number of usages replaced.
 */
function collectTemplateEdits(
  template: string,
  offset: number,
  fileContent: string,
  filePath: string,
  edits: Edit[],
  manual: string[],
): number {
  const parsed = parseTemplate(template, filePath, {preserveWhitespaces: true})
  if (parsed.errors?.length) {
    const [error] = parsed.errors
    manual.push(
      `the template on line ${getLineNumber(fileContent, offset + error.span.start.offset)} couldn't be parsed (${error.msg}), update it manually`,
    )
    return 0
  }

  const visitor = new AffectedElementVisitor()
  tmplAstVisitAll(visitor, parsed.nodes)

  const templateEdits: Edit[] = []
  let replaced = 0
  for (const [element, component] of visitor.elements) {
    replaced += replaceEmphasisProps(
      component,
      getPropUsages(element, template),
      () => {
        const attribute = Object.hasOwn(ELEMENT_SELECTORS, element.name)
          ? ""
          : ` ${element.attributes.find(({name}) => Object.hasOwn(ATTRIBUTE_SELECTORS, name))!.name}`
        const line = getLineNumber(
          fileContent,
          offset + element.startSourceSpan.start.offset,
        )
        return `<${element.name}${attribute}> on line ${line}`
      },
      templateEdits,
      manual,
    )
  }
  for (const edit of templateEdits) {
    edits.push({
      end: edit.end + offset,
      start: edit.start + offset,
      text: edit.text,
    })
  }
  return replaced
}

/**
 * Replaces the deprecated props and values of the affected components in an
 * external template (`.html`).
 */
export function transformAngularTemplate(
  content: string,
  filePath = "template.html",
): EmphasisPropsResult {
  if (!mentionsSelector(content)) {
    return {content, manual: [], replaced: 0, status: "skipped"}
  }
  const edits: Edit[] = []
  const manual: string[] = []
  const replaced = collectTemplateEdits(
    content,
    0,
    content,
    filePath,
    edits,
    manual,
  )
  return {
    content: applyEdits(content, edits),
    manual,
    replaced,
    status: getEmphasisStatus(replaced, manual),
  }
}

/**
 * Returns the `template` initializers of the `@Component` decorators in the
 * file.
 */
function getInlineTemplates(sourceFile: SourceFile): Node[] {
  return sourceFile
    .getDescendantsOfKind(SyntaxKind.Decorator)
    .flatMap((decorator) => {
      const [options] = decorator.getArguments()
      if (
        decorator.getName() !== "Component" ||
        !Node.isObjectLiteralExpression(options)
      ) {
        return []
      }
      const property = options.getProperty("template")
      const initializer = Node.isPropertyAssignment(property)
        ? property.getInitializer()
        : undefined
      return initializer ? [initializer] : []
    })
}

/**
 * Replaces the deprecated props and values of the affected components in the
 * inline templates of a TypeScript file, and the deprecated variant type names
 * from `@qualcomm-ui/qds-core`.
 */
export function transformAngularSource(
  content: string,
  filePath = "file.ts",
): EmphasisPropsResult {
  const sourceFile = parseSource(content, filePath)
  const importsTypes = referencesModule(sourceFile, (module) =>
    Object.hasOwn(EMPHASIS_TYPE_RENAMES, module),
  )
  const templates = getInlineTemplates(sourceFile).filter((node) =>
    mentionsSelector(node.getText()),
  )
  if (!importsTypes && !templates.length) {
    return {content, manual: [], replaced: 0, status: "skipped"}
  }

  const edits: Edit[] = []
  const manual: string[] = []
  let replaced = renameImportedNames(sourceFile, EMPHASIS_TYPE_RENAMES, edits)

  for (const node of templates) {
    const line = node.getStartLineNumber()
    if (
      !Node.isStringLiteral(node) &&
      !Node.isNoSubstitutionTemplateLiteral(node)
    ) {
      manual.push(
        `the template on line ${line} isn't a plain string, update it manually`,
      )
      continue
    }
    // Template offsets map to the file only if the raw text is the template.
    const raw = node.getText().slice(1, -1)
    if (raw !== node.getLiteralValue()) {
      manual.push(
        `the template on line ${line} contains escape sequences, update it manually`,
      )
      continue
    }
    replaced += collectTemplateEdits(
      raw,
      node.getStart() + 1,
      content,
      filePath,
      edits,
      manual,
    )
  }

  return {
    content: applyEdits(content, edits),
    manual,
    replaced,
    status: getEmphasisStatus(replaced, manual),
  }
}

export const angularEmphasisProps: Codemod<"@qualcomm-ui/angular"> = {
  name: "emphasis-props",
  noMatchMessage:
    "no templates using the affected components or imports of the affected types found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/*.{ts,mts,cts,html}", {
      absolute: true,
      cwd,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/.angular/**",
      ],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const file of files.sort()) {
      const original = await readFile(file, "utf-8")
      const isTemplate = file.endsWith(".html")
      if (
        !mentionsSelector(original) &&
        (isTemplate || !original.includes("@qualcomm-ui/qds-core/"))
      ) {
        continue
      }
      const result = isTemplate
        ? transformAngularTemplate(original, file)
        : transformAngularSource(original, file)
      if (result.content !== original && !dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
      results.push({
        file,
        message: describeEmphasisResult(
          result,
          dryRun,
          "doesn't use an affected component or type, ignored",
        ),
        status: result.status,
      })
    }
    return results
  },
  title: "Replace the deprecated emphasis props and values",
  versions: {
    "@qualcomm-ui/angular": {from: 3, to: 4},
  },
}
