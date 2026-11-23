// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import type {PopoverPositioningOptions} from "@qualcomm-ui/core/popover"
import {usePopoverContext} from "@qualcomm-ui/react-core/popover"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {ShikiHighlighter} from "@qualcomm-ui/react-mdx/shiki"
import {Popover} from "@qualcomm-ui/react/popover"
import {clsx} from "@qualcomm-ui/utils/clsx"

export interface HighlightedReference {
  /**
   * Rendered below the type, such as the JSDoc summary of the referenced type.
   */
  description?: ReactNode

  /**
   * The declaration of the referenced type, highlighted at the top of the card,
   * such as `interface Options {...}`.
   */
  prettyType: string
}

export interface RefHoverCardProps extends ElementRenderProp<"div"> {
  children?: ReactNode

  /**
   * Milliseconds between the pointer leaving a ref or the card and the card
   * closing. Entering a ref or the card within this window keeps it open.
   *
   * @default 150
   */
  closeDelay?: number

  /**
   * Milliseconds the pointer rests on a ref before the card opens. Once the
   * card is open, moving to another ref switches the card without this delay.
   *
   * @default 300
   */
  openDelay?: number

  /**
   * The card content for each ref, by name. Descendants with a matching
   * `data-ref` attribute open the card.
   */
  references: Record<string, HighlightedReference>
}

interface ActiveRef {
  element: HTMLElement
  name: string
}

const triggerSelector = "[data-ref]"

function closestTrigger(
  target: EventTarget | null,
  root: HTMLElement | null,
): HTMLElement | null {
  if (!root || !(target instanceof Element)) {
    return null
  }
  const trigger = target.closest<HTMLElement>(triggerSelector)
  return trigger && root.contains(trigger) ? trigger : null
}

function containsNode(element: HTMLElement | null, node: EventTarget | null) {
  return !!element && node instanceof Node && element.contains(node)
}

/**
 * Re-measures the card position when it moves to another ref while open.
 */
function RepositionOnActiveChange({
  element,
}: {
  element: HTMLElement | undefined
}): null {
  const popover = usePopoverContext()
  const reposition = useEffectEvent(() => popover.reposition())
  useEffect(() => {
    if (element) {
      reposition()
    }
  }, [element])
  return null
}

/**
 * A single hover card shared by every ref in its children. Refs are found by
 * event delegation, so they can live in HTML that React does not render, such
 * as highlighted code.
 */
export function RefHoverCard({
  children,
  className,
  closeDelay = 150,
  openDelay = 300,
  references,
  ...props
}: RefHoverCardProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const activeElementRef = useRef<HTMLElement | null>(null)
  const openRef = useRef(false)
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [active, setActive] = useState<ActiveRef | null>(null)
  const [open, setOpenState] = useState(false)
  const contentId = useId()

  const setOpen = (value: boolean) => {
    openRef.current = value
    setOpenState(value)
  }

  const clearTimers = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
  }

  useEffect(() => clearTimers, [])

  // refs live in HTML that React does not render, so the attribute is set here.
  const describedElement = open ? active?.element : undefined
  useEffect(() => {
    if (!describedElement) {
      return
    }
    describedElement.setAttribute("aria-describedby", contentId)
    return () => describedElement.removeAttribute("aria-describedby")
  }, [contentId, describedElement])

  const show = (element: HTMLElement, immediate: boolean) => {
    const name = element.dataset.ref
    if (!name || !references[name]) {
      return
    }
    clearTimers()
    const activate = () => {
      activeElementRef.current = element
      setActive({element, name})
      setOpen(true)
    }
    if (immediate || openRef.current) {
      activate()
    } else {
      openTimer.current = setTimeout(activate, openDelay)
    }
  }

  const scheduleClose = () => {
    clearTimers()
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay)
  }

  const positioning: PopoverPositioningOptions = useMemo(
    () => ({
      getAnchorRect: () => {
        const element = activeElementRef.current
        return element?.isConnected ? element.getBoundingClientRect() : null
      },
      offset: {mainAxis: 4},
      placement: "bottom-start",
    }),
    [],
  )

  const entry = active ? references[active.name] : undefined

  return (
    <Popover.Root
      autoFocus={false}
      closeOnInteractOutside={false}
      lazyMount
      onOpenChange={(nextOpen) => {
        clearTimers()
        setOpen(nextOpen)
      }}
      open={open}
      positioning={positioning}
      restoreFocus={false}
    >
      <RepositionOnActiveChange element={active?.element} />
      <Popover.Anchor
        ref={rootRef}
        className={clsx("qui-ref-hover-card__anchor", className)}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          if (
            closestTrigger(event.target, rootRef.current) &&
            !containsNode(contentRef.current, event.relatedTarget)
          ) {
            scheduleClose()
          }
        }}
        onFocus={(event: FocusEvent<HTMLDivElement>) => {
          const trigger = closestTrigger(event.target, rootRef.current)
          if (trigger) {
            show(trigger, true)
          }
        }}
        onPointerOut={(event: PointerEvent<HTMLDivElement>) => {
          if (event.pointerType === "touch") {
            return
          }
          const trigger = closestTrigger(event.target, rootRef.current)
          if (trigger && !containsNode(trigger, event.relatedTarget)) {
            scheduleClose()
          }
        }}
        onPointerOver={(event: PointerEvent<HTMLDivElement>) => {
          if (event.pointerType === "touch") {
            return
          }
          const trigger = closestTrigger(event.target, rootRef.current)
          if (trigger) {
            show(trigger, false)
          }
        }}
        {...props}
      >
        {children}
      </Popover.Anchor>
      <Popover.Positioner>
        <Popover.Content
          ref={contentRef}
          className="qui-ref-hover-card"
          id={contentId}
          onBlur={(event) => {
            if (
              !containsNode(contentRef.current, event.relatedTarget) &&
              event.relatedTarget !== activeElementRef.current
            ) {
              scheduleClose()
            }
          }}
          onPointerEnter={() => clearTimeout(closeTimer.current)}
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") {
              scheduleClose()
            }
          }}
        >
          {active && entry ? (
            <>
              <ShikiHighlighter
                cache
                className="qui-ref-hover-card__type"
                code={entry.prettyType}
                language="tsx"
              />
              {entry.description ? (
                <div className="qui-ref-hover-card__description">
                  {entry.description}
                </div>
              ) : null}
            </>
          ) : null}
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
