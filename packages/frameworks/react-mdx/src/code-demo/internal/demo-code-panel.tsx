// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, type RefObject, useRef} from "react"
import {flushSync} from "react-dom"

import {ChevronDown, ChevronUp} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Icon} from "@qualcomm-ui/react/icon"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {DemoStyleToggle} from "./demo-style-toggle.js"

export interface DemoCodePanelProps {
  /**
   * Additional actions to render before the expand/collapse button.
   */
  actions?: ReactNode
  activeTab: string
  /**
   * Copy button element - allows different copy button implementations.
   */
  copyButton: ReactNode
  expanded: boolean
  fileNames: string[]
  getHighlightedCode: () => string
  hasInlineStyles: boolean | undefined
  hasPreview: boolean | undefined
  /**
   * Ref for the highlighted code container (used by React demo for DOM-based
   * code copying).
   */
  highlighterRef?: RefObject<HTMLDivElement | null>
  onExpandedChange: (expanded: boolean) => void
  onTabChange: (tab: string) => void
  /**
   * Whether to suppress hydration warnings (needed for Angular SSR).
   */
  suppressHydrationWarning?: boolean
  /**
   * Value for the tabs - allows controlling when tabs appear selected.
   */
  tabsValue?: string | null
}

export function DemoCodePanel({
  actions,
  activeTab,
  copyButton,
  expanded,
  fileNames,
  getHighlightedCode,
  hasInlineStyles,
  hasPreview,
  highlighterRef,
  onExpandedChange,
  onTabChange,
  suppressHydrationWarning,
  tabsValue,
}: DemoCodePanelProps): ReactNode {
  const {setDemoSettings} = useMdxDocsContext()

  const effectiveTabsValue = tabsValue !== undefined ? tabsValue : activeTab

  const collapseButtonIcon = expanded ? (
    <Icon icon={ChevronUp} size="xs" />
  ) : (
    <Icon icon={ChevronDown} size="xs" />
  )

  const collapsibleTriggerRef = useRef<HTMLButtonElement>(null)

  const handleExpandedChange = (newExpanded: boolean) => {
    if (!newExpanded && collapsibleTriggerRef.current != null) {
      const triggerEl = collapsibleTriggerRef.current
      const rectTopBeforeClose = triggerEl.getBoundingClientRect().top

      flushSync(() => onExpandedChange(newExpanded))

      const rectTopAfterClose = triggerEl.getBoundingClientRect().top
      const delta = rectTopAfterClose - rectTopBeforeClose
      // don't scroll if the trigger is still in the viewport after closing
      if (rectTopAfterClose < 0) {
        window.scrollBy({
          behavior: "instant",
          top: delta,
        })
      }
      return
    }

    onExpandedChange(newExpanded)
  }

  /**
   * Handles toggling between inline CSS and Tailwind CSS display modes.
   *
   * When the style mode changes, the highlighted code is re-rendered, which
   * causes the `<pre>` element to be replaced. This would normally reset the
   * scroll position to the top, losing the user's place in the code. We preserve
   * and restore it here.
   */
  const handleStyleToggle = (value: "inline" | "tailwind") => {
    if (highlighterRef?.current != null) {
      const preEl = highlighterRef.current.querySelector("pre.shiki")

      if (preEl) {
        const scrollTopBeforeChange = preEl.scrollTop
        const mutationObserver = new MutationObserver(() => {
          mutationObserver.disconnect()
          highlighterRef.current
            ?.querySelector("pre.shiki")
            ?.scrollTo(0, scrollTopBeforeChange)
        })
        mutationObserver.observe(highlighterRef.current, {childList: true})
      }
      setDemoSettings?.((prevState) => ({
        ...prevState,
        transformTailwindClasses: value === "inline",
      }))
    }

    setDemoSettings?.((prevState) => ({
      ...prevState,
      transformTailwindClasses: value === "inline",
    }))
  }

  return (
    <div className="qui-demo-runner__tabs">
      <div
        className="qui-demo-runner__action-bar"
        data-state={expanded || hasPreview ? "open" : "closed"}
      >
        {fileNames.length > 1 ? (
          <Tabs.Root
            onValueChange={(value) => {
              onTabChange(value)
              if (!expanded) {
                onExpandedChange(true)
              }
            }}
            value={effectiveTabsValue}
          >
            <Tabs.List>
              <Tabs.Indicator />
              {fileNames.map((fileName) => {
                return (
                  <Tab.Root key={fileName} value={fileName}>
                    <Tab.Button
                      onClick={() => {
                        if (!expanded) {
                          onExpandedChange(true)
                        }
                      }}
                    >
                      {fileName}
                    </Tab.Button>
                  </Tab.Root>
                )
              })}
            </Tabs.List>
          </Tabs.Root>
        ) : (
          <div />
        )}
        <div className="qui-demo-runner__actions">
          {actions}
          {hasInlineStyles ? (
            <DemoStyleToggle onValueChange={handleStyleToggle} />
          ) : null}
          {copyButton}
        </div>
      </div>

      <div
        ref={highlighterRef}
        className="qui-docs-highlighter__root"
        dangerouslySetInnerHTML={{__html: getHighlightedCode()}}
        data-hidden={booleanDataAttr(!expanded && !hasPreview)}
        suppressHydrationWarning={suppressHydrationWarning}
      />
      <button
        ref={collapsibleTriggerRef}
        className="qui-demo__collapse-button"
        data-expanded={booleanDataAttr(expanded)}
        data-has-preview={booleanDataAttr(hasPreview)}
        data-sticky={booleanDataAttr(expanded)}
        onClick={() => handleExpandedChange(!expanded)}
      >
        <span>
          {hasPreview
            ? expanded
              ? "Show Less"
              : "Show More"
            : expanded
              ? "Hide Code"
              : "Show Code"}
        </span>
        <span>{collapseButtonIcon}</span>
      </button>
    </div>
  )
}
