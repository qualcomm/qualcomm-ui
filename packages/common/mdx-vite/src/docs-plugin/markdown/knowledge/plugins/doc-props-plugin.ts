// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Parent} from "mdast"
import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import {readFile} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import type {SimplifiedProp} from "@qualcomm-ui/mdx-common"
import type {
  QuiComment,
  QuiCommentDisplayPart,
} from "@qualcomm-ui/typedoc-common"

import {extractNamesFromAttribute} from "../../mdx-utils"
import type {ComponentProps, DocProps, PropInfo} from "../types"
import {exists} from "../utils"

function extractBestType(propInfo: PropInfo): string {
  const type = propInfo.resolvedType?.prettyType || propInfo.type

  return cleanType(type.startsWith("| ") ? type.substring(2) : type)
}

function extractRequired(propInfo: PropInfo, isPartial: boolean): boolean {
  return Boolean(propInfo.resolvedType?.required && !isPartial)
}

function cleanType(type: string): string {
  return type.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
}

function cleanDefaultValue(defaultValue: string): string {
  return defaultValue.replace(/^\n+/, "").replace(/\n+$/, "").trim()
}

function escapeText(value: string): string {
  return value.replace(/\n/g, " ")
}

function propsToDefinitionList(props: SimplifiedProp[]): string {
  if (props.length === 0) {
    return ""
  }

  return props
    .map((prop) => {
      const parts = [`- **${prop.name}** (\`${escapeText(prop.type)}\``]

      if (prop.defaultValue) {
        parts.push(`, default: \`${escapeText(prop.defaultValue)}\``)
      }
      if (prop.required) {
        parts.push(", required")
      }

      parts.push(")")

      if (prop.description) {
        parts.push(` - ${escapeText(prop.description)}`)
      }

      return parts.join("")
    })
    .join("\n")
}

export interface PropFormatterOptions {
  docPropsPath?: string
  routeDir: string
  verbose?: boolean
}

export class PropFormatter {
  private docProps: DocProps | null = null
  private readonly docPropsPath?: string
  private readonly routeDir: string
  private readonly verbose: boolean

  constructor(options: PropFormatterOptions) {
    this.docPropsPath = options.docPropsPath
    this.routeDir = options.routeDir
    this.verbose = options.verbose ?? false
  }

  async loadDocProps(): Promise<DocProps | null> {
    if (this.docProps) {
      return this.docProps
    }
    const resolvedDocPropsPath = this.docPropsPath
      ? (await exists(this.docPropsPath))
        ? this.docPropsPath
        : resolve(process.cwd(), this.docPropsPath)
      : join(dirname(this.routeDir), "doc-props.json")

    if (!(await exists(resolvedDocPropsPath))) {
      if (this.verbose) {
        console.log(`Doc props file not found at: ${resolvedDocPropsPath}`)
      }
      return null
    }

    try {
      const content = await readFile(resolvedDocPropsPath, "utf-8")
      const docProps = JSON.parse(content) as DocProps
      if (this.verbose) {
        console.log(`Loaded doc props from: ${resolvedDocPropsPath}`)
        console.log(
          `Found ${Object.keys(docProps.props).length} component types`,
        )
      }
      this.docProps = docProps
      return docProps
    } catch (error) {
      if (this.verbose) {
        console.log("Error loading doc props", error)
      }
      return null
    }
  }

