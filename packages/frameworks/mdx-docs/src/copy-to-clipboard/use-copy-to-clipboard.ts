import {useCallback, useEffect, useState} from "react"

import {useCopyToClipboardContext} from "./copy-to-clipboard-context"

export interface UseCopyToClipboardProps {
  valueOrFn: (() => string) | string
}

export interface UseCopyToClipboard {
  copyToClipboard: () => void
  isCopied: boolean
}

export function useCopyToClipboard(
  props: UseCopyToClipboardProps,
): UseCopyToClipboard {
  const context = useCopyToClipboardContext(false)
  const {valueOrFn} = props
  const [isCopied, setCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) {
      return () => {}
    }
    const timerId = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timerId)
    }
  }, [isCopied])

  const copyToClipboard = useCallback(() => {
    if (!navigator?.clipboard) {
      console.error("Access to clipboard rejected!")
    }
    const value = typeof valueOrFn === "function" ? valueOrFn() : valueOrFn
    if (!value) {
      console.error("No value to copy!")
      return
    }
    void navigator.clipboard
      .writeText(value)
      .catch(() => console.error("Failed to copy!"))
      .finally(() => {
        setCopied(true)
      })
  }, [valueOrFn])

  return {
    copyToClipboard: context?.copyToClipboard || copyToClipboard,
    isCopied: context?.isCopied ?? isCopied,
  }
}
