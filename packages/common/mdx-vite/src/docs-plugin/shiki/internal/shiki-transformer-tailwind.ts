// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Element, Root, Text} from "hast"
import {fromHtml} from "hast-util-from-html"
import {toHtml} from "hast-util-to-html"
import {readFile} from "node:fs/promises"
import postcss, {type Rule} from "postcss"
import selectorParser from "postcss-selector-parser"
import type {ShikiTransformer} from "shiki"
import {compile} from "tailwindcss"
import {visit} from "unist-util-visit"

import {camelCase} from "@qualcomm-ui/utils/change-case"

declare const createRequire: NodeRequire

async function loadStylesheetContent(id: string): Promise<string> {
  const resolveId = id === "tailwindcss" ? "tailwindcss/index.css" : id

  let resolvedPath: string
  if (typeof createRequire !== "undefined") {
    resolvedPath = createRequire(import.meta.url).resolve(resolveId)
  } else {
    const createRequire = await import("node:module").then(
      (module) => module.createRequire,
    )
    resolvedPath = createRequire(import.meta.url).resolve(resolveId)
  }
  return readFile(resolvedPath, "utf-8")
}

function getClassValue(node: Element): string | null {
  const val = node.properties?.className ?? node.properties?.class
  if (!val) {
    return null
  }
  return Array.isArray(val) ? val.join(" ") : String(val)
}

/**
 * Extract class names from the text content of a HAST tree.
 * Looks for string literals that could be Tailwind class names.
 */
