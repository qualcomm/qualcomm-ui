import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react"

import {ChevronsLeftRight} from "lucide-react"

import {CopyToClipboardButton} from "@qualcomm-ui/mdx-docs/copy-to-clipboard"
import type {SourceCodeData} from "@qualcomm-ui/mdx-docs-common"
import {Button} from "@qualcomm-ui/react/button"
import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import type {ColorScheme, QdsBrand} from "@qualcomm-ui/react/qds-theme"
import {Tab, Tabs} from "@qualcomm-ui/react/tabs"
import {booleanDataAttr, type WithDataAttributes} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsDemoThemeSelector} from "./internal"

export interface QdsAngularDemoRunnerProps
  extends ComponentPropsWithRef<"div"> {
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

export function QdsAngularDemoRunner({
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
}: QdsAngularDemoRunnerProps): ReactElement {
  const [expanded, setExpanded] = useState<boolean | undefined>(expandedProp)
  const [activeTab, setActiveTab] = useState<string>(
    sourceCode?.[0]?.fileName || "",
  )

  const toggleExpanded = () => setExpanded((prevState) => !prevState)

  const scheme = colorScheme === "light" ? "light" : "dark"

  const fileNames = useMemo(
    () => sourceCode?.map((item) => item.fileName) ?? [],
    [sourceCode],
  )

  const activeTabSourceCode: SourceCodeData | undefined = useMemo(
    () =>
      sourceCode?.find((item) => item.fileName === activeTab) ||
      sourceCode?.[0],
    [activeTab, sourceCode],
  )

  const hasPreview = useMemo(
    () => !!activeTabSourceCode?.raw?.preview,
    [activeTabSourceCode],
  )

  const mergedProps = mergeProps(
    {className: "qui-docs-demo-container__root"},
    props,
  )

  const mergedWrapperProps = mergeProps(
    {className: "qui-demo-runner__wrapper"},
    wrapperProps ?? {},
  )

  const getCopyableCode = useCallback(() => {
    if (!activeTabSourceCode) {
      return ""
    }
    return expanded
      ? activeTabSourceCode.raw.full
      : activeTabSourceCode.raw.preview || activeTabSourceCode.raw.full
  }, [activeTabSourceCode, expanded])

  const getHighlightedCode = useCallback(() => {
    if (!activeTabSourceCode) {
      return ""
    }
    if (hasPreview) {
      return expanded
        ? activeTabSourceCode.highlighted.full
        : activeTabSourceCode.highlighted.preview || ""
    }
    return activeTabSourceCode.highlighted.full
  }, [activeTabSourceCode, expanded, hasPreview])

  return (
    <div
      data-has-preview={booleanDataAttr(hasPreview)}
      data-state={expanded ? "expanded" : "collapsed"}
      data-updating={booleanDataAttr(updating)}
      {...mergedProps}
    >
      {hideDemoBrandSwitcher ? null : (
        <QdsDemoThemeSelector qdsBrand={qdsBrand} setQdsBrand={setQdsBrand} />
      )}
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
                value={activeTab}
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
              {updating ? <ProgressRing size="xs" /> : null}
              <Button
                data-brand="qualcomm"
                emphasis="primary"
                endIcon={ChevronsLeftRight}
                onClick={toggleExpanded}
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
              <CopyToClipboardButton code={getCopyableCode()} />
            </div>
          </div>
          {(hasPreview || expanded) && activeTabSourceCode ? (
            <div
              className="qui-docs-highlighter__root"
              dangerouslySetInnerHTML={{
                __html: getHighlightedCode(),
              }}
              suppressHydrationWarning
            ></div>
          ) : null}
        </div>
      )}
    </div>
  )
}