  private formatCommentParts(parts: QuiCommentDisplayPart[]): string {
    return parts
      .map((part) => {
        switch (part.kind) {
          case "text":
            return part.text
          case "code":
            const codeText = part.text
              .replace(/```\w*\n?/g, "") // Remove opening code blocks with optional language
              .replace(/\n?```/g, "") // Remove closing code blocks
              .trim()

            if (codeText.includes("\n")) {
              return `\`\`\`\n${codeText}\n\`\`\``
            } else {
              return codeText
            }
          default:
            if (
              "tag" in part &&
              part.tag === "@link" &&
              typeof part.target === "string"
            ) {
              if (part.text === "Learn more") {
                return ""
              }
            }
            return part.text
        }
      })
      .join("")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  private formatComment(comment: QuiComment | null): string {
    if (!comment) {
      return ""
    }

    const parts: string[] = []

    if (comment.summary && comment.summary.length > 0) {
      const summaryText = this.formatCommentParts(comment.summary)
      if (summaryText.trim()) {
        parts.push(summaryText.trim())
      }
    }

    if (comment.blockTags && comment.blockTags.length > 0) {
      for (const blockTag of comment.blockTags) {
        const tagContent = this.formatCommentParts(blockTag.content)
        if (tagContent.trim()) {
          const tagName = blockTag.tag.replace("@", "")

          if (tagName === "default" || tagName === "defaultValue") {
            continue
          }

          if (tagName === "example") {
            parts.push(`**Example:**\n\`\`\`\n${tagContent.trim()}\n\`\`\``)
          } else {
            parts.push(`**${tagName}:** ${tagContent.trim()}`)
          }
        }
      }
    }

    return parts.join("\n\n")
  }

  extractProps(props: ComponentProps, isPartial: boolean): SimplifiedProp[] {
    const propsInfo: SimplifiedProp[] = []

    if (props.props?.length) {
      propsInfo.push(
        ...props.props.map((prop) => this.convertPropInfo(prop, isPartial)),
      )
    }
    if (props.input?.length) {
      propsInfo.push(
        ...props.input.map((prop) =>
          this.convertPropInfo(prop, isPartial, "input"),
        ),
      )
    }
    if (props.output?.length) {
      propsInfo.push(
        ...props.output.map((prop) =>
          this.convertPropInfo(prop, isPartial, "output"),
        ),
      )
    }

    return propsInfo
  }

  private convertPropInfo(
    propInfo: PropInfo,
    isPartial: boolean,
    propType: "input" | "output" | undefined = undefined,
  ): SimplifiedProp {
    return {
      name: propInfo.name,
      type: extractBestType(propInfo),
      ...(propInfo.defaultValue && {
        defaultValue: cleanDefaultValue(propInfo.defaultValue),
      }),
      description: this.formatComment(propInfo.comment || null),
      propType,
      required: extractRequired(propInfo, isPartial) || undefined,
    }
  }

  /**
   * Creates a remark plugin that replaces TypeDocProps JSX elements with
   * Markdown tables containing component prop documentation.
   */
  propsToMarkdownList(): Plugin {
    return () => (tree, _file, done) => {
      visit(
        tree,
        "mdxJsxFlowElement",
        (
          node: MdxJsxFlowElement,
          index: number | undefined,
          parent: Parent | undefined,
        ) => {
          if (node?.name !== "TypeDocProps") {
            return
          }
          const nameAttr = node.attributes?.find(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "name",
          )
          const isPartial = node.attributes?.some(
            (attr): attr is MdxJsxAttribute =>
              attr.type === "mdxJsxAttribute" && attr.name === "partial",
          )
          if (!this.docProps || !nameAttr) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propsNames = extractNamesFromAttribute(nameAttr)
          if (propsNames.length === 0) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propsName = propsNames[0]
          const componentProps = this.docProps.props[propsName]
          if (!componentProps) {
            if (this.verbose) {
              console.log(`  TypeDocProps not found: ${propsName}`)
            }
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }
          const propTypes = this.extractProps(
            componentProps,
            Boolean(isPartial),
          )
          if (this.verbose) {
            console.log(
              `  Replaced TypeDocProps ${propsName} with API documentation`,
            )
          }

          const regularProps = propTypes.filter((p) => p.propType === undefined)
          const inputs = propTypes.filter((p) => p.propType === "input")
          const outputs = propTypes.filter((p) => p.propType === "output")

          const sections: string[] = []

          if (regularProps.length > 0) {
            sections.push(propsToDefinitionList(regularProps))
          }

          if (inputs.length > 0) {
            sections.push(`**Inputs**\n\n${propsToDefinitionList(inputs)}`)
          }

          if (outputs.length > 0) {
            sections.push(`**Outputs**\n\n${propsToDefinitionList(outputs)}`)
          }

          const markdownContent = sections.join("\n\n")

          if (!markdownContent) {
            if (parent && index !== undefined) {
              parent.children.splice(index, 1)
            }
            return
          }

          Object.assign(node, {
            data: {typeDocProps: {name: propsName, props: propTypes}},
            lang: null,
            meta: null,
            type: "code",
            value: markdownContent,
          })
        },
      )
      done()
    }
  }
}
