// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useState,
} from "react"

import type {SourceCodeData} from "@qualcomm-ui/mdx-common"
import {CopyToClipboardButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import type {ColorScheme, QdsBrand} from "@qualcomm-ui/react/qds-theme"
import {
  booleanDataAttr,
  type WithDataAttributes,
} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  DemoCodePanel,
  QdsDemoThemeSelector,
  useDemoSourceCode,
} from "./internal/index.js"

export interface AngularDemoRunnerProps extends ComponentPropsWithRef<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
  colorScheme?: ColorScheme
  demoName: string
  expanded?: boolean
  /**
   * The stored height of the demo from the first render.
   */
  height?: number
  hideDemoBrandSwitcher?: boolean | undefined

  /**
   * `true` if the demo component couldn't be located.
   */
  notFound?: boolean
  qdsBrand: QdsBrand
  setQdsBrand: (brand: QdsBrand) => void
  sourceCode: SourceCodeData[]
  /**
   * True if the demo is currently updating.
   */
  updating?: boolean
  wrapperProps?: WithDataAttributes<ComponentPropsWithRef<"div">>
}

export function AngularDemoRunner({
  children,
  colorScheme,
  demoName,
  expanded: expandedProp,
  hideDemoBrandSwitcher,
  notFound,
  qdsBrand,
  setQdsBrand,
  sourceCode,
  updating,
  wrapperProps,
  ...props
}: AngularDemoRunnerProps): ReactElement {
  const [expanded, setExpanded] = useState<boolean | undefined>(expandedProp)
  const [activeTab, setActiveTab] = useState<string>(
    sourceCode?.[0]?.fileName || "",
  )

  const scheme = colorScheme === "light" ? "light" : "dark"

  const {
    fileNames,
    getCopyableCode,
    getHighlightedCode,
    hasInlineStyles,
    hasPreview,
    highlighterRef,
  } = useDemoSourceCode({
    activeTab,
    expanded: !!expanded,
    sourceCode,
  })

  const mergedProps = mergeProps(
    {className: "qui-docs-demo-container__root"},
    props,
  )

  const mergedWrapperProps = mergeProps(
    {className: "qui-demo-runner__wrapper"},
    wrapperProps ?? {},
  )

  return (
    <div
      data-has-preview={booleanDataAttr(hasPreview)}
      data-state={expanded ? "expanded" : "collapsed"}
      data-updating={booleanDataAttr(updating)}
      {...mergedProps}
    >
      <div
        data-brand={qdsBrand}
        data-theme={scheme}
        suppressHydrationWarning
        {...mergedWrapperProps}
      >
        {notFound ? (
          <InlineNotification
            emphasis="danger"
            label={
              <div>
                <span>Demo Not Found: </span>
                <code className="qui-docs-code">{demoName}</code>
              </div>
            }
          />
        ) : null}
        {children}
      </div>
      {notFound ? null : (
        <DemoCodePanel
          actions={
            <>
              {updating ? <ProgressRing size="xs" /> : null}
              {hideDemoBrandSwitcher ? null : (
                <QdsDemoThemeSelector
                  qdsBrand={qdsBrand}
                  setQdsBrand={setQdsBrand}
                />
              )}
            </>
          }
          activeTab={activeTab}
          copyButton={
            <CopyToClipboardButton code={getCopyableCode} emphasis="neutral" />
          }
          expanded={!!expanded}
          fileNames={fileNames}
          getHighlightedCode={getHighlightedCode}
          hasInlineStyles={hasInlineStyles}
          hasPreview={hasPreview}
          highlighterRef={highlighterRef}
          onExpandedChange={setExpanded}
          onTabChange={setActiveTab}
          suppressHydrationWarning
        />
      )}
    </div>
  )
}

/**
 * @deprecated migrate to {@link AngularDemoRunnerProps}
 */
export type QdsAngularDemoRunnerProps = AngularDemoRunnerProps

/**
 * @deprecated migrate to {@link AngularDemoRunner}
 */
export const QdsAngularDemoRunner: (
  props: AngularDemoRunnerProps,
) => ReactElement = AngularDemoRunner
