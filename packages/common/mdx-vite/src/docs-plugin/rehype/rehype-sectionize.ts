// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Element, Root, RootContent} from "hast"
import {heading} from "hast-util-heading"
import {headingRank} from "hast-util-heading-rank"
import type {Properties} from "hastscript"
import type {Plugin} from "unified"

import {PAGE_HEADER_COMPONENT_NAME} from "../remark/remark-frontmatter-title.js"
import {STEPS_COMPONENT_NAME} from "../remark/remark-steps.js"

export type RehypeSectionizeOptions = {
  enableRootSection?: boolean | undefined
  idPropertyName?: string | undefined
  properties?: Properties | undefined
  rankPropertyName?: string | undefined
}

const defaultOptions: Required<RehypeSectionizeOptions> = {
  enableRootSection: false,
  idPropertyName: "ariaLabelledby",
  properties: {},
  rankPropertyName: "dataHeadingRank",
}

const wrappingRank = (
  rootContent: RootContent | undefined,
  rankPropertyName: RehypeSectionizeOptions["rankPropertyName"],
) => {
  if (
    rootContent == null ||
    rankPropertyName == null ||
    !("properties" in rootContent)
  ) {
    throw new Error("rootContent and rankPropertyName must have value")
  }

  const rank = rootContent.properties?.[rankPropertyName]
  if (typeof rank !== "number") {
    throw new Error(`rankPropertyName(${rankPropertyName}) must be number`)
  }

  return rank
}

const createElement = (
  rank: number,
  options: Pick<
    RehypeSectionizeOptions,
    "properties" | "rankPropertyName" | "idPropertyName"
  >,
  children: Element[] = [],
) => {
  const {idPropertyName, properties, rankPropertyName} = options

  if (
    properties != null &&
    rankPropertyName != null &&
    rankPropertyName in properties
  ) {
    throw new Error(
      `rankPropertyName(${rankPropertyName}) dataHeadingRank must exist`,
    )
  }

  const id = children.at(0)?.properties?.id
  const element: Element = {
    children,
    properties: {
      className: ["heading"],
      ...(rankPropertyName ? {[rankPropertyName]: rank} : {}),
      ...(idPropertyName && typeof id === "string"
        ? {[idPropertyName]: id}
        : {}),
      ...(properties ? properties : {}),
    },
    tagName: "section",
    type: "element",
  }

  return element
}

const isPageHeader = (node: RootContent) =>
  node.type === "mdxJsxFlowElement" && node.name === PAGE_HEADER_COMPONENT_NAME

/**
 * Groups the page header and the content between it and the first heading.
 * ESM nodes stay at the root because MDX only compiles them at the top level.
 */
const wrapPageIntro = (children: RootContent[]): RootContent[] => {
  const start = children.findIndex(isPageHeader)
  if (start === -1) {
    return children
  }

  const end = children.findIndex(
    (node, index) => index > start && heading(node),
  )
  const introContent = children.slice(start, end === -1 ? undefined : end)

  const intro: Element = {
    children: introContent.filter(
      (node) => node.type !== "mdxjsEsm",
    ) as Element[],
    properties: {className: ["qui-docs__page-intro"]},
    tagName: "div",
    type: "element",
  }

  return [
    ...children.slice(0, start),
    ...introContent.filter((node) => node.type === "mdxjsEsm"),
    intro,
    ...(end === -1 ? [] : children.slice(end)),
  ]
}

type ResolvedSectionizeOptions = Required<
  Omit<RehypeSectionizeOptions, "enableRootSection">
>

const STEP_SECTION_CLASS_NAME = "qui-docs__step-section"

const isStepsComponent = (node: RootContent) =>
  node.type === "mdxJsxFlowElement" && node.name === STEPS_COMPONENT_NAME

/**
 * Wraps each heading and its trailing content in a `section`, nesting sections
 * by heading rank. Returns the root wrapper, whose children are the top-level
 * sections and any content preceding the first heading.
 */
const sectionize = (
  children: RootContent[],
  options: ResolvedSectionizeOptions,
): Element => {
  const rootWrapper = createElement(0, options)

  const wrapperStack: RootContent[] = []
  wrapperStack.push(rootWrapper)

  const lastStackItem = () => {
    const last = wrapperStack.at(-1)
    if (last == null || last.type !== "element") {
      throw new Error("lastStackItem must be Element")
    }
    return wrapperStack.at(-1) as Element
  }

  for (const rootContent of children) {
    if (heading(rootContent)) {
      const rank = headingRank(rootContent)
      if (rank == null) {
        throw new Error("heading or headingRank is not working")
      }

      if (rank > wrappingRank(lastStackItem(), options.rankPropertyName)) {
        const childWrapper = createElement(rank, options, [rootContent])
        lastStackItem().children.push(childWrapper)
        wrapperStack.push(childWrapper)
      } else if (
        rank <= wrappingRank(lastStackItem(), options.rankPropertyName)
      ) {
        while (
          rank <= wrappingRank(lastStackItem(), options.rankPropertyName)
        ) {
          wrapperStack.pop()
        }
        const siblingWrapper = createElement(rank, options, [rootContent])

        lastStackItem().children.push(siblingWrapper)
        wrapperStack.push(siblingWrapper)
      }
    } else {
      if (rootContent.type === "doctype") {
        throw new Error("must be used in a fragment")
      }
      /**
       * Steps headings are sectionized within their own wrapper so that each
       * step is scoped to the steps block instead of the page outline.
       */
      if (isStepsComponent(rootContent) && "children" in rootContent) {
        rootContent.children = sectionize(rootContent.children, {
          ...options,
          properties: {
            ...options.properties,
            className: [STEP_SECTION_CLASS_NAME],
          },
        }).children
      }
      lastStackItem().children.push(rootContent as any)
    }
  }

  return rootWrapper
}

export const rehypeSectionize: Plugin<[RehypeSectionizeOptions?], Root> = (
  options = defaultOptions,
) => {
  const {enableRootSection, ...rest} = {
    enableRootSection:
      options.enableRootSection ?? defaultOptions.enableRootSection,
    idPropertyName: options.idPropertyName ?? defaultOptions.idPropertyName,
    properties: options.properties ?? defaultOptions.properties,
    rankPropertyName:
      options.rankPropertyName ?? defaultOptions.rankPropertyName,
  }

  return (root) => {
    const rootWrapper = sectionize(wrapPageIntro(root.children), rest)

    return {
      ...root,
      children: enableRootSection ? [rootWrapper] : rootWrapper.children,
    }
  }
}
