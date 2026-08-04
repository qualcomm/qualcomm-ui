// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from "react"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"

interface HighlightRect {
  height: number
  left: number
  top: number
  width: number
}

export type ComponentPart =
  | string
  | {
      /**
       * Custom part doc link if auto-generation is not desired.
       */
      link: string
      /**
       * Part name, matching the `data-<scope>-part` attribute value.
       */
      name: string
    }

export interface ComponentExplorerBaseProps extends ComponentPropsWithRef<"div"> {
  /**
   * The component demo to explore.
   */
  children: ReactNode

  /**
   * Prefix for API documentation links.
   * e.g.
   * "slider" -> "#slider-root" (React)
   * "q-slider" -> "#q-slider-root" (Angular)
   */
  linkPrefix?: string

  /**
   * Array of parts.
   */
  parts: ComponentPart[]

  /**
   * Additional CSS class name for the preview container.
   */
  previewClassName?: string

  /**
   * Scope name matching the component's namespaced attribute
   * (`data-<scope>-part`). When omitted, the explorer falls back to matching
   * any `data-*-part` attribute with the target part name — useful for demos
   * that compose parts from multiple components (e.g. a checkbox nested in
   * field parts).
   */
  scope?: string
}

function generatePartLink(
  partName: string,
  linkPrefix: string | undefined,
): string | undefined {
  return linkPrefix ? `#${linkPrefix}-${partName}` : undefined
}

function getPartName(part: ComponentPart): string {
  return typeof part === "string" ? part : part.name
}

function getPartLink(
  part: ComponentPart,
  linkPrefix: string | undefined,
): string | undefined {
  if (typeof part === "object" && "link" in part) {
    return part.link
  }
  return generatePartLink(getPartName(part), linkPrefix)
}

export function ComponentExplorerBase({
  children,
  linkPrefix,
  parts,
  previewClassName,
  scope,
  ...props
}: ComponentExplorerBaseProps): ReactElement {
  const {renderLink: Link} = useMdxDocsContext()
  const previewRef = useRef<HTMLDivElement>(null)
  const [hoveredPart, setHoveredPart] = useState<string | null>(null)
  const [highlightRects, setHighlightRects] = useState<HighlightRect[]>([])

  useSafeLayoutEffect(() => {
    const previewElement = previewRef.current

    if (!previewElement || !hoveredPart) {
      setHighlightRects([])
      return
    }

    const targetElements = scope
      ? Array.from(
          previewElement.querySelectorAll<HTMLElement>(
            `[data-${scope}-part="${hoveredPart}"]`,
          ),
        )
      : Array.from(previewElement.querySelectorAll<HTMLElement>("*")).filter(
          (el) =>
            Array.from(el.attributes).some(
              (attr) =>
                attr.name.startsWith("data-") &&
                attr.name.endsWith("-part") &&
                attr.value === hoveredPart,
            ),
        )

    if (targetElements.length === 0) {
      setHighlightRects([])
      return
    }

    const previewRect = previewElement.getBoundingClientRect()
    const highlightOffset = 4
    const rects = targetElements.map((targetElement) => {
      const elementRect = targetElement.getBoundingClientRect()
      return {
        height: elementRect.height + highlightOffset * 2,
        left: elementRect.left - previewRect.left - highlightOffset,
        top: elementRect.top - previewRect.top - highlightOffset,
        width: elementRect.width + highlightOffset * 2,
      }
    })

    setHighlightRects(rects)
  }, [hoveredPart, scope])

  return (
    <div {...props} className="qui-component-explorer__root">
      <div
        ref={previewRef}
        className={
          previewClassName
            ? `qui-component-explorer__preview ${previewClassName}`
            : "qui-component-explorer__preview"
        }
      >
        {children}
        {highlightRects.map((rect, index) => (
          <div
            key={index}
            className="qui-component-explorer__highlight"
            style={{
              height: `${rect.height}px`,
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
            }}
          />
        ))}
      </div>
      <div className="qui-component-explorer__anatomy">
        <div className="qui-component-explorer__anatomy-header">
          <h3 className="qui-component-explorer__anatomy-title">
            Component Anatomy
          </h3>
          <p className="qui-component-explorer__anatomy-subtitle">
            Hover to highlight, click to view API
          </p>
        </div>
        <div className="qui-component-explorer__parts">
          {parts.map((part) => {
            const partName = getPartName(part)
            const link = getPartLink(part, linkPrefix)

            return link ? (
              <Link
                key={partName}
                className="qui-component-explorer__part"
                data-active={hoveredPart === partName || undefined}
                href={link}
                onMouseEnter={() => setHoveredPart(partName)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {partName}
              </Link>
            ) : (
              <span
                key={partName}
                className="qui-component-explorer__part"
                data-active={hoveredPart === partName || undefined}
                onMouseEnter={() => setHoveredPart(partName)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {partName}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
