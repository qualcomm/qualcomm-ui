// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ButtonHTMLAttributes,
  type HTMLProps,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefCallback,
  useCallback,
  useState,
} from "react"

import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import type {As} from "@qualcomm-ui/react-core/system"
import {
  booleanDataAttr,
  type BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"

import {useEventListeners} from "./use-event-listeners"

export type UseClickableProps<T extends As = "div"> = Omit<
  HTMLProps<T>,
  | "onKeyDown"
  | "onKeyUp"
  | "onMouseDown"
  | "onMouseUp"
  | "onMouseOver"
  | "onMouseLeave"
  | "onClick"
  | "ref"
> & {
  /**
   * Whether to trigger click on pressing `Enter`.
   *
   * @default true
   */
  clickOnEnter?: boolean

  /**
   * Whether to trigger click on pressing `Space`.
   *
   * @default true
   */
  clickOnSpace?: boolean

  /**
   * If `true`, the element will be disabled.
   * It will set the `disabled` HTML attribute
   *
   * @default false
   */
  disabled?: boolean

  /*
   * Event Handlers
   * TODO: fix type
   */
  onClick?: MouseEventHandler<unknown>
  onKeyDown?: KeyboardEventHandler<unknown>
  onKeyUp?: KeyboardEventHandler<unknown>
  onMouseDown?: MouseEventHandler<unknown>
  onMouseLeave?: MouseEventHandler<unknown>
  onMouseOver?: MouseEventHandler<unknown>
  onMouseUp?: MouseEventHandler<unknown>

  /**
   * If `true` have only `aria-disabled` set to `true`
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * The ref for the element
   */
  ref?: RefCallback<any | undefined> | null
}

function isValidElement(
  event: ReactKeyboardEvent<any> | KeyboardEvent,
): boolean {
  const element = event.target as HTMLElement
  const {isContentEditable, tagName} = element
  return (
    tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== true
  )
}

export type UseClickableReturn<T extends As = "div"> = HTMLProps<T> & {
  "data-active"?: BooleanDataAttr
}

/**
 * useClickable implements all the interactions of a native `button`
 * component with support for making it focusable even if it is disabled.
 *
 * It can be used with both native button elements or other elements (like `div`).
 */
export function useClickable<T extends As = "div">(
  props: UseClickableProps<T> = {},
): UseClickableReturn<T> {
  const {
    clickOnEnter = true,
    clickOnSpace = true,
    disabled,
    onClick,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseLeave,
    onMouseOver,
    onMouseUp,
    readOnly,
    ref: refProp,
    tabIndex: tabIndexProp,
    ...htmlProps
  } = props
  /**
   * We'll use this to track if the element is a button element
   */
  const [isButton, setIsButton] = useState(true)

  /**
   * For custom button implementation, we'll use this to track when
   * we mouse down on the button, to enable use style its ":active" style
   */
  const [isPressed, setIsPressed] = useState(false)

  const listeners = useEventListeners()

  /**
   * The ref callback that fires as soon as the dom node is ready
   */
  const refCallback = (node: any | null) => {
    if (!node) {
      return
    }
    if (node.tagName !== "BUTTON") {
      setIsButton(false)
    }
  }

  const tabIndex = isButton ? tabIndexProp : tabIndexProp || 0
  const trulyDisabled = disabled && !readOnly

  const handleClick = useCallback(
    (event: ReactMouseEvent<never>) => {
      if (disabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      const self = event.currentTarget as HTMLElement
      self.focus()

      if (!readOnly) {
        onClick?.(event as never)
      }
    },
    [disabled, onClick, readOnly],
  )

  const onDocumentKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (isPressed && isValidElement(e)) {
        e.preventDefault()
        e.stopPropagation()

        setIsPressed(false)

        listeners.remove(document, "keyup", onDocumentKeyUp, false)
      }
    },
    [isPressed, listeners],
  )

  const handleKeyDown: KeyboardEventHandler<T> = useCallback(
    (event) => {
      onKeyDown?.(event)

      if (disabled || event.defaultPrevented || event.metaKey || readOnly) {
        return
      }

      if (!isValidElement(event.nativeEvent) || isButton) {
        return
      }

      const shouldClickOnEnter = clickOnEnter && event.key === "Enter"
      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(true)
      }

      if (shouldClickOnEnter) {
        event.preventDefault()
        const self = event.currentTarget as unknown as HTMLElement
        self.click()
      }

      listeners.add(document, "keyup", onDocumentKeyUp, false)
    },
    [
      onKeyDown,
      disabled,
      readOnly,
      isButton,
      clickOnEnter,
      clickOnSpace,
      listeners,
      onDocumentKeyUp,
    ],
  )

  const handleKeyUp: KeyboardEventHandler<T> = useCallback(
    (event) => {
      onKeyUp?.(event)

      if (disabled || event.defaultPrevented || event.metaKey || readOnly) {
        return
      }

      if (!isValidElement(event.nativeEvent) || isButton) {
        return
      }

      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(false)

        const self = event.currentTarget as unknown as HTMLElement
        self.click()
      }
    },
    [clickOnSpace, disabled, isButton, onKeyUp, readOnly],
  )

  const onDocumentMouseUp = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) {
        return
      }
      setIsPressed(false)
      listeners.remove(document, "mouseup", onDocumentMouseUp, false)
    },
    [listeners],
  )

  const handleMouseDown: MouseEventHandler<T> = useCallback(
    (event) => {
      if (event.button !== 0) {
        return
      }

      if (disabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      if (!isButton) {
        setIsPressed(true)
      }

      const target = event.currentTarget as unknown as HTMLElement
      target.focus({preventScroll: true})

      listeners.add(document, "mouseup", onDocumentMouseUp, false)

      onMouseDown?.(event as never)
    },
    [disabled, isButton, listeners, onDocumentMouseUp, onMouseDown],
  )

  const handleMouseUp: MouseEventHandler<T> = useCallback(
    (event) => {
      if (event.button !== 0) {
        return
      }

      if (!isButton) {
        setIsPressed(false)
      }

      onMouseUp?.(event as never)
    },
    [onMouseUp, isButton],
  )

  const handleMouseOver: MouseEventHandler<T> = useCallback(
    (event) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      onMouseOver?.(event as never)
    },
    [disabled, onMouseOver],
  )

  const handleMouseLeave: MouseEventHandler<T> = useCallback(
    (event) => {
      if (isPressed) {
        event.preventDefault()
        setIsPressed(false)
      }
      onMouseLeave?.(event as never)
    },
    [isPressed, onMouseLeave],
  )

  const ref = useMergedRef<T>(refProp as never, refCallback)

  if (isButton) {
    return {
      ...htmlProps,
      "aria-disabled": trulyDisabled ? undefined : disabled,
      disabled: trulyDisabled,
      onClick: handleClick,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseOver,
      onMouseUp,
      ref,
      tabIndex,
      type: "button" as ButtonHTMLAttributes<any>["type"],
    }
  }

  return {
    ...htmlProps,
    "aria-disabled": disabled ? ("true" as const) : undefined,
    "data-active": booleanDataAttr(isPressed),
    disabled,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseOver: handleMouseOver,
    onMouseUp: handleMouseUp,
    ref,
    role: "button",
    tabIndex: trulyDisabled ? undefined : tabIndex,
  }
}
