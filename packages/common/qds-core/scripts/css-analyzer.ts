import {readFileSync, writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import postcss, {type Rule} from "postcss"
import selectorParser from "postcss-selector-parser"

interface TokenReference {
  property: string
  token: string
}

interface SelectorState {
  dataAttributes: Array<{name: string; value?: string}>
  pseudoClasses: string[]
}

interface StateVariant {
  state?: {
    dataAttributes?: Array<{name: string; value?: string}>
    pseudoClasses?: string[]
  }
  tokens: TokenReference[]
}

interface PartAnalysis {
  className: string
  part: string
  variants: StateVariant[]
}

function extractPartName(className: string): string {
  const parts = className.split("__")
  return parts[1] || "unknown"
}

function extractSelectorState(selector: string): SelectorState {
  const pseudoClasses: string[] = []
  const dataAttributes: Array<{name: string; value?: string}> = []

  selectorParser((selectors) => {
    selectors.each((selector) => {
      selector.walkPseudos((pseudo) => {
        if (pseudo.value) {
          pseudoClasses.push(pseudo.value)
        }
      })

      selector.walkAttributes((attr) => {
        dataAttributes.push(
          attr.value
            ? {name: attr.attribute, value: attr.value}
            : {name: attr.attribute},
        )
      })
    })
  }).processSync(selector)

  return {dataAttributes, pseudoClasses}
}

function extractClassName(selector: string): string | null {
  let className: string | null = null

  selectorParser((selectors) => {
    selectors.each((selector) => {
      selector.walkClasses((classNode) => {
        if (!className) {
          className = classNode.value
        }
      })
    })
  }).processSync(selector)

  return className
}

function extractVariablesFromValue(value: string): string[] {
  const variables: string[] = []
  value.replace(/var\((--[^)]+)\)/g, (_, variable) => {
    variables.push(variable)
    return _
  })
  return variables
}

function collectStatePaths(
  rule: Rule,
  parentState: SelectorState,
  parentVariables: Map<string, string>,
  parentProperties: Map<string, string[]>,
  paths: Array<{
    properties: Map<string, string[]>
    state: SelectorState
    variables: Map<string, string>
  }>,
): void {
  const currentState = extractSelectorState(rule.selector)
  const mergedState: SelectorState = {
    dataAttributes: [
      ...parentState.dataAttributes,
      ...currentState.dataAttributes,
    ],
    pseudoClasses: [
      ...parentState.pseudoClasses,
      ...currentState.pseudoClasses,
    ],
  }

  const currentVariables = new Map(parentVariables)
  const currentProperties = new Map(parentProperties)

  rule.walkDecls((decl) => {
    if (decl.parent !== rule) {
      return
    }

    if (decl.prop.startsWith("--")) {
      const vars = extractVariablesFromValue(decl.value)
      if (vars.length > 0) {
        currentVariables.set(decl.prop, vars[0])
      }
    } else {
      const vars = extractVariablesFromValue(decl.value)
      if (vars.length > 0) {
        currentProperties.set(decl.prop, vars)
      }
    }
  })

  paths.push({
    properties: currentProperties,
    state: mergedState,
    variables: currentVariables,
  })

  rule.walkRules((childRule) => {
    if (childRule.parent !== rule) {
      return
    }
    collectStatePaths(
      childRule,
      mergedState,
      currentVariables,
      currentProperties,
      paths,
    )
  })
}

function resolveVariables(
  variable: string,
  definitions: Map<string, string>,
  depth = 0,
): string {
  if (depth > 10) {
    return variable
  }
  const resolved = definitions.get(variable)
  if (!resolved || resolved === variable) {
    return variable
  }
  return resolveVariables(resolved, definitions, depth + 1)
}

export async function parseCssRelationships(
  css: string,
): Promise<PartAnalysis[]> {
  const result = postcss().process(css, {from: undefined})
  const partsMap = new Map<string, PartAnalysis>()

  result.root.walkRules((rule) => {
    if (rule.parent?.type !== "root") {
      return
    }

    const className = extractClassName(rule.selector)
    if (!className) {
      return
    }

    const part = extractPartName(className)

    if (!partsMap.has(className)) {
      partsMap.set(className, {
        className,
        part,
        variants: [],
      })
    }

    const paths: Array<{
      properties: Map<string, string[]>
      state: SelectorState
      variables: Map<string, string>
    }> = []

    collectStatePaths(
      rule,
      {dataAttributes: [], pseudoClasses: []},
      new Map(),
      new Map(),
      paths,
    )

    const analysis = partsMap.get(className)!

    for (const path of paths) {
      const tokens: TokenReference[] = []

      for (const [property, variables] of path.properties) {
        for (const variable of variables) {
          const resolved = resolveVariables(variable, path.variables)
          if (resolved !== variable && !resolved.startsWith("--button-")) {
            tokens.push({property, token: resolved})
          }
        }
      }

      if (tokens.length > 0) {
        const variant: StateVariant = {tokens}
        if (
          path.state.dataAttributes.length > 0 ||
          path.state.pseudoClasses.length > 0
        ) {
          variant.state = {}
          if (path.state.dataAttributes.length > 0) {
            variant.state.dataAttributes = path.state.dataAttributes
          }
          if (path.state.pseudoClasses.length > 0) {
            variant.state.pseudoClasses = path.state.pseudoClasses
          }
        }
        analysis.variants.push(variant)
      }
    }
  })

  return Array.from(partsMap.values())
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const buttonCss = readFileSync(
  resolve(__dirname, "../src/button/qds-button.css"),
  "utf-8",
)
writeFileSync(
  resolve(__dirname, "./temp/button-css.json"),
  JSON.stringify(await parseCssRelationships(buttonCss), null, 2),
  "utf-8",
)
