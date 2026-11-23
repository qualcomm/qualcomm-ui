// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
} from "react"

import {ChevronDownIcon} from "lucide-react"
import type {DecorationItem} from "shiki/types"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  CopyToClipboardIconButton,
  type CopyToClipboardProps,
} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import type {RenderLink} from "@qualcomm-ui/react-mdx/docs-layout"
import {ShikiHighlighter} from "@qualcomm-ui/react-mdx/shiki"
import {Button} from "@qualcomm-ui/react/button"
import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {type HighlightedReference, RefHoverCard} from "./ref-hover-card.js"

export interface CodeHighlightProps extends ElementRenderProp<"div"> {
  /**
   * The code to highlight.
   */
  code: string

  /**
   * Code blocks are automatically collapsible if {@link label} is supplied.
   * Set this prop to false to override this behavior.
   *
   * @default true
   */
  collapsible?: boolean

  /**
   * props passed to the copy button.
   */
  copyButtonProps?: Omit<CopyToClipboardProps, "getValue">

  /**
   * Default collapsed state when {@link collapsible} is true.
   */
  defaultCollapsed?: boolean

  /**
   * If false, the copy button will not render.
   */
  disableCopy?: boolean

  forceShowCopyButton?: boolean

  /**
   * Hides the copy button until the user hovers over the code block.
   *
   * @deprecated this is the default behavior and cannot be changed.
   */
  hideCopyUntilHover?: boolean

  /**
   * Lines to highlight.
   *
   * Broken until shiki supports decorations with structure: inline.
   * https://github.com/shikijs/shiki/issues/992
   */
  highlight?: number[] | DecorationItem[]

  /**
   * Type references by name. References to these types in the code open a
   * hover card with the referenced type.
   */
  highlightedReferences?: Record<string, HighlightedReference>

  /**
   * Label to render as the code block's title.
   */
  label?: ReactNode

  /**
   * shiki target language.
   */
  language: string

  /**
   * Props applied to the inner `pre` element.
   */
  preProps?: ComponentPropsWithRef<"pre">

  renderLink?: RenderLink
}

export function CodeHighlight({
  className,
  code,
  collapsible = true,
  copyButtonProps,
  defaultCollapsed,
  disableCopy,
  forceShowCopyButton = false,
  hideCopyUntilHover: _hideCopyUntilHover,
  highlight: linesProp,
  highlightedReferences,
  label,
  language,
  preProps,
  ref,
  renderLink: _DocLink,
  ...props
}: CodeHighlightProps): ReactElement {
  const formattedCode = code.trim()
  const [showingPanel, setShowingPanel] = useState(!defaultCollapsed)

  const typeRefs = useMemo(
    () =>
      Object.keys(highlightedReferences ?? {}).filter((name) =>
        formattedCode.includes(name),
      ),
    [formattedCode, highlightedReferences],
  )

  const highlight: DecorationItem[] = useMemo(() => {
    const highlightProp = linesProp ?? []
    if (highlightProp && typeof highlightProp?.[0] === "number") {
      return (highlightProp as number[]).map(
        (line: number): DecorationItem => ({
          end: {character: -1, line},
          properties: {
            "data-highlight": "true",
          },
          start: {character: 0, line},
          transform: (element, type) => {
            console.debug(element, type)
            return element
          },
        }),
      )
    }
    return highlightProp as DecorationItem[]
  }, [linesProp])

  const shikiConfig = useMemo(() => ({decorations: highlight}), [highlight])
  const highlighter = (
    <ShikiHighlighter
      cache
      code={formattedCode}
      language={language}
      shikiConfig={shikiConfig}
      typeRefs={typeRefs.length ? typeRefs : undefined}
      {...preProps}
    />
  )

  return (
    <PolymorphicElement
      ref={ref}
      as="div"
      className={clsx("qui-docs-highlighter__root", className)}
      {...props}
    >
      {label ? (
        <Button
          className={clsx("qui-demo-runner__title", {
            "showing-panel": showingPanel,
          })}
          endIcon={
            collapsible ? (
              <Icon
                className={clsx("qui-demo-runner__collapse-icon", {
                  "showing-panel": showingPanel,
                })}
                icon={ChevronDownIcon}
              />
            ) : null
          }
          onClick={() =>
            collapsible ? setShowingPanel((prevState) => !prevState) : null
          }
          tabIndex={collapsible ? 0 : -1}
          variant="outline"
        >
          {label}
        </Button>
      ) : null}

      <Collapsible.Root open={showingPanel}>
        <Collapsible.Content>
          {disableCopy || !showingPanel ? null : (
            <CopyToClipboardIconButton
              {...copyButtonProps}
              className={clsx(
                "qui-code-copy-button",
                {"has-title": label, showing: showingPanel},
                copyButtonProps?.className,
              )}
              data-force-show={booleanDataAttr(forceShowCopyButton)}
              valueOrFn={formattedCode}
            />
          )}

          {typeRefs.length > 0 && highlightedReferences ? (
            <RefHoverCard references={highlightedReferences}>
              {highlighter}
            </RefHoverCard>
          ) : (
            highlighter
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </PolymorphicElement>
  )
}
