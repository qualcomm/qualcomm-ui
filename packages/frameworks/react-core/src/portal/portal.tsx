// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Fragment,
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
  useState,
} from "react"

import {createPortal} from "react-dom"

import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"

import {usePortalContext} from "./portal-context"

export interface PortalProps {
  /**
   * Specify to override the container element.
   */
  container?: RefObject<HTMLElement | null> | HTMLElement | null

  /**
   * Disable the portal conditionally. This causes the children to be rendered as-is.
   */
  disabled?: boolean
}

/**
 * Render `children` into a different DOM node using a React portal.
 *
 * On the server we render nothing so the markup matches the first client
 * render. The portal is mounted after the client loads.
 */
export function Portal(
  props: PropsWithChildren<PortalProps>,
): ReactElement | null {
  const {children, container, disabled = false} = props
  const context = usePortalContext(false)

  const isServer = typeof window === "undefined"
  const [mounted, setMounted] = useState(false)

  // Runs only in the browser
  useSafeLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (disabled) {
    return <Fragment>{children}</Fragment>
  }

  // Server render OR first client render: nothing → identical markup
  if (isServer || !mounted) {
    return null
  }

  const mountNode =
    container && "current" in container
      ? container.current
      : (container ?? context?.container?.current ?? document.body)

  if (!mountNode) {
    return null
  }

  return createPortal(children, mountNode as unknown as HTMLElement)
}
