// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MdxJsxAttribute} from "mdast-util-mdx-jsx"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {type Plugin, unified} from "unified"
import {visit} from "unist-util-visit"

import {
  type PageDocProps,
  type PageHeading,
  type PagePropType,
  UniqueIdService,
} from "@qualcomm-ui/mdx-common"
import type {
  QuiPropDeclaration,
  QuiPropTypes,
} from "@qualcomm-ui/typedoc-common"

import type {IndexedSection} from "../markdown"

function extractPickPropsRecord(
  node: MdxJsxAttribute,
): Record<string, string[]> | null {
  if (
    node.name !== "unionWithPick" ||
    !node.value ||
    typeof node.value === "string"
  ) {
    return null
  }

  const estree = node.value.data?.estree
  if (!estree?.body?.[0] || estree.body[0].type !== "ExpressionStatement") {
    return null
  }

  const expression = estree.body[0].expression
  if (expression.type !== "ObjectExpression") {
    return null
  }

  const result: Record<string, string[]> = {}

  for (const property of expression.properties) {
    if (property.type !== "Property" || property.key.type !== "Identifier") {
      continue
    }

    if (property.value.type !== "ArrayExpression") {
      continue
    }

    const key = property.key.name
    const values: string[] = []

    for (const element of property.value.elements) {
      if (element?.type === "Literal" && typeof element.value === "string") {
        values.push(element.value)
      }
    }

    result[key] = values
  }

  return result
}

const targetMdxElements: string[] = [
  "TypeDocProps",
  "TypeDocAttributes",
  "TypeDocAngularAttributes",
]

interface DocPropEntry {
  name: string
  omitFrom?: string[]
}

export class DocPropsIndexer {
  docPropsEntries: DocPropEntry[] = []
  idService: UniqueIdService = new UniqueIdService()
  private readonly props: Record<string, QuiPropTypes>
  private pageDocProps: PageDocProps = {}

  constructor(props: Record<string, QuiPropTypes>) {
    this.props = props
  }

  reset(): void {
    this.idService.reset()
    this.docPropsEntries = []
  }

  private extractNamesFromAttribute(attr: MdxJsxAttribute): string[] {
    if (!attr.value) {
      return []
    }

    if (typeof attr.value === "string") {
      return [attr.value]
    }

    if (attr.value.type === "mdxJsxAttributeValueExpression") {
      const estree = attr.value.data?.estree
      if (!estree?.body?.[0] || estree.body[0].type !== "ExpressionStatement") {
        return []
      }

      const expression = estree.body[0].expression

      if (expression.type === "ArrayExpression") {
        const names: string[] = []
        for (const element of expression.elements) {
          if (
            element?.type === "Literal" &&
            typeof element.value === "string"
          ) {
            names.push(element.value)
          }
        }
        return names
      }

      // Handle single string expression
      if (
        expression.type === "Literal" &&
        typeof expression.value === "string"
      ) {
        return [expression.value]
      }
    }

    return []
  }

  /**
   * Finds all JSX `<TypeDocProps />` nodes on the current page and adds their names
   * to an array. Once all nodes have been collected, we process them into
   * `PageSection` entries for the search index.
   */
  getTypeDocPropsNodes: Plugin = () => {
    return (tree, _file, done) => {
      visit(tree, "mdxJsxFlowElement", (node: any) => {
        if (node && "name" in node && targetMdxElements.includes(node.name)) {
          const nameAttr = node.attributes?.find(
            (attr: MdxJsxAttribute) => attr.name === "name",
          )
          const omitFromAttr = node.attributes?.find(
            (attr: MdxJsxAttribute) => attr.name === "omitFrom",
          )
          const omitFrom = omitFromAttr
            ? this.extractNamesFromAttribute(omitFromAttr)
            : undefined

          if (nameAttr) {
            const names = this.extractNamesFromAttribute(nameAttr)
            for (const name of names) {
              this.docPropsEntries.push({name, omitFrom})
              if (name.endsWith("Props")) {
                // also index the corresponding component for lookup on this page.
                this.docPropsEntries.push({name: name.slice(0, -5), omitFrom})
              }
            }
          }

          const unionWithPickAttr: MdxJsxAttribute = node.attributes?.find(
            (attr: MdxJsxAttribute) => attr.name === "unionWithPick",
          )
          if (unionWithPickAttr) {
            try {
              const unionWithPick = extractPickPropsRecord(unionWithPickAttr)
              if (unionWithPick) {
                this.docPropsEntries.push(
                  ...Object.keys(unionWithPick).map((entry) => ({
                    name: entry,
                    omitFrom,
                  })),
                )
              }
            } catch (e) {}
          }
        }
      })
      done()
    }
  }

  build(fileContents: string, toc: PageHeading[]): IndexedSection[] | null {
    // parse the Markdown into an AST
    unified()
      .use(remarkMdx)
      // find the TypeDocProp nodes
      .use(this.getTypeDocPropsNodes)
      .use(remarkParse)
      .use(remarkStringify)
      .processSync(fileContents)

    if (!this.docPropsEntries.length) {
      return null
    }

    for (const item of toc) {
      this.idService.add(item.id)
    }

    return this.docPropsEntries
      .map((entry): IndexedSection[] => {
        const propTypes = this.props[entry.name]
        if (!propTypes) {
          return []
        }

        const omittedProps = new Set<string>(
          (entry.omitFrom ?? [])
            .map((entry) => {
              const propTypes = this.props[entry]
              if (!propTypes) {
                return []
              }
              return [
                propTypes.props,
                propTypes.input,
                propTypes.output,
                propTypes.publicMethods,
              ].reduce((acc: string[], current) => {
                if (current) {
                  acc.push(...current.map((prop) => prop.name))
                }
                return acc
              }, [])
            })
            .flat(1)
            .filter(Boolean),
        )

        const sections: IndexedSection[] = []

        const assembleProps = (
          propsInput: QuiPropDeclaration[] | undefined,
        ): PagePropType[] | undefined => {
          if (!propsInput) {
            return undefined
          }
          const props: PagePropType[] = []
          for (const prop of propsInput) {
            if (omittedProps.has(prop.name)) {
              continue
            }
            const id = this.idService.add(prop.name)
            props.push({...prop, id})
            sections.push(this.assembleProp(prop, id))
          }
          return props
        }

        this.pageDocProps[entry.name] = {
          ...this.props[entry.name],
          input: assembleProps(propTypes.input),
          output: assembleProps(propTypes.output),
          props: assembleProps(propTypes.props),
          publicMethods: assembleProps(propTypes.publicMethods),
        }
        return sections
      })
      .flat()
  }

  getDocProps(): PageDocProps {
    return this.docPropsEntries.reduce((acc: PageDocProps, entry) => {
      const propTypes = this.pageDocProps[entry.name]
      // TODO: convert code comments to HTML using rehype. Remove markdown-to-jsx
      //  in @qualcomm-ui/react-mdx library.
      if (propTypes) {
        acc[entry.name] = propTypes
      }
      return acc
    }, {})
  }

  private assembleProp(prop: QuiPropDeclaration, id: string): IndexedSection {
    const name = prop.name

    const heading: PageHeading = {
      headingLevel: 4,
      id,
      tagName: "a",
      textContent: name,
    }

    const comment = prop.comment
    if (!comment) {
      return {content: [], heading}
    }

    const content = {
      tagName: "p",
      text: [
        comment.summary
          .map((entry) => entry.text.replaceAll("\n", " "))
          .join(""),
      ],
    }
    return {content: [content], heading}
  }
}
