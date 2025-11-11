// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type MouseEvent, useCallback} from "react"

function getDocument(): Document | undefined {
  return typeof document === "undefined" ? undefined : document
}

function withoutTransition(callback: Function) {
  const document = getDocument()
  if (!document) {
    return
  }
  const css = document.createElement("style")
  css.appendChild(
    document.createTextNode(
      `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`,
    ),
  )
  document.head.appendChild(css)

  callback()

  setTimeout(() => {
    // Calling getComputedStyle forces the browser to redraw

    const _ = window.getComputedStyle(css).transition
    document.head.removeChild(css)
  }, 0)
}

export function useCorrectCssTransition({
  disableTransitions = false,
}: {disableTransitions?: boolean} = {}) {
  return useCallback(
    (callback: Function, event?: MouseEvent) => {
      if (disableTransitions) {
        withoutTransition(() => {
          callback()
        })
      } else {
        if (event) {
          const x = event.clientX
          const y = event.clientY
          const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
          )

          document.documentElement.style.setProperty(
            "--view-transition-x",
            `${x}px`,
          )
          document.documentElement.style.setProperty(
            "--view-transition-y",
            `${y}px`,
          )
          document.documentElement.style.setProperty(
            "--view-transition-r",
            `${endRadius}px`,
          )
        }

        document.documentElement.style.viewTransitionName = "theme-transition"

        const transition = document.startViewTransition(() => {
          callback()
        })

        transition.finished.finally(() => {
          document.documentElement.style.viewTransitionName = ""
        })
      }
    },
    [disableTransitions],
  )
}
