// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Processor} from "unified"

interface MarkdownExtension {
  handlers?: {
    text?: MarkdownHandler
  }
}

interface MarkdownInfo {
  after?: string
  before?: string
}

interface MarkdownNode {
  type: string
  value: string
}

interface MarkdownParent {
  children?: MarkdownNode[]
  type: string
}

interface MarkdownState {
  safe: (value: string, info: MarkdownInfo) => string
  stack: string[]
}

interface MarkdownProcessorData {
  toMarkdownExtensions?: MarkdownExtension[]
}

type MarkdownHandler = (
  node: MarkdownNode,
  parent: MarkdownParent | undefined,
  state: MarkdownState,
  info: MarkdownInfo,
) => string

const ALERT_MARKER_PATTERN =
  /^\\?\[!(?:note|tip|success|warning|caution)(?:\/[^\]\n]+)?\]/iu

export default function remarkPreserveAlertMarkers(this: Processor): void {
  const extensions = getToMarkdownExtensions(this)

  // mdx/remark fixes reserialize the whole file. Register with the markdown
  // stringifier so alert markers keep the syntax consumed by the docs runtime.
  const data = this.data() as MarkdownProcessorData
  data.toMarkdownExtensions = [
    ...extensions,
    {
      handlers: {
        text: preserveAlertMarkerText,
      },
    },
  ]
}

function preserveAlertMarkerText(
  node: MarkdownNode,
  parent: MarkdownParent | undefined,
  state: MarkdownState,
  info: MarkdownInfo,
): string {
  const value = state.safe(node.value, info)

  if (!isAlertMarkerText(node, parent, state)) {
    return value
  }

  return value.replace(/^\\(?=\[!)/u, "")
}

function isAlertMarkerText(
  node: MarkdownNode,
  parent: MarkdownParent | undefined,
  state: MarkdownState,
): boolean {
  return (
    parent?.type === "paragraph" &&
    parent.children?.[0] === node &&
    state.stack.includes("blockquote") &&
    ALERT_MARKER_PATTERN.test(node.value)
  )
}

function getToMarkdownExtensions(processor: Processor): MarkdownExtension[] {
  const {toMarkdownExtensions} = processor.data() as MarkdownProcessorData

  return Array.isArray(toMarkdownExtensions) ? toMarkdownExtensions : []
}
