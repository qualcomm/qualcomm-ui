import type {ComponentProps, ReactElement} from "react"

import {Check, Copy} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useCopyToClipboard} from "./use-copy-to-clipboard"

export interface CopyToClipboardProps
  extends Omit<ComponentProps<"button">, "color" | "ref"> {
  valueOrFn: string | (() => string)
}

export function CopyToClipboardIconButton({
  valueOrFn,
  ...props
}: CopyToClipboardProps): ReactElement {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn,
  })

  const mergedProps = mergeProps({onClick: copyToClipboard}, props)

  return (
    <IconButton
      emphasis="primary"
      icon={isCopied ? Check : Copy}
      size="sm"
      tabIndex={0}
      title="Copy code"
      variant="ghost"
      {...mergedProps}
    />
  )
}
