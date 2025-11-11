// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import path from "path"
import {format, type Options} from "prettier"
import type {JSONOutput} from "typedoc"

import type {FormattedType} from "@qualcomm-ui/typedoc-common"

import {isTypeOverride} from "../guards"

import {dedent} from "./dedent"
import type {KnownInterfaces, QuiDeclarationReflection} from "./types"

/**
 * TypeDoc expands default generics, which is not desirable.
 * TODO: find out how to disable instead of filtering after the fact.
 */
const knownGenerics =
  /(ReactElement)|(React\.ReactElement)|(SyntheticEvent)|(React\.SyntheticEvent)|(MouseEvent)|(React\.MouseEvent)/

export function getName(
  decl: QuiDeclarationReflection | JSONOutput.SignatureReflection,
) {
  return decl.name === "default"
    ? path.parse(getFileName(decl) || "default").name
    : decl.name
}

function getFileName(
  decl: QuiDeclarationReflection | JSONOutput.SignatureReflection,
) {
  const src = decl.sources?.[0]
  if (!src) {
    return null
  }

  return path.basename(src.fileName)
}

/**
 * We enhance each component's props with a @docLink tag which points to the
 * relative link of the prop on the docs site.
 *
 * @example
 * `@docLink /components/icon-button#props`.
 *
 * This function resolves this property from the parsed json for easy lookup in the
 * symbol map.
 */
export function extractDocLink(
  comment: JSONOutput.Comment | undefined,
): string | undefined {
  if (!comment) {
    return undefined
  }
  const docLinkTag = (comment.blockTags ?? []).find(
    (tag) => tag.tag === "@docLink",
  )
  if (!docLinkTag) {
    return undefined
  }
  return docLinkTag.content[0].text
}

export function getInheritDoc(comment: JSONOutput.Comment | undefined) {
  return (comment ?? {blockTags: []}).blockTags?.find(
    (tag) => tag.tag === "@inheritDoc",
  )
}

export function getFileGitUrl(
  decl: QuiDeclarationReflection | JSONOutput.SignatureReflection,
): string | undefined {
  const src = decl.sources?.[0]
  if (!src) {
    return
  }

  return src.url
}