export function extractClassesFromHast(tree: Root): string[] {
  const classes = new Set<string>()
  const stringLiteralPattern = /["'`]([^"'`]+)["'`]/g

  visit(tree, "text", (node: Text) => {
    const text = node.value
    let match
    while ((match = stringLiteralPattern.exec(text)) !== null) {
      const content = match[1]
      const tokens = content.split(/\s+/).filter(Boolean)
      for (const token of tokens) {
        classes.add(token)
      }
    }
  })

  return [...classes]
}

export function extractClasses(source: string): string[] {
  const tree = fromHtml(source, {fragment: true})
  const classes = new Set<string>()

  visit(tree, "element", (node: Element) => {
    const value = getClassValue(node)
    if (value) {
      classes.add(value)
    }
  })

  return Array.from(classes)
    .map((value) => value.split(" "))
    .flat()
}

/**
 * Create a fresh Tailwind compiler for each transformation.
 * Note: Tailwind v4's compiler.build() is incremental and accumulates
 * all candidates across calls. We must create a fresh compiler each time
 * to avoid CSS from one demo leaking into another.
 */
async function createCompiler(styles: string) {
  return compile(styles, {
    loadStylesheet: async (id: string, base: string) => {
      const content = await loadStylesheetContent(id)
      return {
        base,
        content,
        path: `virtual:${id}`,
      }
    },
  })
}

/**
 * Extract CSS custom property definitions from compiled CSS.
 * Looks in :root and :host selectors within @layer theme.
 */
function extractCssVariables(css: string): Map<string, string> {
  const variables = new Map<string, string>()
  const root = postcss.parse(css)

  root.walkAtRules("layer", (atRule) => {
    if (atRule.params !== "theme") {
      return
    }

    atRule.walkRules(":root, :host", (rule) => {
      rule.walkDecls((decl) => {
        if (decl.prop.startsWith("--")) {
          variables.set(decl.prop, decl.value)
        }
      })
    })
  })

  return variables
}

/**
 * Evaluate a calc() expression with resolved numeric values.
 * Handles expressions like "0.25rem * 4" -> "1rem" or "1.25 / 0.875" -> "1.4286"
 */
function evaluateCalc(expression: string): string | null {
  const expr = expression.trim()

  // Pattern 1: number+unit operator number (e.g., "0.25rem * 4")
  const withUnitFirst = expr.match(
    /^([\d.]+)(rem|px|em|%|vh|vw)\s*([*/+-])\s*([\d.]+)$/,
  )
  if (withUnitFirst) {
    const [, num1, unit, op, num2] = withUnitFirst
    const result = evaluateOperation(parseFloat(num1), op, parseFloat(num2))
    if (!Number.isFinite(result)) {
      return null
    }
    return formatNumber(result) + unit
  }

  // Pattern 2: number operator number+unit (e.g., "4 * 0.25rem")
  const withUnitSecond = expr.match(
    /^([\d.]+)\s*([*/+-])\s*([\d.]+)(rem|px|em|%|vh|vw)$/,
  )
  if (withUnitSecond) {
    const [, num1, op, num2, unit] = withUnitSecond
    const result = evaluateOperation(parseFloat(num1), op, parseFloat(num2))
    if (!Number.isFinite(result)) {
      return null
    }
    return formatNumber(result) + unit
  }

  // Pattern 3: unitless (e.g., "1.25 / 0.875")
  const unitless = expr.match(/^([\d.]+)\s*([*/+-])\s*([\d.]+)$/)
  if (unitless) {
    const [, num1, op, num2] = unitless
    const result = evaluateOperation(parseFloat(num1), op, parseFloat(num2))
    if (!Number.isFinite(result)) {
      return null
    }
    return formatNumber(result)
  }

  return null
}

function evaluateOperation(a: number, op: string, b: number): number {
  switch (op) {
    case "*":
      return a * b
    case "/":
      return a / b
    case "+":
      return a + b
    case "-":
      return a - b
    default:
      return NaN
  }
}

function formatNumber(num: number): string {
  // Avoid floating point artifacts like 0.30000000000000004
  const rounded = Math.round(num * 10000) / 10000
  return String(rounded)
}

/**
 * Convert rem values to pixels (assuming 1rem = 16px).
 */
function remToPx(value: string): string {
  return value.replace(/([\d.]+)rem/g, (_, num) => {
    const px = parseFloat(num) * 16
    return `${formatNumber(px)}px`
  })
}

/**
 * Find the matching closing parenthesis for a var() call.
 * Handles nested parentheses in fallback values.
 */
function findVarEnd(str: string, start: number): number {
  let depth = 0
  for (let i = start; i < str.length; i++) {
    if (str[i] === "(") {
      depth++
    } else if (str[i] === ")") {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }
  return -1
}

/**
 * Parse a var() expression and return its parts.
 */
function parseVar(
  str: string,
  startIndex: number,
): {end: number; fallback: string | null; varName: string} | null {
  // Find "var(" starting position
  const varStart = str.indexOf("var(", startIndex)
  if (varStart === -1) {
    return null
  }

  const contentStart = varStart + 4 // After "var("
  const end = findVarEnd(str, varStart)
  if (end === -1) {
    return null
  }

  const content = str.slice(contentStart, end)

  // Find comma separating variable name from fallback
  let commaIndex = -1
  let depth = 0
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "(") {
      depth++
    } else if (content[i] === ")") {
      depth--
    } else if (content[i] === "," && depth === 0) {
      commaIndex = i
      break
    }
  }

  if (commaIndex === -1) {
    return {
      end,
      fallback: null,
      varName: content.trim(),
    }
  }

  return {
    end,
    fallback: content.slice(commaIndex + 1).trim(),
    varName: content.slice(0, commaIndex).trim(),
  }
}

/**
 * Resolve CSS var() references and evaluate calc() expressions.
 * Recursively resolves nested var() calls.
 */
function resolveCssValue(
  value: string,
  variables: Map<string, string>,
  depth = 0,
): string {
  if (depth > 10) {
    return value // Prevent infinite recursion
  }

  let resolved = value
  let searchStart = 0

  // Process var() calls iteratively to handle nested var() in fallbacks
  while (true) {
    const parsed = parseVar(resolved, searchStart)
    if (!parsed) {
      break
    }

    const {end, fallback, varName} = parsed
    const varStart = resolved.indexOf("var(", searchStart)

    let replacement: string
    const varValue = variables.get(varName)
    if (varValue !== undefined) {
      replacement = resolveCssValue(varValue, variables, depth + 1)
    } else if (fallback) {
      replacement = resolveCssValue(fallback, variables, depth + 1)
    } else {
      // Keep original if unresolved, move past it
      searchStart = end + 1
      continue
    }

    resolved =
      resolved.slice(0, varStart) + replacement + resolved.slice(end + 1)
  }

  // Evaluate calc() expressions after var() resolution
  resolved = resolved.replace(
    /calc\(([^)]+)\)/g,
    (match, expression: string) => {
      const evaluated = evaluateCalc(expression)
      return evaluated ?? match
    },
  )

  // Convert rem to px (1rem = 16px)
  resolved = remToPx(resolved)

  return resolved
}

interface SelectorAnalysis {
  /** The class name if it's a simple class selector */
  className: string | null
  /** Whether this selector can be inlined (single class, no pseudo/combinators) */
  inlineable: boolean
}

/**
 * Analyze a CSS selector using postcss-selector-parser AST.
 * Returns whether it can be inlined and extracts the class name.
 */
function analyzeSelector(selector: string): SelectorAnalysis {
  let inlineable = true
  let className: string | null = null

  const processor = selectorParser((selectors) => {
    if (selectors.nodes.length !== 1) {
      inlineable = false
      return
    }

    const selectorNode = selectors.nodes[0]
    if (selectorNode.nodes.length !== 1) {
      inlineable = false
      return
    }

    const node = selectorNode.nodes[0]
    if (node.type !== "class") {
      inlineable = false
      return
    }

    className = node.value

    selectorNode.walk((n) => {
      if (
        n.type === "pseudo" ||
        n.type === "combinator" ||
        n.type === "nesting" ||
        n.type === "attribute"
      ) {
        inlineable = false
      }
    })
  })

  processor.processSync(selector)

  return {className, inlineable}
}

interface ParsedRule {
  className: string
  declarations: string
  inlineable: boolean
  originalRule: string
}

/**
 * Parse compiled CSS and extract rules with their inlineability status.
 * CSS variables are resolved and calc() expressions are evaluated.
 */
function parseCompiledCss(css: string): ParsedRule[] {
  const rules: ParsedRule[] = []
  const root = postcss.parse(css)
  const variables = extractCssVariables(css)

  function processRule(rule: Rule, insideAtRule: boolean) {
    const {className, inlineable} = analyzeSelector(rule.selector)

    if (!className) {
      return
    }

    let hasNestedAtRule = false
    rule.walkAtRules(() => {
      hasNestedAtRule = true
    })

    const declarations: string[] = []
    rule.each((node) => {
      if (node.type === "decl") {
        const resolvedValue = resolveCssValue(node.value, variables)
        declarations.push(`${node.prop}: ${resolvedValue}`)
      }
    })

    if (declarations.length === 0 && !hasNestedAtRule) {
      return
    }

    rules.push({
      className,
      declarations: declarations.join("; "),
      inlineable: inlineable && !insideAtRule && !hasNestedAtRule,
      originalRule: rule.toString(),
    })
  }

  root.walkAtRules("layer", (atRule) => {
    atRule.walkRules((rule) => {
      const parent = rule.parent
      const insideNestedAtRule =
        parent?.type === "atrule" && (parent as postcss.AtRule).name !== "layer"
      processRule(rule, insideNestedAtRule)
    })

    atRule.walkAtRules((nested) => {
      if (nested.name !== "layer") {
        nested.walkRules((rule) => {
          processRule(rule, true)
        })
      }
    })
  })

  root.walkRules((rule) => {
    if (rule.parent?.type === "root") {
      processRule(rule, false)
    }
  })

  return rules
}

/**
 * Build residual CSS from non-inlineable rules, stripping @layer wrappers.
 */
function buildResidualCss(css: string, inlineableClasses: Set<string>): string {
  const root = postcss.parse(css)
  const residualRules: string[] = []

  function shouldKeepRule(rule: Rule): boolean {
    const {className} = analyzeSelector(rule.selector)
    return className !== null && !inlineableClasses.has(className)
  }

  root.walkAtRules("layer", (atRule) => {
    if (atRule.params !== "utilities") {
      return
    }

    atRule.each((node) => {
      if (node.type === "rule") {
        const rule = node
        if (shouldKeepRule(rule)) {
          residualRules.push(rule.toString())
        }
      }
    })
  })

  return residualRules.join("\n\n")
}

export interface TransformResult {
  /** CSS for non-inlineable rules without @layer wrappers */
  css: string
  /** HTML with inline styles applied */
  html: string
}

/**
 * Transform HTML by inlining Tailwind styles where possible.
 * Non-inlineable styles (pseudo-classes, media queries, etc.) are returned as CSS.
 */
export async function transformWithInlineStyles(
  html: string,
  styles: string,
): Promise<TransformResult> {
  const compiler = await createCompiler(styles)
  const allClasses = extractClasses(html)
  const compiledCss = compiler.build(allClasses)
  const parsedRules = parseCompiledCss(compiledCss)

  const inlineableStyles = new Map<string, string>()
  const inlineableClasses = new Set<string>()

  for (const rule of parsedRules) {
    if (rule.inlineable) {
      inlineableStyles.set(rule.className, rule.declarations)
      inlineableClasses.add(rule.className)
    }
  }

  const residualCss = buildResidualCss(compiledCss, inlineableClasses)
  const tree = fromHtml(html, {fragment: true})

  visit(tree, "element", (node: Element) => {
    const classValue = getClassValue(node)
    if (!classValue) {
      return
    }

    const classes = classValue.split(/\s+/)
    const inlineStyles: string[] = []
    const remainingClasses: string[] = []

    for (const cls of classes) {
      const style = inlineableStyles.get(cls)
      if (style) {
        inlineStyles.push(style)
      } else {
        remainingClasses.push(cls)
      }
    }

    if (inlineStyles.length > 0) {
      const existingStyle = node.properties?.style
      const newStyle = inlineStyles.join("; ")
      node.properties = node.properties ?? {}
      node.properties.style = existingStyle
        ? `${existingStyle}; ${newStyle}`
        : newStyle
    }

    if (remainingClasses.length > 0) {
      node.properties = node.properties ?? {}
      node.properties.className = remainingClasses
    } else if (node.properties) {
      delete node.properties.className
      delete node.properties.class
    }
  })

  return {
    css: residualCss,
    html: toHtml(tree),
  }
}

export interface ShikiTailwindTransformerOptions {
  /**
   * Callback invoked after transformation indicating whether any className/class
   * attributes were detected in the code. Useful for conditionally applying
   * the transformation or showing/hiding UI elements.
   */
  onClassesDetected?: (detected: boolean) => void
  /**
   * Callback invoked with CSS rules for non-inlineable classes (hover:, sm:, etc.).
   * Receives a Map where keys are class names and values are the CSS rule strings.
   * This allows for deduplication when aggregating CSS from multiple files.
   */
  onResidualCss?: (rules: Map<string, string>) => void
  /**
   * Output format for inline styles.
   * - "html": `style="display: flex"` (HTML string syntax)
   * - "jsx": `style={{ display: 'flex' }}` (JSX object syntax)
   * @default "html"
   */
  styleFormat?: "html" | "jsx"
  /** Tailwind CSS styles to compile against */
  styles: string
}

interface CompileClassesResult {
  inlineStyles: string[]
  remainingClasses: string[]
  residualRules: Map<string, string>
}

/**
 * Compile classes and return inline styles, remaining classes, and residual CSS
 * rules.
 */
function compileClasses(
  classes: string[],
  compiler: {build(candidates: string[]): string},
): CompileClassesResult {
  const compiledCss = compiler.build(classes)
  const parsedRules = parseCompiledCss(compiledCss)

  const inlineableStyles = new Map<string, string>()
  const residualRules = new Map<string, string>()

  for (const rule of parsedRules) {
    if (rule.inlineable) {
      inlineableStyles.set(rule.className, rule.declarations)
    } else {
      residualRules.set(rule.className, rule.originalRule)
    }
  }

  const inlineStyles: string[] = []
  const remainingClasses: string[] = []

  for (const cls of classes) {
    const style = inlineableStyles.get(cls)
    if (style) {
      inlineStyles.push(style)
    } else {
      remainingClasses.push(cls)
    }
  }

  return {inlineStyles, remainingClasses, residualRules}
}

/**
 * Convert CSS declarations to JSX object syntax.
 * `"display: flex; align-items: center"` -> `"{ display: 'flex', alignItems:
 * 'center'}"`
 */
function cssToJsxObject(cssDeclarations: string[]): string {
  const props = cssDeclarations
    .flatMap((decl) => {
      return decl
        .split(";")
        .map((d) => d.trim())
        .filter(Boolean)
    })
    .map((declaration) => {
      const colonIndex = declaration.indexOf(":")
      if (colonIndex === -1) {
        return null
      }
      const prop = declaration.slice(0, colonIndex).trim()
      const value = declaration.slice(colonIndex + 1).trim()
      const camelProp = camelCase(prop)
      return `${camelProp}: '${value}'`
    })
    .filter(Boolean)

  return `{ ${props.join(", ")} }`
}

interface LineReplacementsResult {
  replacements: Map<string, string>
  residualRules: Map<string, string>
}

/**
 * Transform className attributes to style attributes in a line's text.
 * Returns replacements and residual CSS rules for non-inlineable classes.
 */
function computeLineReplacements(
  lineText: string,
  compiler: {build(candidates: string[]): string},
  styleFormat: "html" | "jsx" = "html",
): LineReplacementsResult {
  const replacements = new Map<string, string>()
  const allResidualRules = new Map<string, string>()
  const classAttrPattern = /(className|class)=(["'`])([^"'`]*)\2/g
  let match

  while ((match = classAttrPattern.exec(lineText)) !== null) {
    const fullMatch = match[0]
    const attrName = match[1]
    const quote = match[2]
    const classValue = match[3]

    const classes = classValue.split(/\s+/).filter(Boolean)
    if (classes.length === 0) {
      continue
    }

    const {inlineStyles, remainingClasses, residualRules} = compileClasses(
      classes,
      compiler,
    )

    for (const [className, rule] of residualRules) {
      allResidualRules.set(className, rule)
    }

    if (inlineStyles.length === 0) {
      continue
    }

    let replacement: string
    if (styleFormat === "jsx") {
      const jsxStyleObj = cssToJsxObject(inlineStyles)
      replacement = `style={${jsxStyleObj}}`
    } else {
      replacement = `style=${quote}${inlineStyles.join("; ")}${quote}`
    }

    if (remainingClasses.length > 0) {
      replacement += ` ${attrName}=${quote}${remainingClasses.join(" ")}${quote}`
    }

    replacements.set(fullMatch, replacement)
  }

  return {replacements, residualRules: allResidualRules}
}

interface TransformSourceResult {
  /** Whether any className/class attributes were detected in the code */
  classesDetected: boolean
  /** CSS rules for non-inlineable classes */
  residualRules: Map<string, string>
  /** Transformed source code */
  source: string
}

/**
 * Transform className/class attributes to inline styles in source code.
 * This runs BEFORE Shiki tokenization to preserve proper syntax highlighting.
 */
function transformSourceCode(
  source: string,
  compiler: {build(candidates: string[]): string},
  styleFormat: "html" | "jsx" = "html",
): TransformSourceResult {
  const allResidualRules = new Map<string, string>()
  let classesDetected = false

  const {replacements, residualRules} = computeLineReplacements(
    source,
    compiler,
    styleFormat,
  )

  if (replacements.size > 0 || residualRules.size > 0) {
    classesDetected = true
  }

  for (const [cls, rule] of residualRules) {
    allResidualRules.set(cls, rule)
  }

  // Apply all replacements to the source
  let transformed = source
  for (const [original, replacement] of replacements) {
    transformed = transformed.replaceAll(original, replacement)
  }

  return {
    classesDetected,
    residualRules: allResidualRules,
    source: transformed,
  }
}

/**
 * Create a Shiki transformer that inlines Tailwind styles.
 * Uses preprocess to transform source code BEFORE tokenization,
 * ensuring proper syntax highlighting of the transformed output.
 * Must be called with `await` before using the transformer.
 */
export async function createShikiTailwindTransformer(
  options: ShikiTailwindTransformerOptions,
): Promise<ShikiTransformer> {
  const {
    onClassesDetected,
    onResidualCss,
    styleFormat = "html",
    styles,
  } = options
  const compiler = await createCompiler(styles)

  return {
    name: "shiki-transformer-tailwind-to-inline",
    preprocess(code) {
      const {classesDetected, residualRules, source} = transformSourceCode(
        code,
        compiler,
        styleFormat,
      )

      onClassesDetected?.(classesDetected)

      if (onResidualCss && residualRules.size > 0) {
        onResidualCss(residualRules)
      }

      return source
    },
  }
}
