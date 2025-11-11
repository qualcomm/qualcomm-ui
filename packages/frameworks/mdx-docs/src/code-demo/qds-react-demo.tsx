import {
  type ComponentPropsWithRef,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useState,
} from "react"
// eslint-disable-next-line no-restricted-imports
import * as React from "react"

import {ChevronsLeftRight} from "lucide-react"

import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {CopyToClipboardButton} from "@qualcomm-ui/mdx-docs/copy-to-clipboard"
import {useRunner, type UseRunnerProps} from "@qualcomm-ui/mdx-docs/runner"
import type {
  ReactDemoWithScope,
  SourceCodeData,
} from "@qualcomm-ui/mdx-docs-common"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import type {ColorScheme, QdsBrand} from "@qualcomm-ui/react/qds-theme"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {getDefaultSourceCode} from "./code-demo.utils"

export interface QdsReactDemoProps extends ComponentPropsWithRef<"div"> {
  /**
   * Optional child element, rendered above the component demo.
   */
  children?: ReactNode

  colorScheme?: ColorScheme

  /**
   * The default source code index to render.
   */
  defaultSourceIndex?: number

  /**
   * Demo getter function provided by the vite plugin.
   */
  demo: ReactDemoWithScope | null

  /**
   * Whether the source code is viewable. If false, the source code and filename
   * tabs will not render.
   */
  expandable?: boolean

  /**
   * Whether the source code is initially expanded.
   */
  expanded?: boolean

  /**
   * The name of the primary demo. This is the PascalCase name of the demo file
   * without its extension.
   *
   * @example
   * ```tsx
   * // demos/my-demo-file.tsx
   * export default function Demo() {
   *   // ...
   * }
   *
   * // <QdsReactDemo name="MyDemoFile" />
   * ```
   *
   * TODO: link to docs
   */
  name: string

  onDemoRendered?: ((error: Error | undefined) => void) | undefined

  qdsBrand?: QdsBrand

  /**
   * Whether the demo is currently updating from the vite HMR backend.
   */
  updating?: boolean | undefined

  /**
   * Props applied to the element that wraps the component demo.
   */
  wrapperProps?: HTMLAttributes<HTMLDivElement>
}

export function QdsReactDemo({
  children,
  colorScheme,
  defaultSourceIndex: _defaultSourceIndex = 0,
  demo: demoProp,
  expandable = true,
  expanded: expandedProp = false,
  name,
  onDemoRendered,
  qdsBrand,
  updating,
  wrapperProps = {},
  ...props
}: QdsReactDemoProps): ReactNode {
  const demo: ReactDemoWithScope =
    demoProp ||
    ({
      demoName: "",
      fileName: "",
      imports: [],
      pageId: "",
      scope: {},
      sourceCode: [],
    } satisfies ReactDemoWithScope)

  const [activeTab, setActiveTab] = useState<string>(demo?.fileName || "")

  const {demoState, updateDemoState} = useMdxDocsContext()

  const state = useMemo(() => {
    return demoState[demo.pageId] || {}
  }, [demo.pageId, demoState])

  const [expanded, setExpanded] = useState(
    state?.[name]?.expanded || expandedProp,
  )

  useSafeLayoutEffect(() => {
    if (demo.fileName && !activeTab) {
      setActiveTab(demo.fileName)
    }
  }, [activeTab, demo.fileName])

  const toggleCollapsed = () => {
    queueMicrotask(() => {
      updateDemoState(demo.pageId, name, {expanded: !expanded})
    })
    setExpanded((prevState) => {
      return !prevState
    })
  }

  const fileNames = demo.sourceCode?.map((item) => item.fileName) ?? []

  const sourceCode = demo.sourceCode?.[0] ?? getDefaultSourceCode()
  const activeTabSourceCode: SourceCodeData =
    (demo.sourceCode ?? []).find((item) => item.fileName === activeTab) ??
    getDefaultSourceCode()

  const hasPreview = !!activeTabSourceCode.raw.preview
  const scheme = colorScheme || "dark"

  const missingDefaultExport = useMemo(
    () =>
      !sourceCode.raw.full.includes("export default") &&
      !sourceCode.raw.full.includes("function Demo()"),
    [sourceCode.raw.full],
  )

  const scope = useMemo(
    () => ({
      ...demo.scope,
      React,
    }),
    [demo.scope],
  )

  const mergedProps = mergeProps(
    {
      className: "qui-docs-demo-container__root",
      "data-has-preview": booleanDataAttr(hasPreview),
      "data-state": expanded ? "expanded" : "collapsed",
    },
    props,
  )

  const runnerProps: UseRunnerProps = useMemo(() => {
    return {
      code: sourceCode.raw.withoutImports,
      disableCache: true,
      onRendered: (error) => {
        onDemoRendered?.(error)
      },
      scope,
    }
  }, [onDemoRendered, scope, sourceCode.raw.withoutImports])

  const {element: demoComponent, error} = useRunner(runnerProps)

  const renderedDemo = useMemo(() => {
    if (demo.errorMessage || missingDefaultExport) {
      return (
        <div
          className="qds-demo-runner__render-error"
          data-updating={booleanDataAttr(updating)}
        >
          {updating ? (
            <>
              <div>Loading...</div>
              <ProgressRing size="xs" />
            </>
          ) : (
            demo.errorMessage || "Error: missing default export"
          )}
        </div>
      )
    }
    return demoComponent || error
  }, [demo.errorMessage, demoComponent, error, missingDefaultExport, updating])

  const getCopyableCode = () => {
    return expanded
      ? activeTabSourceCode.raw.full
      : activeTabSourceCode.raw.preview || activeTabSourceCode.raw.full
  }

  const getHighlightedCode = () => {
    if (hasPreview) {
      return expanded
        ? activeTabSourceCode.highlighted.full
        : activeTabSourceCode.highlighted.preview!
    }
    return activeTabSourceCode.highlighted.full
  }

  return (
    <div {...mergedProps}>
      {children}

      {!expandable ? (
        renderedDemo
      ) : (
        <>
          <div
            {...mergeProps(
              {className: "qui-demo-runner__wrapper"},
              wrapperProps,
            )}
            data-brand={qdsBrand}
            data-theme={scheme}
          >
            {renderedDemo}
          </div>
          <div className="qui-demo-runner__tabs">
            <div
              className="qui-demo-runner__action-bar"
              data-state={expanded || hasPreview ? "open" : "closed"}
            >
              {fileNames.length > 1 ? (
                <Tabs.Root
                  onValueChange={(value) => {
                    setActiveTab(value)
                    if (!expanded) {
                      setExpanded(true)
                    }
                  }}
                  value={expanded || hasPreview ? activeTab : null}
                >
                  <Tabs.List>
                    <Tabs.Indicator />
                    {fileNames.map((fileName) => {
                      return (
                        <Tab.Root key={fileName} value={fileName}>
                          <Tab.Button
                            onClick={() => {
                              if (!expanded) {
                                setExpanded(true)
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
                <Button
                  data-brand="qualcomm"
                  emphasis="primary"
                  endIcon={ChevronsLeftRight}
                  onClick={toggleCollapsed}
                  size="sm"
                  variant="ghost"
                >
                  {hasPreview
                    ? expanded
                      ? "Collapse Code"
                      : "Expand Code"
                    : expanded
                      ? "Hide Code"
                      : "Show Code"}
                </Button>
                <CopyToClipboardButton code={getCopyableCode} />
              </div>
            </div>

            {hasPreview || expanded ? (
              <div
                className="qui-docs-highlighter__root"
                dangerouslySetInnerHTML={{__html: getHighlightedCode()}}
              ></div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