export function escape(src: string) {
  return src
    .replace(/\[/g, "\\[")
    .replace(/\</g, "\\<")
    .replace(/\*/g, "\\*")
    .replace(/\-/g, "\\-")
    .replace(/\|/g, "\\|")
    .replace(/\`/g, "\\`")
    .replace(/\{/g, "\\{")
}

export const defaultPrintWidth = 30

const prettierOpts: Options = {
  bracketSpacing: false,
  endOfLine: "auto",
  jsxSingleQuote: true,
  parser: "typescript",
  printWidth: defaultPrintWidth,
  semi: false,
  singleQuote: true,
  trailingComma: "all",
}

const prettierCache: Record<string, string> = {}

export async function prettyType(type: string, printWidth: number) {
  // optimization: prettier is expensive, so skip it if it's unnecessary. This
  // bail-out results in a 50% speed increase.
  if (!type.includes(" ") && type.length <= printWidth) {
    return type
  }
  if (prettierCache[type]) {
    return prettierCache[type]
  }
  try {
    // we need valid typescript for prettier to work.
    const dummyType = `type ___DUMMY = ${type}`
    const result = await format(dummyType, {
      ...prettierOpts,
      printWidth,
    })
    const formatted = dedent(result.replace("type ___DUMMY =", " ").trim())
    prettierCache[type] = formatted
    return formatted
  } catch (e) {
    return type
  }
}

export async function prettyImportStatement(str: string): Promise<string> {
  if (prettierCache[str]) {
    return prettierCache[str]
  }
  try {
    prettierCache[str] = (await format(str, prettierOpts)).trim()
    return prettierCache[str]
  } catch (e) {
    return str
  }
}

function replaceType(
  type: string,
  paramsReplacer: Record<string, string> | undefined,
) {
  return paramsReplacer ? (paramsReplacer[type] ?? type) : type
}

type ParseTypeOpts = {
  /**
   * Log debug messages.
   */
  debug?: boolean

  isInheritDoc?: boolean

  isPartOfUnion?: boolean

  isTypeArgument?: boolean

  /**
   * Replacement string for each typeParameter
   */
  paramsReplacer?: Record<string, string>
}

/**
 * This class is responsible for resolving and formatting each property's TypeScript
 * type. The result is a condensed string that represents a valid TypeScript type
 * for the API property.
 */
export class TypeFormatter {
  private readonly knownInterfaces

  constructor(knownInterfaces: KnownInterfaces | undefined) {
    this.knownInterfaces = knownInterfaces ?? {}
  }

  formatSignature(
    signatures: JSONOutput.SignatureReflection[],
    opts: ParseTypeOpts,
  ) {
    const s = signatures[0]

    const typeOverride = isTypeOverride(s.comment)
    if (typeOverride) {
      return typeOverride
    }

    const params = s.parameters?.map((p) => {
      const inheritDoc = getInheritDoc(p.comment)
      if (inheritDoc) {
        if (p.type?.type === "reference") {
          // TODO: link to docLink in UI. Can we add a link in a highlighted
          //  syntax block with prism or hljs?
          return `${p.name}: ${p.type.name}${
            p.type.typeArguments
              ? `<${p.type.typeArguments
                  .map((type) =>
                    this.formatType(type, {
                      ...opts,
                      isTypeArgument: true,
                    }),
                  )
                  .join(", ")
                  .trim()}>`
              : ""
          }`
        }
      }
      const name = `${p.flags.isRest ? "..." : ""}${
        p.name.includes("-") ? `"${p.name}"` : p.name
      }`
      return `${name}${p.flags?.isOptional ? "?" : ""}: ${replaceType(
        p.type
          ? this.formatType(p.type as JSONOutput.SomeType, opts)
          : "unknown",
        opts.paramsReplacer,
      )}`
    })

    const type = replaceType(
      s.type ? this.formatType(s.type as JSONOutput.SomeType, opts) : "unknown",
      opts.paramsReplacer,
    )
    const startParens = opts.isPartOfUnion ? "((" : "("
    const endParens = opts.isPartOfUnion ? ")" : ""
    return `${startParens}${params?.join(", ") || ""}) => ${type}${endParens}`
  }

  formatType(
    t: JSONOutput.SomeType | undefined,
    optsParam?: ParseTypeOpts,
  ): string {
    const opts = optsParam ?? {}
    if (opts.debug) {
      console.debug(t)
    }
    if (!t?.type) {
      return ""
    }

    switch (t.type) {
      case "array":
        switch (t.elementType.type) {
          case "literal":
          case "intrinsic":
            return `${this.formatType(t.elementType)}[]`
          case "reference":
            return opts.isInheritDoc
              ? `${this.formatType(t.elementType, opts)}[]`
              : `Array<${this.formatType(t.elementType, opts)}>`
          default:
            return `Array<${this.formatType(t.elementType, opts)}>`
        }

      case "conditional":
        return `${this.formatType(t.checkType, opts)} extends ${this.formatType(
          t.extendsType,
          opts,
        )} ? ${this.formatType(t.trueType, opts)} : ${this.formatType(
          t.falseType,
          opts,
        )}`

      case "indexedAccess":
        const formattedType = `${this.formatType(t.objectType, opts)}[${this.formatType(
          t.indexType,
          opts,
        )}]`

        // TODO: fix with proper reference lookup.
        if (
          formattedType.startsWith("(typeof (typeof { ") &&
          formattedType.includes(")[keyof (typeof ")
        ) {
          return formattedType.substring(
            16,
            formattedType.indexOf(")[keyof (typeof "),
          )
        }

        return formattedType

      case "intersection":
        return t.types.map((type) => this.formatType(type, opts)).join(" & ")

      case "predicate":
        return `${t.asserts ? "asserts " : ""}${t.name}${
          t.targetType ? ` is ${this.formatType(t.targetType, opts)}` : ""
        }`

      case "reference":
        if (knownGenerics.test(t.name)) {
          return t.name
        } else if (opts.isInheritDoc) {
          return `${t.name}${
            t.typeArguments
              ? `<${t.typeArguments
                  .map((type) =>
                    this.formatType(type, {...opts, isTypeArgument: true}),
                  )
                  .join(", ")
                  .trim()}>`
              : ""
          }`
        } else if (
          t.refersToTypeParameter &&
          typeof t.target === "number" &&
          t.target === -1
        ) {
          // do nothing, will resolve with replaceTypes
        } else if (typeof t.target === "number") {
          // every reference target with type number has an equivalent interface by
          // name
          const known = this.knownInterfaces[t.name]
          if (known) {
            if (known.qualifiedName.match(/Q.*Props/)) {
              // Return props interfaces of our components instead of expanding the
              // entire prop's type. This prevents prop parameters from expanding to
              // an ugly, massive type in the table.
              // TODO: this might not be necessary anymore with the @inheritDoc tag.
              return known.qualifiedName
            }
            return known.resolvedType?.type as string
          }
        } else if (
          typeof t.target === "object" &&
          t.target.qualifiedName &&
          this.knownInterfaces?.[t.target.qualifiedName]
        ) {
          // signature parameters don't have a number for t.target. We resolve using
          // the name.
          return this.knownInterfaces[t.target.qualifiedName].resolvedType
            ?.type as string
        }
        const res = `${t.name}${
          t.typeArguments
            ? `<${t.typeArguments
                .map((type) =>
                  this.formatType(type, {...opts, isTypeArgument: true}),
                )
                .join(", ")
                .trim()}>`
            : ""
        }`
        return replaceType(res, opts.paramsReplacer)

      case "reflection": {
        const obj: {
          name: string
          optional: boolean | undefined
          type: FormattedType
        }[] = []
        const {children, signatures} = t.declaration

        if (children && children.length > 0) {
          children.forEach((child) => {
            obj.push({
              name: child.name.includes("-") ? `"${child.name}"` : child.name,
              optional: child.flags?.isOptional,
              type:
                // exported variable with methods
                child.signatures?.length && !child.type
                  ? this.formatSignature(child.signatures, opts)
                  : this.formatType(child.type as JSONOutput.SomeType, opts),
            })
          })

          return `{ ${obj
            .map((param) => {
              return `${param.name}${param.optional ? "?" : ""}: ${param.type}`
            })
            .join("; ")} }`
        }

        if (signatures && signatures.length) {
          return this.formatSignature(signatures, opts)
        }

        return "{}"
      }

      case "templateLiteral":
        return `\`${t.tail
          .map((tail) => {
            return `${t.head.replace(/\n/g, "\\n")}$\{${escape(
              this.formatType(tail[0], opts),
            )}}${tail[1].replace(/\n/g, "\\n")}`
          })
          .join("")}\``

      case "literal":
        return typeof t.value === "string"
          ? `'${t.value}'`
          : typeof t.value === "number" || typeof t.value === "boolean"
            ? `${t.value}`
            : // this should never happen
              "object"

      case "tuple":
        return `[${
          t.elements?.map((type) => this.formatType(type, opts)).join(", ") ||
          ""
        }]`

      case "typeOperator":
        return `${t.operator} ${this.formatType(t.target, opts)}`

      case "union":
        return t.types
          .map((type) => this.formatType(type, {...opts, isPartOfUnion: true}))
          .filter((t) => !!t?.trim().length)
          .join(" | ")

      case "query":
        return `(typeof ${this.formatType(t.queryType, opts)})`

      case "inferred":

      case "intrinsic":

      case "unknown":
        return t.name

      default:
        return "any"
    }
  }
}
