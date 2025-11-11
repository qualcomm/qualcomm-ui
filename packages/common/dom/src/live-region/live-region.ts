// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface LiveRegionOptions {
  delay?: number | undefined
  document?: Document | undefined
  level: "polite" | "assertive"
  root?: HTMLElement | null | undefined
}

const ID = "__live-region__"

interface LiveRegion {
  announce: (message: string, delay?: number) => void
  destroy: () => void
  toJSON(): string
}

export function createLiveRegion(
  opts: Partial<LiveRegionOptions> = {},
): LiveRegion {
  const {
    delay: _delay = 0,
    document: doc = document,
    level = "polite",
    root,
  } = opts

  const win = doc.defaultView ?? window
  const parent = root ?? doc.body

  function announce(message: string, delay?: number) {
    const oldRegion = doc.getElementById(ID)

    // remove old region
    oldRegion?.remove()

    // Did an override level get set?
    delay = delay ?? _delay

    // create fresh region
    const region = doc.createElement("span")
    region.id = ID
    region.dataset.liveAnnouncer = "true"

    // Determine redundant role
    const role = level !== "assertive" ? "status" : "alert"

    // add role and attributes
    region.setAttribute("aria-live", level)
    region.setAttribute("role", role)

    // hide live region
    Object.assign(region.style, {
      border: "0",
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0",
      position: "absolute",
      whiteSpace: "nowrap",
      width: "1px",
      wordWrap: "normal",
    })

    parent.appendChild(region)

    // populate region to trigger it
    win.setTimeout(() => {
      region.textContent = message
    }, delay)
  }

  function destroy() {
    const oldRegion = doc.getElementById(ID)
    oldRegion?.remove()
  }

  return {
    announce,
    destroy,
    toJSON() {
      return ID
    },
  }
}
