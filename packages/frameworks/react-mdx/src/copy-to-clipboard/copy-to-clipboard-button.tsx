// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Check, Copy} from "lucide-react"

import {useCopyToClipboard} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

export interface CopyButtonProps extends Pick<
  ButtonProps,
  "size" | "variant" | "emphasis"
> {
  code: string | (() => string) | (() => Promise<string>)
}

export function CopyToClipboardButton({
  code,
  ...props
}: CopyButtonProps): ReactElement {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn: code,
  })

  return (
    <Button
      data-copied={booleanDataAttr(isCopied)}
      emphasis="primary"
      endIcon={isCopied ? Check : Copy}
      onClick={(event) => {
        copyToClipboard()
        // this is a child of the QTabList so we need to prevent this event,
        // otherwise the bubbling can cause issues.
        event.preventDefault()
        event.stopPropagation()
      }}
      size="sm"
      type="button"
      variant="ghost"
      {...props}
    >
      Copy
    </Button>
  )
}
