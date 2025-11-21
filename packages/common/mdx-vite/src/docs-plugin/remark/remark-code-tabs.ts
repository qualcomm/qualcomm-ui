// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Code, Parent, Root} from "mdast"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

interface Tab {
  index: number
  label: string
  meta: string | undefined
  tabsGroup: string
}

function parseTabAttributes(meta: string): {
  label: string | null
  remainingMeta: string
  tabsGroup: string | null
} {
  if (!meta) {
    return {label: null, remainingMeta: "", tabsGroup: null}
  }

  const tabsMatch = meta.match(/tabs=["']([^"']+)["']|tabs=(\S+)/)
  const labelMatch = meta.match(/label=["']([^"']+)["']|label=(\S+)/)

  const tabsGroup = tabsMatch ? tabsMatch[1] || tabsMatch[2] : null
  const label = labelMatch ? labelMatch[1] || labelMatch[2] : null

  // Remove both tabs and label attributes from meta
  const remainingMeta = meta
    .replace(/\s*tabs=["']([^"']+)["']/g, "")
    .replace(/\s*tabs=(\S+)/g, "")
    .replace(/\s*label=["']([^"']+)["']/g, "")
    .replace(/\s*label=(\S+)/g, "")
    .trim()

  return {label, remainingMeta, tabsGroup}
}

function findConsecutiveTabs(
  startIndex: number,
  parent: Parent,
  targetTabsGroup: string,
): Tab[] {
  const tabs: Tab[] = []
  let currentIndex = startIndex

  while (currentIndex < parent.children.length) {
    const currentNode = parent.children[currentIndex]

    if (!currentNode || currentNode.type !== "code") {
      break
    }

    const codeNode = currentNode

    if (!codeNode.meta) {
      break
    }

    const {label, remainingMeta, tabsGroup} = parseTabAttributes(codeNode.meta)

    // Only include if it matches the target tabs group and has a label
    if (!tabsGroup || !label || tabsGroup !== targetTabsGroup) {
      break
    }

    // Clean the original node's meta NOW
    codeNode.meta = remainingMeta || undefined

    tabs.push({
      index: currentIndex,
      label,
      meta: remainingMeta || undefined,
      tabsGroup,
    })

    if (remainingMeta && remainingMeta.includes("end")) {
      break
    }

    currentIndex++
  }

  return tabs
}

function renderTabs(tabs: Tab[], parent: Parent): any[] {
  const tabsContainer = {
    attributes: [],
    children: [] as any[],
    name: "CodeTabs",
    type: "mdxJsxFlowElement",
  }

  tabs.forEach((tab) => {
    const codeNode = parent.children[tab.index] as Code

    const tabAttributes = [
      {
        name: "label",
        type: "mdxJsxAttribute",
        value: tab.label,
      },
    ]

    // Add meta to JSX element if it exists
    if (tab.meta) {
      tabAttributes.push({
        name: "meta",
        type: "mdxJsxAttribute",
        value: tab.meta,
      })
    }

    const tabElement = {
      attributes: tabAttributes,
      children: [
        {
          lang: codeNode.lang,
          meta: codeNode.meta, // This is now clean
          type: "code",
          value: codeNode.value,
        },
      ],
      name: "CodeTab",
      type: "mdxJsxFlowElement",
    }

    tabsContainer.children.push(tabElement)
  })

  return [tabsContainer]
}

/**
 * Very cool. TODO: document this https://docs.qui.qualcomm.com/guide/markdown
 *
 * @example
 * ```angular-html tabs="demo" label="HTML"
 * <div class="w-72" q-text-input [invalid]="!value()" [(ngModel)]="value">
 *   <label q-text-input-label>Label</label>
 *   <input placeholder="Enter a value" q-text-input-input />
 *   <div q-text-input-error-text>You must enter a value</div>
 * </div>
 * ```
 *
 * ```angular-ts tabs="demo" label="TS"
 * @Component()
 * export class DemoComponent {
 *   readonly value = signal("")
 * }
 * ```
 */
export const remarkCodeTabs: Plugin<[], Root> = () => {
  return (tree) => {
    const transformations: Array<{
      endIndex: number
      parent: Parent
      replacement: any[]
      startIndex: number
    }> = []

    visit(
      tree,
      "code",
      (node: Code, index: number | undefined, parent: Parent | undefined) => {
        if (!node.meta || !parent || index === undefined) {
          return
        }

        const {label, tabsGroup} = parseTabAttributes(node.meta)
        if (!tabsGroup || !label) {
          return
        }

        const alreadyProcessed = transformations.some(
          (t) =>
            t.parent === parent && index >= t.startIndex && index < t.endIndex,
        )

        if (alreadyProcessed) {
          return
        }

        const tabs = findConsecutiveTabs(index, parent, tabsGroup)

        if (tabs.length > 1) {
          const startIndex = tabs[0].index
          const endIndex = tabs[tabs.length - 1].index + 1
          const newChildren = renderTabs(tabs, parent)

          transformations.push({
            endIndex,
            parent,
            replacement: newChildren,
            startIndex,
          })
        }
      },
    )

    transformations
      .sort((a, b) => b.startIndex - a.startIndex)
      .forEach((transformation) => {
        transformation.parent.children.splice(
          transformation.startIndex,
          transformation.endIndex - transformation.startIndex,
          ...transformation.replacement,
        )
      })
  }
}
