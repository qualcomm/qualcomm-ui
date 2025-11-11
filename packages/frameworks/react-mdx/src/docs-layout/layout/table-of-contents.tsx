// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {uniq} from "lodash-es"

import type {TocHeading} from "@qualcomm-ui/mdx-common"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {TocLink} from "../internal"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

interface Props {
  activeTocClassName?: string
}

const HEADING_LEVELS: TocHeading[] = ["h2", "h3", "h4"]
const SCROLL_DEBOUNCE_MS = 0
const RESIZE_DEBOUNCE_MS = 100
const HEADING_OFFSET = -48
const VIEWPORT_TOP_MARGIN = 0.1
const VIEWPORT_BOTTOM_MARGIN = 0.2
const INDENT_PER_LEVEL = 12

function useScrollDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  return useMemo(
    () =>
      ((...args: Parameters<T>) => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => callback(...args), delay)
      }) as T,
    [callback, delay],
  )
}

function elementIsVisible(rect: DOMRect): boolean {
  if (typeof window === "undefined") {
    return false
  }
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function useTocScrollSync(
  activeId: string | null,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const linkRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (!activeId || !containerRef.current) {
      return
    }

    const activeElement = linkRefs.current.get(activeId)
    if (!activeElement) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          })
        }
        observer.disconnect()
      },
      {root: containerRef.current, threshold: 1},
    )

    observer.observe(activeElement)
    return () => observer.disconnect()
  }, [activeId, containerRef])

  return linkRefs
}

function useActiveHeading() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const {tocHighlightStrategy} = useMdxDocsContext()
  const {mainContentElement, toc: headings} = useMdxDocsLayoutContext()

  const calculateActive = useCallback(() => {
    if (!headings.length || !mainContentElement) {
      return
    }

    const headingElements: Element[] = []
    const contentElement = document
      .querySelector(".qui-docs__app-content")
      ?.querySelector("article")

    if (!contentElement) {
      return
    }

    contentElement
      .querySelectorAll(
        uniq(HEADING_LEVELS)
          .map((level) => `${level}:not(.qui-demo-runner__wrapper ${level})`)
          .join(","),
      )
      .forEach((element) => {
        headingElements.push(element)
      })

    let activeIndex: number | null = null

    if ((tocHighlightStrategy || "nearest") === "nearest") {
      if (window.scrollY === 0) {
        activeIndex = 0
      } else {
        const scrollBottom = window.scrollY + window.innerHeight
        if (scrollBottom >= document.body.scrollHeight) {
          activeIndex = headingElements.length - 1
        } else {
          let closestVisibleElementTop = 100000
          let closestVisibleIndex = -1
          let found = false

          for (let i = 0; i < headingElements.length; i++) {
            const element = headingElements[i]
            const elementRect = element.getBoundingClientRect()
            const elementTop = elementRect.top

            if (
              elementTop > HEADING_OFFSET &&
              elementIsVisible(elementRect) &&
              elementTop < closestVisibleElementTop
            ) {
              found = true
              closestVisibleElementTop = elementTop
              closestVisibleIndex = i
            }
          }

          if (!found) {
            const headingRegions = headingElements.map((element, index) => {
              const start = element.getBoundingClientRect().top + window.scrollY
              const nextElement = headingElements[index + 1]
              const end = nextElement
                ? nextElement.getBoundingClientRect().top + window.scrollY - 1
                : document.body.scrollHeight
              return [start, end]
            })

            const currentRegionIndex = headingRegions.findIndex(
              ([start, end]) => window.scrollY > start && window.scrollY < end,
            )
            activeIndex = currentRegionIndex >= 0 ? currentRegionIndex : null
          } else {
            activeIndex = closestVisibleIndex >= 0 ? closestVisibleIndex : null
          }
        }
      }
    } else {
      // Viewport strategy logic
      if (window.scrollY === 0) {
        activeIndex = 0
      } else {
        const windowHeight = window.innerHeight

        for (let i = 0; i < headingElements.length; i++) {
          const item = headingElements[i]
          const itemTop = item.getBoundingClientRect().top
          const nextItem = headingElements[i + 1]
          const itemBottom = nextItem
            ? nextItem.getBoundingClientRect().top
            : mainContentElement.getBoundingClientRect().bottom

          if (
            itemBottom > windowHeight * VIEWPORT_TOP_MARGIN &&
            itemTop < windowHeight * (1 - VIEWPORT_BOTTOM_MARGIN)
          ) {
            activeIndex = i
            break
          }
        }
      }
    }

    if (activeIndex !== null && headings[activeIndex]) {
      setActiveId(headings[activeIndex].id)
    } else {
      setActiveId(null)
    }
  }, [headings, mainContentElement, tocHighlightStrategy])

  const debouncedCalculateActive = useScrollDebounce(
    calculateActive,
    SCROLL_DEBOUNCE_MS,
  )

  const debouncedResizeHandler = useScrollDebounce(
    calculateActive,
    RESIZE_DEBOUNCE_MS,
  )

  useEffect(() => {
    if (!headings.length || !mainContentElement) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateActive()

    window.addEventListener("scroll", debouncedCalculateActive, {passive: true})
    window.addEventListener("resize", debouncedResizeHandler, {passive: true})

    const resizeObserver = new ResizeObserver(debouncedResizeHandler)
    resizeObserver.observe(mainContentElement)

    return () => {
      window.removeEventListener("scroll", debouncedCalculateActive)
      window.removeEventListener("resize", debouncedResizeHandler)
      resizeObserver.disconnect()
    }
  }, [
    calculateActive,
    debouncedCalculateActive,
    debouncedResizeHandler,
    headings.length,
    mainContentElement,
  ])

  return activeId
}

export function TableOfContents({
  activeTocClassName = "q-active",
}: Props): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const {renderLink: Link} = useMdxDocsContext()
  const {toc: headings} = useMdxDocsLayoutContext()

  const activeId = useActiveHeading()
  const linkRefs = useTocScrollSync(activeId, containerRef)

  if (!headings.length) {
    return null
  }

  return (
    <div className="qui-toc">
      <div ref={containerRef} className="qui-toc__container">
        <div className="qui-toc__links">
          <div className="qui-toc-bar" />
          {headings.map(({headingLevel, id, textContent}) => {
            const isActive = activeId === id
            return (
              <TocLink
                key={id}
                ref={(element: HTMLDivElement | null) => {
                  if (element) {
                    linkRefs.current.set(id, element)
                  } else {
                    linkRefs.current.delete(id)
                  }
                }}
                className={`qui-toc__link${isActive ? ` ${activeTocClassName}` : ""}`}
                style={{
                  paddingLeft: INDENT_PER_LEVEL * (headingLevel - 1),
                }}
              >
                {headingLevel > 2 ? (
                  <div
                    aria-hidden
                    className="qui-toc__link-indent-guide"
                    data-active={booleanDataAttr(isActive)}
                  ></div>
                ) : null}
                <Link href={`#${id}`}>{textContent}</Link>
              </TocLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
