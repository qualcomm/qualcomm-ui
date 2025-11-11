// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

interface WindowFrames {
  addEventListener(event: string, listener: any, options?: any): () => void
  each(cb: (win: Window) => void): void
  removeEventListener(event: string, listener: any, options?: any): void
}

export function getWindowFrames(win: Window): WindowFrames {
  const frames = {
    addEventListener(event: string, listener: any, options?: any) {
      frames.each((frame) => {
        try {
          frame.document.addEventListener(event, listener, options)
        } catch {}
      })

      return () => {
        try {
          frames.removeEventListener(event, listener, options)
        } catch {}
      }
    },

    each(cb: (win: Window) => void) {
      for (let i = 0; i < win.frames?.length; i += 1) {
        const frame = win.frames[i]
        if (frame) {
          cb(frame)
        }
      }
    },

    removeEventListener(event: string, listener: any, options?: any) {
      frames.each((frame) => {
        try {
          frame.document.removeEventListener(event, listener, options)
        } catch {}
      })
    },
  }

  return frames
}

interface ParentWindow {
  addEventListener(event: string, listener: any, options?: any): () => void
  removeEventListener(event: string, listener: any, options?: any): void
}

export function getParentWindow(win: Window): ParentWindow {
  const parent = win.frameElement != null ? win.parent : null
  return {
    addEventListener: (event: string, listener: any, options?: any) => {
      try {
        parent?.addEventListener(event, listener, options)
      } catch {}
      return () => {
        try {
          parent?.removeEventListener(event, listener, options)
        } catch {}
      }
    },
    removeEventListener: (event: string, listener: any, options?: any) => {
      try {
        parent?.removeEventListener(event, listener, options)
      } catch {}
    },
  }
}
