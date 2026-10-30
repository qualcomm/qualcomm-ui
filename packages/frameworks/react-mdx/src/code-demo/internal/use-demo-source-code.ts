// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type RefObject, useCallback, useMemo, useRef} from "react"

import type {SourceCode, SourceCodeData} from "@qualcomm-ui/mdx-common"
import {useDocsRuntimeContext} from "@qualcomm-ui/react-mdx/context"

export interface UseDemoSourceCodeOptions {
  activeTab: string
  expanded: boolean
  sourceCode: SourceCodeData[]
}

export interface UseDemoSourceCodeResult {
  activeHighlightedCode: SourceCode | undefined
  activeTabSourceCode: SourceCodeData | undefined
  fileNames: string[]
  filteredSourceCode: SourceCodeData[]
  getCopyableCode: () => string
  getHighlightedCode: () => string
  hasInlineStyles: boolean | undefined
  hasPreview: boolean | undefined
  highlighterRef: RefObject<HTMLDivElement | null>
  isInlineMode: boolean | undefined
}

const defaultSourceCode: SourceCodeData = {
  fileName: "",
  highlighted: {full: ""},
  type: "file",
}

export function useDemoSourceCode({
  activeTab,
  expanded,
  sourceCode,
}: UseDemoSourceCodeOptions): UseDemoSourceCodeResult {
  const {demoSettings} = useDocsRuntimeContext()

  const isInlineMode = demoSettings?.transformTailwindClasses

  // Only show residual CSS tab when in inline mode
  const filteredSourceCode = useMemo(
    () =>
      isInlineMode
        ? sourceCode
        : (sourceCode ?? []).filter((item) => item.type !== "residual-css"),
    [sourceCode, isInlineMode],
  )

  const fileNames = useMemo(
    () => filteredSourceCode?.map((item) => item.fileName) ?? [],
    [filteredSourceCode],
  )

  const activeTabSourceCode: SourceCodeData | undefined = useMemo(
    () =>
      filteredSourceCode?.find((item) => item.fileName === activeTab) ||
      filteredSourceCode?.[0] ||
      defaultSourceCode,
    [activeTab, filteredSourceCode],
  )

  const hasInlineStyles =
    !!activeTabSourceCode?.highlightedInline ||
    activeTabSourceCode?.type === "residual-css"
  const activeHighlightedCode = useMemo(
    () =>
      isInlineMode && hasInlineStyles
        ? activeTabSourceCode?.highlightedInline
        : activeTabSourceCode?.highlighted,
    [isInlineMode, hasInlineStyles, activeTabSourceCode],
  )

  const hasPreview = useMemo(
    () => !!activeHighlightedCode?.preview,
    [activeHighlightedCode],
  )

  const getHighlightedCode = useMemo(() => {
    return () => {
      if (!activeHighlightedCode) {
        return ""
      }
      if (hasPreview) {
        return expanded
          ? activeHighlightedCode.full
          : activeHighlightedCode.preview || ""
      }
      return activeHighlightedCode.full
    }
  }, [activeHighlightedCode, expanded, hasPreview])

  const highlighterRef = useRef<HTMLDivElement>(null)

  const getCopyableCode = useCallback(() => {
    const ref = highlighterRef.current
    if (ref) {
      const preElement = ref.querySelector("pre")
      if (preElement) {
        const dataCode = preElement.getAttribute("data-code")
        const dataPreview = preElement.getAttribute("data-preview")
        if (dataCode) {
          return expanded ? dataCode : dataPreview || dataCode
        }
      }
    }
    return (
      (expanded
        ? activeTabSourceCode?.raw?.full
        : activeTabSourceCode?.raw?.preview ||
          activeTabSourceCode?.raw?.full) || ""
    )
  }, [
    activeTabSourceCode?.raw?.full,
    activeTabSourceCode?.raw?.preview,
    expanded,
  ])

  return {
    activeHighlightedCode,
    activeTabSourceCode,
    fileNames,
    filteredSourceCode,
    getCopyableCode,
    getHighlightedCode,
    hasInlineStyles,
    hasPreview,
    highlighterRef,
    isInlineMode,
  }
}
