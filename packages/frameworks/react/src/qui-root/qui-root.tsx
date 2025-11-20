// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useEffect} from "react"

export interface QuiRootProps {
  /**
   * The rest of your application.
   */
  children: ReactNode

  /**
   * A root node to correctly resolve the root element (i.e. `<html>`) in custom
   * environments. Defaults to `document.documentElement` if omitted.
   */
  getRootElement?: (() => HTMLElement) | undefined
}

/**
 * @deprecated no longer required
 */
export function QuiRoot({
  children,
  getRootElement,
}: QuiRootProps): ReactElement {
  useEffect(() => {
    const rootElement = getRootElement?.() || document.documentElement
    rootElement.classList.remove("qui-preload")
    document.body.classList.remove("qui-preload")
  }, [getRootElement])

  return <>{children}</>
}

QuiRoot.displayName = "QuiRoot"
