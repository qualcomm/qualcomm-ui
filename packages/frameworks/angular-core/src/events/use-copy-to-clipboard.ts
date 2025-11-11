// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DestroyRef, effect, inject, signal} from "@angular/core"

import {NAVIGATOR} from "@qualcomm-ui/angular-core/dom"

export interface UseCopyToClipboardProps {
  valueOrFn: (() => string) | string
}

export interface UseCopyToClipboard {
  copyToClipboard: () => void
  isCopied: () => boolean
}

export function useCopyToClipboard(
  props: UseCopyToClipboardProps,
): UseCopyToClipboard {
  const {valueOrFn} = props
  const destroyRef = inject(DestroyRef)

  const navigator = inject(NAVIGATOR)

  const isCopied = signal<boolean>(false)
  let copyTimeout: ReturnType<typeof setTimeout>

  effect(() => {
    if (isCopied()) {
      copyTimeout = setTimeout(() => {
        isCopied.set(false)
      }, 2000)
    } else {
      if (copyTimeout !== undefined) {
        clearTimeout(copyTimeout)
      }
    }
  })

  destroyRef.onDestroy(() => {
    if (copyTimeout !== undefined) {
      clearTimeout(copyTimeout)
    }
  })

  const copyToClipboard = () => {
    if (!navigator?.clipboard) {
      console.error("Access to clipboard rejected!")
      return
    }

    const value = typeof valueOrFn === "function" ? valueOrFn() : valueOrFn

    navigator.clipboard
      .writeText(value)
      .then(() => {
        isCopied.set(true)
      })
      .catch(() => {
        console.error("Failed to copy!")
      })
  }

  return {
    copyToClipboard,
    isCopied: isCopied.asReadonly(),
  }
}
